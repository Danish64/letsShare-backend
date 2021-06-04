const express = require("express");
const router = express.Router();
const {
  createShare,
  getUserWorkingSpaceShares,
  getAllWorkingSpaceShares,
  createWorkingSpaceBooking,
  acceptWorkingShareBooking,
  rejectWorkingShareBooking,
  deleteShare,
} = require("../../../controllers/Shares/Space/Working");

router.route("/createWorkingSpaceShare").post(createShare);
router.route("/deleteWorkingSpaceShare").delete(deleteShare);
router.route("/getUserWorkingSpaceShares").post(getUserWorkingSpaceShares);
router.route("/acceptWorkingSpaceShareBooking").put(acceptWorkingShareBooking);
router.route("/rejectWorkingSpaceShareBooking").put(rejectWorkingShareBooking);
router
  .route("/createWorkingSpaceShareBooking/:id")
  .post(createWorkingSpaceBooking);
router.route("/getAllWorkingSpaces").post(getAllWorkingSpaceShares);

module.exports = router;
