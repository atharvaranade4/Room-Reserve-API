const mongoose = require('mongoose');

const room = require('../models/room');
const building = require('../models/building')

module.exports = {};

module.exports.createItem = async (roomName, roomNumber, roomDuration, buildingId, date ) => {
    console.log(date)
    const addedrooms = await room.create({ 
        number: roomNumber,
        duration: roomDuration,
        name: roomName, 
        buildingId: buildingId,
        time: date
    });
    return addedrooms;
}

module.exports.getSearch = async (searchTerm) => {
    return await building.find( {
        $text: { $search: searchTerm }}).lean()
}


module.exports.getAll = async (buildingId) => {
    if (buildingId){
      return await room.find({ buildingId: buildingId }).lean()
    }
    return room.find().lean();
}

module.exports.deleteById = async (roomId) => {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return false;
    }
    await room.deleteOne({ _id: roomId });
    return true;
}