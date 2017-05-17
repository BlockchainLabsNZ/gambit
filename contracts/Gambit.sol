pragma solidity ^0.4.4;

import "./Token.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract Gambit is Token {
  // Constructor
  function Gambit() {
  }

  // Creates more tokens
  /// @param _value Total amount of tokens
  /// @return Total amount of tokens
  function print(uint _value) returns (bool success) {
    balances[owner] += _value;
    return true;
  }

  // Get the total token supply
  /// @return Total amount of tokens
  function burn(uint _value) returns (bool success) {
    if (balances[msg.sender] >= _value
        && _value > 0) {
      balances[owner] -= _value;
      return true;
    } else {
      return false;
    }
  }
}
