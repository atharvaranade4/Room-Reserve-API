const mongoose = require('mongoose');

const room = require('../models/room');
const building = require('../models/building')

module.exports = {};

module.exports.createItem = async (buildingName, roomNumber, roomDuration, buildingId) => {
    const addedrooms = await room.create({ 
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

module.exports.getBuildingStats = (buildingInfo) => {
    if (buildingInfo) {
        return room.aggregate([
            {
                $group: {
                    _id:'$buildingId',
                    totalUsageTime: { $sum: '$duration' },
                    numRooms: { $count: {} },
                    roomNumbers: { $push: '$roomNumber' },
                    buildingName: { $push: '$buildingName' }
                }
            },
            {   $project: { buildingId: '$_id', _id: 0, totalUsageTime: 1, numRooms:1, roomNumbers:1, buildingName:1 }},
            {
                $lookup: {
                    from: 'buildings',
                    localField: 'buildingId',
                    foreignfield: '_id',
                    as: 'building'
                }
            },
            { $unwind: "building"}
        ])
    };
    return room.aggregate([
        {
            $group: {
                _id:'$buildingId',
                totalUsageTime: { $sum: '$duration' },
                numRooms: { $count: {} },
                roomNumbers: { $push: '$roomNumber' },
                buildingName: { $push: '$buildingName' }
            }
        },
        {   $project: { buildingId: '$_id', _id: 0, totalUsageTime: 1, numRooms:1, roomNumbers:1, buildingName:1 }},
        { $sort: { totalUsageTime: 1 }}
    ]);
}

module.exports.deleteById = async (roomId) => {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return false;
    }
    await room.deleteOne({ _id: roomId });
    return true;
}