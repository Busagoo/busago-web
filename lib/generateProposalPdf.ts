import { jsPDF } from "jspdf";

export interface ProposalPdfData {
  nombre: string;
  email: string;
  empresa?: string;
  tituloServicio?: string;
}

export function generateProposalPdf(data: ProposalPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Colors
  const darkNavy = "#0c1238";
  const brandBlue = "#4356fd";
  const cyanAccent = "#5ee6d8";
  const greenAccent = "#059669";
  const redAccent = "#dc2626";
  const bgLight = "#f8fafc";
  const textDark = "#0f172a";
  const textMuted = "#475569";
  const borderColor = "#e2e8f0";

  // Helper for drawing rounded boxes
  function drawCardBox(y: number, height: number, borderCol = borderColor, bgCol = bgLight) {
    doc.setFillColor(bgCol);
    doc.setDrawColor(borderCol);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, height, 3, 3, "FD");
  }

  // Helper for section titles
  function drawSectionTitle(y: number, num: string, title: string) {
    doc.setFillColor(brandBlue);
    doc.rect(margin, y, 3, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(darkNavy);
    doc.text(`${num}. ${title}`, margin + 5, y + 5);
  }

  // Helper for footer
  function drawFooter(pageNum: number) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#94a3b8");
    doc.text("Busago.Studio — Propuesta Comercial", margin, pageHeight - 10);
    doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  }

  // ==========================================
  // PAGE 1
  // ==========================================

  // Header Banner
  doc.setFillColor(darkNavy);
  doc.roundedRect(margin, 12, contentWidth, 38, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor("#ffffff");
  doc.text("BUSAGO.STUDIO", pageWidth / 2, 23, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(cyanAccent);
  doc.text("PROPUESTA COMERCIAL", pageWidth / 2, 29, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor("#ffffff");
  doc.text("Revoluciona tu Empresa con IA y Automatización a Medida", pageWidth / 2, 35, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor("#cbd5e1");
  const bannerSubtitle = "Maximiza la eficiencia operativa, elimina costos ocultos de personal y escala tu negocio sin fricciones las 24 horas.";
  doc.text(bannerSubtitle, pageWidth / 2, 42, { align: "center" });

  let curY = 56;

  // Section 1
  drawSectionTitle(curY, "1", "El Verdadero Costo de la Operación Manual vs. IA");
  curY += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted);
  const s1Text = "Para cualquier empresario o dueño de PyME, la gestión tradicional de personal para tareas repetitivas conlleva una carga financiera y operativa gigantesca. Mantener equipos humanos en labores mecánicas no solo drena la rentabilidad, sino que introduce errores y limita el crecimiento.";
  const s1Lines = doc.splitTextToSize(s1Text, contentWidth);
  doc.text(s1Lines, margin, curY);
  curY += s1Lines.length * 4.2 + 4;

  // Table vs IA
  const tableY = curY;
  const colW1 = 45;
  const colW2 = 65;
  const colW3 = 70;
  const rowH = 14;

  // Table Header
  doc.setFillColor(darkNavy);
  doc.rect(margin, tableY, contentWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor("#ffffff");
  doc.text("Concepto / Gasto", margin + 3, tableY + 5.5);
  doc.text("Empleado Tradicional (Manual)", margin + colW1 + 3, tableY + 5.5);
  doc.text("Automatización Busago.Studio", margin + colW1 + colW2 + 3, tableY + 5.5);

  const rowsData = [
    {
      c1: "Costo Mensual",
      c2: "Sueldo elevado + Cargas sociales (40-60% extra)",
      c3: "Mantenimiento mensual predecible y optimizado",
    },
    {
      c1: "Disponibilidad",
      c2: "8 horas diarias, 5 días a la semana (Fines de semana inactivos)",
      c3: "24 horas al día, 365 días del año sin descanso",
    },
    {
      c1: "Imprevistos",
      c2: "Vacaciones, licencias por enfermedad, indemnizaciones, rotación",
      c3: "Cero ausentismo, sin conflictos gremiales ni legales",
    },
    {
      c1: "Precisión y Velocidad",
      c2: "Propenso a fatiga, olvidos de tipeo y demoras operativas",
      c3: "Ejecución instantánea, datos precisos y sin errores",
    },
  ];

  let rY = tableY + 8;
  rowsData.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? "#ffffff" : bgLight);
    doc.setDrawColor(borderColor);
    doc.rect(margin, rY, contentWidth, rowH, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(textDark);
    doc.text(row.c1, margin + 3, rY + 8);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(redAccent);
    const c2Lines = doc.splitTextToSize(row.c2, colW2 - 5);
    doc.text(c2Lines, margin + colW1 + 3, rY + 5.5);

    doc.setTextColor(greenAccent);
    doc.setFont("helvetica", "bold");
    const c3Lines = doc.splitTextToSize(row.c3, colW3 - 5);
    doc.text(c3Lines, margin + colW1 + colW2 + 3, rY + 5.5);

    rY += rowH;
  });

  curY = rY + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  const impactText = "Impacto Financiero Directo: Automatizar la atención, facturación o triaje comercial reduce drásticamente los costos de mano de obra improductiva, redirigiendo tu presupuesto a la expansión estratégica.";
  const impactLines = doc.splitTextToSize(impactText, contentWidth);
  doc.text(impactLines, margin, curY);
  curY += impactLines.length * 4 + 6;

  // Section 2
  drawSectionTitle(curY, "2", "Soluciones a Medida & Combos Estratégicos");
  curY += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted);
  const s2Text = "En Busago.Studio sabemos que cada empresa es única. Por eso, no ofrecemos soluciones encorsetadas. Trabajamos con opciones flexibles adaptadas a tus necesidades reales:";
  doc.text(s2Text, margin, curY);
  curY += 8;

  // Box 1: Planes 100% a medida
  drawCardBox(curY, 28, brandBlue, "#f8fafc");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(brandBlue);
  doc.text("Planes 100% a Medida", margin + 5, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  doc.text("• Analizamos los flujos internos de tu empresa y diseñamos la arquitectura digital exacta que necesitas.", margin + 5, curY + 12);
  doc.text("• Conectamos tus bases de datos, pasarelas de pago y sistemas legados sin alterar tu operativa diaria.", margin + 5, curY + 17);
  doc.text("• Ideal para empresas con requerimientos específicos, ERPs propios o procesos complejos de alta especialización.", margin + 5, curY + 22);

  curY += 32;

  // Box 2: Combos Estratégicos
  drawCardBox(curY, 22, greenAccent, "#f8fafc");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(greenAccent);
  doc.text("Combos Estratégicos (Ahorro Pack)", margin + 5, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  doc.text("• Combo Comercial: Leads en redes, WhatsApp inteligente y agendamiento automático.", margin + 5, curY + 12);
  doc.text("• Combo Operativo: Lectura de facturas OCR con IA y reportes ejecutivos automáticos.", margin + 5, curY + 17);

  curY += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  const flexText = "Flexibilidad Absoluta: Ya sea que elijas un combo o un desarrollo completamente personalizado desde cero, garantizamos integración total y escalabilidad a prueba de futuro.";
  doc.text(doc.splitTextToSize(flexText, contentWidth), margin, curY);

  drawFooter(1);

  // ==========================================
  // PAGE 2
  // ==========================================
  doc.addPage();
  curY = 15;

  drawSectionTitle(curY, "3", "Inversión Inteligente & Descuento de Fundadores");
  curY += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted);
  const s3Text = "Nuestros proyectos se estructuran en dos fases: la Implementación Inicial (Setup) a medida y la Cuota de Mantenimiento Mensual de la infraestructura de IA y servidores.";
  doc.text(doc.splitTextToSize(s3Text, contentWidth), margin, curY);
  curY += 10;

  // Helper for Pricing Box Cards
  function drawPricingCard(
    y: number,
    planTitle: string,
    planDesc: string,
    oldSetup: string,
    newSetup: string,
    monthlyPrice: string,
    promoText: string,
    isPopular = false
  ) {
    const cardBorder = isPopular ? brandBlue : borderColor;
    const cardBg = isPopular ? "#f0f3ff" : "#ffffff";
    drawCardBox(y, 36, cardBorder, cardBg);

    // Pill: 75% OFF FUNDADORES
    doc.setFillColor(greenAccent);
    doc.roundedRect(pageWidth - margin - 42, y + 4, 38, 5, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor("#ffffff");
    doc.text("75% OFF FUNDADORES", pageWidth - margin - 23, y + 7.5, { align: "center" });

    // Plan Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(isPopular ? brandBlue : textDark);
    doc.text(planTitle, margin + 5, y + 8);

    // Plan Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted);
    doc.text(planDesc, margin + 5, y + 14);

    // Inner Pricing Box
    doc.setDrawColor(isPopular ? brandBlue : borderColor);
    doc.roundedRect(margin + 5, y + 17, contentWidth - 10, 15, 2, 2, "D");

    // Left Column: Setup
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted);
    doc.text("INVERSIÓN SETUP (ÚNICA VEZ)", margin + 8, y + 21.5);

    // Old Price with Strikethrough Line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(redAccent);
    doc.text(oldSetup, margin + 8, y + 27.5);
    const oldW = doc.getTextWidth(oldSetup);
    doc.setDrawColor(redAccent);
    doc.setLineWidth(0.4);
    doc.line(margin + 8, y + 25.8, margin + 8 + oldW, y + 25.8);

    // New Price Arrow & Green Text
    doc.setTextColor(greenAccent);
    doc.setFont("helvetica", "bold");
    doc.text(`→  ${newSetup}`, margin + 8 + oldW + 3, y + 27.5);

    // Right Column: Mantenimiento Mensual
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted);
    doc.text("MANTENIMIENTO MENSUAL", margin + 82, y + 21.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(textDark);
    doc.text(monthlyPrice, margin + 82, y + 27.5);

    const mWidth = doc.getTextWidth(monthlyPrice);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(greenAccent);
    doc.text(promoText, margin + 82 + mWidth + 3, y + 27.5);
  }

  // Plan 1: Basica
  drawPricingCard(
    curY,
    "Plan Básica / Módulo Inicial",
    "Bots de atención automatizada, respuestas frecuentes y FAQs inteligentes.",
    "$1,000 USD",
    "$250 USD",
    "$500 USD/mes",
    "(50% OFF 1er 3 meses: solo $250 USD/mes!)",
    false
  );
  curY += 40;

  // Plan 2: Intermedia (Popular)
  drawPricingCard(
    curY,
    "Plan Intermedia / Estándar (Más Popular)",
    "CRM integrado, OCR de facturación, agendas inteligentes y sincronización multicanal.",
    "$2,500 USD",
    "$625 USD",
    "$750 USD/mes",
    "(50% OFF 1er 3 meses: solo $375 USD/mes!)",
    true
  );
  curY += 40;

  // Plan 3: Avanzada / Enterprise
  drawPricingCard(
    curY,
    "Plan Avanzada / Enterprise",
    "Ecosistema completo multicanal, IA predictiva, bases de datos avanzadas y ERP custom.",
    "$5,000 USD",
    "$1,250 USD",
    "$1,000 USD/mes",
    "(50% OFF 1er 3 meses: solo $500 USD/mes!)",
    false
  );
  curY += 44;

  // Section 4: Glosario
  drawSectionTitle(curY, "4", "Glosario Técnico: Entendiendo la Tecnología");
  curY += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted);
  doc.text("Sabemos que la jerga técnica puede parecer compleja. Aquí te explicamos de manera sencilla qué significa cada herramienta:", margin, curY);
  curY += 7;

  // Item 1: CRM
  drawCardBox(curY, 20, borderColor, "#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(brandBlue);
  doc.text("CRM (Customer Relationship Management)", margin + 5, curY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  const crmLines = doc.splitTextToSize("Sistema central donde se almacena toda la información de tus clientes y prospectos. Lo conectamos con IA para que ningún cliente quede sin responder y se actualice solo.", contentWidth - 10);
  doc.text(crmLines, margin + 5, curY + 11);

  curY += 23;

  // Item 2: OCR
  drawCardBox(curY, 20, borderColor, "#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(brandBlue);
  doc.text("OCR (Optical Character Recognition)", margin + 5, curY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  const ocrLines = doc.splitTextToSize("Tecnología que permite a la IA \"leer\" facturas, recibos o contratos en PDF o imagen, extrayendo montos y CUITS automáticamente para cargarlos a tu sistema contable sin tipeo humano.", contentWidth - 10);
  doc.text(ocrLines, margin + 5, curY + 11);

  curY += 23;

  // Item 3: APIs y Webhooks
  drawCardBox(curY, 18, borderColor, "#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(brandBlue);
  doc.text("APIs y Webhooks", margin + 5, curY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  const apiLines = doc.splitTextToSize("Puentes digitales invisibles que permiten que tus aplicaciones hablen entre sí en tiempo real (por ejemplo, que un pago en Mercado Pago active automáticamente el envío).", contentWidth - 10);
  doc.text(apiLines, margin + 5, curY + 11);

  drawFooter(2);

  // ==========================================
  // PAGE 3
  // ==========================================
  doc.addPage();
  curY = 15;

  // Item 4: LLMs
  drawCardBox(curY, 20, borderColor, "#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(brandBlue);
  doc.text("LLMs (Large Language Models)", margin + 5, curY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  const llmLines = doc.splitTextToSize("Cerebros de IA generativa entrenados con los datos de tu empresa para conversar con naturalidad, redactar correos, clasificar urgencias o asesorar clientes con precisión milimétrica.", contentWidth - 10);
  doc.text(llmLines, margin + 5, curY + 11);

  curY += 24;

  // Item 5: n8n
  drawCardBox(curY, 20, borderColor, "#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(brandBlue);
  doc.text("n8n y Automatización de Flujos", margin + 5, curY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  const n8nLines = doc.splitTextToSize("Plataforma de orquestación de procesos. Conecta disparadores y acciones para que las tareas repetitivas ocurran en segundos de forma 100% autónoma y segura.", contentWidth - 10);
  doc.text(n8nLines, margin + 5, curY + 11);

  curY += 30;

  // Section: Próximo paso
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkNavy);
  doc.text("Próximo Paso: Da el Salto Definitivo", margin, curY);
  curY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted);
  doc.text("Deja atrás los costos fijos elevados, el ausentismo y los errores operativos manuales.", margin, curY);
  curY += 10;

  // Green Box: Consultoria
  drawCardBox(curY, 34, greenAccent, "#f0fdf4");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(greenAccent);
  doc.text("Consultoría Técnica Gratuita", margin + 5, curY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textDark);
  doc.text("Analizaremos los procesos de tu empresa en una sesión de 30 minutos y te mostraremos exactamente cuánto dinero y tiempo ahorrarás.", margin + 5, curY + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(greenAccent);
  const promoText = "¿Por qué comenzar ahora? Los cupos con el 75% de descuento en setup y el 50% de descuento en los primeros 3 meses de mantenimiento están disponibles exclusivamente para nuestros primeros socios estratégicos.";
  doc.text(doc.splitTextToSize(promoText, contentWidth - 10), margin + 5, curY + 22);

  curY += 44;

  // Contact Button Banner
  doc.setFillColor(darkNavy);
  doc.roundedRect(margin, curY, contentWidth, 14, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#ffffff");
  doc.text("CONTÁCTANOS EN BUSAGO.STUDIO", pageWidth / 2, curY + 9, { align: "center" });

  drawFooter(3);

  return doc;
}
