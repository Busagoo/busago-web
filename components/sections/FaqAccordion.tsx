"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import FaqChat from "./FaqChat";

export type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Acordeón de preguntas frecuentes tradicionales */}
      <div className="overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-[#0e1642]/80 via-[#080d2b]/95 to-[#120a2e]/80 p-2 sm:p-3 shadow-[0_0_50px_-15px_rgba(67,86,253,0.25)] backdrop-blur-2xl">
        <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-base-900/60">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.question}
                className={`transition-all duration-300 ${
                  isOpen
                    ? "bg-gradient-to-r from-brand-500/25 via-accent-cyan/20 to-brand-500/10 border-l-4 border-l-accent-cyan shadow-[0_0_30px_rgba(94,230,216,0.2)]"
                    : "hover:bg-white/[0.04] border-l-4 border-l-transparent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors sm:px-6"
                >
                  <span
                    className={`text-pretty font-display text-base font-semibold transition-colors duration-300 ${
                      isOpen ? "text-accent-cyan drop-shadow-[0_0_12px_rgba(94,230,216,0.3)]" : "text-white hover:text-accent-cyan/90"
                    }`}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-accent-cyan/20 text-accent-cyan shadow-[0_0_15px_rgba(94,230,216,0.4)] rotate-180"
                        : "bg-white/5 text-ink-subtle hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[68ch] text-pretty px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bloque del Agente IA de Preguntas Frecuentes */}
      <div className="relative overflow-hidden rounded-3xl border border-accent-cyan/50 bg-gradient-to-br from-[#0d1b40]/90 via-[#081030]/95 to-[#160c38]/90 p-5 shadow-[0_0_60px_-10px_rgba(94,230,216,0.25)] backdrop-blur-2xl sm:p-7">
        {/* Glow de esquina */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-cyan/20 blur-[70px]" />

        <div className="relative flex items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/30 to-brand-500/30 text-accent-cyan shadow-[0_0_20px_rgba(94,230,216,0.3)] ring-1 ring-accent-cyan/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                ¿No está tu pregunta? Preguntá a nuestro agente IA en vivo
              </h3>
              <p className="text-xs text-ink-muted hidden sm:block">
                Respuestas instantáneas en tiempo real basadas en nuestra tecnología.
              </p>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1 text-[11px] font-semibold text-accent-cyan">
            <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
            IA Activa 24/7
          </span>
        </div>
        <FaqChat />
      </div>
    </div>
  );
}
