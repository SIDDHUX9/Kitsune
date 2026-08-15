export const CONTRACT_ADDRESSES = {
  // 0G-Aristotle Mainnet (Chain ID 16661)
  aristotle: {
    agenticID: process.env.NEXT_PUBLIC_ARISTOTLE_AGENTIC_ID || "0x91EcD796b55B815719117A8530e3bed138c89bCb",
    marketplace: process.env.NEXT_PUBLIC_ARISTOTLE_MARKETPLACE || "0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627",
    rpc: "https://evmrpc.0g.ai",
    explorer: "https://chainscan-galileo.0g.ai"
  },
  // 0G-Galileo Testnet (Chain ID 16602 / 16601)
  galileo: {
    agenticID: process.env.NEXT_PUBLIC_GALILEO_AGENTIC_ID || "0x91EcD796b55B815719117A8530e3bed138c89bCb",
    marketplace: process.env.NEXT_PUBLIC_GALILEO_MARKETPLACE || "0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627",
    rpc: "http://evmrpc-testnet.0g.ai",
    explorer: "https://chainscan-galileo.0g.ai"
  },
  // Hardhat Local EVM Node (Chain ID 31337)
  localhost: {
    agenticID: process.env.NEXT_PUBLIC_LOCAL_AGENTIC_ID || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    marketplace: process.env.NEXT_PUBLIC_LOCAL_MARKETPLACE || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    rpc: "http://127.0.0.1:8545",
    explorer: "http://127.0.0.1:8545"
  }
};

export const AGENTIC_ID_ABI = [
  "function mintAgenticID(address to, string memory storageHash, string memory modelReference, string memory initialMetadataURI) external returns (uint256)",
  "function getAgentMetadata(uint256 tokenId) external view returns (tuple(string storageHash, string modelReference, bytes32 stateCommitment, uint256 createdAt, bool isActive))",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "event AgenticIDMinted(uint256 indexed tokenId, address indexed owner, string storageHash, string modelReference)"
];

export const MARKETPLACE_ABI = [
  "function listAgent(uint256 tokenId, uint256 pricePerCall) external returns (uint256)",
  "function requestInference(uint256 listingId, string calldata inputHash) external payable returns (uint256)",
  "function fulfillInference(uint256 requestId, bytes32 resultHash, bytes calldata workerAttestation) external",
  "function refundExpiredRequest(uint256 requestId) external",
  "function getListing(uint256 listingId) external view returns (tuple(uint256 listingId, uint256 tokenId, address seller, uint256 pricePerCall, bool active, uint256 totalCalls))",
  "function getRequest(uint256 requestId) external view returns (tuple(uint256 requestId, uint256 listingId, address buyer, uint256 escrowAmount, string inputHash, bytes32 resultHash, uint256 createdAt, uint8 status))",
  "event AgentListed(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 pricePerCall)",
  "event InferenceRequested(uint256 indexed requestId, uint256 indexed listingId, address indexed buyer, uint256 escrowAmount, string inputHash)",
  "event InferenceFulfilled(uint256 indexed requestId, uint256 indexed listingId, bytes32 resultHash, bytes workerAttestation)",
  "event PaymentReleased(uint256 indexed requestId, address indexed seller, uint256 amount)",
  "event InferenceRefunded(uint256 indexed requestId, address indexed buyer, uint256 amount)"
];
