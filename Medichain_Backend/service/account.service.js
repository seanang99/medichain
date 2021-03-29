const Account = require('../model/account.model')
const SystemAdmin = require('../model/systemAdmin.model')
const Policyholder = require('../model/policyholder.model')
const Insurer = require('../model/Insurer.model')

async function createSystemAdmin(systemAdmin) {

    return SystemAdmin.create(systemAdmin)
        .catch((err) => {
            throw err
        })
}

async function createPolicyholder(newPolicyholder) {

    return Policyholder.create(newPolicyholder)
        .catch((err) => {
            throw err
        })
}

async function createInsurer(newInsurer) {

    return Insurer.create(newInsurer)
        .catch((err) => {
            throw err
        })
}

async function readAllAccounts() {
    return Account.find()
        .catch((err) => {
            throw err
        })
}

async function readAccount(username) {
    return Account.findOne({username: username})
        .catch((err) => {
            throw err
        })
}

async function deleteAccountByUsername(username) {
    return Account.findOneAndDelete(
        {
            username: username
        })
        .catch((err) => {
            throw err
        })
}

module.exports = {
    createSystemAdmin,
    createPolicyholder,
    createInsurer,
    readAllAccounts,
    readAccount,
    deleteAccountByUsername
}