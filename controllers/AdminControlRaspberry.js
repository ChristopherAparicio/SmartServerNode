var express = require('express');
var router = express.Router();
var MapStorageManager = require("../helpers/MapStorageManager");


module.exports = function(io){
	router.get('/sendplay', function(req, res) {
		console.log(req.query.name);
		var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
		io.to(socketId).emit('raspberry_registration','aqqqqq');
		res.send('Hello World');
	});
	return router;
}