"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Send, CheckCircle2, Loader2, ShieldCheck, Sparkles, Download } from "lucide-react";
import type { Service } from "@prisma/client";
import { generateProposalPdf } from "@/lib/generateProposalPdf";

interface RequestPdfModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestPdfModal({ service, isOpen, onClose }: RequestPdfModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  if (!service) return null;

  function triggerDirectPdfDownload() {
    try {
      const doc = generateProposalPdf({
        nombre: formData.nombre,
        email: formData.email,
        empresa: formData.empresa,
        tituloServicio: service?.tituloServicio,
      });

      // Desencadena la descarga directa e instantánea del archivo .pdf en el navegador sin abrir pestañas
      const cleanTitle = (service?.tituloServicio || "Servicio").replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`Busago_Propuesta_Comercial_${cleanTitle}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF directo:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !aceptaTerminos) return;

    setStatus("loading");

    // 1. Descarga directa e instantánea del archivo PDF
    triggerDirectPdfDownload();

    // 2. Registro de lead y envío de propuesta por correo electrónico
    try {
      const res = await fetch("/api/leads/service-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          empresa: formData.empresa,
          telefono: formData.telefono,
          servicioId: service?.id,
          tituloServicio: service?.tituloServicio,
          categoria: service?.categoria,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar solicitud");
      setStatus("success");

      // Cierre automático tras 2.2 segundos para comodidad del usuario
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2200);
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-base-950/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-accent-cyan/40 bg-gradient-to-br from-[#0e1642]/95 via-[#080d2b]/95 to-[#120a2e]/95 p-6 md:p-8 shadow-[0_0_60px_-10px_rgba(94,230,216,0.3)] backdrop-blur-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-cyan/20 text-accent-cyan shadow-[0_0_20px_-3px_rgba(94,230,216,0.4)]">
                  <CheckCircle2 className="h-10 w-10 text-accent-cyan" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">¡PDF Descargado!</h3>
                <p className="mt-2 text-sm text-slate-300">
                  La propuesta comercial en PDF fue descargada directamente a tu dispositivo y enviada a{" "}
                  <span className="text-accent-cyan">{formData.email}</span>.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={triggerDirectPdfDownload}
                    className="flex items-center justify-center gap-2 rounded-full border border-accent-cyan/40 bg-accent-cyan/20 py-2.5 px-5 text-xs font-semibold text-white transition-all hover:bg-accent-cyan/30 hover:shadow-[0_0_20px_-3px_rgba(94,230,216,0.4)]"
                  >
                    <Download className="h-4 w-4 text-accent-cyan" />
                    Volver a descargar PDF
                  </button>

                  <button
                    onClick={onClose}
                    className="rounded-full border border-white/10 bg-white/5 py-2 px-4 text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Cerrar ventana
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan shadow-[0_0_15px_-3px_rgba(94,230,216,0.3)]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-cyan uppercase tracking-wider">
                      <Sparkles className="h-3 w-3" />
                      Descarga Directa de PDF
                    </span>
                    <h3 className="font-display text-lg font-bold text-white leading-snug">
                      Recibir propuesta en PDF
                    </h3>
                  </div>
                </div>

                <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                  <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider block">
                    Servicio seleccionado
                  </span>
                  <p className="font-display text-sm font-bold text-white mt-0.5">
                    {service.tituloServicio}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {service.descripcionCorta}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Nicolas Mantecon"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.05] py-2 px-3 text-xs text-white placeholder-slate-400 focus:border-accent-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email donde recibirás la propuesta *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vos@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.05] py-2 px-3 text-xs text-white placeholder-slate-400 focus:border-accent-cyan focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Empresa (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Tu empresa"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/[0.05] py-2 px-3 text-xs text-white placeholder-slate-400 focus:border-accent-cyan focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        WhatsApp (Opcional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+54 9 11..."
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/[0.05] py-2 px-3 text-xs text-white placeholder-slate-400 focus:border-accent-cyan focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2 pt-1 text-[11px] leading-relaxed text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      required
                      className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-white/10 text-brand-500 accent-brand-500 cursor-pointer"
                    />
                    <span>
                      Acepto los{" "}
                      <a href="/terminos-y-condiciones" target="_blank" className="text-accent-cyan underline">
                        Términos
                      </a>{" "}
                      y la{" "}
                      <a href="/politica-de-privacidad" target="_blank" className="text-accent-cyan underline">
                        Privacidad
                      </a>
                      .
                    </span>
                  </label>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent-cyan" />
                      <span>Descarga automática. Cero spam.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading" || !formData.nombre || !formData.email || !aceptaTerminos}
                      className="btn-pill !py-2.5 !px-5 text-xs disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          Descargar PDF
                        </>
                      )}
                    </button>
                  </div>

                  {status === "error" && (
                    <p className="text-center text-xs text-red-400 mt-2">
                      Algo salió mal. Por favor probá de nuevo.
                    </p>
                  )}
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
