require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config()
require("solidity-coverage");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL=process.env.GOERLI_RPC_URL
const PRIVATE_KEY=process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY=process.env.COINMARKETCAP_API_KEY

module.exports = {
  solidity:{
    compilers : [{version:"0.8.8"},{version:"0.6.6"}],
  },
  defaultNetwork: "hardhat",
  networks : {
    goerli : {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId:5,
      blockConfirmations: 6,
    },
  },
  
  gasReporter : {
    enabled : true,
    outputFile : "gas-report.txt",
    noColors: true,
    currency:"USD",
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  etherscan: {
    apiKey:process.env.ETHERSCAN_API_KEY,
    },
    namedAccounts: {
      deployer : {
        default:0,
      
      },
    },
    mocha : {
      timeout: 500000,
    },
   
  
};


