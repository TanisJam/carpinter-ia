"use client";

import { MATERIALES } from "@/lib/constants";
import type { Material } from "@/types/wardrobe";

export function useMaterialProps(material: Material) {
  const config = MATERIALES[material];
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
