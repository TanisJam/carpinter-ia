"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { fetchAISuggestions } from "@/lib/ai-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AISuggestions() {
  const dimensiones = useWardrobeStore((s) => s.dimensiones);
  const aiSuggestions = useWardrobeStore((s) => s.aiSuggestions);
  const setAiSuggestions = useWardrobeStore((s) => s.setAiSuggestions);
  const applySuggestion = useWardrobeStore((s) => s.applySuggestion);
  const isLoadingAI = useWardrobeStore((s) => s.isLoadingAI);
  const setIsLoadingAI = useWardrobeStore((s) => s.setIsLoadingAI);

  const handleGenerate = async () => {
    setIsLoadingAI(true);
    try {
      const data = await fetchAISuggestions(dimensiones);
      setAiSuggestions(data.sugerencias);
    } catch {
      console.error("Error al obtener sugerencias");
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerate}
        disabled={isLoadingAI}
        className="w-full"
        variant="secondary"
      >
        {isLoadingAI ? "Generando..." : "Generar sugerencias con IA"}
      </Button>

      {aiSuggestions.length > 0 && (
        <div className="space-y-3">
          {aiSuggestions.map((sug) => (
            <Card
              key={sug.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => applySuggestion(sug)}
            >
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">{sug.descripcion}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-xs text-muted-foreground">
                  {sug.columnas.length} columna{sug.columnas.length > 1 ? "s" : ""} -{" "}
                  {sug.columnas.reduce((acc, c) => acc + c.modulos.length, 0)}{" "}
                  modulos
                </p>
                <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                  Aplicar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
