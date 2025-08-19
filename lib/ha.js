export function calculateHA(candles) {
  const haCandles = [];
  let prevClose = candles[0].close;

  candles.forEach((c) => {
    const haClose = (c.open + c.high + c.low + c.close) / 4;
    const haOpen = (prevClose + (c.open + c.close) / 2) / 2;
    const haHigh = Math.max(c.high, haOpen, haClose);
    const haLow = Math.min(c.low, haOpen, haClose);

    haCandles.push({
      timestamp: c.timestamp,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
    prevClose = haClose;
  });

  return haCandles;
}

export function detectDoji(haCandles, threshold = 0.1) {
  // Doji : ouverture et fermeture très proches
  return haCandles.filter(
    (c) => Math.abs(c.close - c.open) / (c.high - c.low) < threshold
  );
}
