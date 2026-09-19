import { getSupabase } from "@/lib/supabase";
import type { Service, ServiceArea } from "@prisma/client";

export type { Service, ServiceArea };

export const AREA_LABELS: Record<ServiceArea, string> = {
  ATENCION_CLIENTE: "Atención al Cliente",
  ADMINISTRACION_OPERATIVA: "Administración Operativa",
  COMERCIAL_VENTAS: "Comercial y Ventas",
  A_MEDIDA: "A Medida",
};

export const AREA_ORDER: ServiceArea[] = [
  "ATENCION_CLIENTE",
  "ADMINISTRACION_OPERATIVA",
  "COMERCIAL_VENTAS",
];

export const SELECT_COLUMNS =
  "id, slug, area, categoria, titulo_servicio, descripcion_corta, descripcion_larga, icono_svg, imagen_url, destacado, orden, seo_keywords, created_at, updated_at";

export type ServiceRow = {
  id: string;
  slug: string;
  area: ServiceArea;
  categoria: string;
  titulo_servicio: string;
  descripcion_corta: string;
  descripcion_larga: string;
  icono_svg: string;
  imagen_url: string | null;
  destacado: boolean;
  orden: number;
  seo_keywords: string[];
  created_at: string;
  updated_at: string;
};

export function mapRow(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    area: row.area,
    categoria: row.categoria,
    tituloServicio: row.titulo_servicio,
    descripcionCorta: row.descripcion_corta,
    descripcionLarga: row.descripcion_larga,
    iconoSvg: row.icono_svg,
    imagenUrl: row.imagen_url,
    destacado: row.destacado,
    orden: row.orden,
    seoKeywords: row.seo_keywords,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getFeaturedServices(): Promise<Service[]> {
  const { data, error } = await getSupabase()
    .from("services")
    .select(SELECT_COLUMNS)
    .eq("destacado", true)
    .neq("area", "A_MEDIDA")
    .order("area", { ascending: true })
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as ServiceRow[]).map(mapRow);
}

export async function getFeaturedByArea(): Promise<Record<string, Service[]>> {
  const services = await getFeaturedServices();
  return services.reduce<Record<string, Service[]>>((acc, service) => {
    acc[service.area] = [...(acc[service.area] ?? []), service];
    return acc;
  }, {});
}

export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await getSupabase()
    .from("services")
    .select(SELECT_COLUMNS)
    .order("area", { ascending: true })
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as ServiceRow[]).map(mapRow);
}

export async function getServicesByArea(area: ServiceArea): Promise<Service[]> {
  const { data, error } = await getSupabase()
    .from("services")
    .select(SELECT_COLUMNS)
    .eq("area", area)
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as ServiceRow[]).map(mapRow);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await getSupabase()
    .from("services")
    .select(SELECT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as ServiceRow) : null;
}
