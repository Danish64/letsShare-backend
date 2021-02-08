// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

const express = require("express");
const router = express.Router();
const { registerUser, getUser } = require("../controllers/users");

router.get("/me", async (req, res) => {
  // try {
  //   // debug("User Id ->", req.user._id);
  //   const user = await User.findById(req.user._id).select("-password");
  //   res.send(user);
  // } catch (ex) {
  //   debug(ex);
  //   res.status(500).send("Server error");
  // }
});

router.route("/").post(registerUser);
router.route("/:id").get(getUser);

module.exports = router;
