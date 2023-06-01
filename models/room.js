const mongoose = require('mongoose')

const Building = require('./building')

const roomSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    duration: { type: Number, required: true },
    name: { type: String },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: Building },
    time: { type : Date, default: Date.now }
});


module.exports = mongoose.model("rooms", roomSchema)