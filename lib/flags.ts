// Sistema de flags unificado - SOLO archivo JSON (commit & push deploy)
import featureFlags from '../config/feature-flags.json';

export const COMING_SOON = Boolean(featureFlags.comingSoon);
