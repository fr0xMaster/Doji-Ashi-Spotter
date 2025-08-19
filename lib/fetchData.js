const ccxt = require("ccxt");

async function fetchData(symbol, timeframe = "1h", limit = 50) {
  const exchange = new ccxt.binance();
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  return ohlcv.map((c) => ({
    timestamp: new Date(c[0]),
    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4],
  }));
}

module.exports = { fetchData };
