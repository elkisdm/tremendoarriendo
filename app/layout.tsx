import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@lib/theme-context";
import { Footer } from "@components/marketing/Footer";
import { getFlagValue } from "@lib/flags";

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

// Script para prevenir parpadeo inicial - solo aplica el tema guardado
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Silenciar errores de localStorage
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
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 bg-background text-foreground">
              {children}
            </main>
            {getFlagValue('FOOTER_ENABLED') && <Footer />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
