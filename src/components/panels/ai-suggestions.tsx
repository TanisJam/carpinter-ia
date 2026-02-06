"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { fetchAISuggestions } from "@/lib/ai-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AISuggestions() {
  const dimensions = useWardrobeStore((s) => s.config.dimensions);
  const aiSuggestions = useWardrobeStore((s) => s.aiSuggestions);
  const setAiSuggestions = useWardrobeStore((s) => s.setAiSuggestions);
  const applySuggestion = useWardrobeStore((s) => s.applySuggestion);
  const isLoadingAI = useWardrobeStore((s) => s.isLoadingAI);
  const setIsLoadingAI = useWardrobeStore((s) => s.setIsLoadingAI);

  const handleGenerate = async () => {
    setIsLoadingAI(true);
    try {
      const data = await fetchAISuggestions(dimensions);
      setAiSuggestions(data.suggestions);
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
                <CardTitle className="text-sm">{sug.description}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-xs text-muted-foreground">
                  {sug.sections.length} seccion{sug.sections.length > 1 ? "es" : ""} -{" "}
                  {sug.sections.reduce((acc, s) => acc + s.modules.length, 0)}{" "}
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
