const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserWorkingSpaceShares,
  getAllWorkingSpaceShares,
} = require("../../../controllers/Shares/Space/Working");

router.route("/createWorkingSpaceShare").post(createShare);
// router.route("/deleteResidenceSpaceShare").delete(deleteShare);
router.route("/getUserWorkingSpaceShares").post(getUserWorkingSpaceShares);
// router
//   .route("/acceptResidenceSpaceShareBooking")
//   .put(acceptResidenceShareBooking);
// router
//   .route("/rejectResidenceSpaceShareBooking")
//   .put(rejectResidenceShareBooking);
// router
//   .route("/createResidenceSpaceShareBooking/:id")
//   .post(createResidenceSpaceBooking);
router.route("/getAllWorkingSpaces").post(getAllWorkingSpaceShares);

module.exports = router;
