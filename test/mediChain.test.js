const { assert } = require("chai");

const MediChain = artifacts.require("./MediChain.sol");

contract("MediChain", accounts => {
  let mediChainInstance;
  const platform = accounts[0];
  const policyholderOne = accounts[1];
  const insurerOne = accounts[2];

  before(async() => {
    mediChainInstance = await MediChain.deployed({ from: platform });
  })

  describe("Register policyholder", async() => {
    it("Failed to register policyholder", async() => {
      let result;
      try {
        result = await mediChainInstance.registerPolicyholder.call(policyholderOne, { from: policyholderOne });
      } catch (err) { }
      assert.equal(result, undefined, 'MediChain registerPolicyholder() succeeded even not performed by the platform.');
    });
    
    it("Successfully register policyholder", async() => {
      const expectedPolicyholderId = await mediChainInstance.registerPolicyholder.call(policyholderOne, { from: platform });
      assert.strictEqual(0, expectedPolicyholderId.toNumber(), "MediChain registerPolicyholder() failed even performed by the platform.");
    });
  });

  describe("Register insurer", async() => {
    it("Failed to register insurer", async() => {
      let result;
      try {
        result = await mediChainInstance.registerInsurer.call(insurerOne, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, 'MediChain registerInsurer() succeeded even not performed by the platform.');
    });
    
    it("Successfully register insurer", async() => {
      const expectedInsurerId = await mediChainInstance.registerInsurer.call(insurerOne, { from: platform });
      assert.strictEqual(0, expectedInsurerId.toNumber(), "MediChain registerInsurer() failed even performed by the platform.");
    });
  });
});