//import
const{networkConfig,developmentChains}=require("../helper-hardhat-config");
const {network}=require("hardhat");
 const{verify}=require("../utils/verify");
// const {verify}=require("@nomiclabs/hardhat-etherscan");
 require("dotenv").config();
 const {deployments}=require('hardhat-deploy');
 module.exports=async({getNamedAccounts,deployments})=>{
    //hre.getNamedAccounts
    //hre.deployments
    const{deploy,log}=deployments
    const{deployer}=await getNamedAccounts()
    const chainId =network.config.chainId

    //if chainid is x use address y
    //if chainid is z use address a
    // const ethUsdPriceFeedAddress=networkConfig[chainId]["ethUsdPriceFeed"];
    let ethUsdPriceFeedAddress
    if(chainId==31337){
        const ethUsdAggregator= await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress=ethUsdAggregator.address
    }
    else{
        ethUsdPriceFeedAddress= networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // if contract doesnt exist, we deploy a minimal version for our local testing

    //when going for localhost or hardhat network we want to use a mock
    const args=[ethUsdPriceFeedAddress]
    const fundme= await deploy("Fundme",{
        from: deployer,
        args:args,
        log:true,
        waitConfirmations: network.config.blockConfirmations|| 1,
    })


   if(!developmentChains.includes(network.name)&&process.env.ETHERSCAN_API_KEY)
{
    //VERIFY
    await verify(fundme.address,args)
}


    log("------------------------------------------")
}
module.exports.tags=["all","fundme"]


