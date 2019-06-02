require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.MNENOMIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(mnemonic, process.env.YOUR_RINKEBY_TEST_URL
          ),
      network_id: "4",
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '0.5.0',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
