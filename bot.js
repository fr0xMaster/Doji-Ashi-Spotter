import { fetchCandles } from "./lib/ccxtHelper.js";
import { calculateHA, detectDoji } from "./lib/ha.js";
import { calculateRSI } from "./lib/rsi.js";
import { sendMessage } from "./lib/telegram.js";

async function main() {
  const symbol = "BTC/USDT";
  const candles = await fetchCandles(symbol, "1h", 50);
  const haCandles = calculateHA(candles);

  const dojis = detectDoji(haCandles);
  const rsi = calculateRSI(haCandles.map((c) => c.close));

  if (dojis.length > 0) {
    sendMessage(
      `🚨 Doji détecté sur ${symbol}! Dernier RSI: ${rsi[
        rsi.length - 1
      ].toFixed(2)}`
    );
  } else {
    sendMessage(
      `Pas de Doji pour ${symbol}. RSI: ${rsi[rsi.length - 1].toFixed(2)}`
    );
  }
}

main();
