import fs from "fs";
import path from "path";

const configPath = path.resolve("./lib/config.json");

export function shouldRun3D() {
  try {
    const raw = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(raw);

    const referenceDate = new Date(config.reference3d);
    const today = new Date();

    // calcul en jours (arrondi vers le bas)
    const diffDays = Math.floor(
      (today - referenceDate) / (1000 * 60 * 60 * 24)
    );

    return diffDays % 3 === 0; // vrai tous les 3 jours
  } catch (err) {
    console.error("Erreur lecture config 3D:", err.message);
    return false;
  }
}
