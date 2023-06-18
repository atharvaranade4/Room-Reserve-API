const mongoose = require('mongoose');
const User = require('../models/user')
const room = require('../models/room');
const user = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj, userEmail) => {
    const exist = await User.findOne({ email: userEmail }).lean();
    if (exist) {
        return 'exists'
    }
    const created = await User.create(userObj);
    return created;
}

module.exports.updateById = async (userId) => {
    await User.updateOne({ _id: userId }, {$push: {roles: "admin"}});
    return true
}

module.exports.getUser = async (userEmail) => { 
    const user = await User.findOne({ email: userEmail }).lean();
    return user;
}

module.exports.updateUserPassword = async (userId, password) => {
    await User.updateOne({ _id: userId }, { password: password });
    return true
}

module.exports.getUserStats = (buildingInfo) => {
    return room.aggregate([
        {
            $group: {
                _id:'$userId',
                totalUsageTime: { $sum: '$duration' },
                numRooms: { $count: {} },
                roomNumbers: { $push: '$roomNumber' },
                buildingName: { $push: '$buildingName' }
            }
        },
        {   $project: { userId: '$_id', _id: 0, totalUsageTime: 1, numRooms:1, roomNumbers:1, buildingName:1 }},
        { $sort: { totalUsageTime: 1 }}
    ]);
}