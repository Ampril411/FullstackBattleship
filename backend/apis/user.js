const express = require("express");
const router  = express.Router();
const User    = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "所有字段均为必填" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "两次密码输入不一致" });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ success: false, message: "用户名已存在" });
    }

    user = new User({ username, password });
    await user.save();

    res.cookie("username", username, { httpOnly: true });
    res.status(201).json({ success: true, message: "注册并登录成功", username });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "用户名和密码均为必填" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "用户名或密码错误" });
    }

    res.cookie("username", username, { httpOnly: true });
    res.json({ success: true, message: "登录成功", username });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.json({ success: true, message: "已登出" });
});

module.exports = router;
