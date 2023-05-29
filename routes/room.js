const { Router } = require("express");
const router = Router();

const roomDAO = require('../daos/roomDAO');

router.post("/", async (req, res, next) => {
    let buildingId
    try {
        if (0 < req.body.number < 10 ) {
            buildingId = "A"
        }
        const reserveRoom = await roomDAO.createItem(req.body.name, req.body.number, req.body.duration, buildingId);
        res.json(reserveRoom)
    } catch(e) {
        res.status(500).send(e.message)
    }
});


module.exports = router;