import { Metadata } from 'next';
import { getBaseUrl } from '@lib/site';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'Próximamente - Hommie',
  description: 'Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.',
  alternates: { canonical: `${baseUrl}/coming-soon` },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Próximamente - Hommie',
    description: 'Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.',
    url: `${baseUrl}/coming-soon`,
    siteName: 'Elkis Realtor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Próximamente - Hommie',
    description: 'Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.',
  },
};
