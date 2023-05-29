const mongoose = require('mongoose')

const buildingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
});

module.exports = mongoose.model("buildings", buildingSchema)