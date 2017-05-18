pragma solidity ^0.4.4;

import "./ERC20.sol";

contract Token is ERC20 {
  function () {
    // if ether is sent to this address, send it back.
    throw;
  }

  // Balances for each account
  mapping(address => uint) balances;

  // Owner of account approves the transfer of an amount to another account
  mapping(address => mapping (address => uint)) allowed;

  // Owner of this contract
  address public owner;

  // The total token supply
  uint _totalSupply = 1000000;

  // Constructor
  function Token() {
    owner = msg.sender;
    balances[owner] = _totalSupply;
  }

  // Get the total token supply
  /// @return Total amount of tokens
  function totalSupply() constant returns (uint totalSupply) {
    return _totalSupply;
  }

  // Get the account balance of another account with address _owner
  /// @param _owner The address from which the balance will be retrieved
  /// @return The balance
  function balanceOf(address _owner) constant returns (uint balance) {
    return balances[_owner];
  }

  // Send _value amount of tokens to address _to
  /// @notice send `_value` token to `_to` from `msg.sender`
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transfer(address _to, uint _value) returns (bool success) {
    if (balances[msg.sender] >= _value
        && _value > 0
        && balances[_to] + _value > balances[_to]) {
      balances[msg.sender] -= _value;
      balances[_to] += _value;
      Transfer(msg.sender, _to, _value);
      return true;
    } else {
      return false;
    }
  }

  // Send _value amount of tokens from address _from to address
  /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
  /// @param _from The address of the sender
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transferFrom(address _from, address _to, uint _value) returns (bool success) {
    if (balances[_from] >= _value
         && allowed[_from][msg.sender] >= _value
         && _value > 0
         && balances[_to] + _value > balances[_to]) {
      balances[_from] -= _value;
      allowed[_from][msg.sender] -= _value;
      balances[_to] += _value;
      Transfer(_from, _to, _value);
      return true;
    } else {
      return false;
    }
  }

  // Allow _spender to withdraw from your account, multiple times, up to the
  // _value amount. If this function is called again it overwrites the current
  // allowance with _value.
  /// @notice `msg.sender` approves `_spender` to spend `_value` tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @param _value The amount of tokens to be approved for transfer
  /// @return Whether the approval was successful or not
  function approve(address _spender, uint _value) returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  // Returns the amount which _spender is still allowed to withdraw from _owner
  /// @param _owner The address of the account owning tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @return Amount of remaining tokens allowed to spent
  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }
}
