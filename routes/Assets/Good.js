const express = require("express");
const router = express.Router();
const {
  createUserGood,
  getUserGoods,
} = require("../../controllers/Assets/Good");

router.route("/createGood").post(createUserGood);
router.route("/getUserGoods").post(getUserGoods);

module.exports = router;
