const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  guildId: { type: String, required: true },
  roles: { type: [String], default: [] },
  role: { type: String, enum: ["Admin", "User"], default: "User" }, // Role-based authentication
  totalDuration: { type: Number, default: 0 },
  weeklyDuration: { type: Number, default: 0 },
  monthlyDuration: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
  voiceTime: { type: Number, default: 0 },
  totalMessages: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
