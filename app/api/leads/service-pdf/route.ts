import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendServicePdfProposalEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, string | undefined>;
    const { nombre, email, empresa, telefono, servicioId, tituloServicio, categoria } = body ?? {};

    if (!nombre || !email || !tituloServicio) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: nombre, email o servicio." },
        { status: 400 }
      );
    }

    let lead = null;
    try {
      const supabase = getSupabase();

      // Guardar lead en base de datos
      const { data, error } = await supabase
        .from("leads_personalizados")
        .insert({
          id: crypto.randomUUID(),
          nombre,
          empresa: empresa || "No especificada",
          email,
          telefono: telefono || null,
          volumen_aprox: `Solicitud PDF: ${tituloServicio}`,
          descripcion: `[Solicitud PDF para Servicio: ${tituloServicio}] Sector: ${categoria || "General"}`,
        })
        .select()
        .single();

      if (error) {
        console.error("Error guardando lead de servicio PDF:", error);
      } else {
        lead = data;
      }
    } catch (dbErr) {
      console.error("Error de base de datos en servicio PDF:", dbErr);
    }

    // Enviar correo con la propuesta comercial y técnica del servicio
    await sendServicePdfProposalEmail({
      nombre,
      email,
      empresa,
      telefono,
      tituloServicio,
      categoria: categoria || "General",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Propuesta enviada exitosamente por correo electrónico.",
        leadId: lead?.id,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Error interno al procesar la solicitud.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
