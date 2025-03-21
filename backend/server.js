require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

app.get("/auth/discord", (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify email`;
  res.redirect(discordAuthUrl);
});

app.get("/auth/discord/callback", async (req, res) => {
  const code = req.query.code;

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

    res.cookie("auth_token", token, { httpOnly: true, secure: false });
    res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.error("Discord OAuth Error:", error.message);
    res.status(400).send("OAuth failed!");
  }
});

app.get("/auth/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out" });
});

app.get("/auth/user", (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const user = jwt.verify(token, JWT_SECRET);
    res.json(user);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
