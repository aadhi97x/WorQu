require("@nomicfoundation/hardhat-toolbox");
require("@quai/hardhat-deploy-metadata");
require("dotenv").config({ path: ".env.local" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "cyprus1",
  networks: {
    cyprus1: {
      url: process.env.RPC_URL || "https://orchard.rpc.quai.network",
      accounts: [process.env.CYPRUS1_PK || "0000000000000000000000000000000000000000000000000000000000000000"],
      chainId: parseInt(process.env.CHAIN_ID || "9000"),
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
