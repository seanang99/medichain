const router = require('express').Router();
const dbInit = require('../dbInit');

router.get('/dbInit', (req, res) => {
    return dbInit.dbInit()
        .then(() => res.status(200).json("Medichain Mongo DB init successfully"))
        .catch(err => res.status(400).json(err))
});

module.exports = router