import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Muy pronto — 0% comisión',
  description: 'Estamos preparando la nueva experiencia de arriendo sin letra chica.',
  robots: { index: false, follow: false }
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
