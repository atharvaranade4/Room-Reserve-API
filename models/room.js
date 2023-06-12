const mongoose = require('mongoose')

const Building = require('./building')

const roomSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    buildingName: { type: String, required: true },
    roomNumber: { type: Number, required: true },
    duration: { type: Number, required: true },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: Building },
});

roomSchema.index({ buildingId: 1})

module.exports = mongoose.model("rooms", roomSchema)