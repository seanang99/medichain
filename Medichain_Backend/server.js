const express = require('express')
const app = express()
const port = 3001
const medichain = require('../connection/app')
const mongoose = require('mongoose')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin:medichain@cluster0.ylqxg.gcp.mongodb.net/cluster0?retryWrites=true&w=majority";
const uri = "mongodb+srv://username:Password@cluster0.hcafc.gcp.mongodb.net/cluster0?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.use(express.json())
mongoose.connect(uri,{useUnifiedTopology:true, useNewUrlParser:true, useCreateIndex:true})
const dbConnection = mongoose.connection
dbConnection.once('open', ()=>{
  console.log("Mongoose DB Connection established Successfully!")
})

const accountRouter = require('./route/account.route')

app.use('/account', accountRouter)

app.post('/registerPolicyholder', (req, res) => {
  console.log("**** POST /registerPolicyholder ****");
  const policyholder = req.body.address;

  medichain.registerPolicyholder(policyholder, (message) => {
    console.log(`server.js/registerPolicyholder: ${message}\n`)
    res.send(message);
  });
});

app.post('/registerInsurer', (req, res) => {
  console.log("**** POST /registerInsurer ****");
  const insurer = req.body.address;

  medichain.registerInsurer(insurer, (message) => {
    console.log(`server.js/registerInsurer: ${message}\n`)
    res.send(message);
  });
});