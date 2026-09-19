import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import PlanPersonalizado from "@/components/sections/PlanPersonalizado";

export const metadata: Metadata = {
  title: "Casos de éxito — Busago",
  description:
    "Todavía no tenemos casos publicados: por eso el primer cliente se lleva 75% de descuento.",
};

export default function CasosPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-4 pt-32 md:pb-8 md:pt-48">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[140px]" />
        </div>

        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              Oferta de lanzamiento
            </span>
            <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
              Todavía no tenemos clientes que mostrarte
            </h1>
            <p className="mt-5 text-balance text-white/60 md:text-lg">
              Somos una agencia nueva, así que no vamos a inventarte casos de éxito que no
              existen. Lo que sí ofrecemos es el mismo nivel de compromiso que le pondríamos a
              cualquier cliente grande, y un beneficio real para quien se anime a ser el primero.
            </p>
            <div className="mx-auto mt-8 w-fit rounded-2xl border border-brand-400/30 bg-brand-500/10 px-8 py-5">
              <p className="font-display text-2xl font-bold text-white md:text-3xl">
                75% de descuento
              </p>
              <p className="mt-1 text-sm text-white/60">en tu primera automatización, por ser nuestro primer cliente</p>
            </div>
          </div>
        </div>
      </section>

      <PlanPersonalizado />
    </>
  );
}
