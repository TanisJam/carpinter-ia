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

    const { dimensions } = parsed.data;

    // ---------------------------------------------------
    // TODO: Reemplazar con llamada real a API de IA
    // Opciones: OpenAI, Anthropic Claude, etc.
    //
    // const response = await fetch("https://api.anthropic.com/...", {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` },
    //   body: JSON.stringify({
    //     prompt: `Sugiere layouts de placard para ${dimensions.width}x${dimensions.height}x${dimensions.depth}mm...`
    //   }),
    // });
    // ---------------------------------------------------

    // Respuesta mock con sugerencias predefinidas
    const mockSuggestions = [
      {
        id: "sug-1",
        name: "Clasico",
        description: "Clasico: espacio para colgar arriba, cajones abajo",
        sections: [
          {
            id: "sec-s1-1",
            order: 0,
            width: 600,
            modules: [
              {
                type: "hanging" as const,
                id: "m1",
                variant: "medio" as const,
                height: 1100,
                rodPositionFromTop: 50,
                rodDiameter: 25,
                garmentSpacing: 40,
              },
              {
                type: "drawers" as const,
                id: "m2",
                variant: "estandar" as const,
                height: 640,
                drawerCount: 4,
                drawerFrontHeight: 160,
                slideClearance: 12.7,
                slideType: "extraccion_total" as const,
                hasDividers: false,
              },
            ],
          },
          {
            id: "sec-s1-2",
            order: 1,
            width: 600,
            modules: [
              {
                type: "shelving" as const,
                id: "m3",
                height: 1450,
                shelfCount: 5,
                shelfSpacing: 290,
                adjustable: true,
              },
              {
                type: "drawers" as const,
                id: "m4",
                variant: "estandar" as const,
                height: 320,
                drawerCount: 2,
                drawerFrontHeight: 160,
                slideClearance: 12.7,
                slideType: "extraccion_total" as const,
                hasDividers: false,
              },
            ],
          },
        ],
      },
      {
        id: "sug-2",
        name: "Organizacion maxima",
        description:
          "Organizacion maxima: 3 secciones con variedad de modulos",
        sections: [
          {
            id: "sec-s2-1",
            order: 0,
            width: 600,
            modules: [
              {
                type: "hanging" as const,
                id: "m11",
                variant: "largo" as const,
                height: 1500,
                rodPositionFromTop: 50,
                rodDiameter: 25,
                garmentSpacing: 60,
              },
              {
                type: "drawers" as const,
                id: "m12",
                variant: "estandar" as const,
                height: 320,
                drawerCount: 2,
                drawerFrontHeight: 160,
                slideClearance: 12.7,
                slideType: "extraccion_total" as const,
                hasDividers: false,
              },
            ],
          },
          {
            id: "sec-s2-2",
            order: 1,
            width: 600,
            modules: [
              {
                type: "shelving" as const,
                id: "m14",
                height: 1740,
                shelfCount: 6,
                shelfSpacing: 290,
                adjustable: true,
              },
            ],
          },
          {
            id: "sec-s2-3",
            order: 2,
            width: 600,
            modules: [
              {
                type: "hanging" as const,
                id: "m19",
                variant: "corto" as const,
                height: Math.min(Math.round(dimensions.height * 0.35), 900),
                rodPositionFromTop: 50,
                rodDiameter: 25,
                garmentSpacing: 35,
              },
              {
                type: "hanging" as const,
                id: "m20",
                variant: "corto" as const,
                height: Math.min(Math.round(dimensions.height * 0.35), 900),
                rodPositionFromTop: 50,
                rodDiameter: 25,
                garmentSpacing: 35,
              },
              {
                type: "drawers" as const,
                id: "m21",
                variant: "accesorios" as const,
                height: 200,
                drawerCount: 2,
                drawerFrontHeight: 100,
                slideClearance: 12.7,
                slideType: "extraccion_total" as const,
                hasDividers: true,
              },
            ],
          },
        ],
      },
    ];

    // Simular delay de IA
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ suggestions: mockSuggestions });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
