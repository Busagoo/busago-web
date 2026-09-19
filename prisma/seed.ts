import { PrismaClient, ServiceArea } from "@prisma/client";

const prisma = new PrismaClient();

const defaultSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="9"/></svg>`;

const sectorIcons: Record<string, string> = {
  "Inmobiliarias": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  "Estudios Contables y Jurídicos": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  "Gastronomía y Cafeterías": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  "Clínicas y Consultorios Médicos": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  "E-commerce y Tiendas Minoristas": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  "Gimnasios y Centros de Fitness": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`,
  "Agencias de Viajes y Turismo": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0 0-3 2.12 2.12 0 0 0-3 0L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.3z"/></svg>`,
  "Talleres Mecánicos y Repuesteras": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  "Empresas de Logística y Última Milla": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  "Academias y Centros de Capacitación": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
};

const rawServicesData: Array<{ sector: string; area: ServiceArea; title: string; desc: string }> = [
  // 1. Inmobiliarias
  { sector: "Inmobiliarias", area: ServiceArea.COMERCIAL_VENTAS, title: "Triaje y calificación de leads", desc: "Recepción automática de consultas desde portales de clasificados (Mercado Libre, Zonaprop) vía webhook para filtrado inicial en el CRM." },
  { sector: "Inmobiliarias", area: ServiceArea.ATENCION_CLIENTE, title: "Atención y filtrado por WhatsApp (IA)", desc: "Bot conversacional para responder dudas de propiedades y recopilar presupuesto, zona de interés y plazos 24/7." },
  { sector: "Inmobiliarias", area: ServiceArea.ATENCION_CLIENTE, title: "Agendamiento inteligente de visitas", desc: "Sincronización automática de turnos de visualización con el calendario disponible de los agentes inmobiliarios." },
  { sector: "Inmobiliarias", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Análisis de solvencia documental", desc: "Extracción automática de datos de recibos de sueldo y garantías mediante OCR e IA para evaluar inquilinos." },
  { sector: "Inmobiliarias", area: ServiceArea.COMERCIAL_VENTAS, title: "Generación de copys para propiedades", desc: "Creación automatizada de descripciones optimizadas para SEO y redes sociales a partir de características básicas del inmueble." },
  { sector: "Inmobiliarias", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Gestión de vencimientos de contratos", desc: "Alertas automáticas y propuestas de renovación enviadas a propietarios e inquilinos con meses de anticipación." },
  { sector: "Inmobiliarias", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Reportes automatizados para propietarios", desc: "Envío mensual de estadísticas de rendimiento de sus propiedades (vistas, leads, consultas) por correo o Telegram." },
  { sector: "Inmobiliarias", area: ServiceArea.COMERCIAL_VENTAS, title: "Publicación omnicanal sincronizada", desc: "Sube una propiedad a un panel central y automatiza su distribución simultánea en portales y redes sociales." },
  { sector: "Inmobiliarias", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Verificación de antecedentes legales", desc: "Flujo que consulta bases de datos públicas para validar el estado legal de los garantes o propiedades." },
  { sector: "Inmobiliarias", area: ServiceArea.ATENCION_CLIENTE, title: "Encuestas post-visita", desc: "Envío automático de feedback por WhatsApp tras una visita para medir la atención del asesor." },

  // 2. Estudios Contables y Jurídicos
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Procesamiento de facturas (OCR + IA)", desc: "Lectura automática de PDFs de compras y ventas para extraer montos, CUITs e impuestos y cargarlos al sistema contable." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Monitoreo de casillas de correo crítico", desc: "Clasificación inteligente de notificaciones judiciales o fiscales para alertar de inmediato casos urgentes." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Redacción preliminar de escritos y contratos", desc: "Generación de borradores de cartas documento o minutas utilizando plantillas y datos del cliente procesados por LLMs." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Control de plazos y vencimientos", desc: "Alertas automatizadas de fechas límite procesales, presentaciones de declaraciones juradas y tasas." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ATENCION_CLIENTE, title: "Onboarding digital de clientes", desc: "Recolección de documentación de identidad y firma electrónica de contratos de servicios profesionales de forma automatizada." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Organización inteligente de expedientes", desc: "Clasificación automática de documentos en almacenamiento en la nube según etiquetas extraídas por IA." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ATENCION_CLIENTE, title: "Recordatorios de documentación mensual", desc: "Envío automatizado de avisos a clientes para el envío de extractos bancarios y comprobantes antes del cierre." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Transcripción de reuniones y audiencias", desc: "Generación automática de actas y resúmenes de reuniones mantenidas con clientes mediante audio a texto." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Análisis de riesgos en contratos", desc: "Detección automática de cláusulas desfavorables o fuera de norma en contratos de terceros." },
  { sector: "Estudios Contables y Jurídicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Reportes fiscales ejecutivos", desc: "Envío automatizado de resúmenes de situación impositiva personalizados para clientes corporativos." },

  // 3. Gastronomía y Cafeterías
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.ATENCION_CLIENTE, title: "Reservas automatizadas por WhatsApp", desc: "Gestión de mesas con confirmación y recordatorio automático al cliente pocas horas antes." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Centralización de pedidos de delivery", desc: "Unificación de órdenes de múltiples apps (PedidosYa, Rappi) hacia una pantalla central (KDS) en cocina." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Control de inventario en tiempo real", desc: "Descuento automático de ingredientes y materias primas según cada plato vendido, con alertas de stock crítico." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.ATENCION_CLIENTE, title: "Análisis de reseñas de Google Maps", desc: "Procesamiento automatizado de comentarios de clientes para medir satisfacción y detectar reclamos frecuentes." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.COMERCIAL_VENTAS, title: "Campañas de marketing por comportamiento", desc: "Envío de promociones personalizadas por email/WhatsApp basadas en qué consumió el cliente en su última visita." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.ATENCION_CLIENTE, title: "Respuestas a FAQs en redes sociales", desc: "Automatización de respuestas sobre menú, precios, alérgenos y horarios de apertura." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Control de asistencia del personal", desc: "Fichaje digital integrado con flujos de aprobación de francos y cálculo de nómina." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Reportes diarios de cierre", desc: "Envío automático al dueño de un resumen diario de ventas, ticket promedio y productos más vendidos vía Telegram." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.COMERCIAL_VENTAS, title: "Creación de contenido visual programado", desc: "Generación automática de placas y copys promocionales basados en los platos destacados de la semana." },
  { sector: "Gastronomía y Cafeterías", area: ServiceArea.COMERCIAL_VENTAS, title: "Programa de fidelización automatizado", desc: "Acumulación automática de puntos por visitas y envío de beneficios por cumpleaños." },

  // 4. Clínicas y Consultorios Médicos
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ATENCION_CLIENTE, title: "Gestión de turnos 24/7", desc: "Bot conversacional en WhatsApp para agendar, reprogramar o cancelar citas médicas sin intervención humana." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ATENCION_CLIENTE, title: "Reducción de ausentismo (No-show)", desc: "Envío automatizado de recordatorios de citas con confirmación por botón interactivo." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Integración de estudios médicos", desc: "Lectura y extracción de datos de laboratorios o imágenes en PDF para adjuntarlos automáticamente a la historia clínica." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ATENCION_CLIENTE, title: "Triaje automatizado inicial", desc: "Cuestionario conversacional de síntomas para derivar al paciente con el especialista adecuado." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Resúmenes clínicos estructurados", desc: "Generación automática de pre-diagnósticos o síntesis de antecedentes para lectura rápida del médico." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ATENCION_CLIENTE, title: "Recetas y pautas post-consulta", desc: "Envío automatizado de indicaciones médicas, recetas digitales y cuidados al paciente por canales seguros." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ATENCION_CLIENTE, title: "Seguimiento de pacientes crónicos", desc: "Alertas periódicas automatizadas para control de signos vitales o toma de medicamentos." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Sincronización de agendas profesionales", desc: "Unificación de la disponibilidad horaria de múltiples médicos en una sola vista para la recepción." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ATENCION_CLIENTE, title: "Encuestas de satisfacción de pacientes", desc: "Medición automatizada de la calidad de atención post-consulta médica." },
  { sector: "Clínicas y Consultorios Médicos", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Control de matrículas y habilitaciones", desc: "Alertas de vencimiento de certificaciones y permisos del staff médico." },

  // 5. E-commerce y Tiendas Minoristas
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Sincronización omnicanal de stock", desc: "Actualización en tiempo real del inventario entre Shopify, Mercado Libre y tiendas físicas." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.COMERCIAL_VENTAS, title: "Recuperación de carritos abandonados", desc: "Secuencias multicanal automatizadas por email y WhatsApp con incentivos personalizados." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Etiquetado y despacho logístico", desc: "Procesamiento automático de guías de envío y generación de etiquetas de operadores logísticos." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.ATENCION_CLIENTE, title: "Atención postventa automatizada", desc: "Resolución de dudas frecuentes sobre estados de envíos, talles y devoluciones mediante bots inteligentes." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.COMERCIAL_VENTAS, title: "Enriquecimiento de catálogos masivos", desc: "Generación y mejora automatizada de títulos, descripciones y atributos técnicos de productos usando IA." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Detección temprana de fraudes", desc: "Análisis automatizado de patrones de pago, direcciones IP y datos de compradores para bloquear transacciones riesgosas." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.ATENCION_CLIENTE, title: "Gestión automatizada de devoluciones", desc: "Emisión automática de etiquetas de devolución y validación de políticas de cambio." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Órdenes de compra automáticas", desc: "Generación de pre-órdenes a proveedores cuando un producto alcanza el nivel mínimo de stock." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.COMERCIAL_VENTAS, title: "Segmentación de clientes por comportamiento", desc: "Campañas de marketing hiperpersonalizadas según el historial de navegación y compras." },
  { sector: "E-commerce y Tiendas Minoristas", area: ServiceArea.ATENCION_CLIENTE, title: "Auditoría de feedback de productos", desc: "Análisis masivo de reseñas de clientes para detectar artículos con problemas recurrentes de calidad." },

  // 6. Gimnasios y Centros de Fitness
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Gestión de cobranzas y cuotas", desc: "Cobro automatizado de membresías y envío de avisos de suspensión temporal por falta de pago." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.COMERCIAL_VENTAS, title: "Reactivación de socios inactivos", desc: "Campañas automatizadas orientadas a recuperar usuarios que no asisten en las últimas semanas (prevención de baja)." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ATENCION_CLIENTE, title: "Inscripción a clases con cupo", desc: "Bot de WhatsApp para reservar lugares en clases grupales y gestión automática de listas de espera." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ATENCION_CLIENTE, title: "Planes de entrenamiento automatizados", desc: "Envío de rutinas y sugerencias nutricionales basadas en los objetivos declarados por el socio." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ATENCION_CLIENTE, title: "Onboarding de nuevos miembros", desc: "Secuencia automatizada de bienvenida con instrucciones de uso de instalaciones y reglas del lugar." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ATENCION_CLIENTE, title: "Gestión de entrenadores personales", desc: "Programación y recordatorios automáticos de sesiones de entrenamiento individual (PT)." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Análisis de horarios pico", desc: "Reportes automáticos de ocupación de salas para optimizar la grilla de clases." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ATENCION_CLIENTE, title: "Encuestas de retención (Churn)", desc: "Envío automático de cuestionarios de satisfacción a los 30, 60 y 90 días de permanencia." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Control de acceso por molinetes", desc: "Validación automatizada de la membresía activa al ingresar al establecimiento." },
  { sector: "Gimnasios y Centros de Fitness", area: ServiceArea.COMERCIAL_VENTAS, title: "Gamificación y retos mensuales", desc: "Generación automática de tablas de clasificación y retos para motivar la comunidad del gimnasio." },

  // 7. Agencias de Viajes y Turismo
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.COMERCIAL_VENTAS, title: "Itinerarios de viaje personalizados (IA)", desc: "Creación automática de propuestas de viaje adaptadas a las preferencias y presupuesto del cliente." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.COMERCIAL_VENTAS, title: "Monitoreo de tarifas aéreas y hoteles", desc: "Alertas automáticas cuando bajan los precios para clientes en lista de espera." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.ATENCION_CLIENTE, title: "Asistente de requisitos de viaje", desc: "Respuestas automatizadas 24/7 sobre visas, vacunas, restricciones y normativas de equipaje." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.ATENCION_CLIENTE, title: "Envío preventivo de documentación", desc: "Entrega automatizada de vouchers, pasajes y guías del destino días antes de la partida." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.ATENCION_CLIENTE, title: "Alertas de incidencias en vuelos", desc: "Notificación automática a los pasajeros ante cancelaciones, cambios de horario o alertas meteorológicas." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.ATENCION_CLIENTE, title: "Seguimiento post-viaje", desc: "Secuencias automatizadas para solicitar opiniones, reseñas y evaluar la experiencia del servicio prestado." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Sincronización con operadores mayoristas", desc: "Integración de reservas en tiempo real mediante APIs con proveedores hoteleros y aéreos." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.COMERCIAL_VENTAS, title: "Venta cruzada de seguros de viaje", desc: "Ofrecimiento automático de pólizas médicas de asistencia en viaje al confirmar vuelos." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Gestión de reembolsos y cancelaciones", desc: "Procesamiento automático de solicitudes de devolución y notas de crédito." },
  { sector: "Agencias de Viajes y Turismo", area: ServiceArea.COMERCIAL_VENTAS, title: "Boletines de ofertas estacionales", desc: "Segmentación automatizada de paquetes turísticos según época del año." },

  // 8. Talleres Mecánicos y Repuesteras
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ATENCION_CLIENTE, title: "Notificación de estado de reparación", desc: "Envío automático por WhatsApp de fotos y estado del vehículo (en diagnóstico, en reparación, listo)." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.COMERCIAL_VENTAS, title: "Búsqueda automatizada de repuestos", desc: "Consulta cruzada de códigos de repuesto en múltiples distribuidores para encontrar el mejor precio." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ATENCION_CLIENTE, title: "Recordatorios de mantenimiento preventivo", desc: "Alertas periódicas por WhatsApp para cambio de aceite, correa o alineación según kilometraje estimado." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ATENCION_CLIENTE, title: "Agendamiento de turnos de taller", desc: "Reserva automatizada de citas de revisión para evitar cuellos de botella en la recepción." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Generación de presupuestos express", desc: "Creación de cotizaciones en PDF basadas en mano de obra y repuestos escaneados por voz o texto." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Recepción digital de vehículos", desc: "Checklist en tablet con fotos de daños previos y firma digital del cliente al dejar la unidad." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Control de repuestos en consignación", desc: "Seguimiento automático de partes usadas e inventario con proveedores." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ATENCION_CLIENTE, title: "Asistencia en ruta 24/7 (IA)", desc: "Bot de triaje inicial para ubicar vehículos averiados y coordinar grúas." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.COMERCIAL_VENTAS, title: "Venta de accesorios y neumáticos", desc: "Recomendaciones automáticas de productos complementarios según la marca del vehículo." },
  { sector: "Talleres Mecánicos y Repuesteras", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Reportes de eficiencia por mecánico", desc: "Medición automática del tiempo invertido vs. tiempo presupuestado por orden de trabajo." },

  // 9. Empresas de Logística y Última Milla
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ATENCION_CLIENTE, title: "Tracking de paquetes por WhatsApp", desc: "Respuestas automáticas al destinatario sobre la ubicación exacta y ventana horaria de entrega." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Optimización de rutas con IA", desc: "Cálculo automatizado de trayectos óptimos para choferes considerando tráfico y ventanas de entrega." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Prueba de entrega digital (POD)", desc: "Captura de foto, firma y geolocalización enviadas en tiempo real al sistema central." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ATENCION_CLIENTE, title: "Reprogramación de entregas fallidas", desc: "Bot automático que acuerda una nueva fecha con el destinatario si no se lo encontró." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Clasificación por visión artificial", desc: "Escaneo rápido de etiquetas e imponderables en depósitos para derivación de paquetería." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Control de flotas y mantenimientos", desc: "Alertas automatizadas sobre VTV, service de camiones y vencimiento de licencias de conducir." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Gestión automatizada de remitos", desc: "Extracción de datos de remitos físicos mediante OCR para liquidación de servicios a transportistas." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ATENCION_CLIENTE, title: "Alertas de demora en tránsito", desc: "Avisos automáticos a clientes cuando un envío sufre un imprevisto en ruta." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.COMERCIAL_VENTAS, title: "Cotizador automático de fletes", desc: "Cálculo instantáneo de tarifas de envío según peso, volumen y código postal de origen y destino." },
  { sector: "Empresas de Logística y Última Milla", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Liquidación de choferes externos", desc: "Cálculo automatizado de pagos por paquete entregado o kilómetros recorridos." },

  // 10. Academias y Centros de Capacitación
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ATENCION_CLIENTE, title: "Atención de dudas de programas académicos", desc: "Respuestas 24/7 sobre planes de estudio, fechas de inicio, aranceles y certificaciones." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Inscripción y matriculación automatizada", desc: "Procesamiento de pagos, emisión de comprobantes y creación del perfil en la plataforma de clases (LMS)." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ATENCION_CLIENTE, title: "Tutoría de apoyo con IA", desc: "Asistente de estudio disponible para responder preguntas frecuentes sobre los contenidos del curso." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Corrección automatizada de ejercicios", desc: "Evaluación instantánea de trabajos prácticos y cuestionarios de opción múltiple o código." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ATENCION_CLIENTE, title: "Recordatorios de entregas y exámenes", desc: "Alertas periódicas por WhatsApp para evitar que los estudiantes pierdan fechas límite." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Emisión de certificados digitales", desc: "Generación automática de diplomas en PDF con código QR de verificación de autenticidad." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.COMERCIAL_VENTAS, title: "Campañas de remarketing académico", desc: "Ofertas de cursos avanzados automatizadas para alumnos que completaron niveles iniciales." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ATENCION_CLIENTE, title: "Control de asistencia a clases en vivo", desc: "Registro automático de presentismo en sesiones de Zoom o Google Meet." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ATENCION_CLIENTE, title: "Encuestas de calidad docente", desc: "Recolección y análisis automatizado del feedback de alumnos sobre los profesores." },
  { sector: "Academias y Centros de Capacitación", area: ServiceArea.ADMINISTRACION_OPERATIVA, title: "Gestión de becas y descuentos", desc: "Validación automatizada de requisitos de postulantes a asistencia económica." },
];

const companyKnowledgeData = [
  {
    categoria: "Tiempos e Implementación",
    clave: "tiempo_implementacion",
    pregunta: "¿Cuánto tiempo tardan en implementar un proyecto de automatización o agente de IA?",
    respuesta: "El desarrollo, configuración e integración completa de una solución de automatización a medida suele tomar entre 2 y 4 semanas, dependiendo de la cantidad de sistemas a conectar. Para bots o integraciones más básicas, la puesta en marcha puede ser menor.",
    tags: ["tiempo", "desarrollo", "duracion", "implementacion"],
    orden: 1,
  },
  {
    categoria: "Tiempos e Implementación",
    clave: "propuesta_inicial",
    pregunta: "¿Cuánto tardan en enviarme la propuesta técnica inicial?",
    respuesta: "Tras la primera reunión o consulta, te enviamos la propuesta técnica detallada con el alcance y el retorno de inversión estimado en un plazo de 48 horas sin costo.",
    tags: ["propuesta", "presupuesto", "48hs", "diagnostico"],
    orden: 2,
  },
  {
    categoria: "Integraciones y Compatibilidad",
    clave: "sistemas_compatibles",
    pregunta: "¿Con qué sistemas, CRMs o software actuales se pueden integrar los agentes de IA?",
    respuesta: "Nos integramos a lo que ya usás: Supabase, HubSpot, Salesforce, Zoho, Mercado Libre, Google Sheets, WhatsApp Business, ERPs propietarios y cualquier plataforma con API o Webhook.",
    tags: ["crm", "integraciones", "software", "api", "supabase"],
    orden: 3,
  },
  {
    categoria: "Servicios y Capacidades",
    clave: "agente_voz",
    pregunta: "¿Cómo funciona el agente de voz por teléfono de Busago?",
    respuesta: "El agente de voz atiende y realiza llamadas telefónicas en tiempo real con voz humana fluida en español, respondiendo consultas, calificando prospectos y agendando turnos en directo.",
    tags: ["voz", "telefono", "llamadas", "livekit"],
    orden: 4,
  },
  {
    categoria: "Servicios y Capacidades",
    clave: "atencion_247",
    pregunta: "¿La IA atiende fuera del horario comercial o fines de semana?",
    respuesta: "Sí, todos los agentes de IA de Busago operan de forma autónoma las 24 horas del día, los 7 días de la semana, los 365 días del año sin interrupciones.",
    tags: ["24/7", "horario", "guardia", "disponibilidad"],
    orden: 5,
  },
  {
    categoria: "Soporte y Mantenimiento",
    clave: "soporte_tecnico",
    pregunta: "¿Qué soporte técnico y mantenimiento ofrecen post-implementación?",
    respuesta: "Ofrecemos monitoreo constante del rendimiento de la IA, mantenimiento preventivo de integraciones y soporte técnico dedicado para asegurar un 99.9% de operatividad continua.",
    tags: ["soporte", "mantenimiento", "uptime", "garantia"],
    orden: 6,
  },
  {
    categoria: "Uso y Capacitación",
    clave: "capacitacion_equipo",
    pregunta: "¿Mi equipo necesita conocimientos técnicos o de programación para usar los agentes?",
    respuesta: "No, las automatizaciones se integran a los canales que tu equipo ya maneja (como WhatsApp, email o tu CRM). Además, entregamos capacitaciones prácticas y manuales de uso.",
    tags: ["capacitacion", "dificultad", "equipo", "entrenamiento"],
    orden: 7,
  },
  {
    categoria: "Seguridad y Privacidad",
    clave: "seguridad_datos",
    pregunta: "¿Cómo garantizan la seguridad y privacidad de la información de mi empresa?",
    respuesta: "Toda la información viaja y se almacena encriptada bajo estándares estrictos (AES-256) en Supabase, cumpliendo normativas de privacidad y confidencialidad estricta.",
    tags: ["seguridad", "privacidad", "encriptacion", "gdpr"],
    orden: 8,
  },
  {
    categoria: "Escalabilidad",
    clave: "escalabilidad_volumen",
    pregunta: "¿Qué sucede si el volumen de consultas aumenta drásticamente en fechas pico?",
    respuesta: "La infraestructura en la nube escala automáticamente para procesar desde decenas hasta miles de conversaciones o llamadas en paralelo sin saturarse ni degradar la velocidad.",
    tags: ["escalabilidad", "volumen", "pico", "rendimiento"],
    orden: 9,
  },
  {
    categoria: "Operativa",
    clave: "derivacion_humana",
    pregunta: "¿La IA reemplaza a mi equipo humano o trabaja en conjunto?",
    respuesta: "Trabaja en conjunto. La IA filtra el 80% de las tareas repetitivas (preguntas frecuentes, calificación y agendamiento) y deriva los casos complejos o cierres comerciales al equipo humano.",
    tags: ["equipo", "derivacion", "hibrido", "humano"],
    orden: 10,
  },
  {
    categoria: "Canales",
    clave: "canales_disponibles",
    pregunta: "¿En qué canales de comunicación se pueden desplegar los bots de IA?",
    respuesta: "Los agentes pueden operar simultáneamente en WhatsApp Business, sitios web (chat widget y voz), llamadas telefónicas, correo electrónico y redes sociales.",
    tags: ["canales", "whatsapp", "web", "llamadas", "email"],
    orden: 11,
  },
  {
    categoria: "Precios y Modelo",
    clave: "estructura_costos",
    pregunta: "¿Cómo es la estructura de costos de las automatizaciones de Busago?",
    respuesta: "Ofrecemos esquemas según la complejidad del proyecto y el volumen mensual de interacciones. Entregamos presupuestos cerrados y transparentes sin costos ocultos.",
    tags: ["precio", "costos", "planes", "presupuesto"],
    orden: 12,
  },
  {
    categoria: "Personalización",
    clave: "tono_marca",
    pregunta: "¿Se puede adaptar la personalidad y tono de voz de la IA a mi marca?",
    respuesta: "Sí, configuramos el prompt de la IA con la identidad, tono (formal, amigable, técnico) y léxico específico de tu empresa o sector.",
    tags: ["tono", "personalidad", "prompt", "marca"],
    orden: 13,
  },
  {
    categoria: "Métricas y Control",
    clave: "reportes_metricas",
    pregunta: "¿Cómo puedo ver los resultados y métricas de la IA?",
    respuesta: "Disponés de tableros de control con estadísticas en tiempo real sobre conversaciones mantenidas, leads calificados, turnos agendados y tiempo de respuesta.",
    tags: ["reportes", "metricas", "dashboard", "kpis"],
    orden: 14,
  },
  {
    categoria: "Idiomas",
    clave: "idiomas_soporte",
    pregunta: "¿En qué idiomas pueden responder los agentes de IA?",
    respuesta: "Atienden principalmente en español latinoamericano (adaptado a modismos locales), pero también pueden atender nativamente en inglés, portugués y otros idiomas.",
    tags: ["idiomas", "espanol", "ingles", "portugues"],
    orden: 15,
  },
  {
    categoria: "Ventas y Triaje",
    clave: "calificacion_prospectos",
    pregunta: "¿Cómo realiza la IA el triaje o calificación de prospectos?",
    respuesta: "La IA realiza preguntas clave predefinidas (como presupuesto disponible, urgencia, zona o necesidades) y asigna un puntaje de prioridad antes de agendar o notificar a un vendedor.",
    tags: ["triaje", "calificacion", "leads", "ventas"],
    orden: 16,
  },
  {
    categoria: "Agendamiento",
    clave: "sincronizacion_calendario",
    pregunta: "¿El agendamiento de turnos se conecta directamente con mi calendario?",
    respuesta: "Sí, se sincroniza en tiempo real con Google Calendar, Microsoft Outlook o el CRM de tu empresa para evitar superposiciones de horarios.",
    tags: ["calendario", "turnos", "google calendar", "outlook"],
    orden: 17,
  },
  {
    categoria: "Documentos e Inteligencia OCR",
    clave: "procesamiento_ocr",
    pregunta: "¿La IA puede leer y extraer datos de documentos o facturas en PDF?",
    respuesta: "Sí, procesa PDFs, imágenes, recibos de sueldo, contratos y facturas mediante IA de visión u OCR para cargar los datos extraídos en tu base de datos o sistema contable.",
    tags: ["ocr", "pdf", "facturas", "lectura", "documentos"],
    orden: 18,
  },
  {
    categoria: "Pruebas y Demos",
    clave: "demo_envivo",
    pregunta: "¿Puedo probar una demostración en vivo antes de contratar?",
    respuesta: "¡Por supuesto! Podés interactuar con nuestro agente de voz y chat FAQ directamente en nuestra página web o solicitar una demo a medida para tu rubro.",
    tags: ["demo", "prueba", "ensayo", "envivo"],
    orden: 19,
  },
  {
    categoria: "Flexibilidad",
    clave: "ajustes_futuros",
    pregunta: "¿Puedo modificar las respuestas o agregar nuevos procesos más adelante?",
    respuesta: "Sí, la arquitectura de Busago es totalmente modular. Podés ajustar flujos, actualizar información o agregar nuevas automatizaciones en cualquier momento.",
    tags: ["ajustes", "cambios", "modular", "flexibilidad"],
    orden: 20,
  },
  // --- DATOS EXTRAÍDOS DE LA PROPUESTA COMERCIAL OFICIAL (PDF) ---
  {
    categoria: "Precios y Planes",
    clave: "plan_basica",
    pregunta: "¿Cuáles son las características y costo del Plan Básica / Módulo Inicial?",
    respuesta: "El Plan Básica / Módulo Inicial incluye bots de atención automatizada, respuestas frecuentes y FAQs inteligentes. Inversión Setup (única vez): $250 USD (75% OFF Fundadores, precio regular $1,000 USD). Mantenimiento mensual: $500 USD/mes (con 50% OFF los primeros 3 meses a solo $250 USD/mes).",
    tags: ["precio", "plan basica", "setup", "mantenimiento", "descuento"],
    orden: 21,
  },
  {
    categoria: "Precios y Planes",
    clave: "plan_intermedia",
    pregunta: "¿Cuáles son las características y costo del Plan Intermedia / Estándar (Más Popular)?",
    respuesta: "El Plan Intermedia / Estándar (el más popular) incluye CRM integrado, OCR de facturación, agendas inteligentes y sincronización multicanal. Inversión Setup (única vez): $625 USD (75% OFF Fundadores, precio regular $2,500 USD). Mantenimiento mensual: $750 USD/mes (con 50% OFF los primeros 3 meses a solo $375 USD/mes).",
    tags: ["precio", "plan intermedia", "estandar", "popular", "crm", "ocr"],
    orden: 22,
  },
  {
    categoria: "Precios y Planes",
    clave: "plan_avanzada",
    pregunta: "¿Cuáles son las características y costo del Plan Avanzada / Enterprise?",
    respuesta: "El Plan Avanzada / Enterprise ofrece un ecosistema completo multicanal, IA predictiva, bases de datos avanzadas y ERP custom. Inversión Setup (única vez): $1,250 USD (75% OFF Fundadores, precio regular $5,000 USD). Mantenimiento mensual: $1,000 USD/mes (con 50% OFF los primeros 3 meses a solo $500 USD/mes).",
    tags: ["precio", "plan avanzada", "enterprise", "custom", "erp"],
    orden: 23,
  },
  {
    categoria: "Combos Estratégicos",
    clave: "combos_estrategicos",
    pregunta: "¿Qué combos estratégicos (Ahorro Pack) ofrecen?",
    respuesta: "Ofrecemos dos paquetes empaquetados de alto impacto: 1) Combo Comercial: captación de leads en redes, WhatsApp inteligente y agendamiento automático. 2) Combo Operativo: lectura de facturas OCR con IA y reportes ejecutivos automáticos.",
    tags: ["combos", "ahorro pack", "comercial", "operativo", "paquetes"],
    orden: 24,
  },
  {
    categoria: "Comparativa Operativa",
    clave: "manual_vs_ia",
    pregunta: "¿Cuál es el verdadero costo de la operación manual comparado con la IA de Busago?",
    respuesta: "1) Costo: Empleado manual requiere sueldo + 40-60% de cargas sociales; Busago ofrece mantenimiento mensual predecible. 2) Disponibilidad: Manual 8h/día 5 días a la semana; Busago 24/7/365 sin descanso. 3) Imprevistos: Manual sufre ausentismo y licencias; Busago cero ausentismo ni litigios. 4) Precisión: Manual propenso a fatiga y tipeo; Busago ejecución instantánea sin errores.",
    tags: ["comparativa", "costo manual", "beneficios ia", "ahorro"],
    orden: 25,
  },
  {
    categoria: "Glosario Técnico",
    clave: "glosario_pdf_completo",
    pregunta: "¿Qué tecnologías principales utiliza Busago según el glosario técnico?",
    respuesta: "1) CRM: almacenamiento y actualización automática de prospectos. 2) OCR: lectura automática de facturas y contratos en PDF/imagen. 3) APIs y Webhooks: conectores en tiempo real entre sistemas. 4) LLMs: cerebros de IA entrenados con los datos de tu empresa. 5) n8n: orquestación autónoma de flujos de trabajo.",
    tags: ["glosario", "crm", "ocr", "api", "llm", "n8n"],
    orden: 26,
  },
  {
    categoria: "Promociones y Próximos Pasos",
    clave: "consultoria_fundadores",
    pregunta: "¿Cómo funciona la consultoría técnica gratuita y el descuento de fundadores?",
    respuesta: "Analizamos los procesos de tu empresa en una sesión de 30 minutos sin costo para calcular tu ahorro de tiempo y dinero. Los cupos con 75% OFF en Setup y 50% OFF en el primer trimestre de mantenimiento están reservados para los primeros socios estratégicos.",
    tags: ["consultoria", "gratis", "fundadores", "75% off", "proximo paso"],
    orden: 27,
  },
];

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function main() {
  console.log("Iniciando sembrado de 10 sectores, 100 automatizaciones y 20 datos de conocimiento en Supabase...");

  // Limpiamos los servicios y la base de conocimiento para asegurar frescura total
  await prisma.service.deleteMany({});
  await prisma.companyKnowledge.deleteMany({});
  console.log("Tablas 'services' y 'company_knowledge' limpiadas exitosamente.");

  let index = 1;

  for (const item of rawServicesData) {
    const slug = `${slugify(item.sector)}-${slugify(item.title)}`;
    const icon = sectorIcons[item.sector] || defaultSvg;

    const isFeatured = index % 10 === 1;

    await prisma.service.create({
      data: {
        slug,
        area: item.area,
        categoria: item.sector,
        tituloServicio: item.title,
        descripcionCorta: item.desc,
        descripcionLarga: `Solución especializada de automatización e inteligencia artificial para el sector de ${item.sector}: ${item.title}. ${item.desc} Diseñada e integrada a medida de los sistemas existentes de tu empresa por el equipo técnico de Busago.`,
        iconoSvg: icon,
        destacado: isFeatured,
        orden: index,
        seoKeywords: [
          `automatización ${item.sector.toLowerCase()}`,
          `IA ${item.title.toLowerCase()}`,
          `busago ${item.sector.toLowerCase()}`,
        ],
      },
    });

    index++;
  }

  console.log(`Se crearon ${index - 1} automatizaciones en 10 sectores.`);

  // Carga de la base de conocimiento
  for (const kItem of companyKnowledgeData) {
    await prisma.companyKnowledge.create({
      data: kItem,
    });
  }

  console.log(`Se sembraron ${companyKnowledgeData.length} registros de conocimiento operativo en Supabase.`);
  console.log("¡Sembrado completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error durante el sembrado:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
