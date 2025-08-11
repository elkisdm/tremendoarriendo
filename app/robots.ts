import type { MetadataRoute } from 'next';
import { COMING_SOON } from '../lib/flags';

export default function robots(): MetadataRoute.Robots {
  if (COMING_SOON) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' } };
}
