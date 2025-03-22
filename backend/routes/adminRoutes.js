const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Attendance = require("../models/Attendance");

// 📌 Route to fetch admin dashboard stats
router.get("/stats", async (req, res) => {
    try {
        // Count total users
        const totalUsers = await User.countDocuments();

        // Fetch users who have a total weekly duration > 1 min
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
                    totalDuration: { $gte: 60 } // 1 min = 60 sec
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

// 📌 Route to fetch leaderboard (Rank users by total duration)
router.get("/leaderboard", async (req, res) => {
    try {
      // Fetch leaderboard by ranking users based on totalDuration
      const leaderboard = await User.find({}, "userId username totalDuration totalMessages voiceTime")
        .sort({ totalDuration: -1 }) // Rank based on totalDuration (descending)
        .lean(); // Convert to plain objects
  
      res.json({
        totalUsers: leaderboard.length, // Total users in leaderboard
        rankedUsers: leaderboard.map((user, index) => ({
          rank: index + 1, // Assign rank based on position
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

  // 📌 Route to fetch recent activity
router.get("/recent-activity", async (req, res) => {
    try {
        // Fetch the last 10 recent activity logs (adjust limit if needed)
        const recentActivity = await Attendance.find({}, "username channelId duration startTime")
            .sort({ startTime: -1 }) // Sort by most recent activity
            .limit(10) // Get only the latest 10 records
            .lean();

        res.json({ recentActivity });
    } catch (error) {
        console.error("❌ Error fetching recent activity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

  

module.exports = router;
