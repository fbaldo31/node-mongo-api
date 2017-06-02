/**
 * Created by Frederick BALDO on 31/05/2017.
 */
// set up ======================================================================
const express = require('express');
const app = express(); 						// create our app w/ express
const mongoose = require('mongoose'); 				// mongoose for mongodb
const database = require('./config/database'); 			// load the database config
const mkdirp = require('mkdirp');               // Used for make directory
const multer = require('multer');               // Handle files saving

// configuration ===============================================================
app.set('port', (process.env.PORT || 5000));
mongoose.connect(database.localUrl); 	// Connect to local or remote MongoDB instance.
app.use(express.static(__dirname + '/public')); // set the static files location 

// routes ======================================================================
require('./private/routes/routes.js')(app, multer, mkdirp);

// listen (start app with node index.js) ======================================
app.listen(port);
console.log("Server listening on port " + port);
