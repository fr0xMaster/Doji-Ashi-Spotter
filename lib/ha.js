export function calculateHA(candles) {
  const haCandles = [];

  candles.forEach((c, i) => {
    const haClose = (c.open + c.high + c.low + c.close) / 4;

    let haOpen;
    if (i === 0) {
      // Première bougie : initialisation
      haOpen = (c.open + c.close) / 2;
    } else {
      // Ensuite : dépend de la bougie HA précédente
      haOpen = (haCandles[i - 1].open + haCandles[i - 1].close) / 2;
    }

    const haHigh = Math.max(c.high, haOpen, haClose);
    const haLow = Math.min(c.low, haOpen, haClose);

    haCandles.push({
      timestamp: c.timestamp,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
  });

  return haCandles;
}
