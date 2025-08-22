import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

// Sélectionne les bonnes variables en fonction de l'environnement
const isProd = process.env.NODE_ENV === "production";

const TELEGRAM_TOKEN = isProd
  ? process.env.TELEGRAM_TOKEN
  : process.env.TELEGRAM_TOKEN_DEV;

const bot = new TelegramBot(TELEGRAM_TOKEN);

export function sendMessage(message) {
  return bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
}
