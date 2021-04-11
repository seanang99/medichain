const medicalRecord = require('../model/medicalRecord.model');
const Patient = require('../model/patient.model');

async function createMedicalRecord(newMedicalRecord, identificationNum) {
    return Patient.findOne(
        {
            identificationNum: identificationNum
        })
        .then(patient => {
            newMedicalRecord.patientId = patient._id
            medicalRecord.create(newMedicalRecord)
                .then(medicalRecord => {
                    Patient.findOneAndUpdate(
                        {
                            identificationNum: identificationNum
                        },
                        {
                            $push: { medicalRecords: medicalRecord._id }
                        })
                        .catch(err => {
                            throw err
                        });
                })
                .catch(err => {
                    throw err
                });
        })
        .catch(err => {
            throw err
        });
}

async function readAllMedicalRecord() {
    return medicalRecord.find()
        .populate({
            path: 'patientId'
        })
        .catch (err => {
    throw err
});
}

async function readMedicalRecordByPatientIdNum(identificationNum) {
    return Patient.findOne(
        {
            identificationNum: identificationNum
        })
        .populate({
            path: 'medicalRecords',
            populate: {
                path: 'patientId',
                model: 'Patient'
            }
        })
        .then(patient => {
            return patient.medicalRecords
        })
        .catch(err => {
            throw err
        });
}

async function readMedicalRecord(medicalRecordId) {
    return medicalRecord.findById(medicalRecordId)
        .populate("patientId")
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
    readMedicalRecordByPatientIdNum,
    readMedicalRecord,
    deleteMedicalRecord
}