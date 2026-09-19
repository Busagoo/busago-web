import Groq from "groq-sdk";
import { toFile } from "groq-sdk/uploads";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Transcribe audios grabados en el chat (ChatDemo) con el modelo Whisper que
// hostea Groq. La grabación llega como un blob de audio (webm/ogg) en un
// FormData desde el navegador; Whisper acepta esos formatos directamente,
// no hace falta convertir a wav/mp3.
export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const apiKey = (env as unknown as { GROQ_API_KEY?: string }).GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "El chat no está configurado." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formData = await request.formData();
  const audio = formData.get("audio");

  if (!(audio instanceof Blob)) {
    return new Response(JSON.stringify({ error: "Falta el audio." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Groq({ apiKey });

  try {
    const transcription = await client.audio.transcriptions.create({
      file: await toFile(audio, "audio.webm"),
      model: "whisper-large-v3-turbo",
      language: "es",
    });

    return new Response(JSON.stringify({ text: transcription.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error en /api/transcribe:", err);
    return new Response(JSON.stringify({ error: "No pudimos transcribir el audio." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
