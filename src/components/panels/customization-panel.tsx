"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { DIMENSION_LIMITS, MATERIAL_CATALOG, DOOR_TYPE_OPTIONS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { AISuggestions } from "./ai-suggestions";
import type { MaterialId } from "@/schemas/wardrobe-schema";

const MATERIAL_KEYS = Object.keys(MATERIAL_CATALOG) as MaterialId[];

export function CustomizationPanel() {
  const dimensions = useWardrobeStore((s) => s.config.dimensions);
  const setDimensions = useWardrobeStore((s) => s.setDimensions);
  const materialId = useWardrobeStore((s) => s.config.structure.material.id);
  const setMaterialId = useWardrobeStore((s) => s.setMaterialId);
  const doorType = useWardrobeStore((s) => s.config.doors.type);
  const setDoorType = useWardrobeStore((s) => s.setDoorType);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-semibold text-sm mb-3">Ajustes rapidos</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Ancho</Label>
              <span className="text-xs text-muted-foreground">
                {dimensions.width / 10} cm
              </span>
            </div>
            <Slider
              value={[dimensions.width / 10]}
              min={DIMENSION_LIMITS.width.min / 10}
              max={DIMENSION_LIMITS.width.max / 10}
              step={1}
              onValueChange={([v]) => setDimensions({ width: v * 10 })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Alto</Label>
              <span className="text-xs text-muted-foreground">
                {dimensions.height / 10} cm
              </span>
            </div>
            <Slider
              value={[dimensions.height / 10]}
              min={DIMENSION_LIMITS.height.min / 10}
              max={DIMENSION_LIMITS.height.max / 10}
              step={1}
              onValueChange={([v]) => setDimensions({ height: v * 10 })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Profundidad</Label>
              <span className="text-xs text-muted-foreground">
                {dimensions.depth / 10} cm
              </span>
            </div>
            <Slider
              value={[dimensions.depth / 10]}
              min={DIMENSION_LIMITS.depth.min / 10}
              max={DIMENSION_LIMITS.depth.max / 10}
              step={1}
              onValueChange={([v]) => setDimensions({ depth: v * 10 })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-sm mb-3">Material</h3>
        <div className="grid grid-cols-2 gap-2">
          {MATERIAL_KEYS.map((key) => {
            const mat = MATERIAL_CATALOG[key];
            return (
              <button
                key={key}
                onClick={() => setMaterialId(key)}
                className={`flex items-center gap-2 p-2 rounded-md border text-xs transition-all
                  ${
                    materialId === key
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
          {DOOR_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDoorType(opt.value)}
              className={`w-full text-left p-2 rounded-md border text-xs transition-all
                ${
                  doorType === opt.value
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
