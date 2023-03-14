const {deployments,ethers,getNamedAccounts,network}=require("hardhat")
const {assert,expect}=require("chai")
const {developmentChains}=require("../../helper-hardhat-config")
//staging test runs on testnet only and unit test runs on development chains only 

//import("hardhat/console.sol") ths method can also be used to debug the file using console.log
!developmentChains.includes(network.name)?describe.skip :
describe("Fundme",function (){
    let fundme
    let deployer
    let mockV3Aggregator
    const sendvalue=ethers.utils.parseEther("1")//1eth
    beforeEach(async ()=> {
        //deploy our fundme contract using hardhat-deploy
        // const accounts=await ethers.getSigners()
        // const accountzero=accounts[0]
        deployer=(await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundme=await ethers.getContract("Fundme",deployer)
        mockV3Aggregator=await ethers.getContract("MockV3Aggregator",deployer)
    })

    describe("constructor", function (){
        
        it("sets the aggregator address correctly",async ()=> {
           const response=await fundme.getpriceFeed()
           assert.equal(response,mockV3Aggregator.address)
        })
    })
    describe("fund", function(){
        it("fails if you dont send enough ETH",async ()=> {
           await expect(fundme.fund()).to.be.revertedWith(
            "you need to spend more ETH!"
           )
        })
        it("update the amount funded data structure",async ()=>{
            await fundme.fund({value:sendvalue})
            const response=await fundme.getaddresstoamountfunded(deployer)
            assert.equal(response.toString(),sendvalue.toString())
        })
        it("Adds funder to array of getpriceFeed",async ()=>{
            await fundme.fund({value:sendvalue})
            const response=await fundme.getfunder(0)
            assert.equal(response,deployer)
        })
    })
    describe("withdraw",function (){
       beforeEach(async ()=>{
        await fundme.fund({value:sendvalue})
       })
       it("withdraw ETH from a single funder",async ()=>{
        //arrange

        const startingfundmebalance=
             await fundme.provider.getBalance(fundme.address)
        const startingdeployerbalance=
            await fundme.provider.getBalance(deployer)

        //act
        const transactionResponse=await fundme.withdraw()
        const transactionReceipt=await transactionResponse.wait(1)
        const {gasUsed,effectiveGasPrice}=transactionReceipt
        const gascost=gasUsed.mul(effectiveGasPrice)


        const endingfundmebalance=
        await fundme.provider.getBalance(fundme.address)
        const endingdeployerbalance=
        await fundme.provider.getBalance(deployer)

        //assert
        assert.equal(endingfundmebalance,0)
        assert.equal(startingfundmebalance.add(startingdeployerbalance).toString(),
        endingdeployerbalance.add(gascost).toString())
        })
        it("allows us to withdraw with multiple getpriceFeed",async()=>{
            //arrange
            
            const accounts=await ethers.getSigners()
            for(let i=1;i<6;i++){
                const fundmeconnectedcontract=await fundme.connect(
                    accounts[i]
                )
                await fundmeconnectedcontract.fund({value:sendvalue})    
            }
            const startingfundmebalance=
             await fundme.provider.getBalance(fundme.address)
            const startingdeployerbalance=
             await fundme.provider.getBalance(deployer)
             
             //act
             
             const transactionResponse=await fundme.withdraw()
             const transactionReceipt=await transactionResponse.wait(1)
             const {gasUsed,effectiveGasPrice}=transactionReceipt
             const gascost=gasUsed.mul(effectiveGasPrice)

             const endingfundmebalance=
             await fundme.provider.getBalance(fundme.address)
             const endingdeployerbalance=
             await fundme.provider.getBalance(deployer)

             //assert
             
             assert.equal(endingfundmebalance,0)
             assert.equal(startingfundmebalance.add(startingdeployerbalance).toString(),
             endingdeployerbalance.add(gascost).toString()
             )
             //make sure that getpriceFeed array are reset properly
             await expect(fundme.getfunder(0)).to.be.reverted
             for(i=1;i<6;i++){
                assert.equal(
                    await fundme.getaddresstoamountfunded(accounts[i].address),
                    0
                )
             }
        })
        it("only allow the owner to withdraw",async()=>{
            const accounts= await ethers.getSigners()
            const attacker=accounts[1]
            const attackerconnectedcontract=await fundme.connect(attacker)
            await expect(attackerconnectedcontract.withdraw()).to.be.revertedWithCustomError(
                fundme,"Fundme_notowner"
            )
        })
        it("cheaperwithdraw testing...",async()=>{
            //arrange
            
            const accounts=await ethers.getSigners()
            for(let i=1;i<6;i++){
                const fundmeconnectedcontract=await fundme.connect(
                    accounts[i]
                )
                await fundmeconnectedcontract.fund({value:sendvalue})    
            }
            const startingfundmebalance=
             await fundme.provider.getBalance(fundme.address)
            const startingdeployerbalance=
             await fundme.provider.getBalance(deployer)
             
             //act
             
             const transactionResponse=await fundme.cheaperwithdraw()
             const transactionReceipt=await transactionResponse.wait(1)
             const {gasUsed,effectiveGasPrice}=transactionReceipt
             const gascost=gasUsed.mul(effectiveGasPrice)

             const endingfundmebalance=
             await fundme.provider.getBalance(fundme.address)
             const endingdeployerbalance=
             await fundme.provider.getBalance(deployer)

             //assert
             
             assert.equal(endingfundmebalance,0)
             assert.equal(startingfundmebalance.add(startingdeployerbalance).toString(),
             endingdeployerbalance.add(gascost).toString()
             )
             //make sure that getpriceFeed array are reset properly
             await expect(fundme.getfunder(0)).to.be.reverted
             for(i=1;i<6;i++){
                assert.equal(
                    await fundme.getaddresstoamountfunded(accounts[i].address),
                    0
                )
             }
        })
        
    })
})




