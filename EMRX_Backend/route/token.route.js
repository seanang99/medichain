const router = require('express').Router();
const Token = require('../model/token.model');
const tokenService = require('../service/token.service');
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString() {
    let length = 8;
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/generateToken', (req, res) => {
    console.log("**** POST / generateToken****");

    const {
        medicalRecordsId,
        patientId
    } = req.body;
    const tokenValue = generateString();

    let newToken = new Token({
        tokenValue,
        isExpired: false,
        medicalRecordsId,
        patientId
    });

    return tokenService.generateToken(newToken)
        .then(() => res.status(200).json(newToken))
        .catch(err => res.status(400).json('Unsuccessfully created token ' + err));
});

router.get('/getAllToken/:patientId', (req, res) => {
    // Patient ID is mongo db .id
    const patientId = req.params.patientId;
    return tokenService.getAllToken(patientId)
        .then(tokens => res.status(200).json(tokens))
        .catch(err => res.status(400).json('Get All Token ' + err));
});

router.get('/getToken/:tokenId', (req, res) => {
    // tokenId is mongo db .id
    const tokenId = req.params.tokenId;
    return tokenService.getToken(tokenId)
        .then(token => res.status(200).json(token))
        .catch(err => res.status(400).json('Get Token ' + err));

});

router.delete('/deleteToken/:tokenId', (req, res) => {
    const tokenId = req.params.tokenId;
    return tokenService.deleteToken(tokenId)
        .then(() => res.status(200).json('Successfully deleted token'))
        .catch(err => res.status(400).json(err));
});

module.exports = router;
