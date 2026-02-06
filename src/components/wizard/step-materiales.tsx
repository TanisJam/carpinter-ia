"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { MATERIALES } from "@/lib/constants";
import type { Material } from "@/types/wardrobe";

const MATERIAL_KEYS = Object.keys(MATERIALES) as Material[];

export function StepMateriales() {
  const material = useWardrobeStore((s) => s.material);
  const setMaterial = useWardrobeStore((s) => s.setMaterial);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Material</h2>
        <p className="text-sm text-muted-foreground">
          Selecciona el acabado para tu placard.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MATERIAL_KEYS.map((key) => {
          const mat = MATERIALES[key];
          const isSelected = material === key;

          return (
            <button
              key={key}
              onClick={() => setMaterial(key)}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                }
              `}
            >
              <div
                className="w-10 h-10 rounded-md border shadow-inner shrink-0"
                style={{ backgroundColor: mat.color }}
              />
              <div>
                <p className="font-medium text-sm">{mat.label}</p>
                {isSelected && (
                  <p className="text-xs text-primary">Seleccionado</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
