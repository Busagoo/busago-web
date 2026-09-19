"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  FileText,
  Sparkles,
  Zap,
  Lock,
  Clock,
  UserCheck,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  PhoneCall,
  Flame,
  Snowflake,
  ArrowRight
} from "lucide-react";

type Tab = "dashboard" | "inbox" | "control" | "docs";

interface LeadItem {
  id: string;
  name: string;
  company: string;
  sector: string;
  score: number;
  status: "Solicitó Llamada" | "Agendado" | "Curioso / Sin Presupuesto";
  lastMessage: string;
  time: string;
  phone: string;
  messages: { sender: "user" | "ia"; text: string; time: string }[];
}

const LEADS_DATA: LeadItem[] = [
  {
    id: "1",
    name: "Lic. Gabriel Rossi",
    company: "Rossi Propiedades & Desarrollos",
    sector: "Inmobiliarias",
    score: 95,
    status: "Solicitó Llamada",
    lastMessage: "Perfecto, agendado. Gracias por la atención inmediata.",
    time: "Hace 2 min",
    phone: "+54 9 11 5421-8900",
    messages: [
      { sender: "user", text: "Hola! Necesitamos un agente de IA para WhatsApp que atienda las consultas de los portales inmobiliarios y agende visitas solas.", time: "14:20" },
      { sender: "ia", text: "¡Hola Gabriel! En Busago implementamos ese flujo exacto: califica la intención del comprador, consulta disponibilidades y agenda en Google Calendar/CRM. ¿Tienen más de 300 consultas al mes?", time: "14:20" },
      { sender: "user", text: "Sí, unas 800 consultas por mes. Queremos arrancar ya mismo, ¿podemos coordinar una llamada estratégica?", time: "14:21" },
      { sender: "ia", text: "¡Excelente Gabriel! Por tu volumen de 800 consultas y decisión inmediata, coordinamos una videollamada con el fundador de Busago. Te reservo para mañana a las 15:00hs.", time: "14:21" },
      { sender: "user", text: "Perfecto, agendado. Gracias por la atención inmediata.", time: "14:22" },
      { sender: "ia", text: "¡Confirmado Gabriel! Te envié la invitación de calendar y el recordatorio a tu correo.", time: "14:22" },
    ],
  },
  {
    id: "2",
    name: "Ing. Marcos Benítez",
    company: "Transportes del Plata S.A.",
    sector: "Logística & Transporte",
    score: 98,
    status: "Solicitó Llamada",
    lastMessage: "Impresionante la rapidez. Quedamos a la espera de la videollamada para cerrar el desarrollo.",
    time: "Hace 5 min",
    phone: "+54 9 11 6789-1122",
    messages: [
      { sender: "user", text: "Hola! Necesitamos un CRM completo a medida para nuestra flota de 45 camiones. Queremos rastreo de remites, automatización de facturación y alertas por WhatsApp.", time: "14:15" },
      { sender: "ia", text: "¡Hola Marcos! En Busago desarrollamos CRMs a medida con tableros Kanban operativos, extracción de datos de remites por OCR y bots multicanal de WhatsApp. ¿Manejan más de 1.000 viajes mensuales?", time: "14:16" },
      { sender: "user", text: "Sí, unos 2.500 envíos mensuales. Queremos reemplazar nuestro sistema viejo urgentemente. ¿Cuándo podemos reunirnos con Nicolás Mantecón?", time: "14:17" },
      { sender: "ia", text: "¡Excelente Ing. Marcos! Dado el volumen operativo de 2.500 viajes y requerimiento de CRM a medida, agendé una sesión estratégica con el fundador de Busago para mañana a las 11:00hs.", time: "14:18" },
      { sender: "user", text: "Impresionante la rapidez. Quedamos a la espera de la videollamada para cerrar el desarrollo.", time: "14:19" },
    ],
  },
  {
    id: "3",
    name: "Lic. Valeria Morales",
    company: "Morales Luxury Properties",
    sector: "Real Estate & Inversiones",
    score: 94,
    status: "Solicitó Llamada",
    lastMessage: "Perfecto, ya me agendé el link de Meet con el equipo de arquitectura de IA.",
    time: "Hace 8 min",
    phone: "+54 9 11 9988-3344",
    messages: [
      { sender: "user", text: "Buenas tardes, queremos un CRM completo personalizado para inmobiliarias que capture leads de ZonaProp, califique el presupuesto del cliente y asigne asesores automáticamente.", time: "14:10" },
      { sender: "ia", text: "¡Buenas tardes Valeria! Nuestro CRM inmobiliario a medida integra scoring con IA, asignación inteligente por tipo de propiedad y agendamiento automático en Google Calendar/Outlook.", time: "14:11" },
      { sender: "user", text: "Es exactamente lo que necesitamos. Tenemos 18 agentes comerciales activos. ¿Tienen disponibilidad para una llamada esta semana?", time: "14:12" },
      { sender: "ia", text: "¡Por supuesto Valeria! Te reservé un turno prioritario para este Miércoles a las 16:00hs con el fundador para definir los módulos del CRM.", time: "14:13" },
      { sender: "user", text: "Perfecto, ya me agendé el link de Meet con el equipo de arquitectura de IA.", time: "14:14" },
    ],
  },
  {
    id: "4",
    name: "Dra. Romina Sola",
    company: "Clínica Odontológica Centro",
    sector: "Salud y Clínicas",
    score: 92,
    status: "Solicitó Llamada",
    lastMessage: "Excelente, reservado para la reunión de diagnóstico.",
    time: "Hace 14 min",
    phone: "+54 9 11 3210-9988",
    messages: [
      { sender: "user", text: "Buenas tardes, queríamos automatizar el agendamiento de turnos de nuestros 12 consultorios y triaje de urgencias.", time: "14:05" },
      { sender: "ia", text: "¡Hola Dra. Romina! El flujo de triaje de Busago clasifica la urgencia médica, asigna el especialista adecuado y agenda el turno en tu sistema actual.", time: "14:06" },
      { sender: "user", text: "Excelente, me gustaría ver la propuesta técnica y tener una llamada de diagnóstico con el equipo.", time: "14:07" },
      { sender: "ia", text: "Coordinado Dra. Romina. Te reservé horario en la agenda del fundador para definir la arquitectura de los 12 consultorios este Jueves 10:30hs.", time: "14:08" },
      { sender: "user", text: "Excelente, reservado para la reunión de diagnóstico.", time: "14:10" },
    ],
  },
  {
    id: "5",
    name: "Federico Santillán",
    company: "Distribuidora Santillán Hnos.",
    sector: "Distribución & Mayorista",
    score: 96,
    status: "Solicitó Llamada",
    lastMessage: "Coordinado. Traigo al director de operaciones a la reunión con Nicolás.",
    time: "Hace 20 min",
    phone: "+54 9 11 4455-7788",
    messages: [
      { sender: "user", text: "Hola! Queremos implementar un CRM completo para nuestro equipo de 15 vendedores en calle, con catálogo inteligente de productos y pedidos automáticos por WhatsApp.", time: "13:58" },
      { sender: "ia", text: "¡Hola Federico! En Busago armamos CRMs operativos personalizados con catálogo dinámico por cliente, pedidos por voz/texto y sincronización directa con tu ERP.", time: "13:59" },
      { sender: "user", text: "Eso es clave. Movemos más de 5.000 bultos semanales y perdemos pedidos por falta de stock actualizado. Necesitamos implementarlo en menos de 30 días.", time: "14:01" },
      { sender: "ia", text: "¡Excelente Federico! Por volumen y plazo prioritario, reservé horario en la agenda de Nicolás Mantecón para definir el desarrollo este Viernes a las 14:00hs.", time: "14:02" },
      { sender: "user", text: "Coordinado. Traigo al director de operaciones a la reunión con Nicolás.", time: "14:03" },
    ],
  },
  {
    id: "6",
    name: "Gonzalo Nolasco",
    company: "Nolasco Motors & Usados",
    sector: "Concesionarias Auto",
    score: 87,
    status: "Solicitó Llamada",
    lastMessage: "Mil gracias por la gestión, nos vemos en la reunión.",
    time: "Hace 28 min",
    phone: "+54 9 11 2233-4455",
    messages: [
      { sender: "user", text: "Buenas! Buscamos un CRM a medida para concesionarias que tome la recepción de autos usados, pida fotos por WhatsApp y cotice el valor preliminar con IA.", time: "13:48" },
      { sender: "ia", text: "¡Hola Gonzalo! Desarrollamos CRMs a medida con motor de evaluación por fotos (visión por computadora), scoring financiero y agendamiento automático de Test Drive.", time: "13:49" },
      { sender: "user", text: "Buenísimo! Recibimos 1.200 consultas al mes entre 0km y Usados. Queremos coordinar una reunión de presupuesto.", time: "13:50" },
      { sender: "ia", text: "Reservado Gonzalo para la sesión técnica de arquitectura este Jueves a las 17:00hs con el equipo fundador de Busago.", time: "13:51" },
      { sender: "user", text: "Mil gracias por la gestión, nos vemos en la reunión.", time: "13:52" },
    ],
  },
  {
    id: "7",
    name: "Estudio Contable Albarracín",
    company: "Albarracín & Asociados",
    sector: "Contables & Finanzas",
    score: 89,
    status: "Solicitó Llamada",
    lastMessage: "Gracias, estamos revisando el PDF de propuesta de automatización OCR.",
    time: "Hace 35 min",
    phone: "+54 9 11 7788-9900",
    messages: [
      { sender: "user", text: "Hola Busago, procesamos más de 400 facturas y comprobantes al mes manualmente. ¿Tienen solución para OCR de comprobantes fiscales?", time: "13:40" },
      { sender: "ia", text: "¡Hola! Sí, nuestro agente OCR digitaliza facturas y comprobantes en segundos, valida el CUIT y los sincroniza automáticamente con su sistema contable o CRM.", time: "13:41" },
      { sender: "user", text: "Genial, nos gustaría recibir la propuesta comercial para evaluar la inversión.", time: "13:42" },
      { sender: "ia", text: "Propuesta generada y despachada a tu correo en formato PDF. Un especialista te contactará para coordinar la demostración en vivo.", time: "13:43" },
      { sender: "user", text: "Gracias, estamos revisando el PDF de propuesta de automatización OCR.", time: "13:44" },
    ],
  },
  {
    id: "8",
    name: "Matías Fontana",
    company: "Fontana Sports Direct",
    sector: "E-Commerce & Retail",
    score: 72,
    status: "Curioso / Sin Presupuesto",
    lastMessage: "Dale, consulto con los socios si arrancamos con el paquete estándar o el CRM completo.",
    time: "Hace 42 min",
    phone: "+54 9 11 5566-7788",
    messages: [
      { sender: "user", text: "Hola! Queremos integrar un bot de WhatsApp conectado a Tiendanube para responder estados de envíos.", time: "13:30" },
      { sender: "ia", text: "¡Hola Matías! Implementamos la integración nativa con Tiendanube/Shopify para responder guía de envío y productos recomendados por IA.", time: "13:31" },
      { sender: "user", text: "Buenísimo, ¿cuál es la diferencia de precio entre el bot suelto y la plataforma CRM completa de Busago?", time: "13:32" },
      { sender: "ia", text: "El bot inteligente atiende WhatsApp 24/7. La plataforma CRM completa incluye inbox unificado, métricas de conversión y automatización de postventa.", time: "13:33" },
      { sender: "user", text: "Dale, consulto con los socios si arrancamos con el paquete estándar o el CRM completo.", time: "13:34" },
    ],
  },
  {
    id: "9",
    name: "Dra. Sofía Gutiérrez",
    company: "Gutiérrez & Abogados",
    sector: "Estudios Jurídicos",
    score: 68,
    status: "Curioso / Sin Presupuesto",
    lastMessage: "Perfecto, le comento al titular del buffet para agendar la llamada técnica.",
    time: "Hace 50 min",
    phone: "+54 9 11 1122-3344",
    messages: [
      { sender: "user", text: "Estimados, necesitamos automatizar la consulta de expedientes judiciales y recepción de documentación.", time: "13:20" },
      { sender: "ia", text: "¡Hola Dra. Sofía! Nuestro módulo de recepción legal califica el tipo de expediente y solicita la documentación necesaria escaneada por OCR.", time: "13:21" },
      { sender: "user", text: "Interesante. ¿Se puede integrar con nuestro software de gestión de causas?", time: "13:22" },
      { sender: "ia", text: "Sí, nos integramos mediante webhooks y API REST a cualquier software propietario o base de datos SQL.", time: "13:23" },
      { sender: "user", text: "Perfecto, le comento al titular del buffet para agendar la llamada técnica.", time: "13:24" },
    ],
  },
  {
    id: "10",
    name: "Bruno Casella",
    company: "Casella Bistro & Delivery",
    sector: "Gastronomía",
    score: 55,
    status: "Curioso / Sin Presupuesto",
    lastMessage: "Joyas, en estos días les vuelvo a escribir cuando el dueño revise los videos.",
    time: "Hace 1 hora",
    phone: "+54 9 11 6677-8899",
    messages: [
      { sender: "user", text: "Hola busago, tenemos 3 locales de comida y queremos que WhatsApp tome pedidos de delivery.", time: "13:10" },
      { sender: "ia", text: "¡Hola Bruno! El agente gastronómico toma pedidos, valida la zona de entrega con Google Maps y envía la comanda directo a cocina.", time: "13:11" },
      { sender: "user", text: "Piola, tenés algún video de demo para mostrarle a mi jefe a ver si le cierra?", time: "13:12" },
      { sender: "ia", text: "¡Sí! Podés ver la demo interactiva en vivo en nuestra web en la sección de Servicios Destacados.", time: "13:13" },
      { sender: "user", text: "Joyas, en estos días les vuelvo a escribir cuando el dueño revise los videos.", time: "13:14" },
    ],
  },
  {
    id: "11",
    name: "Esteban Peralta",
    company: "Ventas por Instagram",
    sector: "Emprendimiento Inicial",
    score: 35,
    status: "Curioso / Sin Presupuesto",
    lastMessage: "uh joya me re sirve la data pero por ahora no tengo caja para invertir",
    time: "Hace 1.5 horas",
    phone: "+54 9 11 3344-5566",
    messages: [
      { sender: "user", text: "hola buenas keria saber cuanto me cobras por ponerme una ia en mi instragram k vendo zapatillas", time: "12:50" },
      { sender: "ia", text: "Hola Esteban. Nuestras automatizaciones de IA están diseñadas para pymes y empresas consolidadas con proyectos a medida.", time: "12:51" },
      { sender: "user", text: "uh joya me re sirve la data pero por ahora no tengo caja para invertir", time: "12:52" },
    ],
  },
  {
    id: "12",
    name: "Luciano R.",
    company: "Particular / Sin Empresa",
    sector: "Consulta Informal",
    score: 28,
    status: "Curioso / Sin Presupuesto",
    lastMessage: "ah ok gracias che pensando k era gratis",
    time: "Hace 2 horas",
    phone: "+54 9 11 8877-2211",
    messages: [
      { sender: "user", text: "hola keria saber si me podes hacer un bot gratis para probar", time: "12:30" },
      { sender: "ia", text: "Hola Luciano. En Busago desarrollamos e integramos soluciones de IA a medida para empresas y pymes estructuradas. No ofrecemos servicios gratuitos.", time: "12:31" },
      { sender: "user", text: "ah ok gracias che pensando k era gratis", time: "12:32" },
    ],
  },
  {
    id: "13",
    name: "Joaquín M.",
    company: "Proyecto Facultad",
    sector: "Estudiante",
    score: 18,
    status: "Curioso / Sin Presupuesto",
    lastMessage: "uh no me pasas el código python de onda para un trabajo práctico?",
    time: "Hace 3 horas",
    phone: "+54 9 11 9900-1122",
    messages: [
      { sender: "user", text: "hola capos me regalan el código del bot de voice ia para una materia de la facultad?", time: "11:40" },
      { sender: "ia", text: "Hola Joaquín. Somos Busago Studio, agencia de desarrollo de soluciones de IA enterprise. No compartimos código fuente privado.", time: "11:41" },
      { sender: "user", text: "uh no me pasas el código python de onda para un trabajo práctico?", time: "11:42" },
    ],
  },
];

