var Gambit = artifacts.require("./Gambit.sol");

module.exports = function(deployer) {
  deployer.deploy(Gambit, 10000000000000000);
};
