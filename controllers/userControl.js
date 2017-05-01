var express = require('express');
var router = express.Router();

var RaspberryModel = require('../models/raspberry');
// middleware that is specific to this router

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', function(req, res) {
	res.send('Hello User');
});

// define the home page route
router.get('/create', function(req, res) {
	var newRaspberry = RaspberryModel({'name':'Gaston Berger'});
	newRaspberry.save(function(err) {
		if (err) throw err;
		console.log('User created!');
	});
});
/*
router.get('/get', function(req, res) {
	raspberryModel.getRaspberry(function(data,err){
		console.log('Raspberry : ');
		console.log(typeof(results));
		console.log(results);
		res.send('Get');
	});
});
*/
module.exports = router;