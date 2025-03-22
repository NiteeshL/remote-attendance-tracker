const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const connectDB = require("./database/db");

// Load environment variables
dotenv.config();

// Initialize the bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// Database Connection
connectDB();

// Import event handlers
const ready = require("./events/ready");
const messageCreate = require("./events/messageCreate");
const voiceStateUpdate = require("./events/voiceStateUpdate");

// Register event listeners
client.on("ready", ready);
client.on("messageCreate", messageCreate);
client.on("voiceStateUpdate", voiceStateUpdate);


// Log in to Discord
client.login(process.env.DISCORD_BOT_TOKEN);
