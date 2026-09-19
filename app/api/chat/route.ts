import Groq from "groq-sdk";
import type { ChatCompletionTool, ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAllServices } from "@/lib/services";
import { getCompanyKnowledge } from "@/lib/knowledge";
import { getSupabase } from "@/lib/supabase";
import { sendLeadConfirmationEmail, sendAdminNewLeadAlertEmail } from "@/lib/email";

type ChatMessage = { role: "user" | "assistant"; content: string };

const LEAD_SAVED_MARKER = " LEAD_SAVED ";

const SYSTEM_PROMPT_BASE = `Eres un consultor experto de Busago, la agencia de automatización e inteligencia artificial. Hablas de forma totalmente natural, cercana, cálida y humana, como una persona real conversando por WhatsApp.

REGLA ESTRICTA DE ESTILO Y FORMATO (HUMANO):
- NUNCA uses listas numeradas (1., 2., 3.), listas con viñetas (- o *) ni guiones al principio de las oraciones.
- NUNCA respondas con párrafos estructurados como robot ni encabezados tipo informe.
- NUNCA incluyas comentarios internos, etiquetas de control, palabras como LEAD_SAVED ni aclaraciones entre paréntesis tipo "(Esperando respuesta)".
- Escribe como una persona real en un chat: oraciones breves, fluidas y directas, separadas en pequeños párrafos naturales usando saltos de línea dobles.
- Habla en español natural, amable y profesional.
- Haz preguntas de a una por vez para mantener la conversación ágil y descubrir qué necesita el cliente.
- Si el usuario te da un correo sin la @ (ej. senderos.com.ar), pídele de forma amigable que incluya la @ para guardarlo correctamente.

REGLA ESTRICTA DE INFORMACIÓN Y DATOS OPERATIVOS (SUPABASE):
- Si el cliente pregunta por tiempos de desarrollo, implementación, integraciones, soporte, seguridad o capacitaciones, responde basándote estrictamente en los DATOS OPERATIVOS OFICIALES DE BUSAGO almacenados en Supabase listados abajo.
- Ten en cuenta que la implementación completa de un proyecto a medida toma habitualmente entre 2 y 4 semanas según la complejidad. La propuesta técnica inicial de alcance sí se entrega en 48 horas tras el primer contacto.
- Solo ofrece las automatizaciones y servicios reales almacenados en la base de datos de Busago. Jamás inventes servicios o tarifas.
- Si el cliente menciona un sector o necesidad específica no listada, explícale de forma amigable que desarrollamos flujos a medida y que el equipo puede evaluar su caso con una propuesta técnica en 48 horas.

REGLA ESTRICTA DE PRECIOS:
- Bajo ninguna circunstancia des montos o tarifas fijas de precios.
- Explica de forma natural que cada proyecto se cotiza según la complejidad y el volumen del flujo, e invítalo a dejar su contacto para mandarle un presupuesto personalizado sin costo.

FLUJO DE CONVERSACIÓN Y CUALIFICACIÓN:
- Saluda amablemente, preséntate brevemente y pregúntale su nombre y qué área o sector de su empresa quiere automatizar.
- Escucha lo que te cuenta y explica brevemente cómo una de nuestras soluciones de la base de datos resuelve exactamente su problema.
- Pregúntale de forma amigable sobre el volumen aproximado de tareas, mensajes o clientes que manejan al mes.
- Pídele su email o WhatsApp para que el equipo lo contacte y le arme una propuesta a medida sin costo.

GUARDADO DE DATOS:
El email es el dato más importante de todos — sin el email real que el cliente escriba, no se puede guardar nada. No llames a guardar_lead hasta que el cliente haya escrito su email explícitamente en un mensaje. Antes de eso, seguí preguntando por el nombre, la empresa y el proceso, pero no llames a la herramienta todavía.
En cuanto tengas el nombre del cliente, el nombre de su empresa, el proceso que quiere automatizar, y el cliente ya escribió su email, llamá la herramienta guardar_lead con esos datos.
Nunca llames a guardar_lead con datos inventados o de relleno.
Al llamar a guardar_lead, si no dispones de teléfono o volumenAprox, omite esas propiedades del JSON, NUNCA envíes el valor null.`;

const TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "guardar_lead",
      description:
        "Guarda los datos de contacto del cliente potencial. Llamala apenas tengas nombre, empresa, el proceso que quiere automatizar, y su email.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string", description: "Nombre del cliente" },
          empresa: { type: "string", description: "Nombre de la empresa" },
          email: { type: "string", description: "Email de contacto" },
          telefono: { type: "string", description: "Teléfono de contacto" },
          descripcion: {
            type: "string",
            description: "Proceso o área que el cliente quiere automatizar, en sus palabras",
          },
          volumenAprox: {
            type: "string",
            description: "Volumen aproximado de tareas, mensajes o llamadas por mes",
          },
        },
        required: ["nombre", "empresa", "descripcion", "email"],
      },
    },
  },
];

const LEAKED_TAG_START = "<function=";
const LEAKED_TAG_END = "</function>";

function createContentFilter(
  onText: (text: string) => void,
  onLeakedCall: (name: string, args: string) => void
) {
  let pending = "";
  let inTag = false;
  let tagBuffer = "";

  function feed(text: string) {
    if (inTag) {
      tagBuffer += text;
      const endIdx = tagBuffer.indexOf(LEAKED_TAG_END);
      if (endIdx === -1) return;

      const full = tagBuffer.slice(0, endIdx);
      const match = full.match(/^<function=([a-zA-Z_]\w*)>([\s\S]*)$/);
      if (match) onLeakedCall(match[1], match[2]);

      inTag = false;
      const rest = tagBuffer.slice(endIdx + LEAKED_TAG_END.length);
      tagBuffer = "";
      feed(rest);
      return;
    }

    pending += text;
    const tagStart = pending.indexOf(LEAKED_TAG_START);
    if (tagStart !== -1) {
      const before = pending.slice(0, tagStart);
      if (before) onText(before);
      inTag = true;
      tagBuffer = pending.slice(tagStart + LEAKED_TAG_START.length);
      pending = "";
      return;
    }

    let safeLen = pending.length;
    for (let i = Math.min(LEAKED_TAG_START.length - 1, pending.length); i > 0; i--) {
      if (LEAKED_TAG_START.startsWith(pending.slice(-i))) {
        safeLen = pending.length - i;
        break;
      }
    }
    if (safeLen > 0) {
      onText(pending.slice(0, safeLen));
      pending = pending.slice(safeLen);
    }
  }

  return { feed };
}

const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/g;

function extractRealEmails(userText: string): string[] {
  const matches = userText.match(EMAIL_PATTERN) ?? [];
  return matches.map((e) => e.replace(/[.,;:!?)\]]+$/, ""));
}

type GuardarLeadResult = { message: string; saved: boolean };

