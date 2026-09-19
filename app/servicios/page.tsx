import type { Metadata } from "next";
import Link from "next/link";
import { getAllServices, AREA_LABELS, AREA_ORDER, type ServiceArea } from "@/lib/services";
import ServiceCard from "@/components/sections/ServiceCard";
import TrustBadges from "@/components/sections/TrustBadges";
import PlanPersonalizado from "@/components/sections/PlanPersonalizado";
import { Sparkles, Layers, Filter, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo Completo de Automatizaciones e IA — Busago",
  description:
    "Catálogo completo de soluciones de Inteligencia Artificial y automatizaciones operativas de Busago por sector: Inmobiliarias, Clínicas, E-commerce, Gastronomía, Estudios Contables y más.",
  alternates: { canonical: "/servicios" },
};

const ALL_AREAS: ServiceArea[] = [...AREA_ORDER, "A_MEDIDA"];

import ServiciosContent from "@/components/sections/ServiciosContent";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; sector?: string }>;
}) {
  const services = await getAllServices();
  const params = await searchParams;
  const activeArea = params.area as ServiceArea | undefined;
  const activeSector = params.sector as string | undefined;

  // Extraer todos los sectores únicos presentes en los servicios
  const allSectors = Array.from(new Set(services.map((s) => s.categoria)));

  const filteredServices = services.filter((s) => {
    if (activeArea && s.area !== activeArea) return false;
    if (activeSector && s.categoria !== activeSector) return false;
    return true;
  });

  // Agrupar por sector para una presentación impecable
  const bySector = filteredServices.reduce<Record<string, typeof services>>((acc, s) => {
    acc[s.categoria] = [...(acc[s.categoria] ?? []), s];
    return acc;
  }, {});

  const sectorsToRender = activeSector ? [activeSector] : Object.keys(bySector);

  return (
    <ServiciosContent
      services={services}
      allSectors={allSectors}
      activeArea={activeArea}
      activeSector={activeSector}
      sectorsToRender={sectorsToRender}
      bySector={bySector}
    />
  );
}
