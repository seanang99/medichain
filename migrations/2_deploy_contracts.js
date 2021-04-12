const MediChain = artifacts.require("./MediChain.sol");

module.exports = function(deployer, network, accounts) {
  const platform = accounts[0];
  deployer.deploy(MediChain, { from: platform });
};