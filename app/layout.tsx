import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Hommie · 0% Comisión",
    template: "%s | Hommie",
  },
  description: "Arrienda departamentos con 0% de comisión. Compara, agenda visita y arrienda fácil.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Hommie",
    title: "Hommie · 0% Comisión",
    description: "Arrienda departamentos con 0% de comisión. Compara, agenda visita y arrienda fácil.",
    images: [
      {
        url: "/images/lascondes-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Hommie – 0% comisión",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hommie · 0% Comisión",
    description: "Arrienda departamentos con 0% de comisión. Compara, agenda visita y arrienda fácil.",
    images: ["/images/lascondes-cover.jpg"],
  },
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
      <body className="min-h-screen bg-gray-900 text-gray-100">
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              id="ga4-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
