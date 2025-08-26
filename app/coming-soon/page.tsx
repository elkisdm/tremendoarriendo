import type { Metadata } from "next";
import { BackgroundFX } from '@components/visual/BackgroundFX';
import { ComingSoonHero } from '@components/marketing/ComingSoonHero';

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
