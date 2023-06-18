const mongoose = require('mongoose');

const room = require('../models/room');
const building = require('../models/building')

module.exports = {};

module.exports.createItem = async (userId, buildingName, roomNumber, roomDuration, buildingId) => {
    const addedrooms = await room.create({
        userId: userId,
        roomNumber: roomNumber,
        duration: roomDuration,
        buildingName: buildingName, 
        buildingId: buildingId,
    });
    return addedrooms;
}

module.exports.getAll = async () => {
    const rooms = await room.find().lean();
    return rooms
}

module.exports.updateById = async (roomId, newObj) => {
    await building.updateOne({ _id: roomId }, newObj);
    return true
}
    
module.exports.deleteById = async (roomId) => {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return false;
    }
    await room.deleteOne({ _id: roomId });
    return true;
}