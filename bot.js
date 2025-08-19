const SYMBOLS = ["BTC/USDT", "ETH/USDT", "BNB/USDT"];
const TIMEFRAME = "1h";
const LIMIT = 50;
const INTERVAL_MIN = 30;

const { fetchData } = require("./lib/fetchData");
const { toHeikinAshi } = require("./lib/heikinAshi");
const { isDoji } = require("./lib/doji");
const { computeRSI } = require("./lib/rsi");
const { generateChartWithRSI } = require("./lib/chart");
const { sendTelegram } = require("./lib/telegram");

async function runBotMultiAssets() {
  for (let symbol of SYMBOLS) {
    try {
      const candles = await fetchData(symbol, TIMEFRAME, LIMIT);
      const haCandles = toHeikinAshi(candles);
      const last = haCandles[haCandles.length - 1];

      let signal = `Pas de doji sur ${symbol}`;
      if (isDoji(last)) {
        signal = `📌 Doji détecté sur ${symbol} (${TIMEFRAME})`;
      }

      const chartPath = await generateChartWithRSI(
        haCandles.slice(-50),
        symbol
      );
      await sendTelegram(signal, chartPath);
    } catch (err) {
      console.error(`Erreur pour ${symbol} :`, err);
    }
  }
}

// Lancement manuel
runBotMultiAssets();

// Lancement automatique toutes les X minutes
setInterval(runBotMultiAssets, INTERVAL_MIN * 60 * 1000);
