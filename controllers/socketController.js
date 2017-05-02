var socketIO  = require('socket.io');

/* Move Following line of code in db.js */

var redis = require('redis');

var redisPort = 6379;
var redisHost = '127.0.0.1';

var clientRedis = redis.createClient();

clientRedis.on('connect',function(){
	console.log('Connection to database successfull');
})


var MapStorageManager = require("../helpers/MapStorageManager");

// Store Socket
// macStorage : mac --> socketId : Useful for Django to retrieve socket

module.exports.listen = function(io){
	io.sockets.on('connection', function (socket) {
		console.log('Incoming connection from raspberry');
		
		socket.on('raspberry_registration', function (registrationMessage) {
			
			// First Step : Check Django Database
			registrationObject = JSON.parse(registrationMessage);
			var djangoReturn = true;

			if(djangoReturn)
			{
				// Add Mapping between Raspberry.Id <--> Socket.ID
				MapStorageManager.addToSocketStorage(registrationObject.raspberryId,socket.id);
				MapStorageManager.addToRaspberryIdStorage(socket.id,registrationObject.raspberryId);

				// Add or Overwrite Raspberry Data in Redis
				//var redisObject = JSON.stringify(registrationObject);
				//clientRedis.hmset(registrationObject.raspberryId,redisObject);
				clientRedis.hmset(registrationObject.raspberryId,registrationObject);

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

			var idRegistered = MapStorageManager.getRaspberryIdBySocketId(socket.id);
			console.log(idRegistered);

			clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);

    				//TODO Get next musique avec l'algo magique
					// en attendant on créé une variable tmp tmp_next_musique

					var tmp_next_musique = "Lorie A 20 ans";
					var next_musique = tmp_next_musique;

					reply["musique_suivante"]= next_musique;
					console.log(reply);
					console.log(idRegistered);

					clientRedis.hmset(idRegistered,reply);

					socket.emit('next_musique',next_musique);
		        	

				});

			//Check Django Next Music
		});	

		socket.on('raspberry_disconnect', function () {

        	socket.emit('raspberry_disconnect', 'Disconnect Successfull');
        	socket.close();
		});	

		socket.on('hello',function(message){
			var idRegistered = MapStorageManager.getRaspberryIdBySocketId(socket.id);
			clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
				});
			console.log(message);
			console.log(socket.id);
			io.to(socket.id).emit('raspberry_registration', 'Hello Mother Fucker by IO TO');
		});
	});
}


module.exports.disconnect = function(callback){
	clientRedis.end(true);
	//macStorage.forEach(disconnectSocket);
	console.log("Redis Disconnected");
	callback();
};


//socket.handshake.session.registrationMessage = registrationMessage;
        	//socket.handshake.session.save();


//console.log("Registration Message : " + socket.handshake.session.registrationMessage);
			//console.log(socket.handshake.session);

