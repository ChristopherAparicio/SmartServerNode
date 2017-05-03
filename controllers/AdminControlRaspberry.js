var express = require('express');
var router = express.Router()
var MapStorageManager = require("../helpers/MapStorageManager");


module.exports = function(io,clientRedis){
	router.get('/sendplay', function(req, res) {
		console.log(req.query.name);
		var id = req.query.name;
		var socketId = MapStorageManager.getSocketByRaspberryId(id);
		res.setHeader('Content-Type', 'application/json');
		clientRedis.hgetall(id, function(err, reply) {
    				console.log(reply);
					
					if(reply["musique_courrante"] == 'None' && reply["musique_suivante"] != 'None')
					{
						console.log("11111");
						reply["etat"]= "JOUE";
						reply["musique_courrante"] = reply["musique_suivante"];
						reply["musique_suivante"] = "None";
						io.to(socketId).emit('playnextmusique');
						io.to(socketId).emit('jouer');
					}
					else if(reply["musique_courrante"] != 'None')
					{
						console.log("2222");
						reply["etat"]= "JOUE";
						io.to(socketId).emit('jouer');
					}
					console.log(reply);
					clientRedis.hmset(id,reply);
					console.log('AAAAAA');
					res.send(JSON.stringify({ etat: reply["etat"] }));	
				});
		//res.send(JSON.stringify({ etat: reply["etat"] }));
    	
	});

	router.get('/', function(req, res) {
		console.log(req.query.name);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write('<script>function play(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/sendplay?name=AC-BC-32-D5-CE-83" , false );xmlHttp.send( null );}'+
			'function pause(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/sendpause?name=AC-BC-32-D5-CE-83" , false );xmlHttp.send( null );}'+
			'</script>'+
			'<h1>Raspberry :'+req.query.name+' </h1>'+
			'<a onclick="play()" href="#">PLAY</a>'+'<br/><br/>'+'<a onclick="pause()" href="#">PAUSE</a>');
		res.end();
	});

	router.get('/sendpause', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('pause');
		res.setHeader('Content-Type', 'application/json');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					reply["etat"]= "ATTENTE";
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);
					res.send(JSON.stringify({ etat: reply["etat"] }));
				});
    	res.send(JSON.stringify({ etat: reply["etat"] }));
	});

	router.get('/sendplaynextmusique', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('playnextmusique');
		res.setHeader('Content-Type', 'application/json');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
    				if(reply["musique_suivante"] != "None")
    				{
    					reply["musique_courrante"] = reply["musique_suivante"];
    					reply["musique_suivante"] = "None";
    				}
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);
    				res.send(JSON.stringify({ musique_courrante: reply["musique_courrante"] }));	
				});
		res.send(JSON.stringify({ musique_courrante: reply["musique_courrante"] }));
		
	});

	router.get('/volumeup', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('volumeup');
		res.setHeader('Content-Type', 'application/json');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					if(reply["volume"]<20)
					{
						reply["volume"]+= 1;
					}
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);
					res.send(JSON.stringify({ volume: reply["volume"] }));	
				});
		res.send(JSON.stringify({ volume: reply["volume"] }));
	});


	router.get('/volumedown', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('volumedown');
		res.setHeader('Content-Type', 'application/json');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					if(reply["volume"]>0)
					{
						reply["volume"]-= 1;
					}
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);
					res.send(JSON.stringify({ volume: reply["volume"] }));	
				});
		res.send(JSON.stringify({ volume: reply["volume"] }));
	});

	router.get('/changenextmusic', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		var musique = req.query.musique;
		io.to(socketId).emit('changeMusiqueSuivante',musique);
		res.setHeader('Content-Type', 'application/json');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					reply["musique_suivante"]= musique;
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);	
					res.send(JSON.stringify({ musique_suivante: reply["musique_suivante"] }));
				});
		res.send(JSON.stringify({ musique_suivante: reply["musique_suivante"] }));
	});	

	return router;
}