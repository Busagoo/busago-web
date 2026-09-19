"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ListExpandModal, { type ListExpandItem } from "@/components/ui/ListExpandModal";
import { MessageSquare, CheckCheck, Sparkles, Phone, Video, Info, Wifi, Battery, ChevronRight, Grid } from "lucide-react";

interface ChatMessageSim {
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface SectorDemo {
  sector: string;
  icon: string;
  description: string;
  chat: ChatMessageSim[];
}

const SECTOR_DEMOS: SectorDemo[] = [
  {
    sector: "Inmobiliarias",
    icon: "🏠",
    description: "Triaje automático de interesados, respuesta 24/7 sobre propiedades y agendamiento directo de visitas.",
    chat: [
      { sender: "user", text: "Hola! Quería consultar por el departamento en alquiler en Palermo.", time: "14:30" },
      { sender: "bot", text: "¡Hola! Con gusto. Es un 2 ambientes de 55m² a $450 USD/mes con balcón y amenities. ¿Querés agendar una visita?", time: "14:30" },
      { sender: "user", text: "Sí, me interesa para este jueves a la tarde.", time: "14:31" },
      { sender: "bot", text: "¡Perfecto! Te reservé el jueves a las 16:30 hs con nuestro asesor. Te envié la ubicación por acá. 📍", time: "14:31" },
    ],
  },
  {
    sector: "Estudios Contables y Jurídicos",
    icon: "⚖️",
    description: "OCR para facturas, recordatorios mensuales de documentación y organización automática de expedientes.",
    chat: [
      { sender: "user", text: "Te adjunto la factura del proveedor de este mes en PDF.", time: "10:15" },
      { sender: "bot", text: "¡Recibido! Procesé la factura (CUIT 30-71234567-8 por $185.000). Ya quedó registrada en tu contabilidad y archivada en el expediente.", time: "10:15" },
      { sender: "user", text: "Genial, ¿cuándo vence la presentación de IVA?", time: "10:16" },
      { sender: "bot", text: "Vence el 18 de este mes. Te enviaré un resumen previo el día 15 con el cálculo borrador.", time: "10:16" },
    ],
  },
  {
    sector: "Gastronomía y Cafeterías",
    icon: "☕",
    description: "Reservas de mesas por WhatsApp, menú interactivo y unificación de pedidos de delivery en pantalla.",
    chat: [
      { sender: "user", text: "Hola, quisieras reservar una mesa para 4 personas hoy a las 21hs.", time: "18:00" },
      { sender: "bot", text: "¡Hola! Tenemos disponibilidad en la terraza o salón interno. ¿Cuál preferís?", time: "18:00" },
      { sender: "user", text: "En la terraza por favor.", time: "18:01" },
      { sender: "bot", text: "¡Reserva confirmada! Mesa para 4 en terraza a las 21:00 hs a tu nombre. Te esperamos 🍽️", time: "18:01" },
    ],
  },
  {
    sector: "Clínicas y Consultorios Médicos",
    icon: "🩺",
    description: "Agendamiento 24/7, reducción del ausentismo con confirmaciones y recetas digitales automáticas.",
    chat: [
      { sender: "user", text: "Hola, necesito un turno para dermatología esta semana.", time: "09:10" },
      { sender: "bot", text: "¡Hola! La Dra. Martínez tiene turno libre el miércoles a las 11:00 hs o viernes a las 15:30 hs. ¿Cuál te sirve?", time: "09:10" },
      { sender: "user", text: "El viernes a las 15:30 hs por favor.", time: "09:11" },
      { sender: "bot", text: "¡Turno agendado! Te enviamos la confirmación e indicaciones previas a tu WhatsApp.", time: "09:11" },
    ],
  },
  {
    sector: "E-commerce y Tiendas Minoristas",
    icon: "🛒",
    description: "Recuperación de carritos abandonados, seguimiento de envíos y recomendaciones personalizadas.",
    chat: [
      { sender: "user", text: "Hola, compré ayer y quería saber por dónde va mi pedido #8492.", time: "16:20" },
      { sender: "bot", text: "¡Hola Martín! Tu pedido está en camino con la empresa Andreani. Código de seguimiento: AR948201. Llega mañana entre 10 y 14hs 📦", time: "16:20" },
      { sender: "user", text: "Buenísimo, muchas gracias!", time: "16:21" },
      { sender: "bot", text: "¡De nada! Además te dejamos un 10% OFF para tu próxima compra en remeras.", time: "16:21" },
    ],
  },
  {
    sector: "Gimnasios y Centros de Fitness",
    icon: "🏋️‍♂️",
    description: "Reserva de clases con cupo, aviso de cobro de cuotas y rutinas personalizadas enviadas por WhatsApp.",
    chat: [
      { sender: "user", text: "Hola, me quiero anotar a la clase de Crossfit de mañana a las 19hs.", time: "20:00" },
      { sender: "bot", text: "¡Hola Sofía! Quedan 2 cupos para la clase de las 19hs. ¿Te anoto?", time: "20:00" },
      { sender: "user", text: "Sí por favor!", time: "20:01" },
      { sender: "bot", text: "¡Listo! Quedaste anotada. Te recordamos traer tu botella de agua y toalla. 💪", time: "20:01" },
    ],
  },
  {
    sector: "Agencias de Viajes y Turismo",
    icon: "✈️",
    description: "Itinerarios con IA, alertas de pasajes con descuento y envío automático de pasajes y vouchers.",
    chat: [
      { sender: "user", text: "Hola! Busco pasajes a Cancún para noviembre para 2 personas.", time: "11:45" },
      { sender: "bot", text: "¡Hola! Encontramos un vuelo directo promocional a $780 USD por persona con equipaje en mano. ¿Te armo el itinerario completo con hotel?", time: "11:45" },
      { sender: "user", text: "Dale, mandame la propuesta.", time: "11:46" },
      { sender: "bot", text: "¡Perfecto! Te acabo de armar la cotización completa de 7 noches en resort All Inclusive. Te la adjunto en PDF 🌴", time: "11:46" },
    ],
  },
  {
    sector: "Talleres Mecánicos y Repuesteras",
    icon: "🔧",
    description: "Cotización instantánea de repuestos, notificaciones de avance del auto y turnos de reparación.",
    chat: [
      { sender: "user", text: "Hola, quisiera saber si ya está listo el Peugeot 208 patente AF123JK.", time: "15:00" },
      { sender: "bot", text: "¡Hola Carlos! Sí, finalizamos el cambio de aceite y filtros. Tu auto está listo para retirar hasta las 19:00 hs. El total es $48.000.", time: "15:00" },
      { sender: "user", text: "Excelente, en media hora paso.", time: "15:01" },
      { sender: "bot", text: "¡Te esperamos! Podés abonar con Mercado Pago o transferencia.", time: "15:01" },
    ],
  },
  {
    sector: "Empresas de Logística y Última Milla",
    icon: "🚚",
    description: "Tracking en vivo por WhatsApp, reprogramación de entregas fallidas y confirmación digital con PIN.",
    chat: [
      { sender: "user", text: "Hola, no voy a estar en casa hoy para recibir el paquete.", time: "08:30" },
      { sender: "bot", text: "¡Hola! No te preocupes. ¿Preferís que lo reprogramemos para mañana o que lo dejemos en una sucursal cercana?", time: "08:30" },
      { sender: "user", text: "Dejamelo en la sucursal de Belgrano.", time: "08:31" },
      { sender: "bot", text: "¡Hecho! Tu paquete estará disponible a partir de mañana a las 10hs en la sucursal de Av. Cabildo 2100 con tu DNI.", time: "08:31" },
    ],
  },
  {
    sector: "Academias y Centros de Capacitación",
    icon: "🎓",
    description: "Matriculación y acceso inmediato al LMS, recordatorios de entregas y emisión de certificados PDF.",
    chat: [
      { sender: "user", text: "Hola, acabo de pagar el curso de Marketing Digital.", time: "12:10" },
      { sender: "bot", text: "¡Bienvenido/a Lucas! Confirmamos tu pago. Te acabamos de crear la cuenta y enviar tu usuario y contraseña por mail para ingresar al aula virtual 🚀", time: "12:10" },
      { sender: "user", text: "Genial, ¿cuándo es la primera clase en vivo?", time: "12:11" },
      { sender: "bot", text: "Es este martes a las 19:00 hs por Zoom. Te llegará el link de acceso 1 hora antes.", time: "12:11" },
    ],
  },
];

export default function SectorSimulator() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const currentDemo = SECTOR_DEMOS[selectedIdx];

