var socketIO  = require('socket.io');

/* Move Following line of code in db.js */

var redis = require('redis');

var redisPort = 6379;
var redisHost = '127.0.0.1';

var client = redis.createClient();

client.on('connect',function(){
	console.log('Connection to database successfull');
})

// Store Socket
// macStorage : mac --> socketId : Useful for Django to retrieve socket

var macStorage    = new Map();
//var socketStorage = new Map();

module.exports.listen = function(io){
	io.sockets.on('connection', function (socket) {
		console.log('Incoming connection from raspberry');
		socket.on('raspberry_registration', function (registrationMessage) {
			
			// First Step : Check Django Database
			registrationObject = JSON.parse(registrationMessage);
			var djangoReturn = true;

			if(djangoReturn)
			{
				// Add Mapping between Raspberry.Id --> Socket.ID
				macStorage.set(registrationObject.raspberryId,socket.id);

				// Add or Overwrite Raspberry Data in Redis
				var redisObject = JSON.stringify(registrationObject);
				client.set(registrationObject.raspberryId,redisObject);

				// Send a positive response
				socket.emit('raspberry_registration', 'Registration successfull raspberry : ' + registrationMessage.raspberryId);
			}
			else
			{
				// Send a negative response
				socket.emit('raspberry_registration', 'Your are not register in database, please contact admin');
			}		
		});	

		socket.on('next_musique', function () {
        	socket.emit('raspberry_disconnect', 'Disconnect Successfull');
        	socket.close();
		});	

		socket.on('raspberry_disconnect', function () {
        	socket.emit('raspberry_disconnect', 'Disconnect Successfull');
        	socket.close();
		});	

		socket.on('hello',function(message){
			
			console.log(message);
			io.to(socket.id).emit('raspberry_registration', 'Hello Mother Fucker by IO TO');
		});
	});
}


module.exports.disconnect = function(callback){
	client.end(true);
	//macStorage.forEach(disconnectSocket);
	console.log("Redis Disconnected");
	callback();
};


//socket.handshake.session.registrationMessage = registrationMessage;
        	//socket.handshake.session.save();


//console.log("Registration Message : " + socket.handshake.session.registrationMessage);
			//console.log(socket.handshake.session);

