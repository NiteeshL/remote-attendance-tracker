const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/User");

const router = express.Router();
router.use(cookieParser());

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  REDIRECT_URI,
  JWT_SECRET,
} = process.env;

router.get("/discord", (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify email`;
  res.redirect(discordAuthUrl);
});

router.get("/discord/callback", async (req, res) => {
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

    const { id: userId, username, avatar } = userResponse.data;

    const avatarUrl = avatar
      ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`; // Discord default avatar

    let dbUser = await User.findOneAndUpdate(
      { userId },
      { username, avatar: avatarUrl },
      { new: true, upsert: true }
    );

    const role = dbUser.role || "User"; 

    const tokenPayload = { id: userId, username, role, avatar: avatarUrl };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    console.log(`✅ User ${username} authenticated as ${role}.`);

    const redirectUrl =
      role === "Admin"
        ? "http://localhost:5173/admindashboard"
        : "http://localhost:5173/dashboard";

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Discord OAuth Error:", error.response?.data || error.message);
    res.status(400).send("OAuth failed!");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "✅ Logged out successfully" });
});

function authenticateUser(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "❌ Unauthorized" });

    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    res.status(401).json({ message: "❌ Invalid or expired token" });
  }
}

router.get("/user", authenticateUser, async (req, res) => {
  try {
    const dbUser = await User.findOne({ userId: req.user.id });
    if (!dbUser) return res.status(404).json({ message: "❌ User not found" });

    res.json({ ...req.user, role: dbUser.role, avatar: dbUser.avatar });
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});


router.get("/admin", authenticateUser, async (req, res) => {
  try {
    const dbUser = await User.findOne({ userId: req.user.id });
    if (!dbUser || dbUser.role !== "Admin") {
      return res.status(403).json({ message: "❌ Access Denied: Admins Only" });
    }

    res.json({ message: "✅ Welcome, Admin!", user: req.user });
  } catch (error) {
    console.error("❌ Error verifying admin role:", error.message);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

module.exports = router;
