function toHeikinAshi(candles) {
  const ha = [];
  candles.forEach((c, i) => {
    if (i === 0) {
      ha.push({ ...c });
    } else {
      const prev = ha[i - 1];
      const close = (c.open + c.high + c.low + c.close) / 4;
      const open = (prev.open + prev.close) / 2;
      const high = Math.max(c.high, open, close);
      const low = Math.min(c.low, open, close);
      ha.push({ timestamp: c.timestamp, open, high, low, close });
    }
  });
  return ha;
}

module.exports = { toHeikinAshi };
