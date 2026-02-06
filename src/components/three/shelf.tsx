"use client";

import { PANEL_THICKNESS } from "@/lib/constants";

interface ShelfProps {
  width: number;
  depth: number;
  position: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
}

export function Shelf({
  width,
  depth,
  position,
  color,
  roughness,
  metalness,
}: ShelfProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, PANEL_THICKNESS, depth]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}
