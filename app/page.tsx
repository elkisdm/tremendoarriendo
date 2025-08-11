import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { COMING_SOON } from "../lib/flags";
import { getBaseUrl } from "@lib/site";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "Arrienda con 0% comisión",
  description:
    "Arrienda departamentos con 0% de comisión. Compara, agenda visita y arrienda fácil.",
  alternates: { canonical: `${baseUrl}/` },
  openGraph: {
    title: "Arrienda con 0% comisión",
    description:
      "Arrienda departamentos con 0% de comisión. Compara, agenda visita y arrienda fácil.",
    url: `${baseUrl}/`,
    siteName: "Elkis Realtor",
    type: "website",
  },
};

export default function HomePage() {
  // Si COMING_SOON está habilitado, hacer redirect HTTP a /coming-soon
  if (COMING_SOON) {
    redirect('/coming-soon');
  }

  return (
    <main id="main-content" role="main">
      <div className="container mx-auto px-4 py-8">
        <h1>Hommie - 0% Comisión</h1>
        <p>Sitio funcionando correctamente</p>
      </div>
    </main>
  );
}
