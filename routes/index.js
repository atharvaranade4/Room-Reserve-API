const { Router } = require("express");
const router = Router();

router.use("/login", require('./user'));
router.use("/room", require ('./room'))
router.use("/building", require ('./building'))

module.exports = router;