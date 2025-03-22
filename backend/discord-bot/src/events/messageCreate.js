const Attendance = require("../database/models/Attendance");
const User = require("../database/models/User");

const activeUsers = new Map();
const AFK_TIMEOUT = 1 * 60 * 1000; // 1 minute

module.exports = async (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;
    const username = message.author.username;
    const channelId = message.channel.id;
    const guildId = message.guild.id;

    console.log(`📩 Message from ${username} (${userId}): "${message.content}" in #${message.channel.name}`);

    if (activeUsers.has(userId)) {
        clearTimeout(activeUsers.get(userId).timer);
        activeUsers.get(userId).timer = setTimeout(() => endSession(userId), AFK_TIMEOUT);
    } else {
        const startTime = new Date();
        const timer = setTimeout(() => endSession(userId), AFK_TIMEOUT);

        activeUsers.set(userId, { username, startTime, channelId, guildId, timer });

        console.log(`✅ Started tracking ${username} in ${message.channel.name}`);
    }

    await User.findOneAndUpdate(
        { userId, guildId },
        { $set: { username }, $inc: { totalMessages: 1 } },
        { upsert: true, new: true }
    );
};

async function endSession(userId) {
    if (!activeUsers.has(userId)) return;

    const { username, startTime, channelId, guildId } = activeUsers.get(userId);
    activeUsers.delete(userId);

    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);

    if (duration > 0) {
        try {
            await Attendance.create({
                userId,
                username,
                channelId,
                guildId,
                startTime,
                endTime,
                duration,
            });

            console.log(`⏳ ${username} (${userId}) was active for ${duration} seconds in ${channelId}`);

            await updateUserStats(userId, username, guildId, duration);
        } catch (error) {
            console.error(`❌ Error saving attendance: ${error.message}`);
        }
    }
}

async function updateUserStats(userId, username, guildId, duration) {
    try {
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setDate(now.getDate() - 30);

        const [totalResult, weeklyResult, monthlyResult] = await Promise.all([
            Attendance.aggregate([{ $match: { userId, guildId } }, { $group: { _id: null, total: { $sum: "$duration" } } }]),
            Attendance.aggregate([{ $match: { userId, guildId, startTime: { $gte: weekAgo } } }, { $group: { _id: null, total: { $sum: "$duration" } } }]),
            Attendance.aggregate([{ $match: { userId, guildId, startTime: { $gte: monthAgo } } }, { $group: { _id: null, total: { $sum: "$duration" } } }])
        ]);

        const totalDuration = totalResult[0]?.total || 0;
        const weeklyDuration = weeklyResult[0]?.total || 0;
        const monthlyDuration = monthlyResult[0]?.total || 0;

        await User.findOneAndUpdate(
            { userId, guildId },
            {
                $set: { username, totalDuration, weeklyDuration, monthlyDuration },
                $inc: { voiceTime: duration },
            },
            { upsert: true, new: true }
        );

        console.log(`📊 Updated stats for ${username} - Total: ${totalDuration}s, Weekly: ${weeklyDuration}s, Monthly: ${monthlyDuration}s`);
    } catch (error) {
        console.error(`❌ Error updating user stats: ${error.message}`);
    }
}
