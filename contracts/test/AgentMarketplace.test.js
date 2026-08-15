const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("0G Kitsune Agent Marketplace & AgenticID (ERC-7857)", function () {
  let AgenticID, agenticID;
  let AgentMarketplace, marketplace;
  let owner, relayer, worker, buyer, seller, attacker;

  beforeEach(async function () {
    [owner, relayer, worker, buyer, seller, attacker] = await ethers.getSigners();

    // Deploy AgenticID (ERC-7857)
    AgenticID = await ethers.getContractFactory("AgenticID");
    agenticID = await AgenticID.deploy();
    await agenticID.waitForDeployment();

    // Deploy AgentMarketplace
    AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
    marketplace = await AgentMarketplace.deploy(await agenticID.getAddress());
    await marketplace.waitForDeployment();

    // Setup roles
    const RELAYER_ROLE = await marketplace.RELAYER_ROLE();
    const COMPUTE_WORKER_ROLE = await marketplace.COMPUTE_WORKER_ROLE();

    await marketplace.grantRole(RELAYER_ROLE, relayer.address);
    await marketplace.grantRole(COMPUTE_WORKER_ROLE, worker.address);

    // Authorize marketplace in AgenticID contract
    await agenticID.setAuthorizedUpdater(await marketplace.getAddress(), true);
  });

  it("Should mint an ERC-7857 Agentic ID token", async function () {
    const storageHash = "0g_storage_hash_zen_oracle_meta_123456789";
    const modelRef = "0g-compute/llama-3.1-70b-instruct";
    const metadataURI = "ipfs://QmZenOracleAgentMeta";

    const tx = await agenticID.mintAgenticID(seller.address, storageHash, modelRef, metadataURI);
    await tx.wait();

    expect(await agenticID.ownerOf(1)).to.equal(seller.address);
    
    const metadata = await agenticID.getAgentMetadata(1);
    expect(metadata.storageHash).to.equal(storageHash);
    expect(metadata.modelReference).to.equal(modelRef);
  });

  it("Should list an agent on the marketplace", async function () {
    await agenticID.mintAgenticID(seller.address, "0g_storage_hash_1", "0g-compute/llama-3.1", "ipfs://meta1");

    const price = ethers.parseEther("0.05");
    await marketplace.connect(seller).listAgent(1, price);

    const listing = await marketplace.getListing(1);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.pricePerCall).to.equal(price);
    expect(listing.active).to.be.true;
  });

  it("Should accept an inference request with 0G Pay escrow", async function () {
    await agenticID.mintAgenticID(seller.address, "0g_storage_hash_1", "0g-compute/llama-3.1", "ipfs://meta1");
    const price = ethers.parseEther("0.05");
    await marketplace.connect(seller).listAgent(1, price);

    const inputHash = "0g_storage_input_prompt_hash_999";
    await marketplace.connect(buyer).requestInference(1, inputHash, { value: price });

    const req = await marketplace.getRequest(1);
    expect(req.buyer).to.equal(buyer.address);
    expect(req.escrowAmount).to.equal(price);
    expect(req.inputHash).to.equal(inputHash);
    expect(req.status).to.equal(0); // Pending
  });

  it("Should fulfill an inference request with 0G Compute worker attestation signature and release funds", async function () {
    await agenticID.mintAgenticID(seller.address, "0g_storage_hash_1", "0g-compute/llama-3.1", "ipfs://meta1");
    const price = ethers.parseEther("0.05");
    await marketplace.connect(seller).listAgent(1, price);

    const inputHash = "0g_storage_input_prompt_hash_999";
    await marketplace.connect(buyer).requestInference(1, inputHash, { value: price });

    const resultHash = ethers.keccak256(ethers.toUtf8Bytes("0g_storage_output_result_hash_777"));
    
    // Compute worker constructs and signs attestation message
    const messageHash = ethers.solidityPackedKeccak256(
      ["uint256", "uint256", "bytes32", "address"],
      [1, 1, resultHash, buyer.address]
    );
    const workerAttestation = await worker.signMessage(ethers.getBytes(messageHash));

    const initialSellerBalance = await ethers.provider.getBalance(seller.address);

    // Relayer submits fulfillment transaction
    await marketplace.connect(relayer).fulfillInference(1, resultHash, workerAttestation);

    const req = await marketplace.getRequest(1);
    expect(req.status).to.equal(1); // Fulfilled
    expect(req.resultHash).to.equal(resultHash);

    const finalSellerBalance = await ethers.provider.getBalance(seller.address);
    expect(finalSellerBalance - initialSellerBalance).to.equal(price);
  });

  it("Should allow buyer to claim refund after request timeout expires", async function () {
    await agenticID.mintAgenticID(seller.address, "0g_storage_hash_1", "0g-compute/llama-3.1", "ipfs://meta1");
    const price = ethers.parseEther("0.05");
    await marketplace.connect(seller).listAgent(1, price);

    await marketplace.connect(buyer).requestInference(1, "input_hash", { value: price });

    // Advance time by 3601 seconds
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");

    const initialBuyerBalance = await ethers.provider.getBalance(buyer.address);
    const tx = await marketplace.connect(buyer).refundExpiredRequest(1);
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const finalBuyerBalance = await ethers.provider.getBalance(buyer.address);
    expect(finalBuyerBalance + gasUsed - initialBuyerBalance).to.equal(price);

    const req = await marketplace.getRequest(1);
    expect(req.status).to.equal(2); // Refunded
  });

  it("Should enforce Pausable circuit breaker when paused", async function () {
    await agenticID.mintAgenticID(seller.address, "0g_storage_hash_1", "0g-compute/llama-3.1", "ipfs://meta1");
    
    // Admin pauses marketplace contract
    await marketplace.connect(owner).pause();

    const price = ethers.parseEther("0.05");
    await expect(marketplace.connect(seller).listAgent(1, price)).to.be.revertedWithCustomError(
      marketplace,
      "EnforcedPause"
    );

    // Unpause and verify operation works
    await marketplace.connect(owner).unpause();
    await expect(marketplace.connect(seller).listAgent(1, price)).to.not.be.reverted;
  });

  it("Should reject fulfillment attempts from unauthorized non-relayer callers", async function () {
    await agenticID.mintAgenticID(seller.address, "0g_storage_hash_1", "0g-compute/llama-3.1", "ipfs://meta1");
    const price = ethers.parseEther("0.05");
    await marketplace.connect(seller).listAgent(1, price);

    await marketplace.connect(buyer).requestInference(1, "input_hash", { value: price });
    const resultHash = ethers.keccak256(ethers.toUtf8Bytes("dummy_result"));
    const dummyAttestation = "0x" + "00".repeat(65);

    // Attacker tries calling fulfillInference
    await expect(
      marketplace.connect(attacker).fulfillInference(1, resultHash, dummyAttestation)
    ).to.be.revertedWithCustomError(marketplace, "AccessControlUnauthorizedAccount");
  });
});
