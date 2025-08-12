import type { Metadata } from "next";
import { Suspense } from "react";
import { FlagsAdminClient } from "./FlagsAdminClient";

export const metadata: Metadata = {
  title: "Admin - Feature Flags",
  description: "Panel de administración para feature flags",
  robots: {
    index: false,
    follow: false,
  },
};

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
        <p className="text-[var(--subtext)]">Cargando configuración...</p>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl bg-[var(--soft)]/90 ring-1 ring-white/10 p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 bg-gray-600 rounded mb-2 w-1/3"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3"></div>
              </div>
              <div className="ml-4">
                <div className="h-6 w-11 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FlagsAdminPage() {
  return (
    <main id="main-content" role="main" className="min-h-screen bg-[var(--bg)]">
      <Suspense fallback={<LoadingFallback />}>
        <FlagsAdminClient />
      </Suspense>
    </main>
  );
}
