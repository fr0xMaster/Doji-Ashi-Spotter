const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
require("chartjs-chart-financial");
const fs = require("fs");
const { computeRSI } = require("./rsi");

const width = 1000;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function generateChartWithRSI(candles, symbol) {
  const labels = candles.map((c) => c.timestamp);
  const rsiValues = computeRSI(candles);
  const rsiData = new Array(candles.length - rsiValues.length)
    .fill(null)
    .concat(rsiValues);

  const config = {
    type: "candlestick",
    data: {
      labels,
      datasets: [
        {
          type: "candlestick",
          label: "Heikin Ashi",
          data: candles.map((c) => ({
            x: c.timestamp,
            o: c.open,
            h: c.high,
            l: c.low,
            c: c.close,
          })),
          yAxisID: "y",
          color: { up: "green", down: "red", unchanged: "gray" },
        },
        {
          type: "line",
          label: "RSI",
          data: rsiData,
          borderColor: "blue",
          yAxisID: "rsi",
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          type: "line",
          label: "RSI 70",
          data: new Array(candles.length).fill(70),
          borderColor: "red",
          borderDash: [5, 5],
          yAxisID: "rsi",
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          type: "line",
          label: "RSI 30",
          data: new Array(candles.length).fill(30),
          borderColor: "green",
          borderDash: [5, 5],
          yAxisID: "rsi",
          pointRadius: 0,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { type: "time", time: { unit: "hour" } },
        y: { position: "left", title: { display: true, text: "Prix" } },
        rsi: {
          position: "right",
          min: 0,
          max: 100,
          grid: { drawOnChartArea: false },
          title: { display: true, text: "RSI" },
        },
      },
    },
  };

  const fileName = `${symbol.replace("/", "_")}_ha_rsi.png`;
  const image = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync(fileName, image);
  return fileName;
}

module.exports = { generateChartWithRSI };
