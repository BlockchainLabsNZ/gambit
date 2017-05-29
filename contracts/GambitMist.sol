pragma solidity ^0.4.11;

// Abstract contract for the full ERC 20 Token standard
// https://github.com/ethereum/EIPs/issues/20
contract ERC20 {
  // Get the total token supply
  /// @return Total amount of tokens
  function totalSupply() constant returns (uint totalSupply);

  // Get the account balance of another account with address _owner
  /// @param _owner The address from which the balance will be retrieved
  /// @return The balance
  function balanceOf(address _owner) constant returns (uint balance);

  // Send _value amount of tokens to address _to
  /// @notice send `_value` token to `_to` from `msg.sender`
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transfer(address _to, uint _value) returns (bool success);

  // Send _value amount of tokens from address _from to address
  /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
  /// @param _from The address of the sender
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transferFrom(address _from, address _to, uint _value) returns (bool success);

  // Allow _spender to withdraw from your account, multiple times, up to the
  // _value amount. If this function is called again it overwrites the current
  // allowance with _value.
  /// @notice `msg.sender` approves `_spender` to spend `_value` tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @param _value The amount of tokens to be approved for transfer
  /// @return Whether the approval was successful or not
  function approve(address _spender, uint _value) returns (bool success);

  // Returns the amount which _spender is still allowed to withdraw from _owner
  /// @param _owner The address of the account owning tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @return Amount of remaining tokens allowed to spent
  function allowance(address _owner, address _spender) constant returns (uint remaining);

  // Triggered when tokens are transferred.
  event Transfer(address indexed _from, address indexed _to, uint _value);

  // Triggered whenever approve(address _spender, uint256 _value) is called.
  event Approval(address indexed _owner, address indexed _spender, uint _value);
}

contract Token is ERC20 {
  function () {
    // if ether is sent to this address, send it back.
    throw;
  }

  // Balances for each account
  mapping(address => uint) balances;

  // Owner of account approves the transfer of an amount to another account
  mapping(address => mapping (address => uint)) allowed;

  // The total token supply
  uint internal _totalSupply;

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
      balances[_to]        += _value;
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
      balances[_to]   += _value;
      allowed[_from][msg.sender] -= _value;
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
