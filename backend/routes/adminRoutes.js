const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Attendance = require("../models/Attendance");

router.get("/stats", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const activeUsers = await Attendance.aggregate([
            {
                $match: {
                    startTime: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalDuration: { $sum: "$duration" }
                }
            },
            {
                $match: {
                    totalDuration: { $gte: 60 }
                }
            }
        ]);

        res.json({
            totalUsers,
            activeUsers: activeUsers.length
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/leaderboard", async (req, res) => {
    try {
      const leaderboard = await User.find({}, "userId username totalDuration totalMessages voiceTime")
        .sort({ totalDuration: -1 }) 
        .lean();
  
      res.json({
        totalUsers: leaderboard.length, 
        rankedUsers: leaderboard.map((user, index) => ({
          rank: index + 1, 
          userId: user.userId,
          username: user.username,
          totalDuration: user.totalDuration,
          totalMessages: user.totalMessages,
          voiceTime: user.voiceTime
        }))
      });
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.get("/recent-activity", async (req, res) => {
    try {
        const recentActivity = await Attendance.find({}, "username channelId duration startTime")
            .sort({ startTime: -1 }) 
            .limit(10) 
            .lean();

        res.json({ recentActivity });
    } catch (error) {
        console.error("❌ Error fetching recent activity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/reports", async (req, res) => {
    try {
        const users = await User.find({}, "userId username totalDuration totalMessages voiceTime").lean();

        res.json({
            totalUsers: users.length,
            users: users.map(user => ({
                userId: user.userId,
                username: user.username,
                totalDuration: user.totalDuration || 0,
                totalMessages: user.totalMessages || 0,
                voiceTime: user.voiceTime || 0
            }))
        });
    } catch (error) {
        console.error("❌ Error fetching reports:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
