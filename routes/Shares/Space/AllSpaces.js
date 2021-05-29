const express = require("express");
const router = express.Router();
const {
  getAllSpaceShares,
  getUserSpaceShares,
  getUserAvailedSpaces,
} = require("../../../controllers/Shares/Space/AllSpaces");

router.route("/getUserSpaceShares").post(getUserSpaceShares);
router.route("/userAvailedSpaces").post(getUserAvailedSpaces);
router.route("/getAllSpaceShares").post(getAllSpaceShares);

module.exports = router;
