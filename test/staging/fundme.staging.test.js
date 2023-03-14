const {getNamedAccounts,ethers,network}=require("hardhat");
const {developmentChains}=require("../../helper-hardhat-config")
const {assert}=require("chai")

developmentChains.includes(network.name)
? describe.skip :
describe("fundme",async ()=>{
    let fundme
    let deployer
    const sendvalue=ethers.utils.parseEther("1")
    
    beforeEach("fundme",async ()=>{
      deployer=(await getNamedAccounts()).deployer
      fundme=await ethers.getContract("Fundme",deployer)
    })
    it("allows people to fund and withdraw",async ()=>{
        await fundme.fund({value:sendvalue})
        await fundme.withdraw()
        const endingbalance=await fundme.provider.getBalance(
            fundme.address
        )
        assert.equal(endingbalance.toString(),"0")
    })

})