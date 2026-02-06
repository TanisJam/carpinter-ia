"use client";

import { OrbitControls, Grid } from "@react-three/drei";
import { useWardrobeStore } from "@/stores/wardrobe-store";

export function SceneControls() {
  const config = useWardrobeStore((s) => s.config);
  const heightM = config.dimensions.height / 1000;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <OrbitControls
        target={[0, heightM / 2, 0]}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enablePan={true}
        minDistance={1}
        maxDistance={8}
      />
      <Grid
        infiniteGrid
        cellSize={0.5}
        sectionSize={1}
        fadeDistance={10}
        fadeStrength={1}
        cellColor="#d4d4d4"
        sectionColor="#a3a3a3"
      />
    </>
  );
}
