"use client";

import { MATERIAL_CATALOG } from "@/lib/constants";
import type { MaterialId } from "@/types/wardrobe";

export function useMaterialProps(materialId: MaterialId) {
  const config = MATERIAL_CATALOG[materialId];
  return {
    color: config.color,
    roughness: config.roughness,
    metalness: config.metalness,
  };
}

export const METAL_PROPS = {
  color: "#B8B8B8",
  roughness: 0.3,
  metalness: 0.8,
} as const;
