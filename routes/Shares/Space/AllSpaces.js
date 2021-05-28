const express = require("express");
const router = express.Router();
const {
  getAllSpaceShares,
} = require("../../../controllers/Shares/Space/AllSpaces");

// router.route("/").post(getUserRidesShares);
// router.route("/userAvailedRides").post(getUserAvailedRides);
router.route("/getAllSpaceShares").post(getAllSpaceShares);

module.exports = router;
