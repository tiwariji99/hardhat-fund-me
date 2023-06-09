const { getNamedAccounts,ethers } = require("hardhat");

async function main(){
    const {deployer}=await getNamedAccounts()
    const fundme=await ethers.getContract("Fundme",deployer)
    console.log("withdrawing...")
    const transactionResponse=await fundme.withdraw()
    await transactionResponse.wait(1)
    console.log("got it back!")
}
main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error)
    process.exit(1)
})
