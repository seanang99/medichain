const Account = require('../model/account.model')
const SystemAdmin = require('../model/systemAdmin.model')

async function createSystemAdmin (systemAdmin) {

    return SystemAdmin.create(systemAdmin)
    .catch((err) => {
        throw err
    })
}

module.exports = {
    createSystemAdmin
}