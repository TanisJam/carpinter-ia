"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { PANEL_THICKNESS_M, BACK_PANEL_THICKNESS_M } from "@/lib/constants";
import { Shelf } from "./shelf";
import { Drawer } from "./drawer";
import { HangingRod } from "./hanging-rod";
import { Door } from "./door";

export function WardrobeModel() {
  const config = useWardrobeStore((s) => s.config);
  const { dimensions, structure, sections, doors } = config;
  const mat = structure.material;
  const matProps = { color: mat.color, roughness: mat.roughness, metalness: mat.metalness };

  // Convertir mm a metros
  const w = dimensions.width / 1000;
  const h = dimensions.height / 1000;
  const d = dimensions.depth / 1000;

  const interiorH = h - PANEL_THICKNESS_M * 2;
  const interiorD = d - BACK_PANEL_THICKNESS_M;

  return (
    <group position={[0, 0, 0]}>
      {/* Panel izquierdo */}
      <mesh position={[-w / 2 + PANEL_THICKNESS_M / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS_M, h, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel derecho */}
      <mesh position={[w / 2 - PANEL_THICKNESS_M / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS_M, h, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel superior */}
      <mesh position={[0, h - PANEL_THICKNESS_M / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, PANEL_THICKNESS_M, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel inferior */}
      <mesh position={[0, PANEL_THICKNESS_M / 2, 0]} receiveShadow>
        <boxGeometry args={[w, PANEL_THICKNESS_M, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel trasero */}
      <mesh position={[0, h / 2, -d / 2 + BACK_PANEL_THICKNESS_M / 2]}>
        <boxGeometry args={[w, h, BACK_PANEL_THICKNESS_M]} />
        <meshStandardMaterial color={structure.backPanel.color} roughness={0.95} />
      </mesh>

      {/* Divisores verticales entre secciones */}
      {sections.length > 1 &&
        sections.slice(0, -1).map((sec, i) => {
          const xOffset = computeDividerXOffset(sections, i);
          return (
            <mesh
              key={`divider-${i}`}
              position={[xOffset, h / 2, BACK_PANEL_THICKNESS_M / 2]}
              castShadow
            >
              <boxGeometry args={[PANEL_THICKNESS_M, interiorH, interiorD]} />
              <meshStandardMaterial {...matProps} />
            </mesh>
          );
        })}

      {/* Contenido por seccion */}
      {sections.map((sec, secIdx) => {
        const secWidthM = sec.width / 1000;
        const secXCenter = computeSectionCenterX(sections, secIdx);
        let currentY = PANEL_THICKNESS_M;

        return (
          <group key={sec.id}>
            {sec.modules.map((mod) => {
              const modH = mod.height / 1000;
              const yCenter = currentY + modH / 2;
              currentY += modH;

              const pos: [number, number, number] = [
                secXCenter, yCenter, BACK_PANEL_THICKNESS_M / 2,
              ];

              switch (mod.type) {
                case "shelving": {
                  const shelves = [];
                  const spacingM = mod.shelfSpacing / 1000;
                  for (let i = 0; i < mod.shelfCount; i++) {
                    const shelfY = currentY - modH + spacingM * (i + 1);
                    shelves.push(
                      <Shelf
                        key={`${mod.id}-s-${i}`}
                        width={secWidthM - PANEL_THICKNESS_M * 0.5}
                        depth={interiorD}
                        position={[secXCenter, shelfY, BACK_PANEL_THICKNESS_M / 2]}
                        {...matProps}
                      />
                    );
                  }
                  return <group key={mod.id}>{shelves}</group>;
                }
                case "drawers":
                  return (
                    <Drawer
                      key={mod.id}
                      width={secWidthM - PANEL_THICKNESS_M * 0.5}
                      height={modH * 0.85}
                      depth={interiorD * 0.9}
                      position={pos}
                      {...matProps}
                    />
                  );
                case "hanging":
                  return (
                    <HangingRod
                      key={mod.id}
                      width={(secWidthM - PANEL_THICKNESS_M * 0.5) * 0.9}
                      position={[
                        secXCenter,
                        currentY - mod.rodPositionFromTop / 1000,
                        BACK_PANEL_THICKNESS_M / 2,
                      ]}
                    />
                  );
                default:
                  return null;
              }
            })}
          </group>
        );
      })}

      {/* Puertas */}
      {doors.type !== "sin_puertas" && (
        <group position={[0, 0, d / 2 + PANEL_THICKNESS_M / 2 + 0.002]}>
          {sections.map((sec, secIdx) => {
            const secWidthM = sec.width / 1000;
            const secXCenter = computeSectionCenterX(sections, secIdx);
            return (
              <Door
                key={`door-${sec.id}`}
                width={secWidthM}
                height={h - PANEL_THICKNESS_M * 2}
                position={[secXCenter, h / 2, 0]}
                {...matProps}
              />
            );
          })}
        </group>
      )}
    </group>
  );
}

function computeDividerXOffset(
  sections: { width: number }[],
  dividerIdx: number
): number {
  const totalSectionsWidth = sections.reduce((sum, s) => sum + s.width, 0);
  const totalDividersWidth = (sections.length - 1) * PANEL_THICKNESS_M * 1000;
  const totalWidth = totalSectionsWidth + totalDividersWidth + PANEL_THICKNESS_M * 2000;

  let xOffset = -totalWidth / 2 + PANEL_THICKNESS_M * 1000;
  for (let i = 0; i <= dividerIdx; i++) {
    xOffset += (sections[i].width / totalSectionsWidth) * totalSectionsWidth;
    if (i < dividerIdx) {
      xOffset += PANEL_THICKNESS_M * 1000;
    }
  }

  return xOffset / 1000;
}

function computeSectionCenterX(
  sections: { width: number }[],
  secIdx: number
): number {
  const totalSectionsWidth = sections.reduce((sum, s) => sum + s.width, 0);
  const totalDividersWidth = (sections.length - 1) * PANEL_THICKNESS_M * 1000;
  const totalWidth = totalSectionsWidth + totalDividersWidth + PANEL_THICKNESS_M * 2000;

  let xOffset = -totalWidth / 2 + PANEL_THICKNESS_M * 1000;
  for (let i = 0; i < secIdx; i++) {
    xOffset += (sections[i].width / totalSectionsWidth) * totalSectionsWidth + PANEL_THICKNESS_M * 1000;
  }
  xOffset += (sections[secIdx].width / totalSectionsWidth) * totalSectionsWidth / 2;

  return xOffset / 1000;
}
