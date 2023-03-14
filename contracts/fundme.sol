//SPDX-License-Identifier: MIT
//pragma
 pragma solidity ^0.8.8;
 //import
import "./priceconvertor.sol";
//error codes
 error Fundme_notowner();
 //interfaces,library,contract

/**
 @title a contract for crowd funding 
 @author tiwariji 
 @notice this contract is to demo a sample funding contract
 @dev this implements price feeds as our library 
 */

contract Fundme{
    //type declarations
    using priceconvertor for uint256;
     // constant and immutable are better way to save gas 
    uint256 public constant MINIMUM_USD=50* 10**18;

//  uint256 public number;
// ask about error on stack exchange ETH
                    
       address[] private s_funders;
//state variables
mapping(address=> uint256) private  s_addresstoamountfunded;

address private immutable  i_owner;
AggregatorV3Interface private s_priceFeed;

//modifier
modifier onlyowner{
      //  require(msg.sender == i_owner ,"sender is not owner");
      if(msg.sender!=i_owner){revert Fundme_notowner();}
        _;
}
//FUnction Order 
//constructor
//receive
//fallback
//external
//public
//internal
//private
//view/pure


        constructor(address s_priceFeedAddress){
            i_owner=msg.sender;
            s_priceFeed=AggregatorV3Interface(s_priceFeedAddress);

        }
      receive() external payable {
        fund();
      }
      fallback() external payable {
        fund();
      }
/**
 @notice this function funds this contract
 @dev this implements price feed as our library
 */
      function fund()public payable {
      require(
        msg.value.getconversionrate(s_priceFeed)>=MINIMUM_USD,
        "you need to spend more ETH!"
      );
        
      s_addresstoamountfunded[msg.sender]+=msg.value;
      s_funders.push(msg.sender);
        
          //reverting returns the total gas spent when particular amount of transaction does not meet the conditions
          
        //   number=5;
        // msg.value.getconversionrate();
         
          // msg.value has 18 decimal places 


          // getting an input from the real world is a genuine concern and to do thiswe also need to take care that there
          //sholud not be a single data provider we are provided with
          // chainlink which is a decentralized oracle network which help us to build hybrid smart contracts 
          //which is also able to extract data from the real world
          
      }
      

      function withdraw() public onlyowner{
        //    require(msg.sender==owner,"sender is not owner!");

          for(uint256 funderindex=0;funderindex<s_funders.length;funderindex++){
              address funder= s_funders[funderindex];
              s_addresstoamountfunded[funder]=0;
          }
          //reset the array 
          s_funders = new address[](0);
          //transfer 
          //msg.sender is of type address

         payable( msg.sender).transfer(address(this).balance);
         //send 
         bool sendsuccess= payable(msg.sender).send(address(this).balance);
         require(sendsuccess ,"send failed");
         //call
         (bool callsuccess ,)=payable(msg.sender).call{value : address(this).balance}("");
         require(callsuccess,"call failed");
         
          
      }
      function cheaperwithdraw() public payable onlyowner{
          address[] memory funders=s_funders;
          for(
            uint256 funderindex=0; 
            funderindex<funders.length; 
            funderindex++){
             
            address funder=funders[funderindex];
            s_addresstoamountfunded[funder]=0;

          }
          s_funders=new address[](0);
          (bool success,)=i_owner.call{value:address(this).balance}("");
          require(success);
      }

      function getfunder(uint256 index) public view returns(address){
        return s_funders[index];
      }
      function getowner()public view returns(address){
        return i_owner;
      }
      function getaddresstoamountfunded(address funder) public view returns(uint256){
        return s_addresstoamountfunded[funder];
      }
      function getpriceFeed() public view returns (AggregatorV3Interface){
        return s_priceFeed;
      }

   //modifier (could be used when several function need some change)
   //
      //receive and fallback basically takes large amount of gas
      
    
}
   //name of constant is just a pointer to data pointed from it
   //constant and immutable variable does not take part in storage 
   //dynamic variables do take some spaces of any storage box but its length is not confirmed  
   //global variable do take spot in storage
   //mapping only creates a gap in storage
   //practise to create a function which gives several outputs as memory locations
  // gas prices are calculated on basis of opcodes written inside 

