// Sistema de flags unificado - archivo JSON + variable de entorno como respaldo
import featureFlags from '../config/feature-flags.json';

// Lee del archivo JSON, con fallback a variable de entorno
const comingSoonFromFile = Boolean(featureFlags.comingSoon);
const comingSoonFromEnv = process.env.COMING_SOON === 'true';

export const COMING_SOON = comingSoonFromFile || comingSoonFromEnv;
