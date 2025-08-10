"use client";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // console.error(error);
  }, [error]);

  return (
    <main id="main-content" role="main" className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div role="alert" className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-2">No pudimos cargar la propiedad</h1>
          <p className="text-[var(--subtext)] mb-6">
            {error?.message || "Intenta nuevamente en unos segundos."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--text)] text-[var(--bg)] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            Reintentar
          </button>
        </div>
      </div>
    </main>
  );
}


