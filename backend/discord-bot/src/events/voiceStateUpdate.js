const Attendance = require("../database/models/Attendance");
const User = require("../database/models/User");

const activeVCUsers = new Map();

module.exports = async (oldState, newState) => {
    const userId = newState.member?.id || oldState.member?.id;
    const username = newState.member?.user.username || oldState.member?.user.username;
    const guildId = newState.guild.id;
    const channelId = newState.channelId;
    const oldChannelId = oldState.channelId;

    if (!oldChannelId && channelId) {
        console.log(`🎤 ${username} joined VC: ${newState.channel.name}`);
        activeVCUsers.set(userId, { channelId, guildId, startTime: new Date() });
    }

    if (oldChannelId && !channelId) {
        console.log(`🔇 ${username} left VC: ${oldState.channel.name}`);

        if (activeVCUsers.has(userId)) {
            const { startTime, channelId, guildId } = activeVCUsers.get(userId);
            activeVCUsers.delete(userId);

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

                    console.log(`✅ ${username} spent ${duration} seconds in ${oldState.channel.name}`);

                    await updateUserStats(userId, username, guildId, duration);
                } catch (error) {
                    console.error(`❌ Error saving VC attendance: ${error.message}`);
                }
            }
        }
    }
};

async function updateUserStats(userId, username, guildId, duration) {
    try {
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setDate(now.getDate() - 30);

        const totalDurationResult = await Attendance.aggregate([
            { $match: { userId, guildId } },
            { $group: { _id: null, total: { $sum: "$duration" } } },
        ]);

        const totalDuration = totalDurationResult[0]?.total || 0;

        const weeklyDurationResult = await Attendance.aggregate([
            { $match: { userId, guildId, startTime: { $gte: weekAgo } } },
            { $group: { _id: null, total: { $sum: "$duration" } } },
        ]);

        const monthlyDurationResult = await Attendance.aggregate([
            { $match: { userId, guildId, startTime: { $gte: monthAgo } } },
            { $group: { _id: null, total: { $sum: "$duration" } } },
        ]);

        const weeklyDuration = weeklyDurationResult[0]?.total || 0;
        const monthlyDuration = monthlyDurationResult[0]?.total || 0;

        const user = await User.findOneAndUpdate(
            { userId, guildId },
            {
                $set: { username, totalDuration, weeklyDuration, monthlyDuration },
                $inc: { voiceTime: duration }, 
            },
            { upsert: true, new: true }
        );

        console.log(
            `📊 Updated VC stats for ${username} - Total: ${totalDuration}s, Weekly: ${weeklyDuration}s, Monthly: ${monthlyDuration}s`
        );
    } catch (error) {
        console.error(`❌ Error updating user VC stats: ${error.message}`);
    }
}