const DOCS_DATA = [
  { name: "Factura_Busago_B-0042.pdf", type: "Comprobante de Pago", size: "142 KB", status: "Procesado OCR (0.8s)", tag: "Facturación" },
  { name: "Requerimiento_Tecnico_Inmobiliaria.pdf", type: "Alcance de Sistema IA", size: "1.2 MB", status: "Indizado en RAG", tag: "Arquitectura" },
  { name: "Acuerdo_SLA_Mantenimiento_247.pdf", type: "Contrato de Servicio", size: "480 KB", status: "Firmado Digitalmente", tag: "Contratos" },
];

export default function CrmMacbookDemo() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [selectedLead, setSelectedLead] = useState<LeadItem>(LEADS_DATA[0]);

  return (
    <section className="section-y relative overflow-hidden py-12 md:py-24">
      <div className="container relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center mb-8 md:mb-14">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
            Plataforma Operativa Busago Studio
          </span>
          <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold leading-tight text-white md:text-5xl">
            Gestión Autónoma de Solicitudes e IA
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-muted md:text-lg">
            Monitoreá en tiempo real cómo nuestros agentes califican prospectos, procesan facturas y agendan reuniones con el equipo.
          </p>
        </div>

        {/* MacBook Pro Framed Container */}
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/20 bg-[#0d122c]/95 shadow-[0_25px_70px_-15px_rgba(67,86,253,0.4)] backdrop-blur-2xl">
            {/* Ambient Corner Glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-cyan/20 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-500/20 blur-[90px]" />

            {/* macOS Chrome Header Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#080b1e]/90 px-3 py-2.5 sm:px-6 sm:py-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ff5f56] shadow-sm" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ffbd2e] shadow-sm" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27c93f] shadow-sm" />
              </div>

              {/* URL Address Bar */}
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] sm:text-xs text-ink-muted shadow-inner">
                <Lock className="h-3 w-3 text-accent-cyan" />
                <span className="font-mono text-white/90">crm.busago.studio</span>
                <span className="hidden sm:inline text-[10px] text-accent-cyan font-semibold">SSL Encriptado</span>
              </div>

              {/* Live Status Indicator */}
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-accent-cyan">IA 24/7</span>
              </div>
            </div>

            {/* macOS Tab Switcher Header (Scrollable on mobile) */}
            <div className="no-scrollbar flex items-center justify-between border-b border-white/10 bg-[#090d24]/80 px-3 py-2 sm:px-6 overflow-x-auto gap-2">
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {[
                  { id: "dashboard", label: "Dashboard de Operaciones", icon: LayoutDashboard },
                  { id: "inbox", label: "Inbox de Leads IA", icon: MessageSquare },
                  { id: "control", label: "Tablero de Control", icon: Kanban },
                  { id: "docs", label: "Facturas & Documentos OCR", icon: FileText },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 shrink-0 ${
                        isActive
                          ? "bg-gradient-to-r from-brand-500/30 via-accent-cyan/20 to-brand-500/30 text-white border border-accent-cyan/40 shadow-[0_0_15px_rgba(94,230,216,0.2)]"
                          : "text-ink-muted hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-accent-cyan" : "text-ink-subtle"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="p-3 sm:p-6 min-h-[380px] bg-gradient-to-b from-[#090d24]/90 to-[#060919]/95">
              <AnimatePresence mode="wait">
                {/* TAB 1: DASHBOARD DE OPERACIONES */}
                {activeTab === "dashboard" && (
                  <motion.div
                    key="tab-dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Operational Stat Cards */}
                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                      {[
                        { label: "Tasa de Respuesta IA", val: "99.4%", sub: "< 3 segundos de respuesta", icon: Clock, color: "text-accent-cyan" },
                        { label: "Leads Calificados", val: "1.480", sub: "Score > 75% este mes", icon: UserCheck, color: "text-emerald-400" },
                        { label: "Llamadas con Fundador", val: "128", sub: "Coordinadas automáticamente", icon: PhoneCall, color: "text-brand-300" },
                        { label: "Uptime Operativo", val: "24/7/365", sub: "Disponibilidad garantizada", icon: ShieldCheck, color: "text-purple-300" },
                      ].map((card) => {
                        const Icon = card.icon;
                        return (
                          <div
                            key={card.label}
                            className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 backdrop-blur-md transition-all hover:border-white/20"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] sm:text-[11px] font-semibold text-ink-subtle">{card.label}</span>
                              <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${card.color}`} />
                            </div>
                            <p className="mt-1.5 font-display text-xl sm:text-3xl font-bold text-white">{card.val}</p>
                            <span className="mt-0.5 block text-[9px] sm:text-[10px] font-medium text-ink-muted">{card.sub}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Operational Activity Feed */}
                    <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-5">
                      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-accent-cyan" />
                          <h4 className="font-display text-xs sm:text-sm font-bold text-white">Solicitudes de Sistemas de IA en Tiempo Real</h4>
                        </div>
                        <span className="text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                          Agente Busago Activo
                        </span>
                      </div>

                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {LEADS_DATA.map((lead) => {
                          const isHigh = lead.score >= 75;
                          return (
                            <div
                              key={lead.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 sm:p-3 text-xs transition-colors hover:bg-white/[0.05]"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-[11px] border ${
                                  isHigh ? "bg-brand-500/20 text-accent-cyan border-accent-cyan/30" : "bg-white/5 text-ink-subtle border-white/10"
                                }`}>
                                  {lead.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-white">{lead.name}</span>
                                    <span className="text-[10px] text-ink-subtle">({lead.company})</span>
                                  </div>
                                  <p className="text-[11px] text-ink-muted line-clamp-1">{lead.lastMessage}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                  isHigh
                                    ? "border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan shadow-[0_0_10px_rgba(94,230,216,0.2)]"
                                    : "border-white/10 bg-white/5 text-ink-subtle"
                                }`}>
                                  {isHigh ? <Flame className="h-3 w-3 text-accent-cyan" /> : <Snowflake className="h-3 w-3 text-ink-subtle" />}
                                  Score: {lead.score}%
                                </span>
                                <span className="text-[10px] text-ink-subtle">{lead.time}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: INBOX DE LEADS IA */}
                {activeTab === "inbox" && (
                  <motion.div
                    key="tab-inbox"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-3 lg:grid-cols-[260px_1fr] min-h-[380px]"
                  >
                    {/* Contacts Sidebar */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 overflow-y-auto space-y-2 max-h-[220px] lg:max-h-[320px]">
                      <div className="text-[10px] font-bold text-ink-subtle uppercase px-1 mb-1">Solicitudes Entrantes</div>
                      {LEADS_DATA.map((lead) => {
                        const isSelected = selectedLead.id === lead.id;
                        const isHigh = lead.score >= 75;
                        return (
                          <button
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className={`flex w-full flex-col items-start rounded-xl p-2 text-left transition-all ${
                              isSelected
                                ? "bg-accent-cyan/15 border border-accent-cyan/40 text-white shadow-sm"
                                : "bg-white/[0.02] border border-white/5 text-ink-muted hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span className="font-semibold text-xs text-white">{lead.name}</span>
                              <span className={`rounded-full border px-1.5 py-0.2 text-[9px] font-bold ${
                                isHigh ? "bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan" : "bg-white/5 border-white/10 text-ink-subtle"
                              }`}>
                                {lead.score}%
                              </span>
                            </div>
                            <span className="text-[10px] text-ink-subtle mt-0.5">{lead.sector}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Conversation Window */}
                    <div className="flex flex-col rounded-xl border border-white/10 bg-base-950/80 overflow-hidden min-h-[300px]">
                      {/* Header Contact Info + Score Pill */}
                      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/[0.03] p-2.5 sm:px-4 gap-2">
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            {selectedLead.name}
                            <span className="text-[10px] text-ink-subtle font-normal">({selectedLead.phone})</span>
                          </h5>
                          <span className="text-[10px] text-accent-cyan font-semibold">{selectedLead.company} — {selectedLead.sector}</span>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-extrabold shadow-sm ${
                          selectedLead.score >= 75
                            ? "bg-gradient-to-r from-brand-500 to-accent-cyan border-accent-cyan/40 text-white shadow-[0_0_15px_rgba(94,230,216,0.3)]"
                            : "bg-white/10 border-white/20 text-ink-muted"
                        }`}>
                          Score IA: {selectedLead.score}% ({selectedLead.status})
                        </span>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-[#060918]/90 max-h-[240px] sm:max-h-[280px]">
                        {selectedLead.messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col ${msg.sender === "user" ? "items-start" : "items-end"}`}
                          >
                            <div
                              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                msg.sender === "user"
                                  ? "bg-white/10 text-white/90 border border-white/10"
                                  : "bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium shadow-[0_0_15px_rgba(67,86,253,0.3)]"
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-0.5 text-[9px] opacity-75 font-semibold">
                                <span>{msg.sender === "user" ? "Cliente" : "IA Busago Studio"}</span>
                                <span>• {msg.time}</span>
                              </div>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/10 bg-white/[0.02] p-2 text-center text-[11px] text-ink-subtle">
                        🤖 Agente de Busago atendiendo y sincronizando con agenda del fundador.
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: TABLERO DE CONTROL (KANBAN) */}
                {activeTab === "control" && (
                  <motion.div
                    key="tab-control"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    {[
                      {
                        title: "Solicitudes Entrantes",
                        color: "border-brand-500/30",
                        items: [
                          { name: "Estudio Jurídico Ramos", score: 85, tag: "Legal", desc: "Solicitó recepción de expedientes y CRM." },
                          { name: "Esteban Peralta", score: 35, tag: "Emprendedor", desc: "Consultó IA para Instagram sin presupuesto." },
                          { name: "Joaquín M.", score: 18, tag: "Estudiante", desc: "Pidió código fuente gratis (Filtrado por IA)." },
                        ],
                      },
                      {
                        title: "Calificados por IA",
                        color: "border-accent-cyan/40",
                        items: [
                          { name: "Lic. Gabriel Rossi", score: 95, tag: "Inmobiliaria", desc: "800 consultas/mes. Pide agendamiento y CRM." },
                          { name: "Lic. Valeria Morales", score: 94, tag: "Real Estate", desc: "Pide CRM completo personalizado para 18 asesores." },
                          { name: "Federico Santillán", score: 96, tag: "Mayorista", desc: "5.000 bultos/semana. Pide CRM operativo a medida." },
                          { name: "Gonzalo Nolasco", score: 87, tag: "Concesionaria", desc: "1.200 consultas/mes. CRM para autos 0km y Usados." },
                        ],
                      },
                      {
                        title: "Llamada con Fundador",
                        color: "border-emerald-500/40",
                        items: [
                          { name: "Ing. Marcos Benítez", score: 98, tag: "Logística", desc: "CRM completo para 45 camiones. Reunión Mañana 11hs." },
                          { name: "Dra. Romina Sola", score: 92, tag: "Salud", desc: "12 consultorios. Reunión confirmada Jueves 10:30hs." },
                        ],
                      },
                      {
                        title: "Propuesta Despachada",
                        color: "border-purple-500/40",
                        items: [
                          { name: "Albarracín & Asoc.", score: 89, tag: "Contable", desc: "400 facturas/mes. Propuesta OCR enviada en PDF." },
                          { name: "Fontana Sports Direct", score: 72, tag: "Retail", desc: "Evaluando bot + plataforma CRM multicanal." },
                          { name: "Gutiérrez & Abogados", score: 68, tag: "Legal", desc: "Evaluando integración con expedientes judicial." },
                        ],
                      },
                    ].map((col) => (
                      <div
                        key={col.title}
                        className={`rounded-xl sm:rounded-2xl border ${col.color} bg-white/[0.02] p-3 backdrop-blur-md`}
                      >
                        <h5 className="text-xs font-bold text-white mb-2.5 pb-1 border-b border-white/5">
                          {col.title}
                        </h5>

                        <div className="space-y-2">
                          {col.items.map((card) => {
                            const isHigh = card.score >= 75;
                            return (
                              <div
                                key={card.name}
                                className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs transition-all hover:border-accent-cyan/40 hover:bg-white/[0.06]"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-white line-clamp-1">{card.name}</span>
                                  <span className={`rounded-full border px-1.5 py-0.2 text-[9px] font-extrabold shrink-0 ${
                                    isHigh ? "bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan" : "bg-white/5 border-white/10 text-ink-subtle"
                                  }`}>
                                    {card.score}%
                                  </span>
                                </div>
                                <span className="inline-block rounded bg-white/10 px-1.5 py-0.2 text-[9px] text-ink-subtle mb-1.5">
                                  {card.tag}
                                </span>
                                <p className="text-[10px] text-ink-muted leading-relaxed line-clamp-2">{card.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* TAB 4: FACTURAS & DOCUMENTOS OCR */}
                {activeTab === "docs" && (
                  <motion.div
                    key="tab-docs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <h4 className="font-display text-xs sm:text-sm font-bold text-white">Procesamiento Automático OCR & Documentación</h4>
                        <p className="text-[10px] sm:text-xs text-ink-subtle">Archivos digitalizados e indizados por la IA de Busago.</p>
                      </div>
                      <span className="text-[10px] font-bold text-accent-cyan bg-accent-cyan/10 px-2.5 py-1 rounded-full border border-accent-cyan/20">
                        3 Documentos Procesados
                      </span>
                    </div>

                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      {DOCS_DATA.map((doc) => (
                        <div
                          key={doc.name}
                          className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md transition-all hover:border-accent-cyan/40"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <FileCheck className="h-5 w-5 text-accent-cyan" />
                            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-ink-muted">
                              {doc.tag}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-white line-clamp-1">{doc.name}</h5>
                          <span className="text-[10px] text-ink-subtle block mt-0.5">{doc.type} • {doc.size}</span>
                          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 p-1.5 rounded-lg border border-accent-cyan/20">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{doc.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Botón CTA hacia Plan a Medida */}
        <div className="mt-8 sm:mt-10 text-center">
          <a
            href="#plan-a-medida"
            className="inline-flex items-center gap-2.5 rounded-full border border-accent-cyan/50 bg-gradient-to-r from-brand-500/20 via-accent-cyan/20 to-brand-500/20 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_25px_rgba(94,230,216,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-accent-cyan hover:shadow-[0_0_35px_rgba(94,230,216,0.5)] active:scale-95"
          >
            <span>Quiero un CRM personalizado</span>
            <ArrowRight className="h-4 w-4 text-accent-cyan" />
          </a>
        </div>
      </div>
    </section>
  );
}
