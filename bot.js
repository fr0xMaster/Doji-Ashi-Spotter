import cron from "node-cron";
import fs from "fs";
import path from "path";
import { analyzeSymbol } from "./lib/analyzer.js";
import { sendMessage } from "./lib/telegram.js";
import { symbols } from "./lib/symbols.js";
import { symbolForHL, symbolForTG } from "./lib/format.js";
import { buildSummary } from "./lib/summary.js";

const logFilePath = path.resolve("./error.log"); // Fichier de log

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
