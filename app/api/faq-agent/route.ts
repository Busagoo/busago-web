import Groq from "groq-sdk";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSupabase } from "@/lib/supabase";
import { getAllServices } from "@/lib/services";
import { getCompanyKnowledge } from "@/lib/knowledge";

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const apiKey = (env as unknown as { GROQ_API_KEY?: string }).GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "El agente no está configurado." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { message, sessionId: incomingSessionId } = (await request.json()) as {
      message?: string;
      sessionId?: string;
    };
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Falta el mensaje." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sessionId = incomingSessionId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const [services, knowledge] = await Promise.all([
      getAllServices(),
      getCompanyKnowledge(),
    ]);

    const servicesContext = services
      .map((s) => `- ${s.tituloServicio} [Sector/Categoría: ${s.categoria}]: ${s.descripcionCorta}`)
      .join("\n");

    const knowledgeContext = knowledge.length > 0
      ? knowledge.map((k) => `- [${k.categoria}] ${k.pregunta}: ${k.respuesta}`).join("\n")
      : "No hay datos adicionales.";

    const systemPrompt = `Eres un asistente de consulta de Busago, la agencia de automatización e IA.

REGLA ESTRICTA DE BURBUJAS DE CHAT Y BREVEDAD:
- NUNCA respondas con párrafos largos ni bloques macizos de texto ("choclos de información").
- Separa SIEMPRE cada idea o solución en MENSAJES CORTOS INDIVIDUALES usando dos saltos de línea (\\n\\n) entre cada uno.
- Cada mensaje corto debe tener máximo 1 o 2 oraciones concisas y directas.
- NUNCA uses listas numeradas (1., 2., 3.) ni viñetas (- o *).
- Si el usuario pregunta qué servicios o automatizaciones ofrecemos para un sector específico (ej. Inmobiliarias, Clínicas, Gastronomía):
  1. Abre con un mensaje corto amigable saludando y confirmando que tenemos soluciones para su sector.
  2. Selecciona ÚNICAMENTE las 3 o 4 automatizaciones más importantes para su sector. Presenta cada una en un mensaje corto separado (vía \\n\\n), explicando su beneficio principal en una sola frase breve.
  3. Cierra en un último mensaje corto mencionando que contamos con más soluciones específicas para su área o que podemos armar un Plan a Medida según lo que necesite.

REGLA ESTRICTA DE INFORMACIÓN Y DATOS OPERATIVOS (SUPABASE):
- Solo responde basándote en los servicios oficiales y los datos operativos almacenados en la base de datos de Busago.
- Si el usuario pregunta por tiempos de desarrollo, implementación, integraciones, soporte, seguridad o capacitaciones, consulta y utiliza los DATOS OPERATIVOS OFICIALES DE BUSAGO extraídos de Supabase.
- El tiempo de implementación habitual es de 2 a 4 semanas según la complejidad. La propuesta técnica sí se entrega en 48 horas.
- Jamás inventes servicios, precios ni fechas no listadas.

DATOS OPERATIVOS DE BUSAGO (extraídos dinámicamente de Supabase):
${knowledgeContext}

SERVICIOS OFICIALES DE BUSAGO (extraídos dinámicamente de Supabase):
${servicesContext}`;

    const client = new Groq({ apiKey });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply =
      (completion as any)?.choices?.[0]?.message?.content ??
      (completion as any)?.choices?.[0]?.text ??
      String(completion);

    // Guardamos la conversación en Supabase
    let supaError: any = null;
    try {
      const supa = getSupabase();
      const now = new Date().toISOString();
      const { error: e1 } = await supa.from("faq_chat_messages").insert([
        { id: crypto.randomUUID(), session_id: sessionId, role: "user", text: message, created_at: now },
        { id: crypto.randomUUID(), session_id: sessionId, role: "assistant", text: reply, created_at: now },
      ]);
      if (e1) supaError = e1;
    } catch (err) {
      console.error("No se pudo guardar en Supabase:", err);
      supaError = err;
    }

    const responseBody: any = { reply, sessionId };
    if (supaError) responseBody.supaError = typeof supaError === "object" ? String((supaError as any).message ?? supaError) : String(supaError);

    return new Response(JSON.stringify(responseBody), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Error en /api/faq-agent:", err);
    return new Response(JSON.stringify({ error: "Error procesando el mensaje." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
