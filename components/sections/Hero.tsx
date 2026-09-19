"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, MessageCircle, FileSpreadsheet, PhoneCall } from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import LogoMarquee from "./LogoMarquee";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  useEffect(() => {
    if (typeof window !== "undefined" && (!window.location.hash || window.location.hash === "#inicio")) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-44">
      {/* Resplandor ambiental multicolor de iluminación */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-500/25 via-accent-cyan/20 to-transparent blur-[160px]" />
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-accent-cyan/15 blur-[140px]" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-brand-500/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-8 px-6 lg:max-w-[1600px] lg:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mb-6 hidden items-center gap-3 lg:flex"
          >
            <span className="eyebrow border-accent-cyan/30 shadow-[0_0_20px_rgba(94,230,216,0.2)]">
              #AutomatizamosTuOperación
            </span>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mb-5 flex items-center gap-3 rounded-full border border-accent-cyan/30 bg-gradient-to-r from-brand-500/10 via-accent-cyan/10 to-transparent py-1.5 pl-1.5 pr-4 shadow-[0_0_25px_rgba(94,230,216,0.15)] backdrop-blur-xl lg:mb-8"
          >
            <span className="flex -space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-base-900 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                <MessageCircle className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 ring-2 ring-base-900 shadow-[0_0_10px_rgba(67,86,253,0.4)]">
                <FileSpreadsheet className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-cyan ring-2 ring-base-900 shadow-[0_0_10px_rgba(94,230,216,0.5)]">
                <PhoneCall className="h-3.5 w-3.5 text-base-900" />
              </span>
            </span>
            <span className="text-xs font-semibold text-white">
              Ofrecemos +20 flujos automatizados
            </span>
          </motion.div>

          <motion.h1
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,3.9vw,4rem)] text-white"
          >
            Sistemas que trabajan
            <span className="block font-hero text-[0.92em] font-normal text-accent-cyan drop-shadow-[0_0_35px_rgba(94,230,216,0.45)]">
              por vos.
            </span>
          </motion.h1>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 max-w-[60ch] space-y-2 text-pretty text-base leading-relaxed text-ink-muted md:text-lg lg:mt-8 lg:space-y-4"
          >
            <p>
              Ayudamos a empresas a eliminar tareas manuales y repetitivas con agentes de IA
              que atienden, responden y procesan por vos, las 24 horas.
            </p>
            <p>
              Combinamos ingeniería de automatización y modelos de IA aplicados a atención al
              cliente, administración operativa y ventas, con resultados medibles desde el
              primer mes.
            </p>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-6 flex flex-col gap-4 sm:flex-row lg:mt-10"
          >
            <Link href="/#plan-a-medida" className="btn-pill shadow-[0_0_30px_rgba(67,86,253,0.4)]">
              Contactanos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="#demos-agentes"
              className="relative group inline-flex items-center justify-center gap-2.5 rounded-full border border-accent-cyan/60 bg-gradient-to-r from-brand-500/20 via-accent-cyan/20 to-brand-500/20 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_35px_rgba(94,230,216,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan hover:shadow-[0_0_50px_rgba(94,230,216,0.6)] hover:scale-105"
            >
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
              </span>
              <span className="bg-gradient-to-r from-white via-slate-100 to-accent-cyan bg-clip-text text-transparent">
                Nuestros Agentes en Vivo
              </span>
              <div className="flex items-center text-accent-cyan transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </div>
            </Link>
          </motion.div>

          <div className="mt-8 w-full lg:hidden">
            <LogoMarquee />
          </div>
        </div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <HeroCarousel />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-4 hidden w-44 rounded-2xl border border-accent-cyan/30 bg-base-900/80 p-2.5 shadow-[0_0_30px_rgba(67,86,253,0.3)] backdrop-blur-xl lg:block"
          >
            <Image
              src="/hero-float-eficiencia.webp"
              alt="+50% de eficiencia"
              width={534}
              height={308}
              sizes="176px"
              className="h-auto w-full rounded-xl"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute bottom-2 right-2 hidden w-32 rounded-xl border border-brand-500/30 bg-base-900/80 p-2 shadow-[0_0_30px_rgba(94,230,216,0.25)] backdrop-blur-xl lg:block lg:-top-4 lg:bottom-auto lg:-right-4 lg:w-44 lg:rounded-2xl lg:p-2.5"
          >
            <Image
              src="/hero-float-tiempo.webp"
              alt="420hrs de tiempo operativo ahorrado este mes"
              width={400}
              height={451}
              sizes="176px"
              className="h-auto w-full object-contain rounded-xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
