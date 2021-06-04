const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserGoodShares,
  getAllGoodShares,
  createGoodShareBooking,
  acceptGoodShareBooking,
  getUserAvailedGoods,
  deleteShare,
} = require("../../../controllers/Shares/Good");

router.route("/createGoodShare").post(createShare);
router.route("/deleteGoodShare").delete(deleteShare);
router.route("/getUserGoodShares").post(getUserGoodShares);
router.route("/acceptGoodShareBooking").put(acceptGoodShareBooking);
router.route("/createGoodShareBooking/:id").post(createGoodShareBooking);
router.route("/getAllGoodShares").post(getAllGoodShares);
router.route("/userAvailedGoods").post(getUserAvailedGoods);

module.exports = router;
