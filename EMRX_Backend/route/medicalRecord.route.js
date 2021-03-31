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
        patientId
    } = req.body;

    let newMedicalRecord = new MedicalRecord({
        recordType,
        recordDetails,
        totalAmt,
        fileUrl,
        patientId,
    });

    return medicalRecordService.createMedicalRecord(newMedicalRecord)
        .then(() => res.status(200).json('Successfully created medical record'))
        .catch(err => res.status(400).json('Medical record ' + err));
});

// Read patient's medical records with patient Id 
router.get('/readAllMedicalRecord/:patientId', (req, res) => {
    const patientId = req.params.patientId;
    
    return medicalRecordService.readAllMedicalRecord(patientId)
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
