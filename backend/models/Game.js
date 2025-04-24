const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  gameId:   { type: String, required: true, unique: true },
  player1:  { type: String, required: true },
  player2:  { type: String, default: null },
  status:   { type: String, enum: ['Open','Active','Completed'], default: 'Open' },
  winner:   { type: String, default: null },
  boards:   { type: Map, of: Array, default: {} },
  hits:     { type: Map, of: Array, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);