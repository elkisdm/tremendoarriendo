import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arriendo Sin Comisión | Departamentos Nuevos | Hommie",
  description: "Arrienda departamentos nuevos sin comisión de corretaje. Proyectos multifamily verificados con promociones especiales. Precios actualizados y proceso 100% digital.",
  keywords: [
    "arriendo sin comisión",
    "departamentos nuevos",
    "arriendo sin corretaje",
    "proyectos multifamily",
    "promociones arriendo",
    "0% comisión",
    "arriendo directo",
    "departamentos Santiago"
  ],
  openGraph: {
    title: "Arriendo Sin Comisión | Departamentos Nuevos | Hommie",
    description: "Arrienda departamentos nuevos sin comisión de corretaje. Proyectos multifamily verificados con promociones especiales.",
    type: "website",
    locale: "es_CL",
    siteName: "Hommie",
    images: [
      {
        url: "/images/og-arriendo-sin-comision.jpg",
        width: 1200,
        height: 630,
        alt: "Arriendo Sin Comisión - Departamentos Nuevos"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Arriendo Sin Comisión | Departamentos Nuevos | Hommie",
    description: "Arrienda departamentos nuevos sin comisión de corretaje. Proyectos multifamily verificados con promociones especiales.",
    images: ["/images/og-arriendo-sin-comision.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/arrienda-sin-comision",
  },
};

