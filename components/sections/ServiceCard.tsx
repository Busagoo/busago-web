"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, FileText } from "lucide-react";
import type { Service } from "@prisma/client";

interface ServiceCardProps {
  service: Service;
  index: number;
  onRequestPdf?: (service: Service) => void;
}

export default function ServiceCard({ service, index, onRequestPdf }: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (index % 6) * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl md:rounded-3xl border border-white/15 bg-gradient-to-b from-[#131b4e]/80 via-[#0b1033]/90 to-[#070a21]/95 p-6 md:p-7 shadow-xl transition-all duration-300 hover:border-accent-cyan/60 hover:shadow-[0_0_35px_-5px_rgba(94,230,216,0.25)] hover:from-[#182363]/90 backdrop-blur-xl"
      >
        {/* Subtle Ambient Hover Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-accent-cyan/20 blur-[50px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-brand-500/20 blur-[50px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            {service.imagenUrl && (
              <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-inner">
                <Image
                  src={service.imagenUrl}
                  alt={service.tituloServicio}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-gradient-to-br from-accent-cyan/20 to-brand-500/20 text-accent-cyan shadow-[0_0_15px_-3px_rgba(94,230,216,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:border-accent-cyan [&_svg]:h-5 [&_svg]:w-5"
                dangerouslySetInnerHTML={{ __html: service.iconoSvg }}
              />
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-[11px] font-semibold text-brand-200">
                <Sparkles className="h-3 w-3 text-accent-cyan" />
                {service.categoria}
              </span>
            </div>

            <h3 className="mb-2.5 text-pretty font-display text-lg font-bold leading-snug text-white group-hover:text-accent-cyan transition-colors">
              {service.tituloServicio}
            </h3>

            <p className="mb-6 text-pretty text-xs sm:text-sm leading-relaxed text-slate-300/90">
              {service.descripcionCorta}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {onRequestPdf ? (
              <button
                type="button"
                onClick={() => onRequestPdf(service)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/15 px-3.5 py-1.5 text-xs font-semibold text-accent-cyan transition-all hover:bg-accent-cyan/25 hover:text-white hover:shadow-[0_0_15px_-3px_rgba(94,230,216,0.4)]"
              >
                <FileText className="h-3.5 w-3.5" />
                Recibir propuesta PDF
              </button>
            ) : null}

            <Link
              href="/#plan-a-medida"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-accent-cyan transition-colors"
            >
              Solicitar flujo
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
