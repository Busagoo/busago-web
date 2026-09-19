import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedByArea, type ServiceArea } from "@/lib/services";
import ServiceCard from "./ServiceCard";

const AREAS_ORDEN: ServiceArea[] = [
  "ATENCION_CLIENTE",
  "ADMINISTRACION_OPERATIVA",
  "COMERCIAL_VENTAS",
];

import type { Service } from "@prisma/client";
import ServiciosDestacadosClient from "./ServiciosDestacadosClient";

export default async function ServiciosDestacados() {
  const byArea = await getFeaturedByArea();
  const destacados = AREAS_ORDEN.map((area) => byArea[area]?.[0]).filter(Boolean) as Service[];

  return (
    <section id="servicios-destacados" className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-accent-cyan/15 blur-[130px]" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-500/15 blur-[130px]" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Lo que más resolvemos</span>
          <h2 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            Automatizaciones listas para tu operación diaria
          </h2>
          <p className="mt-5 text-balance text-ink-muted md:text-lg">
            Una automatización por área de negocio, de las que más implementamos.
          </p>
        </div>

        <ServiciosDestacadosClient destacados={destacados} />

        <div className="mt-12 flex justify-center">
          <Link href="/servicios" className="btn-pill-outline">
            Ver todos los servicios
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
