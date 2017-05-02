var express = require('express');
var router = express.Router();
var MapStorageManager = require("../helpers/MapStorageManager");


module.exports = function(io){
	router.get('/sendplay', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('jouer');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					reply["etat"]= "JOUE";
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);	
				});
		res.send('Hello World');
	});

	router.get('/sendpause', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('pause');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					reply["etat"]= "ATTENTE";
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);	
				});
		res.send('sendpause');
	});

	router.get('/sendplaynextmusique', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('playnextmusique');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
    				if(reply["musique_suivante"] != "None")
    				{
    					reply["musique_courrante"] = reply["musique_suivante"];
    					reply["musique_suivante"] = "None";
    				}
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);	
				});
		res.send('sendplaynextmusique');
	});

	router.get('/volumeup', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('volumeup');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					if(reply["volume"]<20)
					{
						reply["volume"]+= 1;
					}
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);	
				});
		res.send('volumeup');
	});


	router.get('/volumedown', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('volumedown');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					if(reply["volume"]>0)
					{
						reply["volume"]-= 1;
					}
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);	
				});
		res.send('volumedown');
	});

	router.get('/changenextmusic', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		var musique = req.query.musique;
		io.to(socketId).emit('changeMusiqueSuivante',musique);
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					reply["musique_suivante"]= musique;
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);	
				});
		res.send('changeMusiqueSuivante');
	});	

	return router;
}