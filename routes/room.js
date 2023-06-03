const { Router } = require("express");
const router = Router();

const roomDAO = require('../daos/roomDAO');
const buildingDAO = require('../daos/buildingDAO');

// CREATE
router.post("/", async (req, res, next) => {
    let buildingName = req.body.buildingName
    console.log(buildingName.split(" ").length)
    if (buildingName.split(" ").length != 1 || !buildingName.startsWith("M")) {
        res.status(400).send('Please enter valid building name');
    } else {
        try {
            const buildingObj = await roomDAO.getSearch(buildingName);
            if (buildingObj){
                const buildingId = buildingObj[0]._id     
                const reserveRoom = await roomDAO.createItem(
                    req.body.buildingName, 
                    req.body.roomNumber, 
                    req.body.duration, 
                    buildingId,
                );
                console.log(reserveRoom)
                res.json(reserveRoom)
            } else {
                console.log("cannot find buildingObj")
            }
        } catch(e) {
            console.log("reached 500")
            res.status(500).send(e.message)
        }
    }
});



// READ
router.get("/building/stats", async (req, res, next) => {
    let { buildingInfo } = req.query;
    const stats = await roomDAO.getBuildingStats(buildingInfo);
    if (stats)
        res.json(stats);
    else
        res.sendStatus(404);
});



// DELETE
router.delete("/:id", async (req, res, next) => {
    const roomId = req.params.id;
    try {
        const success = await roomDAO.deleteById(roomId);
        res.sendStatus(success ? 200 : 400);
    }   catch(e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;