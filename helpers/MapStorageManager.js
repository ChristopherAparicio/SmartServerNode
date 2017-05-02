// socketStorage : RaspberryId --> Socket.Id
// raspberryIdStorage : Socket.Id --> RaspberryId

var socketStorage      = new Map();
var raspberryIdStorage = new Map();

module.exports = {
	// Socket Storage Functions
	addToSocketStorage(RaspberryId,SocketId){
		socketStorage.set(RaspberryId,SocketId);
	},
	getSocketByRaspberryId(RaspberryId){
		return socketStorage.get(RaspberryId);
	},
	printSocketStorage(){
		console.log(socketStorage);
	},
	// Raspberry Id Storage Functions
	addToRaspberryIdStorage(SocketId,RaspberryId){
		raspberryIdStorage.set(SocketId,RaspberryId);
	},
	getRaspberryIdBySocketId(SocketId){
		return raspberryIdStorage.get(SocketId);
	},
	printRaspberryIdStorage(){
		console.log(raspberryIdStorage);
	}
}