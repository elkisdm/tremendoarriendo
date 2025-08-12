import type { MetadataRoute } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';

function readComingSoonSafe(): boolean {
  try {
    // Leer el archivo TypeScript directamente
    const flagsPath = join(process.cwd(), 'config', 'feature-flags.ts');
    const flagsContent = readFileSync(flagsPath, 'utf8');
    const comingSoonMatch = flagsContent.match(/comingSoon:\s*(true|false)/);
    return comingSoonMatch ? comingSoonMatch[1] === 'true' : false;
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
