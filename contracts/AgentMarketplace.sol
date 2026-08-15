// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./AgenticID.sol";

/**
 * @title AgentMarketplace
 * @notice Decentralized Marketplace for tokenized 0G Agentic IDs (ERC-7857).
 * Handles payment escrow (0G Pay integration), 0G Compute job dispatching, ECDSA worker attestation verification,
 * state commitment synchronization, and refund timeout safety.
 */
contract AgentMarketplace is ReentrancyGuard, AccessControl, Pausable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");
    bytes32 public constant COMPUTE_WORKER_ROLE = keccak256("COMPUTE_WORKER_ROLE");

    AgenticID public immutable agenticIDContract;

    uint256 public constant REQUEST_TIMEOUT = 1 hours;

    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        address seller;
        uint256 pricePerCall; // In wei / native 0G token unit
        bool active;
        uint256 totalCalls;
    }

    enum RequestStatus { Pending, Fulfilled, Refunded }

    struct InferenceRequest {
        uint256 requestId;
        uint256 listingId;
        address buyer;
        uint256 escrowAmount;
        string inputHash;     // 0G Storage reference to input prompt payload
        bytes32 resultHash;   // 0G Storage reference to execution output
        uint256 createdAt;
        RequestStatus status;
    }

    uint256 private _nextListingId;
    uint256 private _nextRequestId;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => InferenceRequest) public requests;
    mapping(uint256 => uint256) public agentToListingId;

    // Events for 0G Explorer tracking (Aristotle / Galileo)
    event AgentListed(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 pricePerCall);
    event ListingUpdated(uint256 indexed listingId, uint256 pricePerCall, bool active);
    event InferenceRequested(uint256 indexed requestId, uint256 indexed listingId, address indexed buyer, uint256 escrowAmount, string inputHash);
    event InferenceFulfilled(uint256 indexed requestId, uint256 indexed listingId, bytes32 resultHash, bytes workerAttestation);
    event InferenceRefunded(uint256 indexed requestId, address indexed buyer, uint256 amount);
    event PaymentReleased(uint256 indexed requestId, address indexed seller, uint256 amount);

    constructor(address agenticIDAddress) {
        require(agenticIDAddress != address(0), "Invalid AgenticID address");
        agenticIDContract = AgenticID(agenticIDAddress);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RELAYER_ROLE, msg.sender);
        _grantRole(COMPUTE_WORKER_ROLE, msg.sender);

        _nextListingId = 1;
        _nextRequestId = 1;
    }

    // Emergency pause functionality
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice List an ERC-7857 Agentic ID token on the marketplace
     */
    function listAgent(uint256 tokenId, uint256 pricePerCall) external whenNotPaused returns (uint256) {
        require(agenticIDContract.ownerOf(tokenId) == msg.sender, "Caller must own AgenticID token");

        uint256 listingId = _nextListingId++;

        listings[listingId] = Listing({
            listingId: listingId,
            tokenId: tokenId,
            seller: msg.sender,
            pricePerCall: pricePerCall,
            active: true,
            totalCalls: 0
        });

        agentToListingId[tokenId] = listingId;

        emit AgentListed(listingId, tokenId, msg.sender, pricePerCall);
        return listingId;
    }

    /**
     * @notice Update price or status of an existing listing
     */
    function updateListing(uint256 listingId, uint256 pricePerCall, bool active) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Only seller can update listing");

        listing.pricePerCall = pricePerCall;
        listing.active = active;

        emit ListingUpdated(listingId, pricePerCall, active);
    }

    /**
     * @notice Buyer escrows payment (0G Pay integration flow) and triggers a 0G Compute job
     * @param listingId Target agent listing ID
     * @param inputHash 0G Storage content hash containing the prompt payload
     */
    function requestInference(uint256 listingId, string calldata inputHash) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        returns (uint256) 
    {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(msg.value >= listing.pricePerCall, "Insufficient payment for 0G Pay escrow");

        uint256 requestId = _nextRequestId++;

        requests[requestId] = InferenceRequest({
            requestId: requestId,
            listingId: listingId,
            buyer: msg.sender,
            escrowAmount: msg.value,
            inputHash: inputHash,
            resultHash: bytes32(0),
            createdAt: block.timestamp,
            status: RequestStatus.Pending
        });

        listing.totalCalls += 1;

        emit InferenceRequested(requestId, listingId, msg.sender, msg.value, inputHash);
        return requestId;
    }

    /**
     * @notice Fulfill job request after 0G Compute worker execution
     * @param requestId Request ID
     * @param resultHash 0G Storage reference hash for the inference response
     * @param workerAttestation ECDSA signature signed by an authorized 0G Compute worker node
     */
    function fulfillInference(
        uint256 requestId,
        bytes32 resultHash,
        bytes calldata workerAttestation
    ) 
        external 
        onlyRole(RELAYER_ROLE) 
        nonReentrant 
        whenNotPaused 
    {
        InferenceRequest storage req = requests[requestId];
        require(req.status == RequestStatus.Pending, "Request is not pending");

        Listing storage listing = listings[req.listingId];

        // Verify ECDSA worker attestation payload
        bytes32 messageHash = keccak256(abi.encodePacked(requestId, req.listingId, resultHash, req.buyer));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        address recoveredSigner = ethSignedMessageHash.recover(workerAttestation);
        require(hasRole(COMPUTE_WORKER_ROLE, recoveredSigner) || hasRole(RELAYER_ROLE, recoveredSigner), "Invalid 0G Compute worker attestation signature");

        req.resultHash = resultHash;
        req.status = RequestStatus.Fulfilled;

        // Update state commitment root on AgenticID contract
        try agenticIDContract.updateStateCommitment(listing.tokenId, resultHash) {} catch {}

        emit InferenceFulfilled(requestId, req.listingId, resultHash, workerAttestation);

        // Release escrowed payment to agent seller via 0G Pay settlement
        uint256 payout = req.escrowAmount;
        (bool success, ) = listing.seller.call{value: payout}("");
        require(success, "0G Pay escrow release failed");

        emit PaymentReleased(requestId, listing.seller, payout);
    }

    /**
     * @notice Timeout safety refund path: buyer recovers escrowed funds if job unfulfilled after REQUEST_TIMEOUT
     */
    function refundExpiredRequest(uint256 requestId) external nonReentrant {
        InferenceRequest storage req = requests[requestId];
        require(req.status == RequestStatus.Pending, "Request is not pending");
        require(msg.sender == req.buyer || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only buyer or admin can claim refund");
        require(block.timestamp >= req.createdAt + REQUEST_TIMEOUT, "Request has not expired yet");

        req.status = RequestStatus.Refunded;
        uint256 refundAmt = req.escrowAmount;

        (bool success, ) = req.buyer.call{value: refundAmt}("");
        require(success, "Refund transfer failed");

        emit InferenceRefunded(requestId, req.buyer, refundAmt);
    }

    /**
     * @notice Get listing details
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    /**
     * @notice Get request details
     */
    function getRequest(uint256 requestId) external view returns (InferenceRequest memory) {
        return requests[requestId];
    }
}
