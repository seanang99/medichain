const express = require('express');
const app = express();
const cors = require('cors');
const port = 3002;
const mongoose = require('mongoose');

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

const uri = "mongodb+srv://admin:passwordAdmin@cluster0.z77gk.gcp.mongodb.net/emrx?retryWrites=true&w=majority";
app.use(cors());
app.use(express.json());
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
const dbConnection = mongoose.connection;
dbConnection.once('open', () => {
    console.log("EMRX Mongoose DB Connection established Successfully!")
});

const medicalInstitutionAccountRouter = require('./route/medicalInstitutionAccount.route');
const patientRouter = require('./route/patient.route');
const medicalRecordRouter = require('./route/medicalRecord.route');
const tokenRouter = require('./route/token.route');

app.use('/medicalInstitutionAccount', medicalInstitutionAccountRouter);
app.use('/patient', patientRouter);
app.use('/medicalRecord', medicalRecordRouter);
app.use('/token', tokenRouter);
