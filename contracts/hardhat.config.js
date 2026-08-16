require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    // 0G Testnet - Galileo
    galileo: {
      url: process.env.OG_GALILEO_RPC || "http://evmrpc-testnet.0g.ai",
      chainId: 16601,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // 0G Mainnet - Aristotle
    aristotle: {
      url: process.env.OG_ARISTOTLE_RPC || "https://evmrpc.0g.ai",
      chainId: 16661,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
