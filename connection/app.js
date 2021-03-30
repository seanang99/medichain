// Assuming private Ethereum blockchain, hence no gas fees are required for making transaction calls.
const Web3 = require('web3');
const contract = require('@truffle/contract');
const medichain_artifact = require('../build/contracts/MediChain.json');

let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
let MediChain = contract(medichain_artifact);
let mediChainInstance;
let ethAccounts;
let platform;

MediChain.setProvider(web3.currentProvider);
MediChain.deployed().then((_instance) => {
  mediChainInstance = _instance
});

web3.eth.getAccounts((err, accounts) => {
  if (err != null) {
    console.log(`There was an error while fetching the accounts: ${err}`);
  } else if (accounts.length == 0) {
    console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
  } else {
    ethAccounts = accounts;
    platform = ethAccounts[0];
  }
});

module.exports = {
  registerPolicyholder: function (policyholder, callback) {
    return mediChainInstance.registerPolicyholder(policyholder, { from: platform })
      .then(txn => callback(`Policyholder: ${policyholder} has been successfully registered!`))
      .catch(err => {
        throw `An error has occurred while registering a new policyholder: ${err}`;
      });
  },
  registerInsurer: function (insurer, callback) {
    return mediChainInstance.registerInsurer(insurer, { from: platform })
      .then(txn => callback(`Insurer: ${insurer} has been successfully registered!`))
      .catch(err => {
        throw `An error has occurred while registering a new insurer: ${err}`;
      });
  },
  submitClaim: function (policyholder, medicalAmount, token, medicalRecordRefIds, callback) {
    let medicalRecordRefIdsInString = "";

    medicalRecordRefIds.forEach(refId => medicalRecordRefIdsInString += `${refId};`);

    return mediChainInstance
      .submitClaim(Math.round(medicalAmount * 100), Date.now(), token, medicalRecordRefIdsInString, {
        from: policyholder
      })
      .then(txn => callback(`Claim for ${medicalRecordRefIdsInString} ($${Math.round(medicalAmount * 100) / 100}) under ${policyholder} has been submitted!`))
      .catch(err => {
        throw `An error has occurred while submitting a new claim: ${err}`;
      });
  },
  processClaim: function (insurer, claimId, claimAmount, remarks, policyNumber, callback) {
    return mediChainInstance
      .processClaim(claimId, Math.round(claimAmount * 100), remarks, policyNumber, {
        from: insurer
      })
      .then(txn => callback(`Claim ${claimId} ($${Math.round(claimAmount * 100) / 100}, remarks: ${remarks}) has been processed under Policy ${policyNumber} by ${insurer}!`))
      .catch(err => {
        throw `An error has occurred while processing a claim: ${err}`;
      });
  },
  approveClaim: function (insurer, claimId, remarks, callback) {
    return mediChainInstance
      .approveClaim(claimId, remarks, {
        from: insurer
      })
      .then(txn => callback(`Claim ${claimId} (remarks: ${remarks}) has been approved by ${insurer}!`))
      .catch(err => {
        throw `An error has occurred while approving a claim: ${err}`;
      });
  },
  rejectClaim: function (insurer, claimId, remarks, callback) {
    return mediChainInstance
      .rejectClaim(claimId, remarks, {
        from: insurer
      })
      .then(txn => callback(`Claim ${claimId} (remarks: ${remarks}) has been rejected by ${insurer}!`))
      .catch(err => {
        throw `An error has occurred while rejecting a claim: ${err}`;
      });
  },
  getClaims: function (address, callback) {
    return mediChainInstance
      .getClaims({ from: address })
      .then(claims => {
        let claimsInJson = [];
        for (claim of claims) {
          claimsInJson.push({
            "claimDate": new Date(claim[0]),
            "claimant": claim[1],
            "medicalAmount": claim[2] / 100,
            "claimAmount": claim[3] / 100,
            "claimStatus": claim[4],
            "remarks": claim[5],
            "verifier": claim[6],
            "endorser": claim[7],
            "policyNumber": claim[8],
            "token": claim[9],
            "medicalRecordRefIds": claim[10].split(";").slice(0, -1)
          })
        }
        
        callback(claimsInJson)
      })
      .catch(err => {
        throw `An error has occurred while getting a list of claims by insurer: ${err}`;
      });
  },
  getClaim: function (user, callback) {
    return mediChainInstance
      .getClaim
      .call({ from: user })
      .then(claim => {
        callback({
          "claimDate": new Date(claim[0]),
          "claimant": claim[1],
          "medicalAmount": claim[2] / 100,
          "claimAmount": claim[3] / 100,
          "claimStatus": claim[4],
          "remarks": claim[5],
          "verifier": claim[6],
          "endorser": claim[7],
          "policyNumber": claim[8],
          "token": claim[9],
          "medicalRecordRefIds": claim[10].split(";").slice(0, -1)
        })
      })
      .catch(err => {
        throw `An error has occurred while getting a claim: ${err}`;
      })
  }
}