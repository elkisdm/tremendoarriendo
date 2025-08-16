import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hommie · 0% Comisión",
    template: "%s | Hommie",
  },
  description: "Arrienda departamentos con 0% de comisión. Compara, agenda visita y arrienda fácil.",
};

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`dark ${inter.className}`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className="min-h-screen bg-gray-900 text-gray-100"
        suppressHydrationWarning={true}
      >
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        {children}
      </body>
    </html>
  );
}
