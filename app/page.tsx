import { redirect } from "next/navigation";
import { COMING_SOON } from "../lib/flags";

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
