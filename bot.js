import cron from "node-cron";
import fs from "fs";
import path from "path";
import { analyzeSymbol } from "./lib/analyzer.js";
import { sendMessage } from "./lib/telegram.js";
import { symbols } from "./lib/symbols.js";
import { symbolForHL, symbolForTG } from "./lib/format.js";
import { buildSummary } from "./lib/summary.js";
import { shouldRun3D } from "./lib/scheduler.js";

const logFilePath = path.resolve("./error.log"); // Fichier de log

const jobs = [
  { tf: "1h", cron: "59 * * * *", label: "H1" }, // 23:59, 0:59, 1:59, …
  { tf: "4h", cron: "58 1,5,9,13,17,21 * * *", label: "H4" }, // 1:58, 5:58, 9:58, …
  { tf: "12h", cron: "57 1,13 * * *", label: "H12" }, // 1:57, 13:57
  { tf: "1d", cron: "56 1 * * *", label: "1D" }, // tous les jours à 1:56
  { tf: "3d", cron: "55 1 * * *", label: "3D", is3D: true }, // tous les 3 jours à 1:55 (scheduler vérifie le jour)
  { tf: "1w", cron: "54 1 * * 1", label: "1W" }, // tous les lundis à 1:54
];

for (const job of jobs) {
  cron.schedule(
    job.cron,
    async () => {
      if (job.is3D && !shouldRun3D()) {
        console.log("⏭️ Analyse 3D ignorée aujourd’hui (pas le bon jour).");
        return;
      }

      const startTime = Date.now();
      console.log(`🔎 Lancement de l’analyse ${job.label}...`);
      fs.appendFileSync(
        logFilePath,
        `[${new Date().toISOString()}] ${`🔎 Lancement de l’analyse ${job.label}...`}\n`
      );
      const results = [];
      const errors = [];
      let totalAnalyzed = 0;

      for (const symbol of symbols) {
        try {
          totalAnalyzed++;
          const signal = await analyzeSymbol(symbolForHL(symbol), job.tf);
          if (signal) results.push(signal);
        } catch (error) {
          console.error(
            `⚠️ Erreur sur ${symbolForTG(symbol)} :`,
            error.message
          );
          fs.appendFileSync(
            logFilePath,
            `[${new Date().toISOString()}] ${error.message}\n`
          );
          errors.push(error.message);
          continue;
        }
      }

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      const summary = buildSummary(
        results,
        job.tf,
        errors,
        totalAnalyzed,
        duration
      );
      sendMessage(summary);
      console.log(summary);
      fs.appendFileSync(
        logFilePath,
        `[${new Date().toISOString()}] ${summary}\n`
      );
    },
    {
      timezone: "Europe/Paris", // Force les heures françaises
    }
  );
}
