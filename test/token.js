var Token = artifacts.require("./Gambit.sol");

contract("Token", function(accounts) {
  // CREATION
  it("creation: should create an initial balance of 1000000 for the creator", function(done) {
    Token.new(1000000, {from: accounts[0]}).then(function(ctr) {
      return ctr.balanceOf.call(accounts[0]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 1000000);
      done();
    }).catch(done);
  });

  // TRANSERS
  it("transfers: should transfer 1000000 to accounts[1] with accounts[0] having 1000000", function(done) {
    var ctr;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.transfer(accounts[1], 1000000, {from: accounts[0]});
    }).then(function(result) {
      var logs = result.logs;
      assert.equal(logs[0].event, 'Transfer');
      assert.equal(logs[0].args._from, accounts[0]);
      assert.equal(logs[0].args._to, accounts[1]);
      assert.strictEqual(logs[0].args._value.toNumber(), 1000000);
      return ctr.balanceOf.call(accounts[0]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 0);
      return ctr.balanceOf.call(accounts[1]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 1000000);
      done();
    }).catch(done);
  });

  it("transfers: should fail when trying to transfer 1000001 to accounts[1] with accounts[0] having 1000000", function(done) {
    var ctr;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.transfer.call(accounts[1], 1000001, {from: accounts[0]});
    }).then(function(result) {
      assert.isFalse(result);
      done();
    }).catch(done);
  });

  it("transfers: should fail when trying to transfer zero.", function(done) {
    var ctr;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.transfer.call(accounts[1], 0, {from: accounts[0]});
    }).then(function(result) {
      assert.isFalse(result);
      done();
    }).catch(done);
  });

  // APPROVALS
  it("approvals: msg.sender should approve 100 to accounts[1]", function(done) {
    var ctr;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function(result) {
      var logs = result.logs;
      assert.equal(logs[0].event, 'Approval');
      assert.equal(logs[0].args._owner, accounts[0]);
      assert.equal(logs[0].args._spender, accounts[1]);
      assert.strictEqual(logs[0].args._value.toNumber(), 100);
      return ctr.allowance.call(accounts[0], accounts[1]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 100);
      done();
    }).catch(done);
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.", function(done) {
    var ctr, watcher;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      watcher = ctr.Transfer();
      return ctr.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function(result) {
      return ctr.balanceOf.call(accounts[2]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 0);
      return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
    }).then(function(result) {
      var logs = result.logs;
      assert.equal(logs[0].event, 'Transfer');
      assert.equal(logs[0].args._from, accounts[0]);
      assert.equal(logs[0].args._to, accounts[2]);
      assert.strictEqual(logs[0].args._value.toNumber(), 20);
      return ctr.allowance.call(accounts[0], accounts[1]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 80);
      return ctr.balanceOf.call(accounts[2]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 20);
      return ctr.balanceOf.call(accounts[0]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 999980);
      done();
    }).catch(done);
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.", function(done) {
    var ctr;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function(result) {
      return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
    }).then(function(result) {
      return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
    }).then(function(result) {
      return ctr.allowance.call(accounts[0], accounts[1]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 60);
      return ctr.balanceOf.call(accounts[2]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 40);
      return ctr.balanceOf.call(accounts[0]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 999960);
      done();
    }).catch(done);
  });

  //should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)", function(done) {
    var ctr;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function(result) {
      return ctr.transferFrom(accounts[0], accounts[2], 50, {from: accounts[1]});
    }).then(function(result) {
      return ctr.allowance.call(accounts[0], accounts[1]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 50);
      return ctr.balanceOf.call(accounts[2]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 50);
      return ctr.balanceOf.call(accounts[0]);
    }).then(function(result) {
      assert.strictEqual(result.toNumber(), 999950);
      return ctr.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
    }).then(function(result) {
      assert.isFalse(result);
      done();
    }).catch(done);
  });

  it("approvals: attempt withdrawal from acconut with no allowance (should fail)", function(done) {
    var ctr = null;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
    }).then(function(result) {
      assert.isFalse(result);
      done();
    }).catch(done);
  });

  it("approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.", function(done) {
    var ctr = null;
    Token.new(1000000, {from: accounts[0]}).then(function(result) {
      ctr = result;
      return ctr.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function(result) {
      return ctr.transferFrom(accounts[0], accounts[2], 60, {from: accounts[1]});
    }).then(function(result) {
      return ctr.approve(accounts[1], 0, {from: accounts[0]});
    }).then(function(result) {
      return ctr.transferFrom.call(accounts[0], accounts[2], 10, {from: accounts[1]});
    }).then(function(result) {
      assert.isFalse(result);
      done();
    }).catch(done);
  });
});
