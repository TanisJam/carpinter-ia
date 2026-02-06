"use client";

import { DimensionSlider } from "./dimension-slider";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import { computeDynamicDimensionLimits } from "@/lib/constants";

export function DimensionsPanel() {
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

  const widthCm = dimensions.width / 10;
  const heightCm = dimensions.height / 10;
  const depthCm = dimensions.depth / 10;

  return (
    <div className="w-full max-w-2xl space-y-12 p-8 bg-white rounded-2xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Dimensions</h1>

      <DimensionSlider
        label="Width"
        min={limits.width.min / 10}
        max={limits.width.max / 10}
        value={widthCm}
        unit="cm"
        onChange={(value) => setDimensions({ width: Math.round(value) * 10 })}
      />

      <DimensionSlider
        label="Height"
        min={limits.height.min / 10}
        max={limits.height.max / 10}
        value={heightCm}
        unit="cm"
        onChange={(value) => setDimensions({ height: Math.round(value) * 10 })}
      />

      <DimensionSlider
        label="Depth"
        min={limits.depth.min / 10}
        max={limits.depth.max / 10}
        value={depthCm}
        unit="cm"
        onChange={(value) => setDimensions({ depth: Math.round(value) * 10 })}
      />
    </div>
  );
}
