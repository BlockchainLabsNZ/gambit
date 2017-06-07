pragma solidity ^0.4.11;

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
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  function changeOwnership(address newOwner) onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

}
