const { RSI } = require("technicalindicators");

function computeRSI(candles, period = 14) {
  const closes = candles.map((c) => c.close);
  return RSI.calculate({ values: closes, period });
}

module.exports = { computeRSI };
