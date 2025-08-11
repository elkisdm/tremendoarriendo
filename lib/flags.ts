// Sistema de flags simplificado para evitar problemas de build
let comingSoonFlag = false;

try {
  // Intentar leer del archivo JSON
  const featureFlags = require('../config/feature-flags.json');
  comingSoonFlag = Boolean(featureFlags.comingSoon);
} catch (error) {
  // Fallback a variable de entorno si el archivo no se puede leer
  comingSoonFlag = process.env.COMING_SOON === 'true';
}

export const COMING_SOON = comingSoonFlag;
