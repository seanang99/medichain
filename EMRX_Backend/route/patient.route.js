const router = require('express').Router();
const MedicalRecord = require('../model/medicalRecord.model');
const Patient = require('../model/patient.model');
const patientService = require('../service/patient.service');

router.post('/createPatient', (req, res) => {
    const {
        firstName,
        lastName,
        identificationNum,
        // medicalRecords,
        // tokens
    } = req.body;

    let newPatient = new Patient({
        firstName,
        lastName,
        identificationNum
    });

    return patientService.createPatient(newPatient)
        .then(() => res.status(200).json('Successfully created patient'))
        .catch(err => res.status(400).json('Patient Creation ' + err));
});

router.get('/readAllPatient', (req, res) => {
    return patientService.readAllPatient()
        .then(patients => res.status(200).json(patients))
        .catch(err => res.status(400).json(err));
});

router.get('/readPatientByIdNum/:identificationNum', (req, res) => {
    const identificationNum = req.params.identificationNum;
    return patientService.readPatientByIdNum(identificationNum)
        .then(patient => res.status(200).json(patient))
        .catch(err => res.status(400).json(err));
});

router.delete('/deletePatientByIdNum/:identificationNum', (req, res) => {
    const identificationNum = req.params.identificationNum;
    return patientService.deletePatientByIdNum(identificationNum)
        .then(msg => res.status(200).json(msg))
        .catch(err => res.status(400).json(err));
});

module.exports = router;
