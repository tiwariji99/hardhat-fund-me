//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

 library priceconvertor{
     function getprice(AggregatorV3Interface priceFeed )internal view returns(uint256)  {
          // abi of contract
          //address  too 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
       
         ( ,int256 price,,, )=priceFeed.latestRoundData();
         // it has 8 decimal values
           return uint256(price*10**10);
      }


     

      function getconversionrate(uint256 ethamount,AggregatorV3Interface priceFeed) internal view returns(uint256) {
          uint256 ethprice =getprice(priceFeed);
          // 1516.000000000000000000
          // 1
          uint256 ethamountinusd =(ethprice*ethamount)/1e18;
          return ethamountinusd ;
      }
 }