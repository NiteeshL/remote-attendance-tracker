const Attendance = require("../database/models/Attendance");
const User = require("../database/models/User");
require("dotenv").config();

const activeVCUsers = new Map();

module.exports = async (oldState, newState) => {
    const userId = newState.member?.id || oldState.member?.id;
    const username = newState.member?.user.username || oldState.member?.user.username;
    const guildId = newState.guild.id;
    const channelId = newState.channelId;
    const oldChannelId = oldState.channelId;
    const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID; // Admin Role from .env

    const member = newState.member || oldState.member;
    if (!member) {
        console.error(`❌ Member not found for userId: ${userId}`);
        return;
    }

    const roles = member.roles.cache.map(role => role.id);
    const isAdmin = roles.includes(adminRoleId);
    const userRole = isAdmin ? "Admin" : "User"; // Assign user role

    if (!oldChannelId && channelId) {
        // 🎤 User joins a voice channel
        console.log(`🎤 ${username} (${userRole}) joined VC: ${newState.channel.name}`);
        activeVCUsers.set(userId, { channelId, guildId, startTime: new Date() });

        // Update user role & details in DB when they join VC
        await User.findOneAndUpdate(
            { userId, guildId },
            { $set: { username, roles, role: userRole } },
            { upsert: true, new: true }
        );
    }

    if (oldChannelId && !channelId) {
        // 🔇 User leaves a voice channel
        console.log(`🔇 ${username} (${userRole}) left VC: ${oldState.channel.name}`);

        if (activeVCUsers.has(userId)) {
            const { startTime, channelId, guildId } = activeVCUsers.get(userId);
            activeVCUsers.delete(userId);

            const endTime = new Date();
            const duration = Math.floor((endTime - startTime) / 1000);

            if (duration > 0) {
                try {
                    // Store attendance data
                    await Attendance.create({ userId, username, channelId, guildId, startTime, endTime, duration });

                    console.log(`✅ ${username} was in VC for ${duration} seconds in ${oldState.channel.name}`);

                    // Update user VC stats
                    await updateUserStats(userId, username, guildId, duration, roles);
                } catch (error) {
                    console.error(`❌ Error saving VC attendance: ${error.message}`);
                }
            }
        }
    }
};

/**
 * Updates user statistics (total, weekly, and monthly durations).
 */
async function updateUserStats(userId, username, guildId, duration, roles) {
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
            { $set: { username, totalDuration, weeklyDuration, monthlyDuration, roles }, $inc: { voiceTime: duration } },
            { upsert: true, new: true }
        );

        console.log(`📊 Updated VC stats for ${username} - Total: ${totalDuration}s, Weekly: ${weeklyDuration}s, Monthly: ${monthlyDuration}s`);
    } catch (error) {
        console.error(`❌ Error updating user VC stats: ${error.message}`);
    }
}
