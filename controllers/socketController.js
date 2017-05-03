var socketIO  = require('socket.io');

/* Move Following line of code in db.js */

var MapStorageManager = require("../helpers/MapStorageManager");

var request = require('request');



var optionsNextMusic = {
    //url: 'http://10.43.1.76/station/next_song',
    url: 'http://10.43.0.190/station/next_song',
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    json: {'raspberryId': 'none'}
}

// Store Socket
// macStorage : mac --> socketId : Useful for Django to retrieve socket

module.exports.listen = function(io,clientRedis){
	io.sockets.on('connection', function (socket) {
		console.log('Incoming connection from raspberry');
		
		socket.on('raspberry_registration', function (registrationMessage) {
			
			registrationObject = JSON.parse(registrationMessage);
			//console.log(registrationObject);
			//optionsRegister.form["raspberryId"] = registrationObject.raspberryId;
			//var optionRequest = JSON.stringify(optionsRegister);
			//console.log(optionRequest);
			//var jsonStr = '{ "raspberryId": "' + registrationObject.raspberryId + '"}';
			var jsonStr = { 'raspberryId': registrationObject.raspberryId };
			var jsonObject    = jsonStr;//JSON.parse(jsonStr);
			console.log(jsonObject);
			var optionsRegister = {
			    //url: "http://10.43.1.76/station/exist",
			    url: "http://10.43.0.190/station/exist",
			    method: "POST",
			    headers: {"Content-Type":"application/json"},
			    json: jsonObject
			}

			console.log(optionsRegister);

			request(optionsRegister, function (error, response, body) {
			//request('http://10.43.1.76/station/next_song', data=json.dumps({'raspberryId':'AC-BC-32-D5-CE-83'}),headers={'content-type': 'application/json'}){
				if(!error && response.statusCode == 200)
				{
					console.log(body);
					//var JsonResponse = JSON.parse(body);
					if(body.response)
					{
						// Add Mapping between Raspberry.Id <--> Socket.ID
						MapStorageManager.addToSocketStorage(registrationObject.raspberryId,socket.id);
						MapStorageManager.addToRaspberryIdStorage(socket.id,registrationObject.raspberryId);

						// Add or Overwrite Raspberry Data in Redis
						//var redisObject = JSON.stringify(registrationObject);
						//clientRedis.hmset(registrationObject.raspberryId,redisObject);
						clientRedis.hmset(registrationObject.raspberryId,registrationObject);

						// Send a positive response
						socket.emit('raspberry_registration', 1);
						console.log("Registration successfull");
					}
					else
					{
						// Send a negative response
						socket.emit('raspberry_registration', 0);
						console.log("Ipossible to register");
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
			optionsNextMusic.json.raspberryId = idRegistered;
			console.log(optionsNextMusic);
			request(optionsNextMusic, function (error, response, body) {
					if(!error && response.statusCode == 200)
					{
						console.log(body);
						clientRedis.hgetall(idRegistered, function(err, reply) {
		    				// Update DataBase
							reply["musique_suivante"]= body.next_song;
							clientRedis.hmset(idRegistered,reply);
						});
						// Send Next Music to Raspberry
						console.log("envoie de la musique suivante au raspberry");
						socket.emit('changeMusiqueSuivante',body.next_song);
					}
					else
					{
						console.log("SocketController Error : Raspberry next music from Django :");
						//console.log(error);
						//console.log(response);
					}
			});

		socket.on('default_response', function (message) {
			if(message == 'nextMusiqueReceived')
			{
				socket.emit('playnextmusique');
			}
			
			});

		});	

		socket.on('raspberry_disconnect', function () {

        	socket.emit('raspberry_disconnect', 'Disconnect Successfull');
        	socket.close();
		});	
		/*
		socket.on('hello',function(message){
			var idRegistered = MapStorageManager.getRaspberryIdBySocketId(socket.id);
			clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
				});
			console.log(message);
			console.log(socket.id);
			io.to(socket.id).emit('raspberry_registration', 'Hello Mother Fucker by IO TO');
		});
		*/
	});
}


module.exports.disconnect = function(io,callback){
	io.close();
	callback();
};


//socket.handshake.session.registrationMessage = registrationMessage;
        	//socket.handshake.session.save();


//console.log("Registration Message : " + socket.handshake.session.registrationMessage);
			//console.log(socket.handshake.session);

