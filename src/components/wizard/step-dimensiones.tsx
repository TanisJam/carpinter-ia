"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { DIMENSION_LIMITS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const FIELDS = [
  { key: "ancho" as const, label: "Ancho", unit: "cm" },
  { key: "alto" as const, label: "Alto", unit: "cm" },
  { key: "profundidad" as const, label: "Profundidad", unit: "cm" },
] as const;

export function StepDimensiones() {
  const dimensiones = useWardrobeStore((s) => s.dimensiones);
  const setDimensiones = useWardrobeStore((s) => s.setDimensiones);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Dimensiones del placard</h2>
        <p className="text-sm text-muted-foreground">
          Ingresa las medidas en centimetros. Usa los controles deslizantes para ajustar.
        </p>
      </div>

      {FIELDS.map(({ key, label, unit }) => {
        const limits = DIMENSION_LIMITS[key];
        const value = dimensiones[key];

        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm font-medium">
                {label}
              </Label>
              <span className="text-sm text-muted-foreground">
                {limits.min} - {limits.max} {unit}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Slider
                value={[value]}
                min={limits.min}
                max={limits.max}
                step={1}
                onValueChange={([v]) => setDimensiones({ [key]: v })}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <Input
                  id={key}
                  type="number"
                  value={value}
                  min={limits.min}
                  max={limits.max}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v >= limits.min && v <= limits.max) {
                      setDimensiones({ [key]: v });
                    }
                  }}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
