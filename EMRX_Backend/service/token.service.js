const Token = require('../model/token.model');
const Patient = require('../model/patient.model');

async function generateToken(newToken) {
    let patientId = newToken.patientId;
    return Token.create(newToken)
        .then(token => {
            
            let tokenId = token._id;
            Patient.findOneAndUpdate(
                {
                    _id: patientId
                },
                {
                    $push: { tokens: tokenId }
                })
                .catch(err => {
                    throw err
                });
        })
        .catch(err => {
            throw err
        });
}

async function getAllToken(patientId) {
    return Token.find(
        {
            patientId: patientId
        })
        .populate("medicalRecordsId")
        .catch(err => {
            throw err;
        });
}

async function getToken(tokenId) {
    return Token.findById(tokenId)
        .populate("medicalRecordsId")
        .catch(err => {
            throw err;
        });
}

async function deleteToken(tokenId) {
    return Token.findByIdAndDelete(tokenId)
        .then(token => {
            let patientId = token.patientId;
            Patient.findOneAndUpdate(
                {
                    _id: patientId
                },
                {
                    $pullAll: { tokens: [tokenId] }
                })
                .catch(err => {
                    throw err
                });
        })
        .catch(err => {
            throw err;
        })
}

module.exports = {
    generateToken,
    getAllToken,
    getToken,
    deleteToken
}