const express = require("express");
const router = express.Router();
const {
  createUserSpace,
  getUserSpaces,
} = require("../../controllers/Assets/Space");

router.route("/createSpace").post(createUserSpace);
router.route("/getUserSpaces").post(getUserSpaces);

module.exports = router;
