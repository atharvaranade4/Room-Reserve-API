const room = require('../models/room');

module.exports = {};

module.exports.createItem = async (roomName, roomNumber, roomDuration, buildingId) => {
    const addedrooms = await room.create({ 
        name:roomName, 
        number:roomNumber,
        duration: roomDuration,
        buildingId: buildingId
    });
    return addedrooms;
}