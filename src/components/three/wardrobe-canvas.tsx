"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { WardrobeModel } from "./wardrobe-model";
import { SceneControls } from "./scene-controls";
import { useWardrobeStore } from "@/stores/wardrobe-store";

export function WardrobeCanvas() {
  const config = useWardrobeStore((s) => s.config);
  const heightM = config.dimensions.height / 1000;

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200">
      <Canvas
        camera={{ position: [3, heightM / 2 + 2, 4], fov: 45 }}
        shadows
      >
        <Suspense fallback={null}>
          <SceneControls />
          <WardrobeModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
