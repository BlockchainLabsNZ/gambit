const assertFail = require("./helpers/assertFail");
const Gambit = artifacts.require("./Gambit.sol");

contract("Gambit", function(accounts) {
  // CREATION
  it("creation: test correct setting of vanity information", async () => {
    let ctr = await Gambit.new({ from: accounts[0] });
    assert.strictEqual(await ctr.name.call(), "Gambit");
    assert.strictEqual((await ctr.decimals.call()).toNumber(), 8);
    assert.strictEqual(await ctr.symbol.call(), "GAM");
  });

  // BURNING
  it("burning: owner of the contract is able to burn tokens", async () => {
    let ctr = await Gambit.new({ from: accounts[0] });
    assert.strictEqual((await ctr.totalBurnt.call()).toNumber(), 0);
    let logs = (await ctr.burn(100, { from: accounts[0] })).logs;
    assert.equal(logs[0].event, "Burn");
    assert.equal(logs[0].args._from, accounts[0]);
    assert.strictEqual(logs[0].args._value.toNumber(), 100);
    assert.strictEqual(
      (await ctr.balanceOf.call(accounts[0])).toNumber(),
      259999999999900
    );
    assert.strictEqual(
      (await ctr.totalSupply.call()).toNumber(),
      259999999999900
    );
    assert.strictEqual((await ctr.totalBurnt.call()).toNumber(), 100);
  });

  it("burning: owner can only burn it's own tokens.", async () => {
    let ctr = await Gambit.new({ from: accounts[0] });
    await ctr.transfer(accounts[1], 250000000000000, {
      from: accounts[0]
    });
    await assertFail(
      async () => await ctr.burn.call(50000000000000, { from: accounts[0] })
    );
  });

  it("burning: owner can only burn it's own tokens.", async () => {
    let ctr = await Gambit.new({ from: accounts[0] });
    await assertFail(async () => await ctr.burn.call(0, { from: accounts[0] }));
  });
});
