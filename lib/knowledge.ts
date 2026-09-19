import { getSupabase } from "@/lib/supabase";

export type CompanyKnowledgeRow = {
  id: string;
  categoria: string;
  clave: string;
  pregunta: string;
  respuesta: string;
  tags: string[];
  orden: number;
};

export async function getCompanyKnowledge(): Promise<CompanyKnowledgeRow[]> {
  try {
    const { data, error } = await getSupabase()
      .from("company_knowledge")
      .select("id, categoria, clave, pregunta, respuesta, tags, orden")
      .order("orden", { ascending: true });

    if (error || !data) return [];
    return data as CompanyKnowledgeRow[];
  } catch {
    return [];
  }
}
