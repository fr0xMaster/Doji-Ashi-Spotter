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
    details: `Open=${Number(candle.open).toFixed(4)}, Close=${Number(
      candle.close
    ).toFixed(4)}, High=${Number(candle.high).toFixed(4)}, Low=${Number(
      candle.low
    ).toFixed(4)}, Body=${bodySize.toFixed(4)}, Range=${candleRange.toFixed(
      4
    )}, Ratio=${ratio.toFixed(4)}`,
  };
}
