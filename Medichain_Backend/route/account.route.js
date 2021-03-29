const SystemAdmin = require('../model/systemAdmin.model')
const Policyholder = require('../model/policyholder.model')
const Insurer = require('../model/Insurer.model')
const accountService = require('../service/account.service')

const router = require('express').Router()

router.post('/create', (req, res) => {

    // type is for creation of account
    const {
        firstName,
        lastName,
        username,
        password,
        identificationNum,
        employeeId,
        type
    } = req.body

    if (type == 'policyHolder') {
        let newPolicyholder = new Policyholder
            ({
                firstName,
                lastName,
                username,
                password,
                identificationNum
            })
        return accountService.createPolicyholder(newPolicyholder)
            .then(() => res.status(200).json('Successfully created new policyholder'))
            .catch((err) => res.status(400).json(err))
    }
    else if (type == 'systemAdmin') {
        let newSystemAdmin = new SystemAdmin
            ({
                firstName,
                lastName,
                username,
                password,
                employeeId,
            })
        return accountService.createSystemAdmin(newSystemAdmin)
            .then(() => res.status(200).json('Successfully created new system admin'))
            .catch((err) => res.status(400).json(err))
    }
    else if (type == 'insurer') {
        let newInsurer = new Insurer
            ({
                firstName,
                lastName,
                username,
                password,
                employeeId,
            })
        return accountService.createInsurer(newInsurer)
            .then(() => res.status(200).json('Successfully created new insurer'))
            .catch((err) => res.status(400).json(err))
    }

})

router.get('/readAllAccounts', (req, res) => {
    return accountService.readAllAccounts()
        .then((accounts) => res.status(200).json(accounts))
        .catch((err) => res.status(400).json(err))
})

router.get('/readAccount/:username', (req, res) => {
    return accountService.readAccount(req.params.username)
        .then((account) => res.status(200).json(account))
        .catch((err) => res.status(400).json(err))
})

router.delete('/deleteAccountByUsername/:username', (req, res) => {
    return accountService.deleteAccountByUsername(req.params.username)
        .then((msg) => res.status(200).json(msg))
        .catch((err) => res.status(400).json(err))
})


module.exports = router;