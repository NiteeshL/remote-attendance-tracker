const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/activity/:userId/:guildId", async (req, res) => {
  try {
      const { userId, guildId } = req.params;

      if (!userId) return res.status(400).json({ message: "❌ Missing userId" });
      if (!guildId) return res.status(400).json({ message: "❌ Missing guildId" });

      const userStats = await User.findOne({ userId, guildId });

      if (!userStats) {
          return res.status(404).json({ message: "❌ User activity not found in database" });
      }

      res.json({
          username: userStats.username || "Unknown",
          totalDuration: userStats.totalDuration || 0,
          weeklyStats: userStats.weeklyStats || [],
          monthlyDuration: userStats.monthlyDuration || 0,
          totalMessages: userStats.totalMessages || 0,
          voiceTime: userStats.voiceTime || 0,
      });
  } catch (error) {
      console.error("❌ Error fetching user activity:", error.message);
      res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

module.exports = router;
