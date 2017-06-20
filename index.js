/**
 * Created by Frederick BALDO on 31/05/2017.
 */
// set up ======================================================================
const express = require('express');
const app = express(); 	// create our app w/ express
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 				// mongoose for mongodb
const database = require('./private/config/database'); 			// load the database config
const mkdirp = require('mkdirp');               // Used for make directory
const multer = require('multer');               // Handle files saving

// configuration ===============================================================
const port = (process.env.PORT || 5000);
app.set('port', port);
mongoose.connect(database.localUrl); 	// Connect to local or remote MongoDB instance.
app.use(express.static(__dirname + '/public')); // set the static files location
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routes ======================================================================
require('./private/routes/index.js')(app, multer, mkdirp);

// listen (start app with node index.js) ======================================
app.listen(port);
console.log("Server listening on port " + port);
