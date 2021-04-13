# MediChain

## Project Description
MediChain is a blockchain project in the Insurance industry

## Technology Stack: 
- Frontend - React 
- Backend - NodeJS & ExpressJS
- Database - MongoDB
- Blockchain - Solidity (Ethereum)

## Frontend & Backend Dependencies
To run the application you must first install the following dependencies:

#### Parent Directory
```sh
npm install -g truffle ganache-cli
npm install web3 @truffle/contract
```

#### Frontend Directory
```sh
cd client
npm install web3 axios react-router-dom @material-ui/core @material-ui/lab @material-ui/icons
```

#### Backend Directory
```sh
cd Medichain_Backend
npm install express cors mongoose dotenv axios
```

```sh
cd EMRX_Backend
npm install express cors mongoose dotenv axios
```

## Application Startup Instructions
Open your Terminals and run these commands.
#### First Tab:
This starts the Ganache-CLI to start on Port 7545 with seed 8888. Ganache should generate 10 fixed test accounts automatically each with 100 ether by default.
```sh
ganache-cli -p 7545 -s 8888
```

#### Second Tab:
This will compile your contracts. You should see details of your contract being compiled and deployed in the command line. Ensure that the summary outputs the correct number of deployments. 
```sh
truffle compile
truffle migrate
```

#### Third Tab:
This starts the backend MediChain node.js server. The app should be listening at http://localhost:3001. It should also show that "Medichain Mongoose DB Connection established Successfully!"
```sh
node Medichain_Backend/server.js
```

#### Fourth Tab:
This starts the backend EMRX node.js server. the app should be listening at http://localhost:3002. It should also show that "EMRX Mongoose DB Connection established Successfully!"
```sh
node EMRX_Backend/server.js
```

#### Fifth Tab:
This web interface for the web reactJS client can then be accessed at http://localhost:3000
```sh
cd client
npm start
```

#### Compulsory Initialisation
Before you start using the application, access the following links to initialise all the necessary accounts:
1. http://localhost:3001/medichainDbInit/dbInit
2. http://localhost:3002/emrxDbInit/dbInit

#### Optional:
To run the test scripts for testing the MediChain smart contract.
```sh
truffle test
```

#### Important Note:
If you are running the application using NUS Wi-Fi, you may encounter problems with starting up the MongoDB database. Please kindly use your personal hotspot or personal Wi-Fi instead.

## Backend API Endpoints
#### MediChain
1. Create MediChain Policyholder/Insurer (POST): http://localhost:3001/account/create

Sample Body:

    "firstName":"policyholder1",
    
    "lastName":"one",
    
    "username":"policyholder1",
    
    "password":"password",
    
    "identificationNum":"S1234567A",
    
    "type":"policyHolder",
    
    "onChainAccountAddress":"0x514181210d13B4070F150d8240c161A954965DB5"

For insurer, the `type` is `insurer`.

#### EMRX
1. Create Medical Institution Account (POST): http://localhost:3002/medicalInstitutionAccount/createAccount

Sample Body: 

    "firstName":"first name",
    
    "lastName":"last name",
    
    "username":"user2",
    
    "password":"password",
    
    "medicalInstituteName":"Tan Tock Seng Hospital"
