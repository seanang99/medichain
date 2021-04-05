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

async function readPatientByIdNum(identificationNum) {
    return Patient.findOne(
        {
            identificationNum: identificationNum
        })
        .catch(err => {
            throw err
        });
}

async function deletePatientByIdNum(identificationNum) {
    return Patient.findOneAndDelete(
        {
            identificationNum: identificationNum
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