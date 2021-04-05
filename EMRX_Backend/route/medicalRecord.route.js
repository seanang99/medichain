const router = require('express').Router();
const MedicalRecord = require('../model/medicalRecord.model');
const medicalRecordService = require('../service/medicalRecord.service');

router.post('/createMedicalRecord', (req, res) => {
    //PatientId here refer to mongodb _id 
    //Can also change to identification num
    const {
        recordType,
        recordDetails,
        totalAmt,
        fileUrl,
        identificationNum
    } = req.body;

    let newMedicalRecord = new MedicalRecord({
        recordType,
        recordDetails,
        totalAmt,
        fileUrl,
    });
    console.log('medicalRecord ', identificationNum);
    return medicalRecordService.createMedicalRecord(newMedicalRecord, identificationNum)
        .then(() => res.status(200).json('Successfully created medical record'))
        .catch(err => res.status(400).json('Medical record ' + err));
});

router.get('/readAllMedicalRecord', (req, res) => {
    return medicalRecordService.readAllMedicalRecord()
        .then(medicalRecords => res.status(200).json(medicalRecords))
        .catch(err => res.status(400).json('Read all medical record ' + err));
});

// Read patient's medical records with patient Id Num 
router.get('/readMedicalRecordByPatientIdNum/:identificationNum', (req, res) => {
    const identificationNum = req.params.identificationNum;

    return medicalRecordService.readMedicalRecordByPatientIdNum(identificationNum)
        .then(medicalRecords => res.status(200).json(medicalRecords))
        .catch(err => res.status(400).json(err));
});

// Read patient's single medical record with medical record Id
router.get('/readMedicalRecord/:medicalRecordId', (req, res) => {
    const medicalRecordId = req.params.medicalRecordId;

    return medicalRecordService.readMedicalRecord(medicalRecordId)
        .then(medicalRecord => res.status(200).json(medicalRecord))
        .catch(err => res.status(400).json(err));
});

// Delete patient's medical record with medical record Id
router.delete('/deleteMedicalRecord/:medicalRecordId', (req, res) => {
    const medicalRecordId = req.params.medicalRecordId;

    return medicalRecordService.deleteMedicalRecord(medicalRecordId)
        .then(msg => res.status(200).json(msg))
        .catch(err => res.status(400).json(err));
});

module.exports = router;
