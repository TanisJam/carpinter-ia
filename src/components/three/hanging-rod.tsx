"use client";

interface HangingRodProps {
  width: number;
  position: [number, number, number];
}

export function HangingRod({ width, position }: HangingRodProps) {
  return (
    <mesh
      position={position}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
    >
      <cylinderGeometry args={[0.012, 0.012, width, 16]} />
      <meshStandardMaterial color="#B8B8B8" roughness={0.3} metalness={0.8} />
    </mesh>
  );
}
