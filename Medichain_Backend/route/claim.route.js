const axios = require('axios');
const router = require('express').Router()
const medichain = require('../../connection/app')
const accountService = require('../service/account.service')

router.post('/submitClaim', async (req, res) => {
    console.log("**** POST /submitClaim ****");

    // expect medicalRecordRefIds to be an array
    const {
        onChainAccountAddress,
        medicalAmount,
        medicalRecordRefIds,
        identificationNum
    } = req.body

    let policyHolder = await accountService.readAccountByIdentificationNum(identificationNum)
        .catch(err => { return undefined })

    if (policyHolder != undefined) {
        console.log(policyHolder)
        if (policyHolder.onChainAccountAddress == onChainAccountAddress) {
            let payload = {
                medicalRecordsId: medicalRecordRefIds,
                identificationNum: identificationNum
            }

            axios.post('http://localhost:3002/token/generateToken', payload)
                .then((response) => {
                    medichain.submitClaim(onChainAccountAddress, medicalAmount, response.data.tokenValue, medicalRecordRefIds, (message) => {
                        console.log(`server.js/submitClaim: ${message}\n`);
                        res.send(message);
                    }).catch(err => {
                        console.log(`server.js/submitClaim: ${err}\n`);
                        res.status(403).send(err);
                    });
                })
                .catch(err => {
                    console.log(`server.js/submitClaim: ${err}\n`);
                    res.status(403).send(err);
                });
        }
        else {
            res.status(400).send(`Identification number ${identificationNum} and on chain account address ${onChainAccountAddress} does not belong to the same account`)
        }
    }
    else {
        res.status(400).send(`Policy holder with identification number ${identificationNum} is not found`)
    }
})

router.get('/getClaims', (req, res) => {
    onChainAccountAddress = '0xE5315ad6b97094b5412a0267e74aA200c1ddE15a'
    medichain.getClaims(onChainAccountAddress, async (claims) => {
        if (claims == undefined) {
            res.status(200).send([])
        }

        result = []
        // return those claims for which the onChainAccountAddress is one of its stakeholders
        for (const claim of claims) {
            // populate all medical records details
            let medicalRecordRefIds = claim.medicalRecordRefIds
            var medicalRecords = []
            for (let i = 0; i < medicalRecordRefIds.length; i++) {
                let mrid = medicalRecordRefIds[i]
                // console.log(mrid)
                let endpointUrl = 'http://localhost:3002/medicalRecord/readMedicalRecord/' + String(mrid)
                // console.log(endpointUrl)
                let medicalRecord = await axios.get(endpointUrl)
                    .then(response => {
                        let mr = response.data
                        // medicalRecords.push(response.data)
                        return mr
                    })
                medicalRecords.push(medicalRecord)
            }
            // add one more field medicalRecords while keeping medicalRecordRefIds
            claim.medicalRecords = medicalRecords
            // console.log(medicalRecords)

            // convert the claims from string to json format
            let remarks = claim.remarks;
            if (remarks != undefined) {
                let remarksSplit = []
                let remarksInJson = []
                remarksSplit = remarks.split(";;;")
                // last index is a empty string, thats why length - 1
                for (let i = 0; i < remarksSplit.length - 1; i++) {
                    let remarkSplit = remarksSplit[i].split("##", 2)
                    remarksInJson.push({
                        account: remarkSplit[0],
                        remark: remarkSplit[1]
                    })
                }
                claim.remarks = remarksInJson
            }
            result.push(claim)
        }
        res.status(200).send(result);
    }).catch(err => {
        console.log(`server.js/getClaims: ${err}`)
        res.status(403).send(err);
    })
})

