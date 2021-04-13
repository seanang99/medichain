const MediChain = artifacts.require("./MediChain.sol");

const truffleAssert = require('truffle-assertions');

contract("MediChain", accounts => {
  let mediChainInstance;
  const platform = accounts[0];
  const policyholderOne = accounts[1];
  const policyholderTwo = accounts[2]
  const insurerOne = accounts[3];
  const insurerTwo = accounts[4];

  let totalClaim = 0;

  before(async() => {
    mediChainInstance = await MediChain.deployed({ from: platform });
  })

  describe("Register policyholder", async () => {
    it("Failed to register policyholder by non-platform owner", async() => {
      let result;
      try {
        result = await mediChainInstance.registerPolicyholder.call(policyholderOne, { from: policyholderOne });
      } catch (err) { }
      assert.equal(result, undefined, 'MediChain registerPolicyholder() succeeded even not performed by the platform.');
    });
    
    it("Successfully register policyholder by platform owner", async() => {
      const expectedPolicyholderId = await mediChainInstance.registerPolicyholder.call(policyholderOne, { from: platform });
      assert.strictEqual(0, expectedPolicyholderId.toNumber(), "MediChain registerPolicyholder() failed even performed by the platform.");
    });
  });

  describe("Register insurer", async () => {
    it("Failed to register insurer by non-platform owner", async() => {
      let result;
      try {
        result = await mediChainInstance.registerInsurer.call(insurerOne, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, 'MediChain registerInsurer() succeeded even not performed by the platform.');
    });
    
    it("Successfully register insurer 1 by platform owner", async() => {
      const expectedInsurerId = await mediChainInstance.registerInsurer.call(insurerOne, { from: platform });
      assert.strictEqual(0, expectedInsurerId.toNumber(), "MediChain registerInsurer() failed even performed by the platform.");
    });

  });

  describe("Submit claim", async () => {
    const medicalAmount = 100;
    const token = "token";
    const claimDate = Date.now();
    const medicalRefIds = "id1;";

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

      totalClaim++;
    });

    it("Failed to submit multiple duplicate claims (with same medical record IDs)", async () => {
      await mediChainInstance.submitClaim(medicalAmount, claimDate, token, medicalRefIds, { from: policyholderOne });
      let result;
      try {
        result = await mediChainInstance.submitClaim(medicalAmount, claimDate, token, medicalRefIds, { from: policyholderOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain submitClaim() succeeded even duplicate is detected");
    });
  });

  describe("Process claim", async () => {
    const claimId = 0;
    const claimAmount = 80;
    const remarks = "remarksOne";
    const policyNumber = "policyOne"

    it("Failed to process claim by non-insurer", async () => {
      let result;
      try {
        result = await mediChainInstance.processClaim(claimId, claimAmount, remarks, policyNumber, { from: policyholderOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain processClaim() succeeded even performed by non-insurer");
    });

    it("Successfully process claim by insurer one", async () => {
      let claim = await mediChainInstance.processClaim(claimId, claimAmount, remarks, policyNumber, { from: insurerOne });
      truffleAssert.eventEmitted(claim, "claimUpdate", ev => ev.claimStatus == 1);
    });
  });

  describe("Approve claim one", async () => {
    const claimId = 0;
    const remarks = "approveRemarks";

    it("Failed to approve claim one by same insurer", async () => {
      let result;
      try {
        result = await mediChainInstance.approveClaim(claimId, remarks, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain approveClaim() succeeded even performed by the same insurer");
    });

    it("Successfully approve claim by insurer two", async () => {
      let claim = await mediChainInstance.approveClaim(claimId, remarks, { from: insurerTwo });
      truffleAssert.eventEmitted(claim, "claimUpdate", ev => ev.claimStatus == 2);
    });
  })

  describe("Reject claim two", async () => {
    const claimId = 1;
    let remarks = "remarksTwo";

    before("Initialise claim two for rejection", async () => {
      const medicalAmount = 100;
      const token = "tokenTwo";
      const claimDate = Date.now();
      const medicalRefIds = "id1;id2;";
      await mediChainInstance.submitClaim(medicalAmount, claimDate, token, medicalRefIds, { from: policyholderOne });

      totalClaim++;

      const claimAmount = 80;
      const policyNumber = "policyTwo";
      await mediChainInstance.processClaim(claimId, claimAmount, remarks, policyNumber, { from: insurerOne });
    });

    remarks = "rejectRemarks";
    it("Failed to reject claim by same insurer", async () => {
      let result;
      try {
        result = await mediChainInstance.rejectClaim(claimId, remarks, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain rejectClaim() succeeded even performed by the same insurer");
    });

    it("Successfully reject claim by insurer two", async () => {
      let claim = await mediChainInstance.rejectClaim(claimId, remarks, { from: insurerTwo });
      truffleAssert.eventEmitted(claim, "claimUpdate", ev => ev.claimStatus == 3);
    });
  });

  describe("Disburse claim", async () => {
    const remarks = "disburseClaim";

    it("Failed to disburse rejected claim", async () => {
      const claimId = 1;

      let result;
      try {
        result = await mediChainInstance.disburseClaim(claimId, remarks, { from: insurerTwo });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain disburseClaim() succeeded even it was rejected");
    });

    it("Successfully disburse claim by insurer two", async () => {
      const claimId = 0;

      let claim = await mediChainInstance.disburseClaim(claimId, remarks, { from: insurerTwo });
      truffleAssert.eventEmitted(claim, "claimUpdate", ev => ev.claimStatus == 4);
    });
  })

  describe("Invalid flow of claim process", async () => {
    const medicalAmount = 100;
    const claimDate = Date.now();
    const token = "tokenThree";
    const medicalRefIds = "id1;id2;id3;";
    
    const claimId = 2;
    const claimAmount = 100;
    const remarks = "remarks";
    const policyNumber = "policyOne";

    before("Initialise claim three for invalid flow", async () => {
      await mediChainInstance.submitClaim(medicalAmount, claimDate, token, medicalRefIds, { from: policyholderOne });
      totalClaim++;
    });

    it ("Failed to approve claim before being processed", async () => {
      let result;
      try {
        result = await mediChainInstance.approveClaim(claimId, remarks, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain approveClaim() succeeded even it has not been processed");
    });

    it ("Failed to reject claim before being processed", async () => {
      let result;
      try {
        result = await mediChainInstance.rejectClaim(claimId, remarks, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain rejectClaim() succeeded even it has not been processed");
    });
    
    it ("Failed to disburse claim before being approved", async () => {
      await mediChainInstance.processClaim(claimId, claimAmount, remarks, policyNumber, { from: insurerTwo });

      let result;
      try {
        result = await mediChainInstance.disburseClaim(claimId, remarks, { from: insurerOne });
      } catch (err) { }
      assert.equal(result, undefined, "MediChain disburseClaim() succeeded even it has not been approved");
    });
  });

  describe("Retrieve claim/claims", async () => {
    const claimId = 0;

    it ("Get all claims", async () => { 
      let claims = await mediChainInstance.getClaims.call();
      assert.strictEqual(claims.length, totalClaim, "Incorrect total number of MediChain claims");
    });

    it ("Failed to get claim by non-claimant", async () => {
      await mediChainInstance.registerPolicyholder(policyholderTwo, { from: platform });
    
      let result;
      try {
        result = await mediChainInstance.getClaim(claimId, { from: policyholderTwo });
      } catch (err) { }
      assert.equal(result, undefined, "Medichain getClaim() succeeded even called by non-claimant");
    });

    it ("Successfully get claim by claimant", async () => {
      let claim = await mediChainInstance.getClaim.call(claimId, { from: policyholderOne });
      assert.equal(claim.claimId, 0, "MediChain getClaim() failed even called by claimant");
    });
  });
});