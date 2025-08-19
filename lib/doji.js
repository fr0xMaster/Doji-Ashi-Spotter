function isDoji(candle, threshold = 0.1) {
  const body = Math.abs(candle.close - candle.open);
  const range = candle.high - candle.low;
  return range > 0 && body / range < threshold;
}

module.exports = { isDoji };
