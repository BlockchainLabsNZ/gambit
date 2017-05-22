var Gambit = artifacts.require("./Gambit.sol");

contract("Gambit", function(accounts) {
  // CREATION
  it("creation: test correct setting of vanity information", function(done) {
    var ctr;
    Gambit.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.name.call();
    }).then(function(result) {
      assert.strictEqual(result, 'Gambit');
      return ctr.decimals.call();
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 8);
      return ctr.symbol.call();
    }).then(function(result) {
      assert.strictEqual(result, 'GAM');
      done();
    }).catch(done);
  });

  // ISSUANCE
  it("issuance: owner of the contract is able to issue tokens", function(done) {
    var ctr;
    Gambit.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.issue(100, {from: accounts[0]});
    }).then(function(result) {
      var logs = result.logs;
      assert.equal(logs[0].event, 'Issuance');
      assert.equal(logs[0].args._from, accounts[0]);
      assert.strictEqual(logs[0].args._value.toNumber(), 100);
      return ctr.balanceOf.call(accounts[0]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 1000100);
      return ctr.totalSupply.call();
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 1000100);
      done();
    }).catch(done);
  });

  it("issuance: non owner of the contract is unable to issue tokens", function(done) {
    var ctr;
    Gambit.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.issue.call(100, {from: accounts[1]});
    }).then(function(result) {
      assert.isFalse(result);
      return ctr.totalSupply.call();
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 1000000);
      done();
    }).catch(done);
  });

  // BURNING
  it("burning: owner of the contract is able to burn tokens", function(done) {
    var ctr;
    Gambit.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.totalBurnt.call();
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 0);
      return ctr.burn(100, {from: accounts[0]});
    }).then(function(result) {
      var logs = result.logs;
      assert.equal(logs[0].event, 'Burn');
      assert.equal(logs[0].args._from, accounts[0]);
      assert.strictEqual(logs[0].args._value.toNumber(), 100);
      return ctr.balanceOf.call(accounts[0]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 999900);
      return ctr.totalSupply.call();
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 999900);
      return ctr.totalBurnt.call();
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 100);
      done();
    }).catch(done);
  });

  it("burning: non owner of the contract is unable to burn tokens", function(done) {
    var ctr;
    Gambit.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.burn.call(100, {from: accounts[1]});
    }).then(function(result) {
      assert.isFalse(result);
      return ctr.totalBurnt.call();
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 0);
      done();
    }).catch(done);
  });

  it("burning: owner can only burn it's own tokens.", function(done) {
    var ctr;
    Gambit.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.transfer(accounts[1], 500000, {from: accounts[0]});
    }).then(function(result) {
      return ctr.burn.call(600000, {from: accounts[0]});
    }).then(function(result) {
      assert.isFalse(result);
      done();
    }).catch(done);
  });

  it("burning: owner can only burn it's own tokens.", function(done) {
    var ctr;
    Gambit.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.burn.call(0, {from: accounts[0]});
    }).then(function(result) {
      assert.isFalse(result);
      done();
    }).catch(done);
  });
});
