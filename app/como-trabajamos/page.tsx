import type { Metadata } from "next";
import {
  Search,
  FileCode2,
  Cpu,
  CheckCircle2,
  Activity,
  Zap,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Clock,
  Database,
  ArrowRight,
} from "lucide-react";
import PlanPersonalizado from "@/components/sections/PlanPersonalizado";
import TrustBadges from "@/components/sections/TrustBadges";

export const metadata: Metadata = {
  title: "Cómo Trabajamos | Metodología de Implementación de IA — Busago",
  description:
    "Conocé nuestro proceso de 5 pasos para implementar agentes de Inteligencia Artificial y automatizaciones a medida en tu empresa, desde el diagnóstico inicial hasta el seguimiento continuo.",
};

const PROCESS_STEPS = [
  {
    stepNumber: "01",
    eyebrow: "Diagnóstico inicial sin costo",
    title: "Relevamiento de Procesos y Cuellos de Botella",
    description:
      "Analizamos tu operación actual: dónde pierde tiempo tu equipo, qué consultas se repiten y qué datos no se están cargando al CRM. Mapeamos el flujo ideal a automatizar.",
    icon: Search,
    deliverable: "Mapa de proceso actual vs. proceso automatizado",
    mockup: (
      <MockupCard title="Diagnóstico Operativo">
        <MockupRow label="Cuello de Botella" value="Atención manual WhatsApp (60% tiempo)" />
        <MockupRow label="Pérdida de Prospectos" value="35% de leads sin responder en horario nocturno" />
        <MockupRow label="Solución Recomendada" value="Agente de Triaje y Agendamiento 24/7" />
      </MockupCard>
    ),
  },
  {
    stepNumber: "02",
    eyebrow: "Propuesta en 48hs",
    title: "Arquitectura Técnica y Cotización Transparente",
    description:
      "En menos de 48 horas te entregamos una propuesta detallada con el alcance exacto, los sistemas a conectar (Supabase, WhatsApp, CRM, ERP) y la estimación de ahorro financiero en USD.",
    icon: FileCode2,
    deliverable: "Documento de alcance técnico + ROI estimado",
    mockup: (
      <MockupCard title="Propuesta Técnica (48hs)">
        <MockupRow label="Sistemas a Integrar" value="WhatsApp Business + Supabase + Google Calendar" />
        <MockupRow label="Tiempo de Desarrollo" value="2 a 4 semanas" />
        <div className="mt-2 flex items-center justify-between rounded-xl bg-accent-cyan/10 p-2.5 text-xs text-accent-cyan font-semibold border border-accent-cyan/20">
          <span>Ahorro Estimado:</span>
          <span>~80 horas/mes liberadas</span>
        </div>
      </MockupCard>
    ),
  },
  {
    stepNumber: "03",
    eyebrow: "Desarrollo ágil",
    title: "Construcción de Flujos e Integraciones",
    description:
      "Desarrollamos los agentes de IA, entrenamos sus prompts con tu conocimiento interno y configuramos las integraciones seguras mediante APIs o Webhooks sin interrumpir a tu equipo.",
    icon: Cpu,
    deliverable: "Agentes entrenados + Conectores activos",
    mockup: (
      <MockupCard title="Estado de Integraciones">
        <div className="space-y-2 text-xs">
          <StatusRow label="API Supabase & Base de Datos" status="Conectado" />
          <StatusRow label="Prompts & Anti-alucinación" status="Entrenado" />
          <StatusRow label="Webhooks WhatsApp & CRM" status="Validado" />
        </div>
      </MockupCard>
    ),
  },
  {
    stepNumber: "04",
    eyebrow: "Pruebas y calibración",
    title: "Entrenamiento del Tono y Pruebas en Vivo",
    description:
      "Hacemos pruebas controladas con tu equipo para ajustar la personalidad del agente, afinar sus respuestas ante casos borde y asegurar que la transición sea 100% natural.",
    icon: CheckCircle2,
    deliverable: "Validación de respuestas con feedback real",
    mockup: (
      <MockupCard title="Calibración del Agente">
        <MockupRow label="Tono de Marca" value="Profesional, cercano y resolutivo" />
        <MockupRow label="Tasa de Acierto en Pruebas" value="98.4%" />
        <MockupRow label="Derivación Humana" value="Regla activa para casos complejos" />
      </MockupCard>
    ),
  },
  {
    stepNumber: "05",
    eyebrow: "Despliegue & Monitoreo",
    title: "Puesta en Producción (2-4 semanas) y Soporte Continuo",
    description:
      "Lanzamos la automatización a producción con acompañamiento técnico en tiempo real, tableros de control para tu equipo y mantenimiento preventivo continuo.",
    icon: Activity,
    deliverable: "Operación autónoma 24/7 + Dashboard",
    mockup: (
      <MockupCard title="Monitoreo en Tiempo Real">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Uptime Garantizado:</span>
          <span className="font-bold text-accent-cyan">99.9%</span>
        </div>
        <MockupRow label="Consultas Procesadas" value="2.450 esta semana" />
        <MockupRow label="Soporte Dedicado" value="Monitoreo continuo activo" />
      </MockupCard>
    ),
  },
];

export default function ComoTrabajamosPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
        {/* Ambient background lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[150px]" />
          <div className="absolute right-1/4 top-1/3 h-[450px] w-[450px] rounded-full bg-accent-cyan/15 blur-[140px]" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow w-fit border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">
              <Zap className="h-3.5 w-3.5 text-accent-cyan" />
              Metodología Transparente
            </span>
            <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-5xl bg-gradient-to-r from-white via-slate-100 to-brand-200 bg-clip-text text-transparent">
              Cómo transformamos la operación de tu empresa paso a paso
            </h1>
            <p className="mt-5 text-balance text-ink-muted md:text-lg">
              Un proceso ágil, estructurado y sin sorpresas. Desde el relevamiento inicial gratuito hasta ver los primeros resultados reales en producción.
            </p>
          </div>

          <div className="relative mx-auto mt-20 max-w-4xl">
            {/* Central Vertical Connector Line */}
            <div className="absolute left-6 top-3 hidden h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-brand-500 via-accent-cyan to-brand-700/30 md:block" />

            <div className="space-y-16">
              {PROCESS_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.stepNumber} className="relative grid gap-6 md:grid-cols-[3.5rem_1fr] md:gap-8">
                    {/* Badge Icon for Desktop */}
                    <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent-cyan/30 bg-brand-900/60 text-accent-cyan backdrop-blur-xl shadow-lg md:flex">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
                      <div>
                        <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-cyan">
                          <Icon className="h-4 w-4 md:hidden" />
                          Paso {step.stepNumber} — {step.eyebrow}
                        </span>
                        <h2 className="font-display text-xl font-bold leading-snug text-white md:text-2xl">
                          {step.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                          {step.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/90">
                          <CheckCircle2 className="h-4 w-4 text-accent-cyan" />
                          <span>Entregable: {step.deliverable}</span>
                        </div>
                      </div>

                      {step.mockup}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />
      <PlanPersonalizado />
    </>
  );
}

function MockupCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-base-900/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 hover:border-brand-500/30">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">{title}</p>
      {children}
    </div>
  );
}

function MockupRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-1.5 text-xs">
      <span className="text-ink-subtle">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/5">
      <span className="text-ink-muted">{label}</span>
      <span className="inline-flex items-center gap-1 rounded-md bg-accent-cyan/10 px-2 py-0.5 text-[11px] font-semibold text-accent-cyan">
        <CheckCircle2 className="h-3 w-3" />
        {status}
      </span>
    </div>
  );
}
