const MediChain = artifacts.require("./MediChain.sol");

const truffleAssert = require('truffle-assertions');

contract("MediChain", accounts => {
  let mediChainInstance;
  const platform = accounts[0];
  const policyholderOne = accounts[1];
  const insurerOne = accounts[2];
  const insurerTwo = accounts[3];

  const medicalAmount = 100;
  const token = "token";
  const claimDate = Date.now();
  const medicalRefIds = "id1;id2;id3;";

  before(async() => {
    mediChainInstance = await MediChain.deployed({ from: platform });
  })

  describe("Register policyholder", async () => {
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

  describe("Register insurer", async () => {
    it("Failed to register insurer", async() => {
      let result;
      try {
        result = await mediChainInstance.registerInsurer.call(insurerOne, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, 'MediChain registerInsurer() succeeded even not performed by the platform.');
    });
    
    it("Successfully register insurer 1", async() => {
      const expectedInsurerId = await mediChainInstance.registerInsurer.call(insurerOne, { from: platform });
      assert.strictEqual(0, expectedInsurerId.toNumber(), "MediChain registerInsurer() failed even performed by the platform.");
    });

  });

  describe("Submit claim", async () => {
    before("Initialise users", async () => {
      await mediChainInstance.registerPolicyholder(policyholderOne, { from: platform });
      await mediChainInstance.registerInsurer(insurerOne, { from: platform });
      await mediChainInstance.registerInsurer(insurerTwo, { from: platform });
    });
    
    it("Failed to submit claim by non-policyholder", async () => {      
      let result;
      try {
        result = await mediChainInstance.submitClaim.call(medicalAmount, claimDate, token, medicalRefIds, { from: account[9] });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain submitClaim() succeeded even performed by non-policyholder!");
    });

    it("Successfully create claim by policyholder", async () => {
      const expectedClaimId = await mediChainInstance.submitClaim.call(medicalAmount, claimDate, token, medicalRefIds, { from: policyholderOne });
      assert.strictEqual(0, expectedClaimId.toNumber(), "MediChain submitClaim() failed even performed by policyholder");
    });

    it("Failed to submit multiple duplicate claims (with same medical record IDs", async () => {
      await mediChainInstance.submitClaim(medicalAmount, claimDate, token, medicalRefIds, { from: policyholderOne });

      let result;
      try {
        result = await mediChainInstance.submitClaim(medicalAmount, claimDate, token, medicalRefIds, { from: policyholderOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain submitClaim() succeeded even duplicate is detected");
    });
  });

  describe("Process claim", async () => {
    it("Failed to process claim by non-insurer", async () => {
      let result;
      try {
        result = await mediChainInstance.processClaim(claimId, claimAmount, remarks, policyNumber, { from: policyholderOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain processClaim() succeeded even performed by non-insurer");
    });

    it("Successfully process claim by insurer one", async () => {
      const claimId = 0;
      const claimAmount = 80;
      const remarks = "remarksOne";
      const policyNumber = "policyOne"

      let claim = await mediChainInstance.processClaim(claimId, claimAmount, remarks, policyNumber, { from: insurerOne });
      truffleAssert.eventEmitted(claim, "claimUpdate", ev => ev.claimStatus == 1);
    });
  });

  describe("Process claim", async () => {
    
  })

  describe("Process claim", async () => {
    
  })

  describe("Process claim", async () => {
    
  })
});