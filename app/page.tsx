import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import LogoMarquee from "@/components/sections/LogoMarquee";
import TrustBadges from "@/components/sections/TrustBadges";
import CrmMacbookDemo from "@/components/sections/CrmMacbookDemo";
import ServiciosBentoVideo from "@/components/sections/ServiciosBentoVideo";
import SectorSimulator from "@/components/sections/SectorSimulator";
import RoiCalculator from "@/components/sections/RoiCalculator";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import FaqSection from "@/components/sections/FaqSection";
import PlanPersonalizado from "@/components/sections/PlanPersonalizado";

export const dynamic = "force-dynamic";

const FAQ_ITEMS = [
  {
    question: "¿Qué es una automatización con IA, en la práctica?",
    answer:
      "Un flujo que reemplaza una tarea manual y repetitiva (responder, clasificar, cargar datos, cruzar información) por un agente que la resuelve solo, conectado a tus sistemas actuales, y que escala a un humano cuando hace falta.",
  },
  {
    question: "¿Para qué me sirve una automatización con IA?",
    answer:
      "Para reducir drásticamente los costos de mano de obra y escalar tus operaciones sin necesidad de agrandar tu equipo. La IA se encarga de las tareas repetitivas 24/7 (calificar prospectos, responder llamadas y procesar datos), permitiéndote operar con una estructura más ágil, eficiente y rentable.",
  },
  {
    question: "¿Cuánto tarda en implementarse una automatización?",
    answer:
      "El desarrollo e integración completa de una solución a medida toma habitualmente entre 2 y 4 semanas desde el relevamiento inicial, según la cantidad de sistemas a integrar.",
  },
  {
    question: "¿Necesito cambiar mis sistemas actuales?",
    answer:
      "No. Conectamos la automatización a lo que ya usás (Supabase, CRM, ERP, helpdesk, WhatsApp Business) en vez de pedirte que migres a una plataforma nueva.",
  },
  {
    question: "¿Qué pasa si mi proceso no encaja en ningún servicio del catálogo?",
    answer:
      "Lo diseñamos a medida. Contanos el detalle en nuestro cuestionario de Plan a Medida y te devolvemos una propuesta de alcance técnico en menos de 48hs.",
  },
];

export const metadata: Metadata = {
  title: "Busago | Automatización de Procesos con Inteligencia Artificial",
  description:
    "Implementamos agentes de IA para atención al cliente, administración operativa y ventas. Automatizaciones a medida para empresas de Latam, con resultados desde la primera semana.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="hidden lg:block">
        <LogoMarquee />
      </div>
      <TrustBadges />
      <CrmMacbookDemo />
      <ServiciosBentoVideo />
      <SectorSimulator />
      <RoiCalculator />
      <BeforeAfterSection />
      <FaqSection
        eyebrow="Preguntas frecuentes"
        heading="Todo lo que necesitás saber antes de automatizar"
        items={FAQ_ITEMS}
      />
      <PlanPersonalizado />
    </>
  );
}
