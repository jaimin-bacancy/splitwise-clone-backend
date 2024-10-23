const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      // create new user
      const newUser = new User({ phone });
      await newUser.save();
    }

    // Generate a temporary token
    const tempToken = generateToken({ phone }, "10m");

    // Here, send OTP to user's phone number (you can use an external service)
    res.status(200).json({ tempToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { otp, tempToken } = req.body;

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const { phone, exp } = decoded;

    if (exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Token expired" });
    }

    // Verify the OTP (this logic should be implemented as per your OTP service)
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new token for the user
    const token = generateToken({ id: user._id, phone }, "7d");

    res.status(200).json({ token, user });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name } = req.body;
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile
    user.name = name;
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  const { id } = req.user;

  try {
    await User.findByIdAndUpdate(id);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
