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

module.exports.getSearch = async (searchTerm) => {
    return await building.find( {
        $text: { $search: searchTerm }}).lean()
}

module.exports.deleteById = async (roomId) => {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return false;
    }
    await room.deleteOne({ _id: roomId });
    return true;
}