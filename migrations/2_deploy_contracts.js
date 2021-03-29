var SimpleStorage = artifacts.require("./SimpleStorage.sol");
const MediChain = artifacts.require("./MediChain.sol");

module.exports = function(deployer, network, accounts) {
  const platform = accounts[0];

  deployer.deploy(SimpleStorage);
  deployer.deploy(MediChain, { from: platform });
};