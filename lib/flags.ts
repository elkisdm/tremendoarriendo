import flagsFromRepo from '../config/feature-flags.json' assert { type: 'json' };

// Si COMING_SOON está en las env de Vercel tendrá prioridad; si no, usa el archivo del repo.
export const COMING_SOON =
  process.env.COMING_SOON === 'true'
    ? true
    : process.env.COMING_SOON === 'false'
      ? false
      : Boolean(flagsFromRepo.comingSoon);
