const Token = require('../model/token.model');
const Patient = require('../model/patient.model');

async function generateToken(newToken, identificationNum) {
    return Patient.findOne(
        {
            identificationNum: identificationNum
        })
        .then(patient => {
            newToken.patientId = patient._id;
            Token.create(newToken)
                .then(token => {
                    let tokenId = token._id;
                    Patient.findOneAndUpdate(
                        {
                            identificationNum: identificationNum
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
        })
        .catch(err => {
            throw err
        });
}

async function getAllToken(identificationNum) {
    return Patient.findOne(
        {
            identificationNum: identificationNum
        })
        .populate({
            path: 'tokens',
            populate: {
                path: 'medicalRecords',
                model: 'MedicalRecord'
            }
        })
        .then(patient => {
            return patient.tokens
        })
        .catch(err => {
            throw err
        })
}

async function getToken(tokenId) {
    return Token.findById(tokenId)
        .populate("medicalRecords")
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
        });
}

async function updateTokenToInactive(tokenId) {
    return Token.findByIdAndUpdate(tokenId,
        {
            $set: {
                isExpired: true
            }
        })
        .catch(err => {
            throw err
        });
}

module.exports = {
    generateToken,
    getAllToken,
    getToken,
    deleteToken,
    updateTokenToInactive
}