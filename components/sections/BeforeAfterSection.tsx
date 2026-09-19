"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, Zap, Clock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function BeforeAfterSection() {
  return (
    <section className="section-y relative overflow-hidden py-24 my-8">
      {/* Outer Glow Background */}
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-brand-500/30 bg-gradient-to-br from-[#0c1238] via-[#090e29] to-[#120a2e] p-8 md:p-14 shadow-[0_0_80px_-20px_rgba(67,86,253,0.35)] backdrop-blur-3xl"
        >
          {/* Vivid Ambient Lighting Spheres */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-500/35 blur-[100px] animate-pulse [animation-duration:5s]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent-cyan/30 blur-[110px] animate-pulse [animation-duration:7s]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />

          {/* Grid pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(94, 230, 216, 0.5) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan shadow-sm">
              <Zap className="h-3.5 w-3.5 text-accent-cyan" />
              Transformación Operativa Real
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl text-white drop-shadow-md">
              El impacto directo en tu operación diaria
            </h2>
            <p className="mt-4 text-pretty text-ink-muted md:text-lg">
              Compará cómo funciona una empresa con procesos manuales vs. una empresa impulsada por agentes de IA autónomos de Busago.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Before Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl border border-red-500/30 bg-gradient-to-b from-red-950/40 via-base-900/90 to-base-950 p-8 backdrop-blur-2xl shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]"
            >
              <div className="flex items-center gap-3 border-b border-red-500/20 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-red-100">Operación Tradicional</h3>
                  <p className="text-xs text-red-300/80">Lenta, manual y dependiente de horarios</p>
                </div>
              </div>

              <ul className="mt-6 space-y-4">
                {[
                  {
                    title: "Respuesta diferida (horas o días)",
                    desc: "Consultas de WhatsApp fuera de horario o los fines de semana quedan sin responder.",
                  },
                  {
                    title: "Pérdida de prospectos calificados",
                    desc: "Leads fríos que terminan comprando en la competencia por tardar en responder.",
                  },
                  {
                    title: "Carga de datos manual",
                    desc: "El equipo pierde el 60% de su tiempo ingresando planillas y pasando datos al CRM.",
                  },
                  {
                    title: "Altos costos para escalar",
                    desc: "Para duplicar la atención necesitas duplicar el personal administrativo.",
                  },
                  {
                    title: "Procesos fragmentados",
                    desc: "Información dispersa en chats, correos y cuadernos sin registro unificado.",
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <div>
                      <span className="font-semibold text-red-100">{item.title}</span>
                      <p className="text-xs text-ink-muted mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* After Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl border border-accent-cyan/50 bg-gradient-to-b from-brand-900/70 via-base-900/90 to-base-900 p-8 backdrop-blur-2xl shadow-[0_0_50px_-10px_rgba(94,230,216,0.3)]"
            >
              <div className="absolute -top-3.5 right-8 rounded-full border border-accent-cyan/50 bg-accent-cyan/20 px-3.5 py-1 text-xs font-semibold text-accent-cyan backdrop-blur-md shadow-lg">
                ✨ Solución integral a medida
              </div>

              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Con Busago IA 24/7</h3>
                  <p className="text-xs text-accent-cyan/90">Automatizado, instantáneo y escalable</p>
                </div>
              </div>

              <ul className="mt-6 space-y-4">
                {[
                  {
                    title: "Respuesta en <3 segundos 24/7",
                    desc: "Agentes de voz y chat responden al instante en WhatsApp, Web y teléfono, los 365 días.",
                  },
                  {
                    title: "Calificación y Agendamiento Autónomo",
                    desc: "La IA filtra prospectos, valida presupuesto y agenda en el Google/Outlook Calendar.",
                  },
                  {
                    title: "Integración directa con tu CRM/Supabase",
                    desc: "Sincronización en tiempo real de leads, notas y estados sin intervención humana.",
                  },
                  {
                    title: "Escalabilidad a costo fijo",
                    desc: "Manejá 10 o 10.000 consultas simultáneas sin incrementar tus costos fijos.",
                  },
                  {
                    title: "Trazabilidad y Reportes en tiempo real",
                    desc: "Control total del pipeline comercial y métricas de conversión centralizadas.",
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-cyan" />
                    <div>
                      <span className="font-semibold text-white">{item.title}</span>
                      <p className="text-xs text-ink-muted mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-ink-muted flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-accent-cyan" /> Implementación estimada: 2 a 4 semanas
                </span>
                <a
                  href="#plan-a-medida"
                  className="btn-pill !py-2 !px-4 text-xs font-medium gap-1.5"
                >
                  Comenzar ahora
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
