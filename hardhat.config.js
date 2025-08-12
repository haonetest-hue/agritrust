require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "hedera-testnet": {
      url: "https://testnet.hashio.io/api",
      accounts: [process.env.HEDERA_PRIVATE_KEY],
      chainId: 296,
    },
    "hedera-mainnet": {
      url: "https://mainnet.hashio.io/api",
      accounts: [process.env.HEDERA_PRIVATE_KEY],
      chainId: 295,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
