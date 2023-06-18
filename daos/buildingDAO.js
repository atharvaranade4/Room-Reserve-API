const mongoose = require('mongoose');
const building = require('../models/building');
const room = require('../models/room');

module.exports = {};

module.exports.create = async (buildingData) => {
  try {
      const created = await building.create(buildingData);
      console.log(created)
      return created;
  } catch (e) {
      if (e.message.includes('validation failed')) {
      throw new BadDataError(e.message);
      }
      throw e;
  }
}
module.exports.getAll = async () => {
    const buildings = await building.find().lean();
    return buildings
}

module.exports.getSearch = async (searchTerm) => {
  return await building.find( {
      $text: { $search: searchTerm }}).lean()
}

module.exports.getBuildingStats = (buildingInfo) => {
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
    { $project: { buildingId: '$_id', _id: 0, totalUsageTime: 1, numRooms:1, roomNumbers:1, buildingName:1 }},
    { $sort: { totalUsageTime: 1 }}
  ]);
}

module.exports.updateById = async (buildingId, newObj) => {
  await building.updateOne({ _id: buildingId }, newObj);
  return true
}

module.exports.deleteById = async (buildingId) => {
  if (!mongoose.Types.ObjectId.isValid(buildingId)) {
    return false;
  }
  await building.deleteOne({ _id: buildingId });
  return true;
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;