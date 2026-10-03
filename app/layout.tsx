import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import MotionProvider from "@/components/layout/MotionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import LiveKitVoiceWidget from "@/components/layout/LiveKitVoiceWidget";
import "./globals.css";

// Sólo los pesos que el sitio realmente usa: cada peso extra es otro archivo
// de fuente en la ruta crítica.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

// Greater Theory: display del H1 del hero, únicamente.
//
// LICENCIA: el archivo original vino con licencia demo de uso personal
// (ver app/fonts/LICENSE-GreaterTheory.txt). Para uso comercial hay que
// comprarla en https://brandsemut.com/product/greater-theory/
//
// Es una fuente de caja única: las minúsculas dibujan las mismas formas que
// las mayúsculas, así que todo lo que la use sale en versales. Tampoco trae
// ¿ ni ¡, por eso no se aplica a títulos en español con interrogación.
const greaterTheory = localFont({
  src: "./fonts/GreaterTheory.woff2",
  variable: "--font-hero",
  display: "swap",
  weight: "400",
  // Space Grotesk como respaldo: si la fuente no carga, el H1 no salta de
  // tamaño de forma brusca.
  adjustFontFallback: false,
  fallback: ["var(--font-sans)", "system-ui", "sans-serif"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.busago.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Busago | Agencia de Automatizaciones con Inteligencia Artificial",
    template: "%s | Busago",
  },
  description:
    "Busago diseña e implementa automatizaciones de procesos con IA para empresas: atención al cliente, administración operativa y ventas. Agentes de IA, RAG, OCR y automatización de flujos de trabajo en Latam.",
  keywords: [
    "automatización de procesos con IA",
    "agentes de IA para atención al cliente",
    "eficiencia operativa empresas",
    "agencia de automatizaciones IA",
    "inteligencia artificial para empresas Latam",
    "automatización de tickets",
    "OCR facturas con IA",
    "cualificación de leads con IA",
  ],
  authors: [{ name: "Busago" }],
  creator: "Busago",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Busago",
    title: "Busago | Agencia de Automatizaciones con Inteligencia Artificial",
    description:
      "Implementamos agentes de IA y automatizaciones de procesos para atención al cliente, administración y ventas. Eficiencia operativa real, medible desde el primer mes.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Busago" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Busago | Agencia de Automatizaciones con Inteligencia Artificial",
    description:
      "Agentes de IA y automatizaciones de procesos para atención al cliente, administración y ventas.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
  // Los iconos los resuelve el App Router desde app/icon.png y
  // app/apple-icon.png. Antes esto apuntaba a /favicon.svg, que no existe.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${spaceGrotesk.variable} ${greaterTheory.variable}`}>
      <body className="font-sans">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand-500 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <MotionProvider>
          <Navbar />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppButton />
        </MotionProvider>
        <LiveKitVoiceWidget />
      </body>
    </html>
  );
}
