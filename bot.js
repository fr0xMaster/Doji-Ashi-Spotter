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
  { tf: "1h", cron: "1 * * * *", label: "H1" },
  { tf: "4h", cron: "1 2,6,10,14,18,22 * * *", label: "H4" },
  { tf: "12h", cron: "1 2,14 * * *", label: "H12" },
  { tf: "1d", cron: "1 2 * * *", label: "1D" },
  { tf: "3d", cron: "1 2 * * *", label: "3D", is3D: true },
  { tf: "1w", cron: "1 2 * * 1", label: "1W" },
];

for (const job of jobs) {
  cron.schedule(job.cron, async () => {
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
        console.error(`⚠️ Erreur sur ${symbolForTG(symbol)} :`, error.message);
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

    const summary = buildSummary(results, tf, errors, totalAnalyzed, duration);
    sendMessage(summary);
    console.log(summary);
    fs.appendFileSync(
      logFilePath,
      `[${new Date().toISOString()}] ${summary}\n`
    );
  });
}
