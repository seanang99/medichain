const MedicalInstitutionAccount = require('../model/medicalInstitutionAccount.model');

async function createAccount(newMedicalInstituteAcc) {
    return MedicalInstitutionAccount.create(newMedicalInstituteAcc)
        .catch(err => {
            throw err
        });
}

async function readAllAccount() {
    return MedicalInstitutionAccount.find()
        .catch(err => {
            throw err
        })
}

async function readAccountByUsername(username) {
    return MedicalInstitutionAccount.findOne(
        {
            username: username
        })
        .catch(err => {
            throw err
        });
}

async function deleteAccountByUsername(username) {
    return MedicalInstitutionAccount.findOneAndDelete(
        {
            username: username
        })
        .catch(err => {
            throw err
        });
}

async function login(username, password) {
    return readAccountByUsername(username)
        .then(account => {
            if (account.password == password) {
                return "Login successfully";
            } else {
                throw new Error("Login unsuccessfully, please try again");
            }
        })
        .catch(err => {
            throw err;
        });
}

module.exports = {
    createAccount,
    readAllAccount,
    readAccountByUsername,
    deleteAccountByUsername,
    login
}