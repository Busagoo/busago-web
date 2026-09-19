import Link from "next/link";
import { ArrowUpRight, House } from "lucide-react";

export default function NotFoundContent() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-base-950 px-6 py-32">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      >
        <source src="/videos/404.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(5,6,15,0.92)_0%,rgba(10,14,39,0.68)_48%,rgba(5,6,15,0.82)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(67,86,253,0.18),transparent_42%)]" />

      <div className="w-full max-w-3xl text-center">
        <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.24em] text-accent-cyan">
          Error 404
        </p>
        <h1 className="text-balance font-display text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-7xl md:text-8xl">
          Esta página se salió del flujo.
        </h1>
        <p className="mx-auto mt-7 max-w-[42ch] text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
          No encontramos la dirección que buscabas. Volvé al inicio o explorá cómo podemos
          automatizar tu operación.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-pill">
            <House className="h-4 w-4" />
            Volver al inicio
          </Link>
          <Link href="/servicios" className="btn-pill-outline">
            Ver servicios
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}