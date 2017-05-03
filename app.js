/* Import Node Module */
var http      = require('http');
var app       = require('express')();
var server    = require('http').Server(app);
var io        = require('socket.io').listen(server);
var redis = require('redis');
/* Import Node Module */

/* Set Up Db */
var dbConfig    = require('./dbConfig.json');
var clientRedis = redis.createClient(dbConfig.port,dbConfig.host);

clientRedis.on('connect',function(){
    console.log('Connection to database successfull');
})
/* Set Up Db */

/* Set Up Controller */
var socketController = require('./controllers/socketController').listen(io,clientRedis);
var adminControlRaspberry = require('./controllers/adminControlRaspberry')(io,clientRedis);
/* Set Up Controller */


/* Route Redirection */
app.use('/adminControlRaspberry', adminControlRaspberry);
/* Route Redirection */


/* Start */
server.listen(8080);
/* Start */


console.log('App.js ready');
/* Kill Server */
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    console.log("Redis Disconnected");
    clientRedis.end(true);
    require('./controllers/socketController').disconnect(io,function(){
    	console.log("Socket Close");
    	server.close();
    });
});
/* Kill Server */