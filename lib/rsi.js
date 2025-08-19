import { RSI } from "technicalindicators";

export function calculateRSI(closes, period = 14) {
  return RSI.calculate({ values: closes, period });
}
