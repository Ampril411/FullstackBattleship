const express = require("express");
const router  = express.Router();
const User    = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Error" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Password not Match" });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ success: false, message: "Username already Exist" });
    }

    user = new User({ username, password });
    await user.save();

    res.cookie("username", username, { httpOnly: true });
    res.status(201).json({ success: true, message: "Successfully Registered and Logged In", username });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and Password not Filled" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Username or Password Error" });
    }

    res.cookie("username", username, { httpOnly: true });
    res.json({ success: true, message: "Logged In", username });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.json({ success: true, message: "Logged Out" });
});

module.exports = router;
