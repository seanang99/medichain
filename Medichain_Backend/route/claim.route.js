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

    axios.post('http://localhost:3002/token/generateToken',payload)
        .then((token) => {
            medichain.submitClaim(onChainAccountAddress, medicalAmount, token.tokenValue, medicalRecordRefIds, (message) => {
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
})

router.get('/getClaims/:address', (req, res) => {
    console.log("**** POST /getClaims ****");

    onChainAccountAddress = req.params.address

    medichain.getClaims(onChainAccountAddress, (claims) => {
        console.log("server.js/getClaims:");
        if (claims == undefined) {
            res.status(200).send([])
        }

        result = []
        // return those claims for which the onChainAccountAddress is one of its stakeholders
        claims.forEach(claim => {
            if (claim.claimant == onChainAccountAddress || claim.verifier == onChainAccountAddress || claim.endorser == onChainAccountAddress) {
                result.push(claim)
            }
        });
        res.status(200).send(result);
    }).catch(err => {
        console.log(`server.js/getClaims: ${err}`)
        res.status(403).send(err);
    })
})

module.exports = router