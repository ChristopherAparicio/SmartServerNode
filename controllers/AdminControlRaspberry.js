var express = require('express');
var router = express.Router()
var MapStorageManager = require("../helpers/MapStorageManager");
var request = require('request');
var rasp = 'B8-27-EB-34-3D-FC';

var addrDjango = '172.20.10.12';

var optionsNextMusic = {
    //url: 'http://10.43.1.76/station/next_song',
    url: 'http://'+addrDjango+'/station/next_song',
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    json: {'raspberryId': 'none'}
}

test = function(duree,callback)
{

}

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
						//var duree = 100;
						//test(duree,)
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
		res.write('<script>function play(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/sendplay?name='+rasp+'" , false );xmlHttp.send( null );}'+
			'function pause(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/sendpause?name='+rasp+'" , false );xmlHttp.send( null );}'+
			'function volumeup(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/volumeup?name='+rasp+'" , false );xmlHttp.send( null );}'+
			'function volumedown(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/volumedown?name='+rasp+'" , false );xmlHttp.send( null );}'+
			'function nextMusique(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/sendplaynextmusique?name='+rasp+'" , false );xmlHttp.send( null );}'+
			'function forcenext(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/forcenextmusic?name='+rasp+'" , false );xmlHttp.send( null );}'+
			'function playnext(){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET","http://localhost:8080/AdminControlRaspberry/sendplaynextmusique?name='+rasp+'" , false );xmlHttp.send( null );}'+
			'</script>'+
			'<h1>Raspberry :'+req.query.name+' </h1>'+
			'<a onclick="play()" href="#">PLAY</a>'+'<br/><br/>'+
			'<a onclick="pause()" href="#">PAUSE</a>'+'<br/><br/>'+
			'<a onclick="volumeup()" href="#">VOLUME UP</a>'+'<br/><br/>'+
			'<a onclick="volumedown()" href="#">VOLUME DOWN</a>'+'<br/><br/>'+
			'<a onclick="forcenext()" href="#">CHANGER LA MUSIQUE SUIVANTE</a>'+'<br/><br/>'+
			'<a onclick="playnext()" href="#">FORCER LA MUSIQUE SUIVANTE</a>'+'<br/><br/>');
		res.end();
	});

	router.get('/sendpause', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		var idRegistered = req.query.name;
		io.to(socketId).emit('pause');
		res.setHeader('Content-Type', 'application/json');
		clientRedis.hgetall(idRegistered, function(err, reply) {
    				console.log(reply);
					reply["etat"]= "ATTENTE";
					console.log(reply);
					clientRedis.hmset(idRegistered,reply);
					res.send(JSON.stringify({ etat: reply["etat"] }));
				});
    	//res.send(JSON.stringify({ etat: reply["etat"] }));
	});

	router.get('/sendplaynextmusique', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		idRegistered = req.query.name;
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
		//res.send(JSON.stringify({ musique_courrante: reply["musique_courrante"] }));
		
	});

	router.get('/volumeup', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		var idRegistered = req.query.name;
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
		//res.send(JSON.stringify({ volume: reply["volume"] }));
	});








	router.get('/volumedown', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		var idRegistered = req.query.name;
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
		//res.send(JSON.stringify({ volume: reply["volume"] }));
	});

	router.get('/changenextmusic', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		var idRegistered = req.query.name;
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
		//res.send(JSON.stringify({ musique_suivante: reply["musique_suivante"] }));
	});	

	router.get('/forcenextmusic', function(req, res) {
			var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
			var idRegistered = req.query.name;
			optionsNextMusic.json.raspberryId = idRegistered;
			console.log(optionsNextMusic);
			res.setHeader('Content-Type', 'application/json');
			request(optionsNextMusic, function (error, response, body) {
					if(!error && response.statusCode == 200)
					{
						console.log(body);
						clientRedis.hgetall(idRegistered, function(err, reply) {
		    				// Update DataBase
		    				console.log(body);
							reply["musique_suivante"]= body.next_song_uri;
							console.log("pb");
							console.log(idRegistered);
							console.log(reply);
							clientRedis.hmset(idRegistered,reply);
							res.send(JSON.stringify({ musique_suivante: reply["musique_suivante"] }));
						});
						// Send Next Music to Raspberry
						console.log("envoie de la musique suivante au raspberry");
						io.to(socketId).emit('changeMusiqueSuivante',body.next_song_uri);

					}
					else
					{
						console.log("SocketController Error : Raspberry next music from Django :");
						//console.log(error);
						//console.log(response);
					}
			});
	});


	return router;
}