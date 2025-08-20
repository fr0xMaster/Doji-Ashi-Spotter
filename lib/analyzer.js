import { fetchCandles } from "./ccxtHelper.js";
import { calculateHA } from "./ha.js";
import { isDoji } from "./isDoji.js";
import { calculateRSI } from "./rsi.js";
import { symbolForTG } from "./format.js";

export async function analyzeSymbol(symbol) {
  const tf = "1h";

  try {
    // On récupère 20 bougies pour avoir assez de données RSI
    const candles = await fetchCandles(symbol, tf, 20);
    const haCandles = calculateHA(candles);

    const lastCandle = haCandles[haCandles.length - 1];
    const lastClosePrices = haCandles.map((c) => c.close);
    const rsi = calculateRSI(lastClosePrices);
    const lastRSI = rsi[rsi.length - 1];

    const { isDoji: dojiDetected, details } = isDoji(lastCandle);

    if (dojiDetected) {
      if (lastRSI < 30) {
        // 📉 RSI bas → Doji haussier
        return `🚀 ${symbolForTG(
          symbol
        )} - Doji HAUSSIER détecté - RSI = ${lastRSI.toFixed(2)} - ${details}`;
      } else if (lastRSI > 70) {
        // 📈 RSI haut → Doji baissier
        return `🔻 ${symbolForTG(
          symbol
        )} - Doji BAISSIER détecté - RSI = ${lastRSI.toFixed(2)} - ${details}`;
      } else {
        // ⚖️ RSI neutre
        return `⚖️ ${symbolForTG(
          symbol
        )} - Doji NEUTRE détecté - RSI = ${lastRSI.toFixed(2)} - ${details}`;
      }
    }

    return null; // Pas de signal si pas de doji
  } catch (err) {
    return `❌ Erreur ${symbol}: ${err.message}`;
  }
}
