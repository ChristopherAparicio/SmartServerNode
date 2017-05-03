/* Import Node Module */
var http      = require('http');
var app       = require('express')();
var server    = require('http').Server(app);
var io        = require('socket.io').listen(server);
var socketController = require('./controllers/socketController').listen(io);
//var adminControl = require('./controllers/adminControl');
var adminControlRaspberry = require('./controllers/adminControlRaspberry')(io);
var redisClient = require('./models/redisManager').clientRedis();

//var userControl  = require('./controllers/userControl');
//var mongooseManager = require('./models/mongooseManager');

/*
request(options, function (error, response, body) {
	if(!error && response.statusCode == 201)
	{
		console.log('body :',body);
		var JsonResponse = JSON.parse(body);
		console.log(JsonResponse);
		console.log(JsonResponse.id);
	}
});
*/
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


app.use('/adminControlRaspberry', adminControlRaspberry);

/* Route Redirection */


/* Start */

server.listen(8080);

/* Start */


console.log('App.js ready');
/* Kill Server */

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    require('./controllers/socketController').disconnect(io,function(){
    	console.log("Redis Disconnected");
    	console.log("Socket Close")
    	server.close();
    });
});

/* Kill Server */