const User = require("../database/models/User");

module.exports = async (member) => {
  const userId = member.id;
  const username = member.user.username;

  const existingUser = await User.findOne({ userId });

  if (!existingUser) {
    await User.create({
      userId,
      username,
      totalActiveTime: 0,
    });
  }
};
