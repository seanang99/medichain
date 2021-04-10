const MedicalInstitutionAccount = require('../model/medicalInstitutionAccount.model');
const router = require('express').Router();
const medicalInstituteAccountService = require('../service/medicalInstitutionAccount.service');

router.post('/createAccount', (req, res) => {
    const {
        firstName,
        lastName,
        username,
        password,
        medicalInstituteName
    } = req.body;

    let newMedicalInstituteAcc = new MedicalInstitutionAccount({
        firstName,
        lastName,
        username,
        password,
        medicalInstituteName
    });

    return medicalInstituteAccountService.createAccount(newMedicalInstituteAcc)
        .then(account => res.status(200).json(account))
        .catch(err => res.status(400).json('Register medical institute account ' + err));
});

router.get('/readAllAccounts', (req, res) => {
    return medicalInstituteAccountService.readAllAccount()
        .then(medicalInstitutionAccounts => res.status(200).json(medicalInstitutionAccounts))
        .catch(err => res.status(400).json(err));
});

router.get('/readAccount/:username', (req, res) => {
    username = req.params.username;
    return medicalInstituteAccountService.readAccountByUsername(username)
        .then(medicalInstitutionAccount => res.status(200).json(medicalInstitutionAccount))
        .catch(err => res.status(400).json(err));
});

router.delete('/deleteAccountByUsername/:username', (req, res) => {
    username = req.params.username;
    return medicalInstituteAccountService.deleteAccountByUsername(username)
        .then(msg => res.status(200).json(msg))
        .catch(err => res.status(400).json(err));
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    return medicalInstituteAccountService.login(username, password)
        .then(msg => res.status(200).json(msg))
        .catch(err => res.status(400).json(err.message));
})

module.exports = router;