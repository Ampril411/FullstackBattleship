// backend/apis/scores.js
const express = require("express");
const router  = express.Router();
const Game    = require("../models/Game");

// 现在这个 GET 就是 /api/scores/
router.get("/", async (req, res) => {
  try {
    // 只抓 Completed 且 winner 不为空的场次
    const games = await Game.find({ status: "Completed", winner: { $ne: null } });

    const results = {};
    games.forEach(({ winner, player1, player2 }) => {
      const loser = (winner === player1 ? player2 : player1);
      // 初始化条目
      if (!results[winner]) results[winner] = { username: winner, wins: 0, losses: 0 };
      if (loser && !results[loser]) results[loser] = { username: loser, wins: 0, losses: 0 };

      results[winner].wins += 1;
      if (loser) results[loser].losses += 1;
    });

    // 转成数组并排序
    const scoreList = Object.values(results).sort((a, b) => {
      if (b.wins   !== a.wins)   return b.wins   - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return a.username.localeCompare(b.username);
    });

    res.json({ success: true, scores: scoreList });
  } catch (err) {
    console.error("Score fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
