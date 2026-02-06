"use client";

import { PANEL_THICKNESS_M } from "@/lib/constants";

interface DoorProps {
  width: number;
  height: number;
  position: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
}

export function Door({
  width,
  height,
  position,
  color,
  roughness,
  metalness,
}: DoorProps) {
  const handleHeight = 0.1;

  return (
    <group position={position}>
      {/* Panel de la puerta */}
      <mesh castShadow>
        <boxGeometry args={[width, height, PANEL_THICKNESS_M]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Manija de la puerta */}
      <mesh position={[width * 0.35, 0, PANEL_THICKNESS_M / 2 + 0.005]}>
        <boxGeometry args={[0.015, handleHeight, 0.02]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
