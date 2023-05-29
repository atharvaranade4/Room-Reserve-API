const building = require('../models/building');

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