  const demoItems: ListExpandItem[] = SECTOR_DEMOS.map((d, idx) => ({
    id: String(idx),
    title: `${d.icon} ${d.sector}`,
    subtitle: d.description,
    badge: `Demo en vivo #${idx + 1}`,
  }));

  return (
    <section id="simulador-sectores" className="section-y relative overflow-hidden px-3 sm:px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            Demostración en Vivo
          </span>
          <h2 className="mt-4 font-display text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            Mirá cómo responde la IA en tu rubro
          </h2>
          <p className="mt-4 text-balance text-sm sm:text-base text-ink-muted">
            Seleccioná tu sector para simular la conversación real que tendrán tus clientes con el agente inteligente de tu empresa.
          </p>
        </div>

        {/* Pestañas de Sectores — Swipe Horizontal Ultra Compacto en Mobile + Botón de Grilla */}
        <div className="mt-6 sm:mt-8 mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
              Sectores disponibles
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mx-auto sm:ml-auto inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-accent-cyan/30 hover:shadow-[0_0_15px_-3px_rgba(94,230,216,0.4)]"
            >
              <Grid className="h-3.5 w-3.5 text-accent-cyan" />
              Ver todas las demos en grilla ({SECTOR_DEMOS.length})
            </button>
          </div>

          <div className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto px-2 py-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
            {SECTOR_DEMOS.map((demo, idx) => (
              <button
                key={demo.sector}
                onClick={() => setSelectedIdx(idx)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
                  selectedIdx === idx
                    ? "border border-accent-cyan bg-accent-cyan/15 text-white shadow-[0_0_20px_-5px_rgba(94,230,216,0.3)] scale-105"
                    : "border border-white/10 bg-white/[0.03] text-ink-muted hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{demo.icon}</span>
                <span className="whitespace-nowrap">{demo.sector}</span>
              </button>
            ))}
          </div>

          <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-ink-subtle sm:hidden">
            <span>Deslizá los rubros o tocá el botón para ver todos</span>
            <ChevronRight className="h-3 w-3 animate-pulse text-accent-cyan" />
          </div>
        </div>

        {/* Clean iPhone 16 Pro Frame without outer button protrusions */}
        <div className="mt-8 sm:mt-12 mx-auto w-full max-w-[340px] sm:max-w-[380px]">
          {/* Titanium Outer Casing */}
          <div className="relative rounded-[3.2rem] border-[8px] sm:border-[10px] border-[#222530] bg-[#0a0c12] p-1.5 sm:p-2 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.95)] ring-1 ring-white/15">
            {/* Inner Screen Container */}
            <div className="relative overflow-hidden rounded-[2.6rem] bg-[#0a0d18] border border-white/10 flex flex-col">
              {/* iPhone Dynamic Island Bar */}
              <div className="relative pt-3 pb-1 px-5 flex items-center justify-between bg-[#0a0d18] z-30 shrink-0">
                <span className="text-[11px] font-semibold text-white/90 tracking-tight pl-1">09:41</span>
                {/* Dynamic Island Notch */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner border border-white/10">
                  <div className="h-2 w-2 rounded-full bg-[#0a1224] border border-blue-900/60" />
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-[10px]">
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                </div>
              </div>

              {/* Chat App Header */}
              <div className="flex items-center justify-between bg-base-900/95 px-3.5 py-2.5 border-b border-white/10 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-cyan/15 text-lg border border-accent-cyan/30 shrink-0">
                    {currentDemo.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate leading-tight">{currentDemo.sector}</h4>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      Agente Busago IA 24/7
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5 text-ink-muted shrink-0">
                  <Phone className="h-3.5 w-3.5 hover:text-white" />
                  <Video className="h-3.5 w-3.5 hover:text-white" />
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="h-[420px] sm:h-[460px] p-3.5 space-y-3 flex flex-col justify-end overflow-y-auto bg-gradient-to-b from-[#0a0d18] via-[#080b15] to-[#050710]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDemo.sector}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {currentDemo.chat.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${
                          msg.sender === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed shadow-sm ${
                            msg.sender === "user"
                              ? "bg-brand-500 text-white rounded-br-xs"
                              : "border border-white/10 bg-white/10 text-white/95 backdrop-blur-md rounded-bl-xs"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-white/50">
                            <span>{msg.time}</span>
                            {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-accent-cyan" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-base-900/95 border-t border-white/10 shrink-0">
                <div className="rounded-full bg-white/[0.06] px-3 py-2 flex items-center gap-2 border border-white/10">
                  <MessageSquare className="h-3.5 w-3.5 text-ink-subtle shrink-0" />
                  <span className="text-[11px] text-ink-subtle flex-1 truncate">Escribir consulta...</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-cyan text-base-950 font-bold text-[10px] shrink-0">
                    ➔
                  </span>
                </div>
                {/* iOS Home Indicator Bar */}
                <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-2.5 mb-0.5" />
              </div>
            </div>
          </div>

          {/* Description Footer */}
          <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-xs text-ink-muted backdrop-blur-md">
            <Info className="h-4 w-4 shrink-0 text-accent-cyan" />
            <p className="leading-relaxed">{currentDemo.description}</p>
          </div>
        </div>
      </div>

      {/* Modal Selector de Demos en Cuadrícula */}
      <ListExpandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Demos de IA por Sector"
        subtitle="Elegí cualquier industria para probar la simulación interactiva"
        items={demoItems}
        selectedId={String(selectedIdx)}
        onSelect={(item) => setSelectedIdx(Number(item.id))}
      />
    </section>
  );
}
