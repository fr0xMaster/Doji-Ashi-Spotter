export function isDoji(candle, threshold = 0.1) {
  const bodySize = Math.abs(candle.close - candle.open);
  const candleRange = candle.high - candle.low;

  if (candleRange === 0) {
    return { isDoji: false, details: "Candle range is zero (flat candle)" };
  }

  const ratio = bodySize / candleRange;
  const isDoji = ratio < threshold;

  return {
    isDoji,
    details: `Doji Size (%) =${(ratio * 100).toFixed(
      2
    )}% - Doji Size ($) =${bodySize.toFixed(4)}$`,
  };
}
