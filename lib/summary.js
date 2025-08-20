export function buildSummary(results, errors, totalAnalyzed, duration) {
  let summary = `📊 Résumé Analyse H1 (${new Date().toLocaleTimeString()}):\n`;
  summary += `- Analyse effectuée en ${duration}s\n`;
  summary += `- Cryptos analysées : ${totalAnalyzed}\n`;
  summary += `- Signaux détectés : ${results.length}\n`;
  summary += `- Erreurs : ${errors.length}\n\n`;

  // Partie signaux
  if (results.length > 0) {
    summary += results.join("\n") + "\n\n";
  } else {
    summary += "✅ Aucun signal détecté.\n\n";
  }

  // Partie erreurs
  if (errors.length > 0) {
    summary += "⚠️ Erreurs rencontrées :\n";
    summary += errors.join("\n");
  }

  return summary;
}
