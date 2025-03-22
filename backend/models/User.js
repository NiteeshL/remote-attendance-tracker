const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  guildId: { type: String, required: true },
  username: { type: String, required: true },
  totalDuration: { type: Number, default: 0 },
  weeklyStats: { type: Array, default: [] }, 
  monthlyDuration: { type: Number, default: 0 }, 
  totalMessages: { type: Number, default: 0 },
  voiceTime: { type: Number, default: 0 }, 
});

module.exports = mongoose.model("User", userSchema);
