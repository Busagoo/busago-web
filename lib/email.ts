import { getCloudflareContext } from "@opennextjs/cloudflare";

export const DEFAULT_ADMIN_EMAIL = "frendo.ytza242@gmail.com";

type ResendEnv = { RESEND_API_KEY?: string };

function getEnv(): ResendEnv & { LEADS_NOTIFICATION_EMAIL?: string } {
  let cfEnv: Record<string, any> = {};
  try {
    const ctx = getCloudflareContext();
    if (ctx && ctx.env) {
      cfEnv = ctx.env as Record<string, any>;
    }
  } catch {
    // Fuera del contexto de Cloudflare o en modo sincrónico
  }

  return {
    RESEND_API_KEY:
      cfEnv.RESEND_API_KEY ??
      (typeof process !== "undefined" ? process.env.RESEND_API_KEY : undefined),
    LEADS_NOTIFICATION_EMAIL:
      cfEnv.LEADS_NOTIFICATION_EMAIL ??
      (typeof process !== "undefined" ? process.env.LEADS_NOTIFICATION_EMAIL : undefined) ??
      DEFAULT_ADMIN_EMAIL,
  };
}

async function sendEmail(
  env: ResendEnv | undefined,
  payload: { to: string; subject: string; html: string }
) {
  const activeEnv = env?.RESEND_API_KEY ? env : getEnv();
  const apiKey = activeEnv.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[Resend] RESEND_API_KEY no configurada. No se envió correo a:", payload.to);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Busago <onboarding@resend.dev>",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!res.ok) {
      console.error("[Resend error]:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[Resend] Error enviando email:", err);
  }
}

type Lead = {
  nombre: string;
  empresa: string;
  email: string;
  telefono?: string | null;
  volumenAprox?: string | null;
  descripcion: string;
  origen?: string;
};

export async function sendLeadConfirmationEmail(lead: Lead) {
  const { env } = getCloudflareContext();

  const html = `
    <h2>¡Recibimos tu solicitud, ${escapeHtml(lead.nombre)}!</h2>
    <p>Gracias por contarnos sobre el proceso que querés automatizar en ${escapeHtml(lead.empresa)}.</p>
    <p>Nuestro equipo va a revisar tu caso y te va a escribir en menos de 48hs para entregarte una propuesta técnica a medida.</p>
    <p>Si mientras tanto tenés alguna duda, escribinos directamente a hola@busago.ai.</p>
  `;

  await sendEmail(env as unknown as ResendEnv, {
    to: lead.email,
    subject: "Recibimos tu solicitud de propuesta técnica — Busago",
    html,
  });
}

export type DigestLead = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string | null;
  volumen_aprox: string | null;
  descripcion: string;
  created_at: string;
};

export type DigestVoiceLead = {
  summary: string | null;
  resultados: Record<string, unknown>;
  created_at: string;
};

export async function sendLeadsDigestEmail(
  leads: DigestLead[],
  env: ResendEnv & { LEADS_NOTIFICATION_EMAIL?: string },
  voiceLeads: DigestVoiceLead[] = []
) {
  if (!env.LEADS_NOTIFICATION_EMAIL) return;

  const total = leads.length + voiceLeads.length;
  const plural = total > 1 ? "s" : "";

  const rows = leads
    .map(
      (lead) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(lead.nombre)} · ${escapeHtml(lead.empresa)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(lead.email)}${lead.telefono ? ` · ${escapeHtml(lead.telefono)}` : ""}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${new Date(lead.created_at).toLocaleString("es-AR")}</td>
        </tr>
      `
    )
    .join("");

  const formTable =
    leads.length > 0
      ? `
    <h3 style="margin-top:24px;">Formulario (${leads.length})</h3>
    <table style="border-collapse:collapse;width:100%;">
      <thead>
        <tr>
          <th align="left" style="padding:8px;">Contacto</th>
          <th align="left" style="padding:8px;">Email / Teléfono</th>
          <th align="left" style="padding:8px;">Fecha</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `
      : "";

  const voiceRows = voiceLeads
    .map(
      (lead) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(lead.summary ?? "(sin resumen)")}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;"><pre style="white-space:pre-wrap;font-family:monospace;font-size:12px;margin:0;">${escapeHtml(JSON.stringify(lead.resultados, null, 2))}</pre></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${new Date(lead.created_at).toLocaleString("es-AR")}</td>
        </tr>
      `
    )
    .join("");

  const voiceTable =
    voiceLeads.length > 0
      ? `
    <h3 style="margin-top:24px;">Agente de voz (${voiceLeads.length})</h3>
    <table style="border-collapse:collapse;width:100%;">
      <thead>
        <tr>
          <th align="left" style="padding:8px;">Resumen</th>
          <th align="left" style="padding:8px;">Datos recolectados</th>
          <th align="left" style="padding:8px;">Fecha</th>
        </tr>
      </thead>
      <tbody>${voiceRows}</tbody>
    </table>
  `
      : "";

  const html = `
    <h2>${total} lead${plural} nuevo${plural} en las últimas 24hs</h2>
    ${formTable}
    ${voiceTable}
    <p style="margin-top:16px;color:#666;">Ver el detalle completo en el dashboard local.</p>
  `;

  await sendEmail(env, {
    to: env.LEADS_NOTIFICATION_EMAIL,
    subject: `${total} lead${plural} nuevo${plural} — Busago`,
    html,
  });
}

