"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { PUERTA_OPTIONS } from "@/lib/constants";

export function StepPuertas() {
  const tipoPuerta = useWardrobeStore((s) => s.tipoPuerta);
  const setTipoPuerta = useWardrobeStore((s) => s.setTipoPuerta);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tipo de puerta</h2>
        <p className="text-sm text-muted-foreground">
          Elige el estilo de puertas para tu placard.
        </p>
      </div>

      <div className="space-y-3">
        {PUERTA_OPTIONS.map((option) => {
          const isSelected = tipoPuerta === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setTipoPuerta(option.value)}
              className={`
                w-full flex flex-col p-4 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                }
              `}
            >
              <p className="font-medium">{option.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
