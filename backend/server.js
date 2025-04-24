// server.js
const express = require("express");
const connectDB = require("./db");
connectDB();
const path = require("path");
const cookieParser = require("cookie-parser");

const userRoutes   = require("./apis/user");
const gameRoutes   = require("./apis/game");
const scoresRoutes = require("./apis/scores");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user",   userRoutes);
app.use("/api/game",   gameRoutes);
app.use("/api/scores", scoresRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
