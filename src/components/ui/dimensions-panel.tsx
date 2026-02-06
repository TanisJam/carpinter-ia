"use client";

import { DimensionSlider } from "./dimension-slider";
import { useWardrobeStore } from "@/stores/wardrobe-store";

export function DimensionsPanel() {
  const dimensions = useWardrobeStore((s) => s.config.dimensions);
  const setDimensions = useWardrobeStore((s) => s.setDimensions);

  // Convert from mm to cm for display
  const widthCm = dimensions.width / 10;
  const heightCm = dimensions.height / 10;
  const depthCm = dimensions.depth / 10;

  return (
    <div className="w-full max-w-2xl space-y-12 p-8 bg-white rounded-2xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Dimensions</h1>

      <DimensionSlider
        label="Width"
        min={80}
        max={400}
        value={widthCm}
        unit="cm"
        onChange={(value) => setDimensions({ width: value * 10 })}
      />

      <DimensionSlider
        label="Height"
        min={150}
        max={280}
        value={heightCm}
        unit="cm"
        onChange={(value) => setDimensions({ height: value * 10 })}
      />

      <DimensionSlider
        label="Depth"
        min={35}
        max={70}
        value={depthCm}
        unit="cm"
        onChange={(value) => setDimensions({ depth: value * 10 })}
      />
    </div>
  );
}