export async function sendServicePdfProposalEmail(data: {
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  tituloServicio: string;
  categoria: string;
  descripcionCorta?: string;
}) {
  const { env } = getCloudflareContext();
  const serviceTitle = escapeHtml(data.tituloServicio);
  const clientName = escapeHtml(data.nombre);
  const company = data.empresa ? escapeHtml(data.empresa) : "tu empresa";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070a1e; color: #e2e8f0; margin: 0; padding: 24px; }
        .card { max-width: 600px; margin: 0 auto; background: #0c1238; border: 1px solid #4356fd; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .brand { font-size: 24px; font-weight: bold; color: #5ee6d8; text-transform: uppercase; letter-spacing: 1px; }
        h1 { font-size: 22px; color: #ffffff; margin-top: 16px; margin-bottom: 8px; }
        .badge { display: inline-block; background: rgba(94, 230, 216, 0.15); border: 1px solid rgba(94, 230, 216, 0.4); color: #5ee6d8; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        p { font-size: 14px; line-height: 1.6; color: #cbd5e1; }
        .feature-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; margin: 20px 0; }
        .feature-item { font-size: 13px; color: #e2e8f0; margin-bottom: 8px; }
        .feature-item:last-child { margin-bottom: 0; }
        .cta-btn { display: inline-block; background: #4356fd; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 30px; text-decoration: none; margin-top: 24px; text-align: center; }
        .footer { font-size: 11px; color: #64748b; margin-top: 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">BUSAGO — IA & Automatizaciones</div>
        <h1>Propuesta Técnica: ${serviceTitle}</h1>
        <span class="badge">Sector: ${escapeHtml(data.categoria)}</span>

        <p>Hola <strong>${clientName}</strong>,</p>
        <p>Gracias por tu interés en optimizar las operaciones de <strong>${company}</strong>. Adjuntamos el desglose ejecutivo de la propuesta para la automatización de <strong>${serviceTitle}</strong>:</p>

        <div class="feature-box">
          <div class="feature-item">✔ <strong>Solución:</strong> ${serviceTitle}</div>
          <div class="feature-item">✔ <strong>Plazo Estimado de Integración:</strong> De 2 a 4 semanas.</div>
          <div class="feature-item">✔ <strong>Modalidad:</strong> Llave en mano con integración a tus sistemas actuales.</div>
          <div class="feature-item">✔ <strong>Seguridad:</strong> Encriptación de datos de extremo a extremo.</div>
          <div class="feature-item">✔ <strong>Garantía:</strong> Puesta en marcha con pruebas en vivo sin costo de ajuste.</div>
        </div>

        <p>Un especialista del equipo de Busago revisará tus requerimientos específicos y se pondrá en contacto contigo en menos de 48 horas.</p>

        <a href="https://busago.ai/#plan-a-medida" class="cta-btn">Coordinar reunión de diagnóstico</a>

        <div class="footer">
          Busago AI — Soluciones de Inteligencia Artificial para Empresas.<br>
          Si no realizaste esta solicitud, por favor ignorá este correo.
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(env as unknown as ResendEnv, {
    to: data.email,
    subject: `Propuesta Técnica: ${serviceTitle} — Busago IA`,
    html,
  });

  // Notificar al administrador con la plantilla estructurada
  await sendAdminNewLeadAlertEmail({
    nombre: data.nombre,
    email: data.email,
    empresa: data.empresa,
    telefono: data.telefono,
    volumenAprox: `Propuesta PDF: ${serviceTitle}`,
    descripcion: `Solicitud de propuesta comercial y técnica para "${serviceTitle}" (${data.categoria}).`,
    origen: `Propuesta PDF (${data.categoria})`,
  });
}

export type AdminLeadAlertData = {
  nombre: string;
  email: string;
  empresa?: string | null;
  telefono?: string | null;
  volumenAprox?: string | null;
  descripcion?: string | null;
  origen?: string;
  createdAt?: string | Date;
};

export async function sendAdminNewLeadAlertEmail(data: AdminLeadAlertData) {
  const env = getEnv();
  const targetEmail = env.LEADS_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;

  const clientName = data.nombre?.trim() || "Nuevo contacto";
  const clientEmail = data.email?.trim() || "sin-email";
  const company = data.empresa?.trim() || "No especificada";
  const phone = data.telefono?.trim() || null;
  const needOrService = data.volumenAprox?.trim() || "Automatización personalizada";
  const notes = data.descripcion?.trim() || null;
  const source = data.origen || "Web Busago";

  const dateStr = (
    data.createdAt ? new Date(data.createdAt) : new Date()
  ).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "full",
    timeStyle: "short",
  });

  const cleanPhoneForWa = phone ? phone.replace(/[^0-9]/g, "") : null;
  const whatsappUrl = cleanPhoneForWa
    ? `https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(
        `¡Hola ${clientName}! Me contacto desde Busago AI respecto a tu solicitud en la web.`
      )}`
    : null;

  const whatsappButton = whatsappUrl
    ? `<a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: #10b981; color: #ffffff; font-weight: 700; font-size: 13px; padding: 11px 22px; border-radius: 24px; text-decoration: none; margin-bottom: 8px;">
        📱 Contactar por WhatsApp
      </a>`
    : "";

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Lead Registrado — Busago</title>
      <style>
        body { margin: 0; padding: 0; background-color: #070a1e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body style="margin: 0; padding: 32px 16px; background-color: #070a1e; color: #e2e8f0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #0c1238; border: 1px solid #1e295f; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
        <!-- Top branding bar -->
        <tr>
          <td style="padding: 24px 32px 20px 32px; border-bottom: 1px solid rgba(255,255,255,0.08); background: linear-gradient(135deg, rgba(67,86,253,0.15) 0%, rgba(94,230,216,0.08) 100%);">
            <table role="presentation" width="100%">
              <tr>
                <td>
                  <span style="font-size: 20px; font-weight: 800; color: #5ee6d8; letter-spacing: 1.5px; text-transform: uppercase;">
                    BUSAGO<span style="color: #ffffff;">.AI</span>
                  </span>
                </td>
                <td align="right">
                  <span style="display: inline-block; background: rgba(94,230,216,0.12); border: 1px solid #5ee6d8; color: #5ee6d8; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                    ● Lead en vivo
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 32px;">
            <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.25;">
              Esta persona, este email, ha sido registrado
            </h1>
            <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
              Se ha registrado un nuevo contacto en la web de <strong style="color: #cbd5e1;">Busago</strong>. A continuación tenés el detalle completo para gestionarlo:
            </p>

            <!-- Highlighted email card -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(67,86,253,0.12); border: 1px solid rgba(94,230,216,0.3); border-radius: 14px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 18px 22px;">
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #5ee6d8; margin-bottom: 6px;">
                    Email registrado
                  </div>
                  <div style="font-size: 19px; font-weight: 800; color: #ffffff; word-break: break-all;">
                    <a href="mailto:${escapeHtml(clientEmail)}" style="color: #5ee6d8; text-decoration: none;">
                      ${escapeHtml(clientEmail)}
                    </a>
                  </div>
                  <div style="font-size: 14px; color: #cbd5e1; margin-top: 6px;">
                    Nombre: <strong style="color: #ffffff;">${escapeHtml(clientName)}</strong>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Data Breakdown Table -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #cbd5e1;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); width: 130px; color: #64748b; font-weight: 600;">
                  🏢 Empresa / Rubro
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-weight: 600;">
                  ${escapeHtml(company)}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #64748b; font-weight: 600;">
                  📱 WhatsApp / Tel
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff;">
                  ${phone ? `<a href="${whatsappUrl || `tel:${escapeHtml(phone)}`}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${escapeHtml(phone)}</a>` : '<span style="color: #64748b;">No especificado</span>'}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #64748b; font-weight: 600;">
                  🎯 Requerimiento
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff;">
                  ${escapeHtml(needOrService)}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #64748b; font-weight: 600;">
                  📍 Canal de Origen
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #a5b4fc;">
                  ${escapeHtml(source)}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #64748b; font-weight: 600;">
                  🕒 Fecha y Hora
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8;">
                  ${escapeHtml(dateStr)}
                </td>
              </tr>
            </table>

            <!-- Additional message if present -->
            ${
              notes
                ? `
            <div style="margin-top: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px;">
              <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">
                Mensaje / Comentarios:
              </div>
              <div style="font-size: 13px; color: #e2e8f0; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(notes)}</div>
            </div>`
                : ""
            }

            <!-- CTA Buttons -->
            <div style="margin-top: 28px; text-align: center;">
              <a href="mailto:${escapeHtml(clientEmail)}?subject=Contacto%20desde%20Busago%20AI" style="display: inline-block; background: #4356fd; color: #ffffff; font-weight: 700; font-size: 13px; padding: 11px 22px; border-radius: 24px; text-decoration: none; margin-right: 8px; margin-bottom: 8px; box-shadow: 0 4px 14px rgba(67,86,253,0.4);">
                ✉️ Responder por Email
              </a>
              ${whatsappButton}
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 20px 32px; background: #070a1e; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 12px; color: #64748b; line-height: 1.5;">
            Busago AI &bull; Sistema automatizado de gestión de prospectos<br>
            Notificación enviada a <span style="color: #94a3b8;">${escapeHtml(targetEmail)}</span>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail(env, {
    to: targetEmail,
    subject: `🚀 [Nuevo Lead] ${clientName} (${clientEmail}) se ha registrado`,
    html,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

