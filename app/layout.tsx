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

// Script robusto para prevenir parpadeo inicial y errores de hidratación
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'light';
      var html = document.documentElement;
      
      // Remover clases existentes para evitar conflictos
      html.classList.remove('dark', 'light');
      
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        // Por defecto, mantener light theme para consistencia SSR
        html.classList.add('light');
      }
    } catch (e) {
      // En caso de error, mantener light theme por defecto
      document.documentElement.classList.add('light');
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
          <main className="min-h-screen bg-background text-foreground">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
