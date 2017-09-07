pragma solidity ^0.4.15;

/**
 * Owned
 *
 * Base contract with an owner.
 * Provides onlyOwner modifier, which prevents the function from running if
 * it is called by anyone other than the owner.
 **/
contract Owned {
  address public owner;

  function Owned() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function changeOwnership(address newOwner) onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

}
