import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Payload que manda LiveKit Agent Builder al terminar la llamada (sección
// "Call ending" → summary/data collection endpoint). Ver
// https://docs.livekit.io/agents/start/builder/
type LiveKitCallEndingPayload = {
  job_id?: string;
  room_id?: string;
  room?: string;
  started_at?: string;
  ended_at?: string;
  summary?: string;
  results?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  const { env } = getCloudflareContext();
  const expectedSecret = (env as unknown as { LIVEKIT_WEBHOOK_SECRET?: string })
    .LIVEKIT_WEBHOOK_SECRET;

  if (expectedSecret) {
    const providedSecret = request.headers.get("x-livekit-webhook-secret");
    if (providedSecret !== expectedSecret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const body = (await request.json()) as LiveKitCallEndingPayload;

  if (!body.results) {
    return NextResponse.json({ error: "Falta el campo 'results'." }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: lead, error } = await supabase
    .from("leads_voz")
    .insert({
      id: crypto.randomUUID(),
      job_id: body.job_id ?? null,
      room_id: body.room_id ?? null,
      room: body.room ?? null,
      started_at: body.started_at ?? null,
      ended_at: body.ended_at ?? null,
      summary: body.summary ?? null,
      resultados: body.results,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: lead }, { status: 201 });
}
