const mongoose = require('mongoose')

const buildingSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

buildingSchema.index({
    name: 'text'
})
module.exports = mongoose.model("buildings", buildingSchema)