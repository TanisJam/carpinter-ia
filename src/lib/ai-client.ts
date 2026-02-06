import type { Dimensiones } from "@/schemas/wardrobe-schema";

export async function fetchAISuggestions(
  dimensiones: Dimensiones,
  uso?: string
) {
  const response = await fetch("/api/ai-sugerencias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dimensiones, uso }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener sugerencias de IA");
  }

  return response.json();
}
