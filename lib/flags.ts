// Sistema de flags simplificado - prioridad a variables de entorno
import featureFlags from '../config/feature-flags.json';

export const COMING_SOON = process.env.COMING_SOON === 'true' || featureFlags.comingSoon;
