import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fetchCandles } from "./lib/ccxtHelper.js";
import { calculateHA } from "./lib/ha.js";
import { isDoji } from "./lib/isDoji.js";
import { calculateRSI } from "./lib/rsi.js";
import { sendMessage } from "./lib/telegram.js";
import { symbols } from "./lib/symbols.js";
import { symbolForHL, symbolForTG } from "./lib/format.js";
import { buildSummary } from "./lib/summary.js";

const logFilePath = path.resolve("./error.log"); // Fichier de log

async function analyzeSymbol(symbol) {
  const tf = "1h";
  // Récupération des 50 dernières bougies pour le calcul du RSI
  const candles = await fetchCandles(symbol, tf, 20);
  const haCandles = calculateHA(candles);

  const lastCandle = haCandles[haCandles.length - 1];
  const lastClosePrices = haCandles.map((c) => c.close);
  const rsi = calculateRSI(lastClosePrices);
  const lastRSI = rsi[rsi.length - 1];

  const { isDoji: dojiDetected, details } = isDoji(lastCandle);

  if (dojiDetected && lastRSI < 30) {
    const message = `🚨 ${symbolForTG(
      symbol
    )} - Doji détecté (RSI = ${lastRSI.toFixed(2)})\n${details}`;
    return message;
  } else {
    return null; // Pas de signal
  }
}

// Analyse toutes les heures a H+01min "1 * * * *"
cron.schedule("*/5 * * * *", async () => {
  const startTime = Date.now();
  console.log("🔎 Lancement de l’analyse H1 pour toutes les cryptos...");
  fs.appendFileSync(
    logFilePath,
    `[${new Date().toISOString()}] ${"🔎 Lancement de l’analyse H1 pour toutes les cryptos..."}\n`
  );

  const results = [];
  const errors = [];
  let totalAnalyzed = 0;
  for (const symbol of symbols) {
    try {
      totalAnalyzed++;
      const signal = await analyzeSymbol(symbolForHL(symbol));
      if (signal) results.push(signal);
    } catch (error) {
      console.error(`⚠️ Erreur sur ${symbolForTG(symbol)} :`, error.message);
      // Écriture dans le fichier log
      fs.appendFileSync(
        logFilePath,
        `[${new Date().toISOString()}] ${error.message}\n`
      );
      errors.push(errorMessage);
      continue;
    }
  }
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2); // en secondes
  const summary = buildSummary(results, errors, totalAnalyzed, duration);
  sendMessage(summary);
  console.log(summary);
  fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ${summary}\n`);
});
