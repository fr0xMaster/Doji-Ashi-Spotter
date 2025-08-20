export function buildSummary(results, errors, totalAnalyzed, duration) {
  const bullish = [];
  const bearish = [];
  const neutral = [];

  results.forEach((res) => {
    if (!res) return;

    if (res.startsWith("🚀")) {
      bullish.push(res);
    } else if (res.startsWith("🔻")) {
      bearish.push(res);
    } else if (res.startsWith("⚖️")) {
      neutral.push(res);
    } else if (res.startsWith("❌")) {
      errors.push(res);
    }
  });

  let summary = `📊 Résumé Analyse H1 (${new Date().toLocaleTimeString()}):\n`;
  summary += `- Analyse effectuée en ${duration}s\n`;
  summary += `- Cryptos analysées : ${totalAnalyzed}\n`;
  summary += `- Signaux détectés : ${results.length}\n`;
  summary += `- Erreurs : ${errors.length}\n\n`;

  if (bullish.length > 0) {
    summary += "🚀 **Dojis haussiers détectés**:\n";
    summary += bullish.join("\n") + "\n\n";
  }

  if (bearish.length > 0) {
    summary += "🔻 **Dojis baissiers détectés**:\n";
    summary += bearish.join("\n") + "\n\n";
  }

  if (neutral.length > 0) {
    summary += "⚖️ **Dojis neutres détectés**:\n";
    summary += neutral.join("\n") + "\n\n";
  }

  if (errors.length > 0) {
    summary += "❌ **Erreurs rencontrées**:\n";
    summary += errors.join("\n") + "\n\n";
  }

  if (
    bullish.length === 0 &&
    bearish.length === 0 &&
    neutral.length === 0 &&
    errors.length === 0
  ) {
    summary += "✅ Aucun signal détecté.";
  }

  return summary.trim();
}
