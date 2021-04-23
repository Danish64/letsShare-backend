const express = require("express");
const router = express.Router();
const {
  createUserFood,
  getUserFoods,
} = require("../../controllers/Assets/Food");

router.route("/createFood").post(createUserFood);
router.route("/getUserFoods").post(getUserFoods);

module.exports = router;
