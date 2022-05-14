const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/authController");

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

module.exports = router;
