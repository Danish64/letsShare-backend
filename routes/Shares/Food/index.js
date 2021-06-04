const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserFoodShares,
  getAllFoodShares,
  createFoodShareBooking,
  acceptFoodShareBooking,
  getUserAvailedFoods,
  deleteShare,
} = require("../../../controllers/Shares/Food");

router.route("/createFoodShare").post(createShare);
router.route("/deleteFoodShare").delete(deleteShare);

router.route("/getUserFoodShares").post(getUserFoodShares);
router.route("/acceptFoodShareBooking").put(acceptFoodShareBooking);
router.route("/createFoodShareBooking/:id").post(createFoodShareBooking);
router.route("/getAllFoodShares").post(getAllFoodShares);
router.route("/userAvailedFoods").post(getUserAvailedFoods);

module.exports = router;
