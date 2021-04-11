const Insurer = require('./model/Insurer.model');
const Policyholder = require('./model/policyholder.model');
const accountService = require('./service/account.service');
const medichain = require('../connection/app');

async function dbInit() {
    // Getting the mongoose connection from server.js
    const mongoose = require("./server");
    const dbConnection = mongoose.connection;

    // Getting the mongodb collection name and dropping it
    // This also makes sure that the collection is available before dropping
    collectionArr = await dbConnection.db.listCollections().toArray();
    for (let i = 0; i < collectionArr.length; i++) {
        dbConnection.db.dropCollection(collectionArr[i].name);
        console.log(collectionArr[i].name + " collection is dropped!");
    }

    let newInsurer1 = new Insurer({
        firstName: "Singapore",
        lastName: "AIA",
        username: "insurer1",
        password: "password",
        employeeId: "AIA123456",
        onChainAccountAddress: "0x514181210d13B4070F150d8240c161A954965DB5",
    });

    let newInsurer2 = new Insurer({
        firstName: "Singapore",
        lastName: "AIA",
        username: "insurer2",
        password: "password",
        employeeId: "AIA654321",
        onChainAccountAddress: "0x961031B9EEB9cF97b3F2Bb5B5F8C736510922fa5",
    });

    let newPolicyholder = new Policyholder({
        firstName: "policyholder",
        lastName: "One",
        username: "policyholder1",
        password: "password",
        identificationNum: "S1234567A",
        onChainAccountAddress: "0xdCc4F8aF9F21a8CC4954434A2001753DAE5cCd90",
    });

    await accountService.createInsurer(newInsurer1)
        .then((insurer) => {
            medichain.registerInsurer(insurer.onChainAccountAddress, (message) => {
                console.log(`dbInit.js/registerInsurer1: ${message}\n`);
            }).catch(err => {
                console.log(`dbInit.js/registerInsurer1: ${err}\n`);
            });
        })
        .catch((err) => { throw err });

    await accountService.createInsurer(newInsurer2)
        .then((insurer) => {
            medichain.registerInsurer(insurer.onChainAccountAddress, (message) => {
                console.log(`dbInit.js/registerInsurer2: ${message}\n`);
            }).catch(err => {
                console.log(`dbInit.js/registerInsurer2: ${err}\n`);
            });
        })
        .catch((err) => { throw err });

    await accountService.createPolicyholder(newPolicyholder)
        .then((policyholder) => {
            medichain.registerPolicyholder(policyholder.onChainAccountAddress, (message) => {
                console.log(`dbInit.js/registerPolicyholder: ${message}\n`);
            }).catch(err => {
                console.log(`dbInit.js/registerPolicyholder: ${err}\n`);
            });
        })
        .catch((err) => { throw err })
}

module.exports = {
    dbInit
}