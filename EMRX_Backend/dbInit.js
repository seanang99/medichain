const MedicalInstituteAccount = require('./model/medicalInstitutionAccount.model');
const medicalInstituteAccountService = require('./service/medicalInstitutionAccount.service');
const Patient = require('./model/patient.model');
const patientService = require('./service/patient.service');

async function dbInit() {
    // console.log('dbInit.js - dbInit()');

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

    // Following is the data we want to init
    let newMedicalInstituteAcc = new MedicalInstituteAccount({
        firstName: "Alex",
        lastName: "Ong",
        username: "user1",
        password: "password",
        medicalInstituteName: "Tan Tock Seng Hospital"
    })

    let newPatient = new Patient({
        firstName: "Patient",
        lastName: "One",
        identificationNum: "S1234567A"
    });

    await medicalInstituteAccountService.createAccount(newMedicalInstituteAcc)
        .then(() => console.log("Medical Institute Account Init Success!"))
        .catch(err => { throw err });

    await patientService.createPatient(newPatient)
        .then(() => console.log("Patient Init Success!"))
        .catch(err => { throw err });
}

module.exports = {
    dbInit
}