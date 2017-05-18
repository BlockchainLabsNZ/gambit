pragma solidity ^0.4.4;

import "./Token.sol";

contract Gambit is Token {
  string public name     = 'Gambit';
  uint8  public decimals = 8;
  string public symbol   = 'GAM';
  string public version  = '1.0.0';
  uint internal _totalBurnt = 0;

  // This notifies clients about the amount burnt
  event Burn(address indexed _from, uint _value);

  // Constructor
  function Gambit(uint _initialAmount) {
    _totalSupply = _initialAmount;
    owner = msg.sender;
    balances[owner] = _totalSupply;
  }

  // Get the total of token burnt
  /// @return Total amount of burned tokens
  function totalBurnt() constant returns (uint totalBurnt) {
    return _totalBurnt;
  }

  // Only the Owner of the contract can burn tokens.
  /// @param _value The amount of token to be burned
  /// @return Whether the burning was successful or not
  function burn(uint _value) returns (bool success) {
    if (msg.sender == owner
        && balances[msg.sender] >= _value
        && _value > 0) {
      balances[owner] -= _value;
      _totalSupply    -= _value;
      _totalBurnt     += _value;
      Burn(msg.sender, _value);
      return true;
    } else {
      return false;
    }
  }
}
