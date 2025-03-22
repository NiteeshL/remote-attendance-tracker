const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
