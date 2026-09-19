import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendLeadConfirmationEmail, sendAdminNewLeadAlertEmail } from "@/lib/email";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Protege el webhook/bot que recibe cada lead: sin este límite, un mismo
// visitante podría floodear el formulario y saturarlo con requests repetidos.
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 15;

function getClientIp(request: NextRequest): string | null {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? null;

  return null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, string | undefined>;
  const { nombre, empresa, email, telefono, volumenAprox, descripcion } = body ?? {};

  if (!nombre || !empresa || !email || !descripcion) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: nombre, empresa, email, descripcion." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  let lead = null;

  try {
    const supabase = getSupabase();

    if (ip) {
      const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
      const { count, error: countError } = await supabase
        .from("leads_personalizados")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", windowStart);

      if (!countError && (count ?? 0) >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Probá de nuevo en unos minutos." },
          { status: 429 }
        );
      }
    }

    const { data, error } = await supabase
      .from("leads_personalizados")
      .insert({
        id: crypto.randomUUID(),
        nombre,
        empresa,
        email,
        telefono: telefono ?? null,
        volumen_aprox: volumenAprox ?? null,
        descripcion,
        ip,
      })
      .select()
      .single();

    if (error) {
      console.error("[Leads API] Error guardando en base de datos:", error.message);
    } else {
      lead = data;
    }
  } catch (dbErr) {
    console.error("[Leads API] Excepción al interactuar con base de datos:", dbErr);
  }

  // 1. Notificar inmediatamente al administrador (frendo.ytza242@gmail.com) vía Resend
  try {
    await sendAdminNewLeadAlertEmail({
      nombre,
      empresa,
      email,
      telefono,
      volumenAprox,
      descripcion,
      origen: "Formulario Plan a Medida (Landing)",
    });
  } catch (err) {
    console.error("[Leads API] Error enviando alerta al administrador:", err);
  }

  // 2. Enviar correo de confirmación al usuario
  try {
    await sendLeadConfirmationEmail({ nombre, empresa, email, telefono, volumenAprox, descripcion });
  } catch (err) {
    console.error("[Leads API] Error enviando confirmación al usuario:", err);
  }

  // 3. Webhook externo si está configurado
  try {
    const { env } = getCloudflareContext();
    const webhookUrl = (env as unknown as { LEADS_WEBHOOK_URL?: string })?.LEADS_WEBHOOK_URL;
    if (webhookUrl && lead) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      }).catch(() => {});
    }
  } catch {
    // Webhook opcional
  }

  return NextResponse.json(
    {
      success: true,
      data: lead ?? { nombre, email, empresa },
      message: "Lead recibido exitosamente.",
    },
    { status: 201 }
  );
}
