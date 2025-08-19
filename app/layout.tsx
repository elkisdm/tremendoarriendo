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

// Script que se ejecuta antes de la hidratación para evitar parpadeo
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'light';
      var html = document.documentElement;
      
      // Aplicar tema inmediatamente
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.add('light');
      }
    } catch (e) {
      // Fallback a light theme
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
