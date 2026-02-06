"use client";

interface DrawerProps {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
}

export function Drawer({
  width,
  height,
  depth,
  position,
  color,
  roughness,
  metalness,
}: DrawerProps) {
  const panelThickness = 0.012;
  const handleWidth = width * 0.4;

  return (
    <group position={position}>
      {/* Frente del cajon */}
      <mesh position={[0, 0, depth / 2 - panelThickness / 2]} castShadow>
        <boxGeometry args={[width, height, panelThickness]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Cuerpo del cajon (mas claro) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry
          args={[width - panelThickness * 2, height * 0.7, depth * 0.9]}
        />
        <meshStandardMaterial color="#E8DCC8" roughness={0.9} />
      </mesh>

      {/* Manija */}
      <mesh position={[0, 0, depth / 2 + 0.005]}>
        <boxGeometry args={[handleWidth, 0.015, 0.01]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
