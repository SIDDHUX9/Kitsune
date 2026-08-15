async function testRelayerApi() {
  console.log("=== Testing 0G Relayer API Server ===");
  
  const healthRes = await fetch("http://localhost:3001/api/health");
  const healthData = await healthRes.json();
  console.log("Health Check:", healthData);

  const inferenceRes = await fetch("http://localhost:3001/api/inference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestId: 8901,
      listingId: 2,
      buyer: "0x71c8a9f0d12b9442008e982f1234567890123456",
      inputPrompt: "Scan smart contract for reentrancy vulnerabilities",
      modelRef: "0g-compute/deepseek-r1-verifier",
      systemPrompt: "You are Ronin Cyber-Auditor."
    })
  });

  const inferenceData = await inferenceRes.json();
  console.log("\n0G Compute Network Inference Result:", JSON.stringify(inferenceData, null, 2));

  const auditRes = await fetch("http://localhost:3001/api/audit-logs");
  const auditData = await auditRes.json();
  console.log("\nLive Audit Log Count:", auditData.logs?.length);
}

testRelayerApi().catch(console.error);
