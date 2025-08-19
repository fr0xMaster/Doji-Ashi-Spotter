import ccxt from "ccxt";

export async function fetchCandles(symbol, timeframe = "1h", limit = 50) {
  const exchange = new ccxt.hyperliquid();
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  return ohlcv.map((c) => ({
    timestamp: c[0],
    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4],
    volume: c[5],
  }));
}
