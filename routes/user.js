const express = require("express");
const {
  login,
  verifyOTP,
  updateProfile,
  getUserDetails,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/otp-verification", verifyOTP);

// Protected routes
router.use(authMiddleware);

router.put("/update-profile", updateProfile);
router.get("/user-details", getUserDetails);
router.post("/logout", logout);

module.exports = router;
