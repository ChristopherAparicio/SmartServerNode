var express = require('express');
var router = express.Router();



router.get('/sendplay', function(req, res) {
  console.log(req.query.name);
  var socketId = MapStorageManager.getSocketByRaspberryId(req.query.name);
  io.to(socketId).emit('jouer','aqqqqq');
});


module.exports = router;