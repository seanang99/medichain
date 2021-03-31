const Patient = require('../model/patient.model');

async function createPatient(newPatient) {
    return Patient.create(newPatient)
        .catch(err => {
            throw err
        });
}

async function readAllPatient() {
    return Patient.find()
        .catch(err => {
            throw err
        })
}

async function readPatientByIdNum(identificationNumber) {
    return Patient.findOne(
        {
            identificationNumber: identificationNumber
        })
        .catch(err => {
            throw err
        });
}

async function deletePatientByIdNum(identificationNumber) {
    return Patient.findOneAndDelete(
        {
            identificationNumber: identificationNumber
        })
        .catch(err => {
            throw err
        });
}

module.exports = {
    createPatient,
    readAllPatient,
    readPatientByIdNum,
    deletePatientByIdNum
}