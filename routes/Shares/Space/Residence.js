const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserResidenceSpaceShares,
  getAllResidenceSpaceShares,
  createResidenceSpaceBooking,
  acceptResidenceShareBooking,
} = require("../../../controllers/Shares/Space/Residence");

router.route("/createResidenceSpaceShare").post(createShare);
router.route("/getUserResidenceSpaceShares").post(getUserResidenceSpaceShares);
router
  .route("/acceptResidenceSpaceShareBooking")
  .put(acceptResidenceShareBooking);
router
  .route("/createResidenceSpaceShareBooking/:id")
  .post(createResidenceSpaceBooking);
router.route("/getAllResidenceSpaces").post(getAllResidenceSpaceShares);

module.exports = router;
