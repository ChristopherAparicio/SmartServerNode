/* Import Node Module */
var http      = require('http');
var app       = require('express')();
var server    = require('http').Server(app);
var io        = require('socket.io').listen(server);
//var adminControl = require('./controllers/adminControl');
//var userControl  = require('./controllers/userControl');
//var mongooseManager = require('./models/mongooseManager');

/*
var session = require("express-session")({
    secret: "secretKey",
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000
});
var sharedsession = require("express-socket.io-session");
*/
/* Import Node Module */

/* Set Up Data */

/* Route Redirection */
//app.use(session);
//io.use(sharedsession(session));
//app.use('/adminControl', adminControl);
//app.use('/userControl', userControl);

/* Route Redirection */


/* Start */


server.listen(8080);

/* Start */


console.log('App.js ready');
/* Kill Server */

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    require('./controllers/socketController').disconnect(function(){
    	server.close();
    });
});

/* Kill Server */
