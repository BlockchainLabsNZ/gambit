pragma solidity ^0.4.11;

import "./Token.sol";

contract Gambit is Token {
  string public constant name     = 'Gambit';
  uint8  public constant decimals = 8;
  string public constant symbol   = 'GAM';
  string public constant version  = '1.0.0';
  uint internal _totalBurnt = 0;

  // Owner of this contract
  address internal owner;

  // Triggered when tokens are burnt.
  event Burn(address indexed _from, uint _value);

  // Triggered when tokens are burnt.
  event Issuance(address indexed _from, uint _value);

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
