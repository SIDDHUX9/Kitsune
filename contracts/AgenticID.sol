// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgenticID (ERC-7857)
 * @notice Verifiable Tokenized AI Agent Identity Standard for 0G Network.
 * Mints AI agents as verifiable tokens with encrypted metadata references stored on 0G Storage.
 */
contract AgenticID is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct AgentMetadata {
        string storageHash;       // 0G Storage content hash for encrypted config/prompts
        string modelReference;     // Base model identifier (e.g. 0g-compute/llama-3.1-70b)
        bytes32 stateCommitment;   // Merkle root / hash of current agent memory & state logs
        uint256 createdAt;         // Mint timestamp
        bool isActive;             // Agent execution availability status
    }

    // Mapping from Token ID to Agent Metadata
    mapping(uint256 => AgentMetadata) private _agentMetadata;

    // Authorized Marketplace or Relayer addresses permitted to update agent state commitments
    mapping(address => bool) public authorizedUpdaters;

    // Events as per 0G Agentic ID (ERC-7857) spec
    event AgenticIDMinted(uint256 indexed tokenId, address indexed owner, string storageHash, string modelReference);
    event MetadataUpdated(uint256 indexed tokenId, string newStorageHash);
    event StateCommitmentUpdated(uint256 indexed tokenId, bytes32 newStateCommitment);
    event AuthorizedUpdaterStatusSet(address indexed updater, bool authorized);

    modifier onlyTokenOwnerOrAuthorized(uint256 tokenId) {
        require(
            ownerOf(tokenId) == msg.sender || authorizedUpdaters[msg.sender] || owner() == msg.sender,
            "AgenticID: Caller is not owner nor authorized updater"
        );
        _;
    }

    constructor() ERC721("0G Verifiable Agentic ID", "AGENT-ID") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @notice Set authorization for contract updaters (e.g., AgentMarketplace or 0G Compute Relayer)
     */
    setAuthorizedUpdater(address updater, bool authorized) external onlyOwner {
        authorizedUpdaters[updater] = authorized;
        emit AuthorizedUpdaterStatusSet(updater, authorized);
    }

    /**
     * @notice Mint a new ERC-7857 Agentic ID token
     * @param to Recipient address of the Agentic ID
     * @param storageHash 0G Storage hash storing encrypted system prompt & configuration
     * @param modelReference Base model ID run by 0G Compute
     * @param initialMetadataURI Public IPFS/0G URI for metadata display
     */
    function mintAgenticID(
        address to,
        string memory storageHash,
        string memory modelReference,
        string memory initialMetadataURI
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, initialMetadataURI);

        _agentMetadata[tokenId] = AgentMetadata({
            storageHash: storageHash,
            modelReference: modelReference,
            stateCommitment: bytes32(0),
            createdAt: block.timestamp,
            isActive: true
        });

        emit AgenticIDMinted(tokenId, to, storageHash, modelReference);
        return tokenId;
    }

    /**
     * @notice Update encrypted metadata reference stored on 0G Storage
     */
    function updateMetadata(uint256 tokenId, string memory newStorageHash, string memory newMetadataURI) 
        external 
        onlyTokenOwnerOrAuthorized(tokenId) 
    {
        _agentMetadata[tokenId].storageHash = newStorageHash;
        _setTokenURI(tokenId, newMetadataURI);
        emit MetadataUpdated(tokenId, newStorageHash);
    }

    /**
     * @notice Update state commitment hash following a verifiable 0G Compute run
     */
    function updateStateCommitment(uint256 tokenId, bytes32 newStateCommitment) 
        external 
        onlyTokenOwnerOrAuthorized(tokenId) 
    {
        _agentMetadata[tokenId].stateCommitment = newStateCommitment;
        emit StateCommitmentUpdated(tokenId, newStateCommitment);
    }

    /**
     * @notice Get complete Agent Metadata
     */
    function getAgentMetadata(uint256 tokenId) external view returns (AgentMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "AgenticID: Token does not exist");
        return _agentMetadata[tokenId];
    }

    /**
     * @notice Hook executed during transfer to preserve ERC-7857 encrypted state access controls
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);
        // Note: In full production ERC-7857, token transfer triggers re-encryption handoff of 0G Storage access keys
        return previousOwner;
    }
}
