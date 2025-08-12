import type { MetadataRoute } from 'next';

function readComingSoonSafe(): boolean {
  try {
    // Importación segura con fallback
    const { featureFlags } = require('@/config/feature-flags');
    return Boolean(featureFlags?.comingSoon);
  } catch {
    // Fallback seguro: permitir crawl por defecto
    return false;
  }
}

export default function robots(): MetadataRoute.Robots {
  const comingSoon = readComingSoonSafe();
  
  if (comingSoon) {
    return { 
      rules: { 
        userAgent: '*', 
        disallow: '/' 
      } 
    };
  }
  
  return { 
    rules: { 
      userAgent: '*', 
      allow: '/' 
    } 
  };
}
