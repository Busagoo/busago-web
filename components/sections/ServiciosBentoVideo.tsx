"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Play } from "lucide-react";
import LazyVideo from "./LazyVideo";
import VoiceAgentDemo from "./VoiceAgentDemo";
import ChatDemo from "./ChatDemo";

type Demo = "voice" | "chat";

type Card = {
  /** Ruta sin extensión: LazyVideo arma .webp / .webm / .mp4 a partir de ella. */
  video: string;
  tag: string;
  title: string;
  description: string;
  demo?: Demo;
  isNew?: boolean;
};

const CARDS: Card[] = [
  {
    video: "/videos/servicio-voz",
    tag: "Soporte de voz",
    title: "Agentes de Voz Inteligentes 24/7",
    description:
      "Atención telefónica automatizada capaz de mantener conversaciones fluidas, agendar citas y consultar bases de datos en tiempo real.",
    demo: "voice",
    isNew: true,
  },
  {
    video: "/videos/servicio-whatsapp",
    tag: "Multicanal",
    title: "Asistentes IA para WhatsApp y Web (RAG)",
    description:
      "Respuestas instantáneas, precisas y fundamentadas en la documentación técnica de tu empresa para resolver consultas frecuentes al instante.",
    demo: "chat",
    isNew: true,
  },
  {
    video: "/videos/servicio-comercial",
    tag: "Comercial",
    title: "Calificación y Scoring de Leads con IA",
    description:
      "Tus prospectos entrantes se evalúan, clasifican y avanzan automáticamente por tu embudo de ventas en tiempo real sin intervención manual.",
  },
];

export default function ServiciosBentoVideo() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = scrollerRef.current;
        if (!node) return;
        const center = node.scrollLeft + node.clientWidth / 2;
        let closest = 0;
        let min = Infinity;
        Array.from(node.children).forEach((child, i) => {
          const c = child as HTMLElement;
          const mid = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.abs(mid - center);
          if (d < min) {
            min = d;
            closest = i;
          }
        });
        setActive(closest);
      });
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function goTo(i: number) {
    const child = scrollerRef.current?.children[i] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  return (
    <section className="section-y relative overflow-hidden bg-transparent">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Servicios Destacados</span>
          <h2 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            Automatizaciones que ya están en producción
          </h2>
          <p className="mt-5 text-balance text-ink-muted md:text-lg">
            Tres agentes de IA trabajando hoy en operaciones comerciales, de soporte y atención al cliente.
          </p>
        </div>

        <div
          id="demos-agentes"
          ref={scrollerRef}
          onMouseLeave={() => setHovered(null)}
          className="no-scrollbar relative -mx-6 mt-12 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 scroll-mt-28 md:scroll-mt-36 md:mt-16 md:gap-5 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {CARDS.map((card, i) => (
            <BentoCard
              key={card.title}
              card={card}
              index={i}
              isHovered={hovered === i}
              onHover={() => setHovered(i)}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
          {CARDS.map((card, i) => (
            <button
              key={card.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a ${card.title}`}
              aria-current={active === i}
              className="group flex h-11 items-center px-1.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  active === i ? "w-7 bg-accent-cyan" : "w-1.5 bg-white/25 group-hover:bg-white/45"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-10 md:mt-14 flex justify-center">
          <Link
            href="/servicios"
            className="btn-pill-outline hover:border-accent-cyan/50 hover:text-accent-cyan hover:shadow-[0_0_25px_rgba(94,230,216,0.3)] transition-all duration-300"
          >
            Ver más servicios
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  card,
  index,
  isHovered,
  onHover,
}: {
  card: Card;
  index: number;
  isHovered: boolean;
  onHover: () => void;
}) {
  const [demoOpen, setDemoOpen] = useState(false);
  const DemoIcon = card.demo === "chat" ? MessageCircle : Play;
  const demoLabel = card.demo === "chat" ? "Probar el asistente" : "Hablar con el agente";

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onHover}
      className={`group relative flex w-[78vw] max-w-[330px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-base-850 shadow-card transition-[flex-grow] duration-500 ease-out sm:w-[62vw] md:w-[46vw] lg:h-[460px] lg:w-auto lg:max-w-none lg:basis-0 ${
        isHovered ? "lg:grow-[3]" : "lg:grow-[1]"
      }`}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
        <LazyVideo
          src={card.video}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-base-950/35 transition-colors duration-500 group-hover:bg-base-950/45" />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-base-950 via-base-950/55 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-base-850 to-transparent lg:hidden" />

        {card.isNew && (
          <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-accent-cyan px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-base-900 shadow-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-base-900/70" />
            Nuevo
          </span>
        )}

        {card.demo && (
          <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 lg:flex">
            <span className="whitespace-nowrap rounded-full bg-accent-cyan px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-base-900 shadow-accent">
              Probar gratis
            </span>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              aria-label={demoLabel}
              className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20"
            >
              <span className="absolute inset-0 -z-10 animate-halo rounded-full bg-white/25" />
              <DemoIcon
                className={`h-8 w-8 text-white ${card.demo === "voice" ? "translate-x-0.5" : ""}`}
                fill={card.demo === "voice" ? "currentColor" : "none"}
              />
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex-none lg:p-6">
        <span
          className={`text-xs font-semibold uppercase tracking-wider text-accent-cyan transition-opacity duration-300 ${
            isHovered ? "lg:opacity-100" : "lg:opacity-0"
          }`}
        >
          {card.tag}
        </span>

        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white sm:text-xl">
          {card.title}
        </h3>

        <div
          className={`mt-2 overflow-hidden transition-all duration-300 lg:mt-2 ${
            isHovered ? "lg:max-h-28 lg:opacity-100" : "lg:max-h-0 lg:opacity-0 lg:mt-0"
          }`}
        >
          <p className="text-pretty text-sm leading-relaxed text-ink-muted">{card.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 pt-1 lg:mt-4 lg:justify-center">
          {card.demo && (
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent-cyan px-4 py-2 text-xs font-bold text-base-900 shadow-accent transition-all duration-300 hover:bg-white active:scale-[0.98] lg:hidden"
            >
              <DemoIcon
                className={`h-3.5 w-3.5 ${card.demo === "voice" ? "translate-x-px" : ""}`}
                fill={card.demo === "voice" ? "currentColor" : "none"}
              />
              Probar gratis
            </button>
          )}
          <a
            href="/casos"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/20"
          >
            Ver casos
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {card.demo === "voice" && (
        <VoiceAgentDemo open={demoOpen} onClose={() => setDemoOpen(false)} />
      )}
      {card.demo === "chat" && <ChatDemo open={demoOpen} onClose={() => setDemoOpen(false)} />}
    </motion.article>
  );
}
