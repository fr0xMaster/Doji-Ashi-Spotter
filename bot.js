import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fetchCandles } from "./lib/ccxtHelper.js";
import { calculateHA } from "./lib/ha.js";
import { calculateRSI } from "./lib/rsi.js";
import { sendMessage } from "./lib/telegram.js";
import { symbols } from "./lib/symbols.js";
import { symbolForHL, symbolForTG } from "./lib/format.js";

const logFilePath = path.resolve("./error.log"); // Fichier de log

async function analyzeSymbol(symbol) {
  const tf = "1h";
  // Récupération des 100 dernières bougies pour le calcul du RSI
  const candles = await fetchCandles(symbol, tf, 100);
  const haCandles = calculateHA(candles);

  const lastCandle = haCandles[haCandles.length - 1];
  const lastClosePrices = haCandles.map((c) => c.close);
  const rsi = calculateRSI(lastClosePrices);
  const lastRSI = rsi[rsi.length - 1];

  // Vérifier si la dernière bougie est un Doji
  const isDoji =
    Math.abs(lastCandle.close - lastCandle.open) /
      (lastCandle.high - lastCandle.low) <
    0.1;

  if (isDoji && lastRSI < 30) {
    const message = `🚨 ${symbolForTG(
      symbol
    )} - ${tf} : Doji détecté sur la dernière bougie avec RSI = ${lastRSI.toFixed(
      2
    )}`;
    sendMessage(message);
  } else {
    sendMessage(
      `Pas de Doji pour ${symbolForTG(
        symbol
      )} sur UT ${tf} . RSI: ${lastRSI.toFixed(2)}`
    );
  }
}

// Analyse toutes les 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("🔎 Lancement de l’analyse H1 pour toutes les cryptos...");

  for (const symbol of symbols) {
    try {
      await analyzeSymbol(symbolForHL(symbol));
    } catch (error) {
      console.error(`⚠️ Erreur sur ${symbolForTG(symbol)} :`, error.message);
      // Écriture dans le fichier log
      fs.appendFileSync(
        logFilePath,
        `[${new Date().toISOString()}] ${error.message}\n`
      );
      sendMessage(`⚠️ Erreur sur ${symbolForTG(symbol)} : ${error.message}`);
      continue;
    }
  }
});
