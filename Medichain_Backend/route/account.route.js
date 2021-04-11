const SystemAdmin = require('../model/systemAdmin.model')
const Policyholder = require('../model/policyholder.model')
const Insurer = require('../model/Insurer.model')
const accountService = require('../service/account.service')
const medichain = require('../../connection/app')

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
        type,
        onChainAccountAddress
    } = req.body

    if (type == 'policyHolder') {
        console.log("**** POST /registerPolicyholder ****");
        let newPolicyholder = new Policyholder
            ({
                firstName,
                lastName,
                username,
                password,
                identificationNum,
                onChainAccountAddress
            })
        return accountService.createPolicyholder(newPolicyholder)
            .then((policyholder) => {
                medichain.registerPolicyholder(policyholder.onChainAccountAddress, (message) => {
                    console.log(`server.js/registerPolicyholder: ${message}\n`);
                    res.status(200).send(message);
                }).catch(err => {
                    console.log(`server.js/registerPolicyholder: ${err}\n`);
                    res.status(403).send(err);
                });
            })
            .catch((err) => res.status(400).json(err))
    }
    else if (type == 'insurer') {
        let newInsurer = new Insurer
            ({
                firstName: "Singapore",
                lastName: "AIA",
                username: "insurer1",
                password: "",
                employeeId,
                onChainAccountAddress
            })
        return accountService.createInsurer(newInsurer)
            .then((insurer) => {
                medichain.registerInsurer(insurer.onChainAccountAddress, (message) => {
                    console.log(`server.js/registerInsurer: ${message}\n`);
                    res.status(200).send(message);
                }).catch(err => {
                    console.log(`server.js/registerInsurer: ${err}\n`);
                    res.status(403).send(err);
                });
            })
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

router.post('/login', (req, res) => {
    console.log("**** POST /accountLogin ****");
    const {
        username,
        password
    } = req.body
    accountService.login(username,password)
        .then(resObj => res.status(200).send(resObj))
        .catch(err => res.status(401).send('Login unsuccessfully:' + err))
})


module.exports = router;