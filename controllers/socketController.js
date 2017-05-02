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

var request = require('request');

var optionsRegister = {
    url: 'http://django/raspberry/register',
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    form: {'raspberryId': 'none'}
}

var optionsNextMusic = {
    url: 'http://django/raspberry/nextmusic',
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    form: {'raspberryId': 'none'}
}

// Store Socket
// macStorage : mac --> socketId : Useful for Django to retrieve socket

module.exports.listen = function(io){
	io.sockets.on('connection', function (socket) {
		console.log('Incoming connection from raspberry');
		
		socket.on('raspberry_registration', function (registrationMessage) {
			
			registrationObject = JSON.parse(registrationMessage);
			optionsRegister.form.raspberryId = registrationObject.raspberryId;

			request(optionsRegister, function (error, response, body) {
				if(!error && response.statusCode == 200)
				{
					var JsonResponse = JSON.parse(body);
					if(JsonResponse.response)
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
				}
				else
				{
					console.log("SocketController Error : Raspberry register from Django :");
					console.log(error);
					console.log(response);
				}
			});
		});	

		socket.on('next_musique', function () {

			var idRegistered = MapStorageManager.getRaspberryIdBySocketId(socket.id);
			optionsNextMusic.form.raspberryId = idRegistered;

			request(optionsNextMusic, function (error, response, body) {
					if(!error && response.statusCode == 200)
					{
						var JsonResponse = JSON.parse(body);
						clientRedis.hgetall(idRegistered, function(err, reply) {
		    				// Update DataBase
							reply["musique_suivante"]= JsonResponse.response;
							clientRedis.hmset(idRegistered,reply);
						});
						// Send Next Music to Raspberry
						socket.emit('next_musique',JsonResponse.response);
					}
					else
					{
						console.log("SocketController Error : Raspberry next music from Django :");
						console.log(error);
						console.log(response);
					}
			});

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


module.exports.disconnect = function(io,callback){
	clientRedis.end(true);
	io.close();
	callback();
};


//socket.handshake.session.registrationMessage = registrationMessage;
        	//socket.handshake.session.save();


//console.log("Registration Message : " + socket.handshake.session.registrationMessage);
			//console.log(socket.handshake.session);

