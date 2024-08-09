const express = require("express");
const {
  allusers,
  login,
  signup,
  editUser,
  forgotPass,
  updatePass,
  deleteuser,
  searchUser,
  searchByEmail,
  userProfile,
  logOut,
} = require("./controller");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

router.get("/all-users", allusers);
router.get("/search-user/:name", searchUser);
router.get("/search-user-email/:email", searchByEmail);
router.get("/userProfile", protectRoute, userProfile);
router.get("/loggedOut", protectRoute, logOut)

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgotpassword", forgotPass);

router.put("/update-password", updatePass);
router.put("/update-user",protectRoute, editUser);

router.delete("/delete-user",protectRoute, deleteuser);

module.exports = router;
