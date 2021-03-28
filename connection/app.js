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
    registerPolicyholder: function(policyholder, callback) {
        return mediChainInstance.registerPolicyholder(policyholder, { from: platform })
            .then(() => callback(`Policyholder: ${policyholder} has been successfully registered!`))
            .catch(err => callback(`An error has occurred while registering a new policyholder: ${err}`));
    },
    registerInsurer: function(insurer, callback) {
        return mediChainInstance.registerInsurer(insurer, { from: platform })
            .then(() => callback(`Insurer: ${insurer} has been successfully registered!`))
            .catch(err => callback(`An error has occurred while registering a new insurer: ${err}`));
    }
}