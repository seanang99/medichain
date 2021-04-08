const express = require('express');
const app = express();
const cors = require('cors');
const port = 3002;
const mongoose = require('mongoose');
const dbInit = require('./dbInit');

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

const uri = "mongodb+srv://admin:passwordAdmin@cluster0.z77gk.gcp.mongodb.net/emrxTestInit?retryWrites=true&w=majority";
app.use(cors());
app.use(express.json());
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
    console.log("EMRX Mongoose DB Connection established Successfully!")
    // DB Init - Can be commented out if you dont want to DB Init for every changes made in backend codes
    dbInit.dbInit()
        .then(() => console.log('Data Init Done!'))
        .catch(err => console.log('DB Init: ' + err))
});

const medicalInstitutionAccountRouter = require('./route/medicalInstitutionAccount.route');
const patientRouter = require('./route/patient.route');
const medicalRecordRouter = require('./route/medicalRecord.route');
const tokenRouter = require('./route/token.route');

app.use('/medicalInstitutionAccount', medicalInstitutionAccountRouter);
app.use('/patient', patientRouter);
app.use('/medicalRecord', medicalRecordRouter);
app.use('/token', tokenRouter);

module.exports = exports = mongoose;