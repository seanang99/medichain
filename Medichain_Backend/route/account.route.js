const SystemAdmin = require('../model/systemAdmin.model')
const PolicyHolder = require('../model/policyholder.model')
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
        let newPolicyHolder = new PolicyHolder
            ({
                firstName,
                lastName,
                username,
                password,
                identificationNum
            })

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
    }

})


module.exports = router;