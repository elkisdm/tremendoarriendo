import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { BackgroundFX } from '@components/visual/BackgroundFX';

const ComingSoonHero = dynamic(() => import('@components/marketing/ComingSoonHero').then(m => m.ComingSoonHero), { ssr: false });

export const metadata: Metadata = {
  title: "Próximamente - Hommie",
  description: "Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen w-full">
      <BackgroundFX />
      <ComingSoonHero />
    </div>
  );
}
