const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
require("dotenv").config();

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(TOKEN);

async function sendTelegram(message, imagePath) {
  await bot.sendMessage(CHAT_ID, message);
  if (fs.existsSync(imagePath)) {
    await bot.sendPhoto(CHAT_ID, imagePath);
  }
}

module.exports = { sendTelegram };
