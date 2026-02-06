import type { Dimensions } from "@/schemas/wardrobe-schema";

export async function fetchAISuggestions(
  dimensions: Dimensions,
  uso?: string
) {
  const response = await fetch("/api/ai-sugerencias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dimensions, uso }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener sugerencias de IA");
  }

  return response.json();
}
