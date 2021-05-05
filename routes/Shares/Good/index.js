const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserGoodShares,
  getAllGoodShares,
  createGoodShareBooking,
  acceptGoodShareBooking,
} = require("../../../controllers/Shares/Good");

router.route("/createGoodShare").post(createShare);
router.route("/getUserGoodShares").post(getUserGoodShares);
router.route("/acceptGoodShareBooking").put(acceptGoodShareBooking);
router.route("/createGoodShareBooking/:id").post(createGoodShareBooking);
router.route("/getAllGoodShares").post(getAllGoodShares);

module.exports = router;
