"use client";

import { ShieldCheck, Zap, Lock, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const BADGES = [
  {
    icon: Zap,
    title: "Propuesta Técnica en 48hs",
    desc: "Recibí la evaluación y el plan de arquitectura estimado en 48hs. La integración completa toma de 2 a 4 semanas.",
  },
  {
    icon: ShieldCheck,
    title: "Resultados Demostrables",
    desc: "Evaluamos los avances en vivo. Si la solución no optimiza tu tiempo operativo, ajustamos la propuesta sin costo.",
  },
  {
    icon: Lock,
    title: "Privacidad y Encriptación",
    desc: "Tus bases de datos y conversaciones en Supabase se mantienen encriptadas y protegidas bajo estándares estrictos.",
  },
  {
    icon: Headphones,
    title: "Soporte Técnico Continuo",
    desc: "Monitoreo constante de tus modelos de IA y soporte especializado para asegurar un uptime del 99.9%.",
  },
];

export default function TrustBadges() {
  return (
    <section className="relative border-y border-white/10 bg-gradient-to-r from-[#0e1642]/90 via-[#080d2b]/95 to-[#120a2e]/90 py-16 backdrop-blur-xl shadow-lg overflow-hidden">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[90px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent-cyan/15 blur-[90px]" />

      <div className="container relative z-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative flex items-start gap-4 rounded-2xl border border-white/15 bg-gradient-to-b from-[#131b4e]/60 to-[#090e2c]/80 p-5 backdrop-blur-lg transition-all duration-300 hover:border-accent-cyan/50 hover:bg-[#182363]/80 hover:shadow-[0_0_25px_-5px_rgba(94,230,216,0.2)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-cyan/40 bg-gradient-to-br from-accent-cyan/20 to-brand-500/20 text-accent-cyan shadow-[0_0_12px_-3px_rgba(94,230,216,0.3)] transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white group-hover:text-accent-cyan transition-colors">
                    {badge.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300/90">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
