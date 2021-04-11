const axios = require('axios');
const router = require('express').Router()
const medichain = require('../../connection/app')

router.post('/submitClaim', (req, res) => {
    console.log("**** POST /submitClaim ****");

    // expect medicalRecordRefIds to be an array
    const {
        onChainAccountAddress,
        medicalAmount,
        medicalRecordRefIds,
        identificationNum
    } = req.body

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
                console.log(`server.js/submitClaim1: ${err}\n`);
                res.status(403).send(err);
            });
        })
        .catch(err => {
            console.log(`server.js/submitClaim2: ${err}\n`);
            res.status(403).send(err);
        });
})

router.get('/getClaims/:address', (req, res) => {
    console.log("**** POST /getClaims ****");

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
                let remarks = claim.remarks;
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

router.post('/disburseClaim', async (req, res) => {
    
})

module.exports = router