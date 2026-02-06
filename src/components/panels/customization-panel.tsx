"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { DIMENSION_LIMITS, MATERIALES, PUERTA_OPTIONS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { AISuggestions } from "./ai-suggestions";
import type { Material } from "@/types/wardrobe";

const MATERIAL_KEYS = Object.keys(MATERIALES) as Material[];

export function CustomizationPanel() {
  const dimensiones = useWardrobeStore((s) => s.dimensiones);
  const setDimensiones = useWardrobeStore((s) => s.setDimensiones);
  const material = useWardrobeStore((s) => s.material);
  const setMaterial = useWardrobeStore((s) => s.setMaterial);
  const tipoPuerta = useWardrobeStore((s) => s.tipoPuerta);
  const setTipoPuerta = useWardrobeStore((s) => s.setTipoPuerta);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-semibold text-sm mb-3">Ajustes rapidos</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Ancho</Label>
              <span className="text-xs text-muted-foreground">
                {dimensiones.ancho} cm
              </span>
            </div>
            <Slider
              value={[dimensiones.ancho]}
              min={DIMENSION_LIMITS.ancho.min}
              max={DIMENSION_LIMITS.ancho.max}
              step={1}
              onValueChange={([v]) => setDimensiones({ ancho: v })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Alto</Label>
              <span className="text-xs text-muted-foreground">
                {dimensiones.alto} cm
              </span>
            </div>
            <Slider
              value={[dimensiones.alto]}
              min={DIMENSION_LIMITS.alto.min}
              max={DIMENSION_LIMITS.alto.max}
              step={1}
              onValueChange={([v]) => setDimensiones({ alto: v })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Profundidad</Label>
              <span className="text-xs text-muted-foreground">
                {dimensiones.profundidad} cm
              </span>
            </div>
            <Slider
              value={[dimensiones.profundidad]}
              min={DIMENSION_LIMITS.profundidad.min}
              max={DIMENSION_LIMITS.profundidad.max}
              step={1}
              onValueChange={([v]) => setDimensiones({ profundidad: v })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-sm mb-3">Material</h3>
        <div className="grid grid-cols-2 gap-2">
          {MATERIAL_KEYS.map((key) => {
            const mat = MATERIALES[key];
            return (
              <button
                key={key}
                onClick={() => setMaterial(key)}
                className={`flex items-center gap-2 p-2 rounded-md border text-xs transition-all
                  ${
                    material === key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
              >
                <div
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: mat.color }}
                />
                {mat.label}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-sm mb-3">Puertas</h3>
        <div className="space-y-2">
          {PUERTA_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTipoPuerta(opt.value)}
              className={`w-full text-left p-2 rounded-md border text-xs transition-all
                ${
                  tipoPuerta === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <AISuggestions />
    </div>
  );
}
