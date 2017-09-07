const assertFail = require("./helpers/assertFail");
const Token = artifacts.require("./Gambit.sol");

contract("Token", function(accounts) {
  // CREATION
  it("creation: should create an initial balance of 260000000000000 for the creator", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    assert.strictEqual(
      (await ctr.balanceOf.call(accounts[0])).toNumber(),
      260000000000000
    );
  });

  // TRANSERS
  it("transfers: should transfer 260000000000000 to accounts[1] with accounts[0] having 1000000", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    let logs = (await ctr.transfer(accounts[1], 260000000000000, {
      from: accounts[0]
    })).logs;

    assert.equal(logs[0].event, "Transfer");
    assert.equal(logs[0].args._from, accounts[0]);
    assert.equal(logs[0].args._to, accounts[1]);
    assert.strictEqual(logs[0].args._value.toNumber(), 260000000000000);
    assert.strictEqual((await ctr.balanceOf.call(accounts[0])).toNumber(), 0);
    assert.strictEqual(
      (await ctr.balanceOf.call(accounts[1])).toNumber(),
      260000000000000
    );
  });

  it("transfers: should fail when trying to transfer 260000000000001 to accounts[1] with accounts[0] having 1000000", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    await assertFail(
      async () =>
        await ctr.transfer.call(accounts[1], 260000000000001, {
          from: accounts[0]
        })
    );
  });

  it("transfers: should fail when trying to transfer zero.", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    await assertFail(
      async () => await ctr.transfer.call(accounts[1], 0, { from: accounts[0] })
    );
  });

  // APPROVALS
  it("approvals: msg.sender should approve 100 to accounts[1]", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    let logs = (await ctr.approve(accounts[1], 100, { from: accounts[0] }))
      .logs;
    assert.equal(logs[0].event, "Approval");
    assert.equal(logs[0].args._owner, accounts[0]);
    assert.equal(logs[0].args._spender, accounts[1]);
    assert.strictEqual(logs[0].args._value.toNumber(), 100);

    assert.strictEqual(
      (await ctr.allowance.call(accounts[0], accounts[1])).toNumber(),
      100
    );
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    await ctr.approve(accounts[1], 100, { from: accounts[0] });
    assert.strictEqual((await ctr.balanceOf.call(accounts[2])).toNumber(), 0);
    let logs = (await ctr.transferFrom(accounts[0], accounts[2], 20, {
      from: accounts[1]
    })).logs;

    assert.equal(logs[0].event, "Transfer");
    assert.equal(logs[0].args._from, accounts[0]);
    assert.equal(logs[0].args._to, accounts[2]);
    assert.strictEqual(logs[0].args._value.toNumber(), 20);
    assert.strictEqual(
      (await ctr.allowance.call(accounts[0], accounts[1])).toNumber(),
      80
    );
    assert.strictEqual((await ctr.balanceOf.call(accounts[2])).toNumber(), 20);
    assert.strictEqual(
      (await ctr.balanceOf.call(accounts[0])).toNumber(),
      259999999999980
    );
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    await ctr.approve(accounts[1], 100, { from: accounts[0] });
    await ctr.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] });
    await ctr.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] });
    assert.strictEqual(
      (await ctr.allowance.call(accounts[0], accounts[1])).toNumber(),
      60
    );
    assert.strictEqual((await ctr.balanceOf.call(accounts[2])).toNumber(), 40);
    assert.strictEqual(
      (await ctr.balanceOf.call(accounts[0])).toNumber(),
      259999999999960
    );
  });

  //should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    await ctr.approve(accounts[1], 100, { from: accounts[0] });
    await ctr.transferFrom(accounts[0], accounts[2], 50, {
      from: accounts[1]
    });
    assert.strictEqual(
      (await ctr.allowance.call(accounts[0], accounts[1])).toNumber(),
      50
    );
    assert.strictEqual((await ctr.balanceOf.call(accounts[2])).toNumber(), 50);
    assert.strictEqual(
      (await ctr.balanceOf.call(accounts[0])).toNumber(),
      259999999999950
    );

    await assertFail(
      async () =>
        await ctr.transferFrom.call(accounts[0], accounts[2], 60, {
          from: accounts[1]
        })
    );
  });

  it("approvals: attempt withdrawal from acconut with no allowance (should fail)", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    await assertFail(
      async () =>
        await ctr.transferFrom.call(accounts[0], accounts[2], 60, {
          from: accounts[1]
        })
    );
  });

  it("approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.", async () => {
    let ctr = await Token.new({ from: accounts[0] });
    await ctr.approve(accounts[1], 100, { from: accounts[0] });
    await ctr.transferFrom(accounts[0], accounts[2], 60, {
      from: accounts[1]
    });
    await ctr.approve(accounts[1], 0, { from: accounts[0] });
    await assertFail(
      async () =>
        await ctr.transferFrom.call(accounts[0], accounts[2], 10, {
          from: accounts[1]
        })
    );
  });
});
