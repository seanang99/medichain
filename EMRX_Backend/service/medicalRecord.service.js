const medicalRecord = require('../model/medicalRecord.model');

async function createMedicalRecord(newMedicalRecord) {
    return medicalRecord.create(newMedicalRecord)
        .catch(err => {
            throw err
        });
}

async function readAllMedicalRecord(patientId) {
    return medicalRecord.find(
        {
            patientId: patientId
        })
        .catch(err => {
            throw err
        });
}

async function readMedicalRecord(medicalRecordId) {
    return medicalRecord.findById(medicalRecordId)
        .then(medicalRecord => medicalRecord)
        .catch(err => {
            throw err
        })
}

async function deleteMedicalRecord(medicalRecordId) {
    return medicalRecord.findByIdAndDelete(medicalRecordId)
        .catch(err => {
            throw err
        });
}

module.exports = {
    createMedicalRecord,
    readAllMedicalRecord,
    readMedicalRecord,
    deleteMedicalRecord
}