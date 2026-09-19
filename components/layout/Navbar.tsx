"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useDialog } from "@/lib/use-dialog";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Servicios", href: "/servicios" },
  { label: "Cómo trabajamos", href: "/como-trabajamos" },
  { label: "Plan a medida", href: "/#plan-a-medida" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useDialog(open, () => setOpen(false));

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <div
          className={`flex w-full max-w-6xl items-center justify-between rounded-full border transition-all duration-500 ${
            scrolled
              ? "border-white/10 bg-base-900/80 px-5 py-2.5 shadow-lg shadow-black/20 backdrop-blur-xl"
              : "border-transparent bg-transparent px-5 py-3.5"
          }`}
        >
          <Link href="/" className="flex items-center gap-1.5 font-display text-sm sm:text-lg font-bold tracking-tight shrink-0">
            <Image
              src="/logo.webp"
              alt="Busago"
              width={193}
              height={209}
              priority
              sizes="48px"
              className="h-8 sm:h-11 w-auto"
            />
            <span>Busago.studio</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Botón llamativo Agentes en Vivo (Visible en mobile y desktop) */}
            <Link
              href="/#demos-agentes"
              className="relative group inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full border border-accent-cyan/50 bg-gradient-to-r from-brand-500/20 via-accent-cyan/20 to-brand-500/20 px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_0_15px_rgba(94,230,216,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-accent-cyan hover:shadow-[0_0_25px_rgba(94,230,216,0.5)] active:scale-95 sm:px-4 sm:py-2 sm:text-xs"
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan" />
              </span>
              <span className="bg-gradient-to-r from-white via-slate-100 to-accent-cyan bg-clip-text text-transparent font-extrabold whitespace-nowrap">
                Agentes en Vivo ⚡
              </span>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <Link href="/#plan-a-medida" className="btn-pill py-2.5 px-5 text-xs">
                Contactanos
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <button
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10 md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col bg-base-950/98 px-8 pb-10 pt-28 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/5 py-4 font-display text-3xl font-semibold text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link
                href="/#plan-a-medida"
                onClick={() => setOpen(false)}
                className="btn-pill w-full"
              >
                Contactanos
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
