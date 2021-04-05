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
npm install axios react-router-dom @material-ui/core @material-ui/lab @material-ui/icons
```
The react web project will run on `http://localhost:3000`.

#### Backend Directory
```sh
cd Medichain_Backend
npm install express cors mongoose dotenv axios
```

## Database Setup Instructions
##### _---------------------------The Easy Way---------------------------_
The test data has already been preloaded into a database for your testing needs and the application just needs to be run as is.

The MongoDB connection string for this database is: `CONNECTION_API_KEY` and has already been provided in the .env file thus you are not required to edit the environmental variables of the program in any way.

If you want to just see the database with the sample data already pre-loaded in, log into MongoDB atlas with the following credentials:

> Email: _email@email.com_
> 
> Password: _password_

##### _---------------------------The Hard Way---------------------------_

1. Before we run the application, we must first create a MongoDB atlas account at https://www.mongodb.com/cloud/atlas/register.

2. Once you sign up, click create a new cluster and choose a free tier cluster and cloud provider.

3. Next, whitelist your IP address by selecting "Network Access" in the left menu.
   Then add your IP address to the whitelist in the 'Access List Entry' field.
   Alternatively, click add current IP address in the same popup. If you wish to allow all IP addresses to access the cluster, your whitelisted 'Access List Entry' should be "0.0.0.0/0".

4. Next, create an admin user to access the database by selecting "Database Access" in the left menu.

5. Select Password authentication and key in a username and password.
   Remember your username and password because it is required for the connection string.
   We will give this user Atlas admin privilages as a superuser to allow access to all database operations.

6. Next, return to the clusters page to create a new database for this application by selecting "Clusters" in the left menu.
   Within the menu for the new cluster, click 'Collections'.
   Click 'Add my own data'
   For both the database name and the collection name, use 'execute'
   Click 'Create' to confirm the creation.

7. Next, return to the clusters page to get your connection string for this database by selecting "Clusters" in the left menu.
   Click the connect button for your new cluster.
   Click connect your application.
   Make sure the driver is node.js and the version is 3.6 or later.
   Copy the connection string. It should look something like "mongodb+srv://<username>:<password>@cluster0.qtpj5.mongodb.net/<dbname>?retryWrites=true&w=majority"
   'username' in the string should be replaced by your username for your admin user. In this example, the admin user's username is admin.
   'password' in the string should be replaced by your password for your admin user. In this example, the admin user's username is password.
   'dbname' in the string should be replaced with the database name you keyed in earlier. In this example, the dbname should be 'execute'.
   When done, your string should look something like "mongodb+srv://admin:password@cluster0.qtpj5.mongodb.net/execute?retryWrites=true&w=majority"

8. In the application folder, navigate as such: ProjectExecuteCAW > backend > .env
   Open the .env file and replace the 'MONGO_URL' variable with the connection string you got above.

9. Once you have finished setting up your mongoDB account, the next step is to load in the test data provided in the data folder.
   a. Install and Open MongoDB Compass (.exe provided in the data folder)
   b. Paste the connection string when you are prompted to
   c. Navigate using the left menu to your execute database and create 3 collections named 'accounts', 'categories' and 'labels'.
   d. Click on the 'accounts' collection that you just created and click Add Data > Import File
   e. Select Accounts.json as the json file to import (provided in the data/json_data folder) and select input file type "JSON"
   f. Leave the rest of the settings as is and click import
   d. Repeat steps 4-6 for categories and labels.

The test data is now loaded into your database and you can proceed to start the application.
___________________________________________________________

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
This starts the backend node.js server. The app should be listening at http://localhost:3001. It should also show that "Mongoose DB Connection established Successfully!"
```sh
node Medichain_Backend/server.js
```

#### Fourth Tab:
This web interface for the web reactJS client can then be accessed at http://localhost:3000
```sh
cd client
npm start
```

#### Optional:
To run the test scripts for testing the MediChain smart contract.
```sh
truffle test
```
