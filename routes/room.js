const { Router } = require("express");
const router = Router();

const roomDAO = require('../daos/roomDAO');

const isLoggedIn = require('./isLoggedIn');
const isAdmin = require('./isAdmin');

router.use(isLoggedIn)

// CREATE
router.post("/", async (req, res, next) => {
    const room = req.body;
    let buildingName = req.body.buildingName
    if (!room || JSON.stringify(room) === '{}' ) {
        res.status(400).send('room is required');
    } else {
        try {
            const buildingObj = await roomDAO.getSearch(buildingName);
            console.log(buildingObj)
            if (buildingObj){
                const buildingId = buildingObj[0]._id;
                const userId = req.user._id;
                // console.log(userId)
                const reserveRoom = await roomDAO.createItem(
                    userId,
                    req.body.buildingName, 
                    req.body.roomNumber, 
                    req.body.duration, 
                    buildingId,
                );
                // console.log(reserveRoom)
                res.json(reserveRoom)
                console.log(reserveRoom)
            } else {
                console.log("cannot find buildingObj")
            }
        } catch(e) {
            console.log("reached 500")
            res.status(500).send(e.message)
        }
    }
});

router.use(isAdmin)

// READ
router.get("/", async (req, res, next) => {
    try {
        const rooms = await roomDAO.getAll();
        res.json(rooms);
    } catch(e) {
        res.status(500).send(e.message);
    }
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