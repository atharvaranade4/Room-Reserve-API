const { Router } = require("express");
const router = Router();

const roomDAO = require('../daos/roomDAO');
const buildingDAO = require('../daos/buildingDAO');

// CREATE
router.post("/", async (req, res, next) => {
    let buildingName = req.body.name
    console.log(buildingName.split(" ").length)
    if (buildingName.split(" ").length != 1 || !buildingName.startsWith("M")) {
        res.status(400).send('Please enter valid building name');
    } else {
        console.log(buildingName)
        try {
            const buildingObj = await roomDAO.getSearch(buildingName);
            if (buildingObj){
                console.log(buildingObj)
                const buildingId = buildingObj[0]._id
                console.log("here + ", buildingId)
                const date = new Date()
                
                const reserveRoom = await roomDAO.createItem(
                    req.body.name, 
                    req.body.number, 
                    req.body.duration, 
                    buildingId,
                    date
                );
                console.log(reserveRoom)
                res.json(reserveRoom)
            } else {
                console.log("cannot find buildingObj")
            }
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
});

// READ
router.get("/", async (req, res, next) => {
    let { buildingId } = req.query;
    const books = await roomDAO.getAll(buildingId);
    res.json(books);
});

// UPDATE


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