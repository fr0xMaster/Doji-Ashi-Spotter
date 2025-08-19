export function isDoji(candle, threshold = 0.1) {
  const bodySize = Math.abs(candle.close - candle.open);
  const candleRange = candle.high - candle.low;

  if (candleRange === 0) {
    return { isDoji: false, debug: "Candle range is zero (flat candle)" };
  }

  const ratio = bodySize / candleRange;
  const isDoji = ratio < threshold;

  return {
    isDoji,
    debug: `Open=${candle.open}, Close=${candle.close}, High=${
      candle.high
    }, Low=${candle.low}, Body=${bodySize.toFixed(
      4
    )}, Range=${candleRange.toFixed(4)}, Ratio=${ratio.toFixed(
      4
    )}, Threshold=${threshold}`,
  };
}
