// var ERC20 = artifacts.require("./ERC20.sol");
// var Token = artifacts.require("./Token.sol");
var Gambit = artifacts.require("./Gambit.sol");

module.exports = function(deployer) {
  deployer.deploy(Gambit);
};
