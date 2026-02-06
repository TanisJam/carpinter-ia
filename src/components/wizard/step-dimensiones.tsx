"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { computeDynamicDimensionLimits } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const FIELDS = [
  { key: "width" as const, label: "Ancho", unit: "cm" },
  { key: "height" as const, label: "Alto", unit: "cm" },
  { key: "depth" as const, label: "Profundidad", unit: "cm" },
] as const;

export function StepDimensiones() {
  const dimensions = useWardrobeStore((s) => s.config.dimensions);
  const setDimensions = useWardrobeStore((s) => s.setDimensions);
  const structure = useWardrobeStore((s) => s.config.structure);
  const sections = useWardrobeStore((s) => s.config.sections);

  const limits = computeDynamicDimensionLimits({
    zocalo: structure.zocalo,
    maletero: structure.maletero,
    panelThickness: structure.material.thickness,
    sections,
    currentWidth: dimensions.width,
    currentHeight: dimensions.height,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Dimensiones del placard</h2>
        <p className="text-sm text-muted-foreground">
          Ingresa las medidas en centimetros. Usa los controles deslizantes para ajustar.
        </p>
      </div>

      {FIELDS.map(({ key, label, unit }) => {
        const valueMm = dimensions[key];
        const valueCm = valueMm / 10;
        const minCm = limits[key].min / 10;
        const maxCm = limits[key].max / 10;

        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm font-medium">
                {label}
              </Label>
              <span className="text-sm text-muted-foreground">
                {minCm} - {maxCm} {unit}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Slider
                value={[valueCm]}
                min={minCm}
                max={maxCm}
                step={1}
                onValueChange={([v]) => {
                  const roundedV = Math.round(v);
                  if (roundedV >= minCm && roundedV <= maxCm) {
                    setDimensions({ [key]: roundedV * 10 });
                  }
                }}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <Input
                  id={key}
                  type="number"
                  value={valueCm}
                  min={minCm}
                  max={maxCm}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const roundedV = Math.round(v);
                    if (!isNaN(roundedV) && roundedV >= minCm && roundedV <= maxCm) {
                      setDimensions({ [key]: roundedV * 10 });
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
