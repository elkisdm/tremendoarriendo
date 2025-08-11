import type { Metadata } from "next";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Próximamente</h1>
        <p className="text-xl">Estamos preparando algo increíble</p>
      </div>
    </div>
  );
}
