import { createClient } from "@supabase/supabase-js";
import { sendLeadsDigestEmail, type DigestLead, type DigestVoiceLead } from "./email";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY?: string;
  LEADS_NOTIFICATION_EMAIL?: string;
};

// Corre desde el handler `scheduled` del Worker (custom-worker.ts), no desde
// una request de Next.js, así que arma su propio cliente de Supabase a partir
// del `env` que le pasa Cloudflare en vez de usar getCloudflareContext().
export async function runLeadsDigest(env: Env) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("leads_personalizados")
    .select("nombre, empresa, email, telefono, volumen_aprox, descripcion, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error consultando leads para el digest:", error.message);
    return;
  }

  const { data: voiceData, error: voiceError } = await supabase
    .from("leads_voz")
    .select("summary, resultados, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (voiceError) {
    console.error("Error consultando leads de voz para el digest:", voiceError.message);
  }

  const leads = (data ?? []) as DigestLead[];
  const voiceLeads = (voiceData ?? []) as DigestVoiceLead[];
  if (leads.length === 0 && voiceLeads.length === 0) return;

  await sendLeadsDigestEmail(leads, env, voiceLeads);
}
