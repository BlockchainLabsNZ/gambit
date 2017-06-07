pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Gambit.sol";

// Proxy contract for testing throws
contract ThrowProxy {
  address public target;
  bytes data;

  function ThrowProxy(address _target) {
    target = _target;
  }

  //prime the data using the fallback function.
  function() {
    data = msg.data;
  }

  function execute() returns (bool) {
    return target.call(data);
  }
}

contract TestOwned {
  function testInitialBalanceUsingDeployedContract() {
    Gambit token = new Gambit();

    uint expected = 260000000000000;
    address expected_owner = address(this);

    Assert.equal(token.balanceOf(expected_owner), expected, "Owner should have 260000000000000 Gambit initially");
    Assert.equal(token.owner(), expected_owner, "Owner should be this contract");
  }

  function testTraspasingOwnership() {
    Gambit token = new Gambit();

    address expected_owner = tx.origin;

    token.changeOwnership(tx.origin);

    Assert.equal(token.owner(), expected_owner, "Owner should be the transactions origin");
  }

  function testTraspasingOwnershipThrow() {
    Gambit token = new Gambit();
    ThrowProxy throwProxy = new ThrowProxy(address(token));

    address expected_owner = tx.origin;

    token.changeOwnership(tx.origin);

    Gambit(address(throwProxy)).changeOwnership(address(this));
    bool r = throwProxy.execute.gas(200000)();

    Assert.isFalse(r, "Should be false, as it should throw");
    Assert.equal(token.owner(), expected_owner, "Owner should be the transactions origin");
  }

  function testBurning() {
    Gambit token = new Gambit();

    Assert.isTrue(token.burn(5000), "Should be false, as it should throw");
    Assert.equal(token.totalBurnt(), 5000, "Burnt amount should be 5000");
    Assert.equal(token.totalSupply(), 259999999995000, "Total supply should be 9999999999995000");
    Assert.equal(token.balanceOf(address(this)), 259999999995000, "Balance of the contract should be 9999999999995000");
  }

  function testUnallowedBurning() {
    Gambit token = new Gambit();
    ThrowProxy throwProxy = new ThrowProxy(address(token));

    token.changeOwnership(tx.origin);

    Assert.isTrue(token.transfer(address(throwProxy), 260000000000000), 'Transfer to Proxy success');

    Gambit(address(throwProxy)).burn(5000);
    bool r = throwProxy.execute.gas(200000)();

    Assert.isFalse(r, "Should be false, as it should throw");
    Assert.equal(token.totalBurnt(), 0, "Burnt amount should be 0");
    Assert.equal(token.totalSupply(), 260000000000000, "Total supply should be 10000000000000000");
    Assert.equal(token.balanceOf(address(throwProxy)), 260000000000000, "Balance of the contract should be 10000000000000000");
  }
}
