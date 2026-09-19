"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@prisma/client";
import type { ServiceArea } from "@/lib/services";
import { AREA_LABELS, AREA_ORDER } from "@/lib/services";
import ServiceCard from "@/components/sections/ServiceCard";
import TrustBadges from "@/components/sections/TrustBadges";
import PlanPersonalizado from "@/components/sections/PlanPersonalizado";
import ListExpandModal, { type ListExpandItem } from "@/components/ui/ListExpandModal";
import RequestPdfModal from "@/components/sections/RequestPdfModal";
import { Sparkles, Layers, Filter, CheckCircle2, Grid } from "lucide-react";
import { useRouter } from "next/navigation";

const ALL_AREAS: ServiceArea[] = [...AREA_ORDER, "A_MEDIDA"];

interface ServiciosContentProps {
  services: Service[];
  allSectors: string[];
  activeArea?: ServiceArea;
  activeSector?: string;
  sectorsToRender: string[];
  bySector: Record<string, Service[]>;
}

export default function ServiciosContent({
  services,
  allSectors,
  activeArea,
  activeSector,
  sectorsToRender,
  bySector,
}: ServiciosContentProps) {
  const router = useRouter();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedPdfService, setSelectedPdfService] = useState<Service | null>(null);

  // Mapear sectores para el modal en cuadrícula
  const listItems: ListExpandItem[] = [
    {
      id: "ALL",
      title: "Todos los Sectores",
      subtitle: `Ver la totalidad de las ${services.length} automatizaciones`,
      badge: `${services.length} servicios`,
    },
    ...allSectors.map((sec) => {
      const count = bySector[sec]?.length ?? 0;
      return {
        id: sec,
        title: sec,
        subtitle: `Automatizaciones específicas para el rubro de ${sec}`,
        badge: `${count} ${count === 1 ? "automatización" : "automatizaciones"}`,
      };
    }),
  ];

  function handleSelectModalItem(item: ListExpandItem) {
    if (item.id === "ALL") {
      router.push("/servicios");
    } else {
      router.push(`/servicios?sector=${encodeURIComponent(item.id)}`);
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0a0e2a] via-[#070a1e] to-[#050716] text-white">
      {/* Page-wide ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-40 h-[600px] w-[600px] rounded-full bg-brand-500/15 blur-[160px]" />
        <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-accent-cyan/15 blur-[160px]" />
        <div className="absolute top-3/4 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[150px]" />
      </div>

      <header className="relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-20 bg-gradient-to-b from-[#0e1540] via-[#090e2b] to-[#070a1f]">
        {/* Header Ambient Glow pods */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[150px]" />
          <div className="absolute right-1/4 top-1/3 h-[450px] w-[450px] rounded-full bg-accent-cyan/20 blur-[140px]" />
        </div>

        <div className="container relative z-10 text-center">
          <span className="eyebrow w-fit mx-auto border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan shadow-[0_0_15px_-3px_rgba(94,230,216,0.3)]">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
            Catálogo Oficial de Automatizaciones
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight md:text-6xl bg-gradient-to-r from-white via-slate-100 to-accent-cyan bg-clip-text text-transparent">
            Todas nuestras soluciones de IA
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-slate-300 md:text-lg">
            Explorá el detalle de cada automatización que implementamos, organizada por sector de negocio y área operativa. Si tu empresa requiere un flujo específico, diseñamos un{" "}
            <Link href="/#plan-a-medida" className="text-accent-cyan underline underline-offset-4 hover:text-white font-semibold">
              plan a medida
            </Link>
            .
          </p>

          {/* Filter Toolbar Container ("Todas nuestras soluciones de IA" panel) */}
          <div className="relative mt-10 max-w-5xl mx-auto rounded-3xl md:rounded-[2.5rem] border border-accent-cyan/30 bg-gradient-to-br from-[#121b54]/90 via-[#0a1038]/95 to-[#160e3d]/90 p-6 md:p-8 backdrop-blur-3xl shadow-[0_0_50px_-10px_rgba(94,230,216,0.2)] overflow-hidden">
            {/* Inner panel ambient glows */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-accent-cyan/20 blur-[70px]" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-brand-500/20 blur-[70px]" />

            {/* Header Toolbar Actions */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-cyan">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtrar por Sector de Industria</span>
              </div>

              {/* Botón para Abrir Modal en Cuadrícula */}
              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-accent-cyan/30 hover:shadow-[0_0_15px_-3px_rgba(94,230,216,0.4)]"
              >
                <Grid className="h-3.5 w-3.5 text-accent-cyan" />
                Ver todos los sectores en grilla
              </button>
            </div>

            {/* Filtros por Sector */}
            <div className="relative z-10">
              <div className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto px-1 py-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
                <Link
                  href="/servicios"
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    !activeSector && !activeArea
                      ? "border border-accent-cyan bg-accent-cyan/25 text-white shadow-[0_0_20px_-3px_rgba(94,230,216,0.4)] scale-105"
                      : "border border-white/15 bg-white/[0.05] text-slate-300 hover:border-accent-cyan/50 hover:bg-white/[0.1] hover:text-white"
                  }`}
                >
                  Todos los Sectores ({services.length})
                </Link>
                {allSectors.map((sec) => (
                  <Link
                    key={sec}
                    href={`/servicios?sector=${encodeURIComponent(sec)}`}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                      activeSector === sec
                        ? "border border-accent-cyan bg-accent-cyan/25 text-white shadow-[0_0_20px_-3px_rgba(94,230,216,0.4)] scale-105"
                        : "border border-white/15 bg-white/[0.05] text-slate-300 hover:border-accent-cyan/50 hover:bg-white/[0.1] hover:text-white"
                    }`}
                  >
                    {sec}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filtros por Área Operativa */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/15">
              <div className="flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Layers className="h-3.5 w-3.5" />
                <span>Filtrar por Área Operativa</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {ALL_AREAS.map((area) => (
                  <Link
                    key={area}
                    href={`/servicios?area=${area}`}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                      activeArea === area
                        ? "border-brand-400 bg-brand-500/30 text-white shadow-[0_0_15px_-3px_rgba(67,86,253,0.4)]"
                        : "border-white/15 bg-white/[0.04] text-slate-300 hover:border-white/30 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {AREA_LABELS[area]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-28">
        <div className="container space-y-16">
          {sectorsToRender.map((sectorName) => {
            const sectorServices = bySector[sectorName] ?? [];
            if (sectorServices.length === 0) return null;

            return (
              <section
                key={sectorName}
                aria-labelledby={`sector-${sectorName}`}
                className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-brand-500/30 bg-gradient-to-br from-[#0e1642]/85 via-[#080d2b]/95 to-[#120a2e]/85 p-6 md:p-10 shadow-[0_0_60px_-15px_rgba(67,86,253,0.3)] backdrop-blur-2xl"
              >
                {/* Ambient Glows Inside Sector Container */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-cyan/15 blur-[100px]" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-brand-500/20 blur-[100px]" />

                {/* Sector Header Banner */}
                <div className="relative z-10 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan shadow-[0_0_15px_-3px_rgba(94,230,216,0.3)]">
                      <Sparkles className="h-5 w-5 text-accent-cyan" />
                    </div>
                    <div>
                      <h2
                        id={`sector-${sectorName}`}
                        className="font-display text-2xl font-bold md:text-3xl text-white tracking-tight"
                      >
                        {sectorName}
                      </h2>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_-3px_rgba(94,230,216,0.2)]">
                    <CheckCircle2 className="h-4 w-4" />
                    {sectorServices.length} {sectorServices.length === 1 ? "automatización" : "automatizaciones"}
                  </span>
                </div>

                {/* Grid de Tarjetas de Servicios */}
                <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sectorServices.map((service, i) => (
                    <article key={service.id}>
                      <ServiceCard
                        service={service}
                        index={i}
                        onRequestPdf={(srv) => setSelectedPdfService(srv)}
                      />
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <TrustBadges />
      <PlanPersonalizado />

      {/* Modal Selector de Sectores en Cuadrícula */}
      <ListExpandModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title="Explorar Sectores de Industria"
        subtitle="Seleccioná cualquier rubro para filtrar el catálogo de automatizaciones"
        items={listItems}
        selectedId={activeSector ?? "ALL"}
        onSelect={handleSelectModalItem}
      />

      {/* Modal para Solicitar Propuesta PDF */}
      <RequestPdfModal
        service={selectedPdfService}
        isOpen={Boolean(selectedPdfService)}
        onClose={() => setSelectedPdfService(null)}
      />
    </div>
  );
}
