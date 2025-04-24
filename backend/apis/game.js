const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const { v4: uuidv4 } = require("uuid");

router.post("/create", async (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const gameId = uuidv4();
    const game = new Game({
      gameId,
      player1: username,
      player2: null,
      status: "Open",
      boards: {},
      hits: {},
      winner: null,
    });
    await game.save();
    res.json({ success: true, gameId });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
);

router.patch("/:id/join", async (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const game = await Game.findOne({ gameId: req.params.id });
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    if (game.player1 === username) {
      return res.json({ success: true, role: "player1" });
    }

    if (game.player2 && game.player2 !== username) {
      return res.status(400).json({ success: false, message: "Game already full" });
    }

    if (!game.player2) {
      game.player2 = username;
      game.status = "Active";
      await game.save();
    }

    res.json({ success: true, role: "player2" });
  } catch (error) {
    console.error("Error joining game:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
);

router.get("/:id", async (req, res) => {
  try{
    const gameDoc = await Game.findOne({ gameId: req.params.id });
    if (!gameDoc) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }
    const game = gameDoc.toObject();

    game.boards = Object.fromEntries(game.boards);
    game.hits = Object.fromEntries(game.hits);
    res.json({ success: true, game });
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({ success: true, games });
  } catch (err) {
    console.error("Fetch all games error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/board", async (req, res) => {
  const username = req.cookies.username;
  const { board } = req.body;
  if (!username) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const game = await Game.findOne({ gameId: req.params.id });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    game.boards.set(username, board);
    if (!game.hits.has(username)) {
      game.hits.set(username, []);
    }
    await game.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
);

router.patch("/:id/hit", async (req, res) => {
  const attacker = req.cookies.username;
  const { row, col } = req.body;
  if (!attacker) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
try{
    const game = await Game.findOne({ gameId: req.params.id });
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }
    const defender = game.player1 === attacker ? game.player2 : game.player1;
    if (!defender) {
      return res.status(400).json({ success: false, message: "Game not full" });
    }

    const defBoard = game.boards.get(defender);
    defBoard[row][col].hit = true;
    game.boards.set(defender, defBoard);
    game.markModified("boards");

    const attackerHits = game.hits.get(attacker) || [];
    attackerHits.push({ row, col });
    game.hits.set(attacker, attackerHits);

    const allSunk = defBoard.every(row =>
      row.every(cell =>
        cell.ship ? cell.hit : true
      )
    );
    if (allSunk) {
      game.status = "Completed";
      game.winner = attacker;
    }
    game.updatedAt = new Date();
    await game.save();
    res.json({ success: true, allSunk, winner: game.winner });
  } catch (error) {
    console.error("Error hitting board:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;