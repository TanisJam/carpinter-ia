import { NextRequest, NextResponse } from "next/server";
import { aiSuggestionRequestSchema } from "@/schemas/wardrobe-schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = aiSuggestionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { dimensiones } = parsed.data;

    // ---------------------------------------------------
    // TODO: Reemplazar con llamada real a API de IA
    // Opciones: OpenAI, Anthropic Claude, etc.
    //
    // const response = await fetch("https://api.anthropic.com/...", {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` },
    //   body: JSON.stringify({
    //     prompt: `Sugiere layouts de placard para ${dimensiones.ancho}x${dimensiones.alto}x${dimensiones.profundidad}cm...`
    //   }),
    // });
    // ---------------------------------------------------

    // Respuesta mock con sugerencias predefinidas
    const mockSuggestions = [
      {
        id: "sug-1",
        descripcion: "Clasico: espacio para colgar arriba, cajones abajo",
        columnas: [
          {
            id: "col-s1-1",
            anchoRelativo: 0.6,
            modulos: [
              { id: "m1", tipo: "barra" as const, altura: 120 },
              { id: "m2", tipo: "estante" as const, altura: 40 },
              { id: "m3", tipo: "cajon" as const, altura: 25 },
              { id: "m4", tipo: "cajon" as const, altura: 25 },
            ],
          },
          {
            id: "col-s1-2",
            anchoRelativo: 0.4,
            modulos: [
              { id: "m5", tipo: "estante" as const, altura: 35 },
              { id: "m6", tipo: "estante" as const, altura: 35 },
              { id: "m7", tipo: "estante" as const, altura: 35 },
              { id: "m8", tipo: "estante" as const, altura: 35 },
              { id: "m9", tipo: "cajon" as const, altura: 30 },
              { id: "m10", tipo: "cajon" as const, altura: 30 },
            ],
          },
        ],
      },
      {
        id: "sug-2",
        descripcion:
          "Organizacion maxima: 3 columnas con variedad de modulos",
        columnas: [
          {
            id: "col-s2-1",
            anchoRelativo: 0.33,
            modulos: [
              { id: "m11", tipo: "barra" as const, altura: 140 },
              { id: "m12", tipo: "cajon" as const, altura: 30 },
              { id: "m13", tipo: "cajon" as const, altura: 30 },
            ],
          },
          {
            id: "col-s2-2",
            anchoRelativo: 0.34,
            modulos: [
              { id: "m14", tipo: "estante" as const, altura: 40 },
              { id: "m15", tipo: "estante" as const, altura: 40 },
              { id: "m16", tipo: "estante" as const, altura: 40 },
              { id: "m17", tipo: "estante" as const, altura: 40 },
              { id: "m18", tipo: "estante" as const, altura: 40 },
            ],
          },
          {
            id: "col-s2-3",
            anchoRelativo: 0.33,
            modulos: [
              {
                id: "m19",
                tipo: "barra" as const,
                altura: Math.round(dimensiones.alto * 0.35),
              },
              {
                id: "m20",
                tipo: "barra" as const,
                altura: Math.round(dimensiones.alto * 0.35),
              },
              { id: "m21", tipo: "cajon" as const, altura: 25 },
              { id: "m22", tipo: "cajon" as const, altura: 25 },
            ],
          },
        ],
      },
    ];

    // Simular delay de IA
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ sugerencias: mockSuggestions });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
