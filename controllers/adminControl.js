var express = require('express');
var router = express.Router();
var MapStorageManager = require("../helpers/MapStorageManager");
var Raspberry = require('../models/raspberry');
var clientRedis = require('./socketControler').clientRedis;
// middleware that is specific to this router

var request = require('request');
var rasp = 'B8-27-EB-34-3D-FC';

var addrDjango = '172.20.10.12';

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', function(req, res) {
	res.send('Hello Admin');
});

// define the home page route
router.get('/create', function(req, res) {
	var newRaspberry = Raspberry({'name':'Gaston Berger'});
	newRaspberry.save(function(err) {
		if (err) throw err;
		console.log('User created!');

	});
	res.end('Get');
});

router.get('/get', function(req, res) {
	raspberryModel.getRaspberry(function(data,err){
		console.log('Raspberry : ');
		console.log(typeof(results));
		console.log(results);
		res.send('Get');
	});
});


router.get('/getinforaspberry', function(req, res) {
	console.log(req.query.name);
	var idRegistered = req.query.name;
	var socketId = MapStorageManager.getSocketByRaspberryId
	//io.to(socketId).emit('getMusicInformation');

});

module.exports = router;