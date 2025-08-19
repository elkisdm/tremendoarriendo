import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@lib/theme-context";

export const metadata: Metadata = {
  title: {
    default: "Elkis Realtor · 0% Comisión",
    template: "%s | Elkis Realtor",
  },
  description: "Arrienda departamentos con 0% de comisión. Compara, agenda visita y arrienda fácil.",
};

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

// Script para prevenir parpadeo de tema durante hidratación
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      
      // Siempre usar light como default para consistencia
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Fallback a light si hay error
      document.documentElement.classList.remove('dark');
    }
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body 
        className="min-h-screen bg-bg text-text"
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
