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
} = require("./controller");
const router = express.Router();

router.get("/all-users", allusers);
router.get("/search-user/:name", searchUser);
router.get("/search-user-email/:email", searchByEmail);

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgotpassword", forgotPass);

router.put("/update-password", updatePass);
router.put("/update-user", editUser);

router.delete("/delete-user", deleteuser);

module.exports = router;
