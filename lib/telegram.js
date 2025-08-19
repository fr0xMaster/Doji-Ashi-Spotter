import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

export function sendMessage(message) {
  return bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
}
