const { Router } = require("express");
const router = Router();

const buildingDAO = require('../daos/buildingDAO');

const isLoggedIn = require('./isLoggedIn');
const isAdmin = require('./isAdmin');

router.use(isLoggedIn)

router.get("/", async (req, res, next) => {
  const allBuildings = await buildingDAO.getAll();
  // console.log(allBuildings)
  if (allBuildings)
    res.json(allBuildings);
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
        const savedBuilding = await buildingDAO.create(building);
        res.status(200).send(savedBuilding);
    } catch(e) {
      res.status(500).send(e.message);
    }
  };
});

// READ
router.get("/stats", async (req, res, next) => {
  const stats = await buildingDAO.getBuildingStats();
  if (stats)
    res.json(stats);
    else
    res.sendStatus(404);
});

// Update
router.put("/:id", async (req, res, next) => {
  const buildingId = req.params.id;
  const building = req.body
  if (!building || JSON.stringify(building) === '{}' ) {
    res.status(400).send('author is required"');
  } else {
    try {
      const success = await buildingDAO.updateById(buildingId, building);
      res.sendStatus(success ? 200 : 400);
    } catch(e) {
      res.status(500).send(e.message);
    }
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