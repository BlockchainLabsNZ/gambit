var Gambit = artifacts.require("./Gambit.sol");

module.exports = function(deployer) {
  deployer.deploy(Gambit, 260000000000000);
};
