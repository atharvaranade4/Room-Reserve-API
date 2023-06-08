const mongoose = require('mongoose');
const building = require('../models/building');
const room = require('../models/room');

module.exports = {};

module.exports.create = async (buildingData) => {
  try {
      const created = await building.create(buildingData);
      return created;
  } catch (e) {
      if (e.message.includes('validation failed')) {
      throw new BadDataError(e.message);
      }
      throw e;
  }
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

module.exports.deleteById = async (buildingId) => {
  if (!mongoose.Types.ObjectId.isValid(buildingId)) {
    return false;
  }
  await building.deleteOne({ _id: buildingId });
  return true;
}