const mongoose = require('mongoose')

const Building = require('./building')

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    duration: { type: Number, required: true },
    buildingId: { type: String, ref: Building}
});

module.exports = mongoose.model("rooms", roomSchema)