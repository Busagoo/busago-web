"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowUpRight, Clock, DollarSign, TrendingUp } from "lucide-react";
import CountUp from "./CountUp";

export default function RoiCalculator() {
  const [empleados, setEmpleados] = useState<number>(3);
  const [horasDiarias, setHorasDiarias] = useState<number>(4);
  const [salarioUsd, setSalarioUsd] = useState<number>(600);

  // Cálculos de ROI
  const horasTotalesMes = empleados * horasDiarias * 22;
  const costoHoraUsd = salarioUsd / 160;
  const costoManualMes = Math.round(costoHoraUsd * horasTotalesMes);
  const ahorroEstimadoUsd = Math.round(costoManualMes * 0.75); // 75% de ahorro estimado
  const horasLiberadasMes = Math.round(horasTotalesMes * 0.80); // 80% de horas liberadas

  return (
    <section id="calculadora-roi" className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[700px] -translate-y-1/2 rounded-full bg-brand-500/10 blur-[140px]" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <Calculator className="h-3.5 w-3.5" />
            Calculadora de ROI Operativo
          </span>
          <h2 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            ¿Cuánto dinero y tiempo está perdiendo tu empresa?
          </h2>
          <p className="mt-4 text-balance text-white/60 md:text-lg">
            Ajustá los parámetros de tu equipo para estimar cuánto podés ahorrar cada mes al
            automatizar tareas repetitivas con agentes de IA de Busago.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Controles / Sliders */}
          <div className="card-glow p-7 lg:col-span-6 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-white">
                  Personal en atención o tareas manuales:
                </label>
                <span className="font-display text-xl font-bold text-accent-cyan">
                  {empleados} {empleados === 1 ? "persona" : "personas"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={empleados}
                onChange={(e) => setEmpleados(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-white/10 accent-brand-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-white">
                  Horas diarias por persona en tareas repetitivas:
                </label>
                <span className="font-display text-xl font-bold text-accent-cyan">
                  {horasDiarias} hs / día
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={horasDiarias}
                onChange={(e) => setHorasDiarias(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-white/10 accent-brand-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-white">
                  Costo mensual estimado por empleado ($ USD):
                </label>
                <span className="font-display text-xl font-bold text-accent-cyan">
                  ${salarioUsd} USD / mes
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="50"
                value={salarioUsd}
                onChange={(e) => setSalarioUsd(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-white/10 accent-brand-400 cursor-pointer"
              />
            </div>

            <p className="text-xs text-white/40 border-t border-white/10 pt-4 leading-relaxed">
              * Estimación basada en 22 días hábiles al mes y un 75% de automatización efectiva de tareas repetitivas.
            </p>
          </div>

          {/* Resultados de ROI */}
          <div className="lg:col-span-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                key={`ahorro-${ahorroEstimadoUsd}`}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl border border-brand-400/30 bg-brand-500/10 p-6 shadow-lift"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/20 text-brand-200">
                  <DollarSign className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                  Ahorro estimado mensual
                </p>
                <p className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
                  $<CountUp value={ahorroEstimadoUsd} /> <span className="text-lg font-normal text-white/60">USD</span>
                </p>
                <p className="mt-1 text-xs text-white/50">Recuperación de costos directa cada mes</p>
              </motion.div>

              <motion.div
                key={`horas-${horasLiberadasMes}`}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl border border-accent-cyan/30 bg-accent-cyan/10 p-6 shadow-lift"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-cyan/20 text-accent-cyan">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                  Horas liberadas al mes
                </p>
                <p className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
                  <CountUp value={horasLiberadasMes} /> <span className="text-lg font-normal text-white/60">horas</span>
                </p>
                <p className="mt-1 text-xs text-white/50">Tiempo reasignado a tareas estratégicas</p>
              </motion.div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-base-900/80 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">+65% Eficiencia Operativa</p>
                  <p className="text-xs text-white/50">Atención inmediata 24/7 sin fricción</p>
                </div>
              </div>

              <a href="#plan-a-medida" className="btn-pill shrink-0 w-full sm:w-auto text-center">
                Ahorrar este tiempo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