async function guardarLead(rawArgs: string, request: Request, userText: string): Promise<GuardarLeadResult> {
  let args: Record<string, unknown>;
  try {
    args = JSON.parse(rawArgs);
  } catch {
    return { message: "Los datos no vinieron en un formato válido, no se pudo guardar.", saved: false };
  }

  const nombre = String(args.nombre ?? "").trim();
  const empresa = String(args.empresa ?? "").trim();
  const descripcion = String(args.descripcion ?? "").trim();

  if (!nombre || !empresa || !descripcion) {
    return {
      message: "Faltan datos obligatorios (nombre, empresa o descripción), no se guardó.",
      saved: false,
    };
  }

  const realEmails = extractRealEmails(userText);
  if (realEmails.length === 0) {
    return {
      message: "Todavía no tenés el email real del cliente en la conversación, no se guardó. Pedíselo de nuevo.",
      saved: false,
    };
  }
  const email = realEmails[realEmails.length - 1];

  const telefono = args.telefono ? String(args.telefono).trim() : null;
  const volumenAprox = args.volumenAprox ? String(args.volumenAprox).trim() : null;
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    null;

  try {
    const supa = getSupabase();
    const { error } = await supa.from("leads_personalizados").insert({
      id: crypto.randomUUID(),
      nombre,
      empresa,
      email,
      telefono,
      volumen_aprox: volumenAprox,
      descripcion,
      origen: "chat_ia",
      ip,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[Chat Lead] Error de Supabase:", error.message);
    }

    try {
      await sendAdminNewLeadAlertEmail({
        nombre,
        email,
        empresa,
        telefono,
        volumenAprox,
        descripcion,
        origen: "Asistente Conversacional IA (Web)",
      });
    } catch (e) {
      console.error("[Chat Lead] No se pudo enviar email de alerta al admin:", e);
    }

    try {
      await sendLeadConfirmationEmail({ nombre, email, empresa, descripcion, origen: "Chat IA Web" });
    } catch (e) {
      console.error("[Chat Lead] No se pudo enviar email de confirmación de lead:", e);
    }

    return { message: "¡Listo! El lead quedó guardado correctamente.", saved: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { message: `No se pudo guardar por un problema técnico (${msg}).`, saved: false };
  }
}

export async function POST(request: Request) {
  const { messages, leadAlreadySaved } = (await request.json()) as {
    messages: ChatMessage[];
    leadAlreadySaved?: boolean;
  };

  const { env } = getCloudflareContext();
  const apiKey = (env as unknown as { GROQ_API_KEY?: string }).GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "El chat no está configurado." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!messages?.length) {
    return new Response(JSON.stringify({ error: "Falta el mensaje." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [services, knowledge] = await Promise.all([
    getAllServices(),
    getCompanyKnowledge(),
  ]);

  const servicesContext = services
    .map((s) => `- ${s.tituloServicio} (${s.categoria}): ${s.descripcionCorta}`)
    .join("\n");

  const knowledgeContext = knowledge.length > 0
    ? knowledge.map((k) => `- [${k.categoria}] ${k.pregunta}: ${k.respuesta}`).join("\n")
    : "";

  const client = new Groq({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const workingMessages: ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: `${SYSTEM_PROMPT_BASE}\n\nDATOS OPERATIVOS DE BUSAGO (SUPABASE):\n${knowledgeContext}\n\nSERVICIOS OFICIALES DE BUSAGO:\n${servicesContext}`,
          },
          ...messages,
        ];
        const userText = messages
          .filter((m) => m.role === "user")
          .map((m) => m.content)
          .join(" ");

        let leadSaved = leadAlreadySaved === true;
        const realEmails = extractRealEmails(userText);
        const offerTool = !leadSaved && realEmails.length > 0;

        for (let round = 0; round < (offerTool ? 2 : 1); round++) {
          const groqStream = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            stream: true,
            messages: workingMessages,
            ...(offerTool ? { tools: TOOLS, tool_choice: "auto" as const } : {}),
          });

          let assistantText = "";
          let toolCallArgs = "";
          let toolCallName = "";
          let isToolCall = false;

          const filter = createContentFilter(
            (text) => {
              assistantText += text;
              controller.enqueue(encoder.encode(text));
            },
            (name, args) => {
              isToolCall = true;
              toolCallName = name;
              toolCallArgs = args;
            }
          );

          for await (const chunk of groqStream) {
            const delta = chunk.choices[0]?.delta;
            if (!delta) continue;

            if (delta.tool_calls?.[0]) {
              const tc = delta.tool_calls[0];
              if (tc.function?.name) toolCallName = tc.function.name;
              if (tc.function?.arguments) toolCallArgs += tc.function.arguments;
              isToolCall = true;
              continue;
            }

            if (delta.content) {
              filter.feed(delta.content);
            }
          }

          if (!isToolCall) {
            if (leadSaved) {
              controller.enqueue(encoder.encode(LEAD_SAVED_MARKER));
            }
            break;
          }

          workingMessages.push({
            role: "assistant",
            tool_calls: [
              {
                id: "call_1",
                type: "function",
                function: { name: toolCallName, arguments: toolCallArgs },
              },
            ],
          });

          if (toolCallName === "guardar_lead") {
            const res = await guardarLead(toolCallArgs, request, userText);
            if (res.saved) leadSaved = true;
            workingMessages.push({
              role: "tool",
              tool_call_id: "call_1",
              content: res.message,
            });
          } else {
            workingMessages.push({
              role: "tool",
              tool_call_id: "call_1",
              content: "Herramienta desconocida.",
            });
          }
        }
      } catch (err) {
        console.error("Error en chat stream:", err);
        controller.enqueue(
          encoder.encode("\n\nHubo un problema al procesar tu consulta. Por favor probá de nuevo.")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
