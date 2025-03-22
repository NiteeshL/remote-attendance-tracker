const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  REDIRECT_URI,
  JWT_SECRET
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

router.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "✅ Logged out successfully" });
});

router.get("/user", (req, res) => {
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

module.exports = router;
