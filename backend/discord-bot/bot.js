require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('Pong! 🏓');
    } else if (message.content === '!hello') {
        message.reply(`Hello, ${message.author.username}! 👋`);
    } else if (message.content === '!help') {
        message.reply('Available Commands: `!ping`, `!hello`, `!help`');
    }
});

client.login(process.env.DISCORD_TOKEN);
