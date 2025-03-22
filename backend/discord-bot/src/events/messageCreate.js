const Attendance = require("../database/models/Attendance");
const User = require("../database/models/User");
require("dotenv").config();

const activeUsers = new Map();
const AFK_TIMEOUT = 1 * 60 * 1000; // 1-minute inactivity timeout

module.exports = async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const userId = message.author.id;
    const username = message.author.username;
    const channelId = message.channel.id;
    const guildId = message.guild.id;
    const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID; // Admin Role ID from .env

    const member = message.guild.members.cache.get(userId);
    if (!member) return;

    const roles = member.roles.cache.map(role => role.id); // Get user's role IDs
    const isAdmin = roles.includes(adminRoleId);
    const userRole = isAdmin ? "Admin" : "User"; // Assign user role

    console.log(`📩 Message from ${username} (${userRole}): "${message.content}" in #${message.channel.name}`);

    // Check if user is already active, reset AFK timer
    if (activeUsers.has(userId)) {
        clearTimeout(activeUsers.get(userId).timer);
        activeUsers.get(userId).timer = setTimeout(() => endSession(userId), AFK_TIMEOUT);
    } else {
        // Start tracking user session
        const startTime = new Date();
        const timer = setTimeout(() => endSession(userId), AFK_TIMEOUT);

        activeUsers.set(userId, { username, startTime, channelId, guildId, timer });
        console.log(`✅ Started tracking ${username} in ${message.channel.name}`);
    }

    // Update or create user data in database
    await User.findOneAndUpdate(
        { userId, guildId },
        { $set: { username, roles, role: userRole }, $inc: { totalMessages: 1 } },
        { upsert: true, new: true }
    );
};

/**
 * Ends a user's active session if AFK timeout is reached.
 */
async function endSession(userId) {
    if (!activeUsers.has(userId)) return;

    const { username, startTime, channelId, guildId } = activeUsers.get(userId);
    activeUsers.delete(userId);

    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);

    if (duration > 0) {
        try {
            // Store attendance data
            await Attendance.create({ userId, username, channelId, guildId, startTime, endTime, duration });

            console.log(`⏳ ${username} (${userId}) was active for ${duration} seconds in ${channelId}`);

            // Update user statistics
            await updateUserStats(userId, username, guildId, duration);
        } catch (error) {
            console.error(`❌ Error saving attendance: ${error.message}`);
        }
    }
}

/**
 * Updates user statistics (total, weekly, monthly durations).
 */
async function updateUserStats(userId, username, guildId, duration) {
    try {
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setDate(now.getDate() - 30);

        // Aggregate user stats efficiently
        const [totalResult, weeklyResult, monthlyResult] = await Promise.all([
            Attendance.aggregate([{ $match: { userId, guildId } }, { $group: { _id: null, total: { $sum: "$duration" } } }]),
            Attendance.aggregate([{ $match: { userId, guildId, startTime: { $gte: weekAgo } } }, { $group: { _id: null, total: { $sum: "$duration" } } }]),
            Attendance.aggregate([{ $match: { userId, guildId, startTime: { $gte: monthAgo } } }, { $group: { _id: null, total: { $sum: "$duration" } } }])
        ]);

        const totalDuration = totalResult[0]?.total || 0;
        const weeklyDuration = weeklyResult[0]?.total || 0;
        const monthlyDuration = monthlyResult[0]?.total || 0;

        // Update user stats in database
        await User.findOneAndUpdate(
            { userId, guildId },
            { $set: { username, totalDuration, weeklyDuration, monthlyDuration }, $inc: { voiceTime: duration } },
            { upsert: true, new: true }
        );

        console.log(`📊 Updated stats for ${username} - Total: ${totalDuration}s, Weekly: ${weeklyDuration}s, Monthly: ${monthlyDuration}s`);
    } catch (error) {
        console.error(`❌ Error updating user stats: ${error.message}`);
    }
}
