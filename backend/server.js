require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const userReportRoutes = require("./routes/userReport");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use("/user/report", userReportRoutes);

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  REDIRECT_URI,
  JWT_SECRET,
  MONGO_URI,
} = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !REDIRECT_URI || !JWT_SECRET || !MONGO_URI) {
  console.error("❌ Missing required environment variables! Check .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/auth/discord", (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify email`;
  res.redirect(discordAuthUrl);
});

app.get("/auth/discord/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("❌ No authorization code provided!");

  try {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userResponse.data;

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    console.log(`✅ User ${user.username} authenticated.`);
    res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.error("❌ Discord OAuth Error:", error.response?.data || error.message);
    res.status(400).send("OAuth failed!");
  }
});

app.get("/auth/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "✅ Logged out successfully" });
});

app.get("/auth/user", (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "❌ Unauthorized" });

    const user = jwt.verify(token, JWT_SECRET);
    res.json(user);
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    res.status(401).json({ message: "❌ Invalid or expired token" });
  }
});

app.get("/user/activity/:userId/:guildId", async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
