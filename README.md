# medichain

Project Description:
MediChain is a blockchain project in the Insurance industry

Technology Stack: 
(1) Frontend - React
(2) Backend - NodeJS & ExpressJS
(3) Database - MongoDB
(4) Blockchain - Solidity (Ethereum)
___________________________________________________________

<<< Frontend & Backend dependencies  >>>
To run the application you must first install the following dependencies, 

In the backend directory: (./server)

npm install express cors mongoose dotenv  

In the frontend directory: (./client)

npm install axios @material-ui/core

The react web project will run on "http://localhost:3000"
___________________________________________________________

<<< Database setup instructions >>>

---------------------------The Easy Way---------------------------
The test data has already been preloaded into a database for your testing needs and the application just needs to be run as is.

The mongodb connection string for this database is: 

and has already been provided in the .env file thus you are not required to edit the environmental variables of the program in any way.

If you want to just see the database with the sample data already pre-loaded in, log into mongodb atlas with the following credentials:

Email: 
Password: 

---------------------------The Hard Way---------------------------

1. Before we run the application, we must first create a mongoDB atlas account at https://www.mongodb.com/cloud/atlas/register.

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

<<< Application startup instructions >>>

Start up 4 instances of command prompt, or use the built in instances of command prompt in visual studio code.

1. For the first instance, run "ganache-cli -p 7545"

This starts the Ganache-CLI to start on Port 7545. Ganache should generate 10 test accounts automatically each with 100 ether by default.

2. For the second instance, run "truffle compile" followed by "truffle migrate"

This will import your contracts. You should see details of your contract being compiled and deployed in the command line. Ensure that the summary outputs the correct number of deployments. 

3. For the third instance, cd client -> npm run

This web interface for the web reactJS client can then be accessed at http://localhost:3000

4. For the fourth instance, cd server -> node server

This starts the backend node.js server. The app should be listening at http://localhost:3001. It should also show that "Mongoose DB Connection established Successfully!"
