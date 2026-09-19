import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { SELECT_COLUMNS, mapRow, type ServiceRow } from "@/lib/services";
import type { ServiceArea } from "@prisma/client";

const VALID_AREAS: ServiceArea[] = [
  "ATENCION_CLIENTE",
  "ADMINISTRACION_OPERATIVA",
  "COMERCIAL_VENTAS",
  "A_MEDIDA",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");
  const destacadoParam = searchParams.get("destacado");

  if (area && !VALID_AREAS.includes(area as ServiceArea)) {
    return NextResponse.json({ error: "Área inválida" }, { status: 400 });
  }

  let query = getSupabase()
    .from("services")
    .select(SELECT_COLUMNS)
    .order("area", { ascending: true })
    .order("orden", { ascending: true });

  if (area) query = query.eq("area", area);
  if (destacadoParam) query = query.eq("destacado", destacadoParam === "true");

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const services = (data as ServiceRow[]).map(mapRow);
  return NextResponse.json({ data: services }, { status: 200 });
}
