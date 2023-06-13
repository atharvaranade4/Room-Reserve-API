const { Router } = require("express");
const router = Router();

const buildingDAO = require('../daos/buildingDAO');
const roomDAO = require('../daos/roomDAO');

const isLoggedIn = require('./isLoggedIn');
const isAdmin = require('./isAdmin');

router.use(isLoggedIn)

router.get("/", async (req, res, next) => {
  const stats = await buildingDAO.getAll();
  if (stats)
    res.json(stats);
    else
    res.sendStatus(404);
});

router.use(isAdmin)

// Create
router.post("/", async (req, res, next) => {
  const building = req.body;
  if (!building || JSON.stringify(building) === '{}' ) {
    res.status(400).send('building is required');
  } else {
    try {
      const existingBuilding = await roomDAO.getSearch(building.name)
      if (existingBuilding.length == 0){
        const savedBuilding = await buildingDAO.create(building);
        res.json(savedBuilding);
      }
      else {
        if (building.name == existingBuilding[0].name){
          res.status(401).send("Building exists");
        } else {
          const savedBuilding = await buildingDAO.create(building);
          res.json(savedBuilding);
        }
      }
    } catch(e) {
      res.status(500).send(e.message);
    }
  };
});

// READ
router.get("/stats", async (req, res, next) => {
  let { buildingInfo } = req.query;
  const stats = await buildingDAO.getBuildingStats(buildingInfo);
  if (stats)
    res.json(stats);
    else
    res.sendStatus(404);
});
    
// Update
router.put("/:id", async (req, res, next) => {
  try {
    const success = await buildingDAO.updateById(req.params.id, req.body);
    res.sendStatus(success ? 200 : 400);
  } catch(e) {
    res.status(500).send(e.message);
  }
});
    
// Delete
router.delete("/:id", async (req, res, next) => {
  const buildingId = req.params.id;
  try {
    const success = await buildingDAO.deleteById(buildingId);
    res.sendStatus(success ? 200 : 400);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;