router.get('/getClaims/:address', (req, res) => {
    console.log("**** GET /getClaims ****");

    onChainAccountAddress = req.params.address

    medichain.getClaims(onChainAccountAddress, (claims) => {
        if (claims == undefined) {
            res.status(200).send([])
        }

        result = []
        // return those claims for which the onChainAccountAddress is one of its stakeholders
        claims.forEach(claim => {
            if (claim.claimant == onChainAccountAddress || claim.verifier == onChainAccountAddress || claim.endorser == onChainAccountAddress) {
                // populate all medical records details
                let medicalRecordRefIds = claim.medicalRecordRefIds
                let medicalRecords = []
                for (let i = 0; i < medicalRecordRefIds.length; i++) {
                    let mrid = medicalRecordRefIds[i]
                    // console.log(mrid)
                    let endpointUrl = 'http://localhost:3002/medicalRecord/readMedicalRecord/' + String(mrid)
                    // console.log(endpointUrl)
                    axios.get(endpointUrl)
                        .then(response => {
                            let mr = response.data
                            medicalRecords.push(mr)
                        })
                }
                // add one more field medicalRecords while keeping medicalRecordRefIds
                claim.medicalRecords = medicalRecords

                // convert the claims from string to json format
                let remarks = claim.remarks;
                if (remarks != undefined) {
                    let remarksSplit = []
                    let remarksInJson = []
                    remarksSplit = remarks.split(";;;")
                    // last index is a empty string, thats why length - 1
                    for (let i = 0; i < remarksSplit.length - 1; i++) {
                        let remarkSplit = remarksSplit[i].split("##", 2)
                        remarksInJson.push({
                            account: remarkSplit[0],
                            remark: remarkSplit[1]
                        })
                    }
                    claim.remarks = remarksInJson
                }
                result.push(claim)
            }
        });
        res.status(200).send(result);
    }).catch(err => {
        console.log(`server.js/getClaims: ${err}`)
        res.status(403).send(err);
    })
})

// router.post('/addRemarksToClaim', async (req,res) => {

//     const {
//         onChainAccountAddress,
//         claimId,
//         newRemark
//     } = req.body;

//     let claimToUpdate;
//     claimToUpdate = await medichain.getClaim(onChainAccountAddress, claimId)
//     .catch(err => res.status(407).send(err))


//     medichain.processClaim()

// })

router.post('/processClaim', async (req, res) => {

    const {
        claimId,
        onChainAccountAddress,
        claimAmount,
        remarks,
        policyNumber
    } = req.body;

    let newRemarks = `${onChainAccountAddress}##${remarks};;;`
    // console.log('claim.route line 104', newRemarks)

    medichain.processClaim(onChainAccountAddress, claimId, claimAmount, newRemarks, policyNumber, (msg) => {
        res.status(200).send(msg)
    })
        .catch(err => res.status(500).send(err))
})

router.post('/approveClaim', async (req, res) => {
    const {
        claimId,
        onChainAccountAddress,
        remarks
    } = req.body;

    let claimToUpdate = await medichain.getClaim(onChainAccountAddress, claimId)
        .catch(err => res.status(500).send(err))

    let newRemarks = `${claimToUpdate.remarks}${onChainAccountAddress}##${remarks};;;`
    // console.log('claim.route line 123', newRemarks)

    medichain.approveClaim(onChainAccountAddress, claimId, newRemarks, (msg) => {
        res.status(200).send(msg)
    })
        .catch(err => res.status(500).send(err))
})

router.post('/rejectClaim', async (req, res) => {
    const {
        claimId,
        onChainAccountAddress,
        remarks
    } = req.body;

    let claimToUpdate = await medichain.getClaim(onChainAccountAddress, claimId)
        .catch(err => res.status(500).send(err))

    let newRemarks = `${claimToUpdate.remarks}${onChainAccountAddress}##${remarks};;;`
    // console.log('claim.route line 142', newRemarks)

    medichain.rejectClaim(onChainAccountAddress, claimId, newRemarks, (msg) => {
        res.status(200).send(msg)
    })
        .catch(err => res.status(500).send(err))
})

module.exports = router