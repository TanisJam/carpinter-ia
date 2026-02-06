"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { PANEL_THICKNESS, BACK_PANEL_THICKNESS, MATERIALES } from "@/lib/constants";
import { Shelf } from "./shelf";
import { Drawer } from "./drawer";
import { HangingRod } from "./hanging-rod";
import { Door } from "./door";

export function WardrobeModel() {
  const dimensiones = useWardrobeStore((s) => s.dimensiones);
  const columnas = useWardrobeStore((s) => s.columnas);
  const material = useWardrobeStore((s) => s.material);
  const tipoPuerta = useWardrobeStore((s) => s.tipoPuerta);

  const mat = MATERIALES[material];
  const matProps = { color: mat.color, roughness: mat.roughness, metalness: mat.metalness };

  // Convertir cm a metros
  const w = dimensiones.ancho / 100;
  const h = dimensiones.alto / 100;
  const d = dimensiones.profundidad / 100;

  // Interior util (descontando paneles)
  const interiorW = w - PANEL_THICKNESS * 2;
  const interiorH = h - PANEL_THICKNESS * 2;
  const interiorD = d - BACK_PANEL_THICKNESS;

  return (
    <group position={[0, 0, 0]}>
      {/* ===== SHELL EXTERIOR ===== */}

      {/* Panel izquierdo */}
      <mesh position={[-w / 2 + PANEL_THICKNESS / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS, h, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel derecho */}
      <mesh position={[w / 2 - PANEL_THICKNESS / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS, h, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel superior */}
      <mesh position={[0, h - PANEL_THICKNESS / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, PANEL_THICKNESS, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel inferior (base) */}
      <mesh position={[0, PANEL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[w, PANEL_THICKNESS, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Panel trasero */}
      <mesh position={[0, h / 2, -d / 2 + BACK_PANEL_THICKNESS / 2]}>
        <boxGeometry args={[w, h, BACK_PANEL_THICKNESS]} />
        <meshStandardMaterial color="#D4C8B0" roughness={0.95} />
      </mesh>

      {/* ===== DIVISORES VERTICALES ===== */}
      {columnas.length > 1 &&
        columnas.slice(0, -1).map((_, i) => {
          const xOffset = computeColumnXOffset(columnas, i + 1, interiorW);
          return (
            <mesh
              key={`divider-${i}`}
              position={[
                -interiorW / 2 + xOffset,
                h / 2,
                BACK_PANEL_THICKNESS / 2,
              ]}
              castShadow
            >
              <boxGeometry args={[PANEL_THICKNESS, interiorH, interiorD]} />
              <meshStandardMaterial {...matProps} />
            </mesh>
          );
        })}

      {/* ===== CONTENIDO POR COLUMNA ===== */}
      {columnas.map((col, colIdx) => {
        const colWidth =
          col.anchoRelativo * interiorW -
          (columnas.length > 1 ? PANEL_THICKNESS * 0.5 : 0);
        const colXCenter = computeColumnCenterX(
          columnas,
          colIdx,
          interiorW
        );

        let currentY = PANEL_THICKNESS;

        return (
          <group key={col.id}>
            {col.modulos.map((mod) => {
              const modH = mod.altura / 100;
              const yCenter = currentY + modH / 2;
              currentY += modH;

              const pos: [number, number, number] = [
                colXCenter,
                yCenter,
                BACK_PANEL_THICKNESS / 2,
              ];

              switch (mod.tipo) {
                case "estante":
                  return (
                    <Shelf
                      key={mod.id}
                      width={colWidth}
                      depth={interiorD}
                      position={[
                        colXCenter,
                        currentY,
                        BACK_PANEL_THICKNESS / 2,
                      ]}
                      {...matProps}
                    />
                  );
                case "cajon":
                  return (
                    <Drawer
                      key={mod.id}
                      width={colWidth}
                      height={modH * 0.85}
                      depth={interiorD * 0.9}
                      position={pos}
                      {...matProps}
                    />
                  );
                case "barra":
                  return (
                    <HangingRod
                      key={mod.id}
                      width={colWidth * 0.9}
                      position={[
                        colXCenter,
                        currentY - 0.03,
                        BACK_PANEL_THICKNESS / 2,
                      ]}
                    />
                  );
                case "espacio":
                  return null;
                default:
                  return null;
              }
            })}
          </group>
        );
      })}

      {/* ===== PUERTAS ===== */}
      {tipoPuerta !== "sin_puertas" && (
        <group position={[0, 0, d / 2 + PANEL_THICKNESS / 2 + 0.002]}>
          {columnas.map((col, colIdx) => {
            const colWidth = col.anchoRelativo * interiorW;
            const colXCenter = computeColumnCenterX(
              columnas,
              colIdx,
              interiorW
            );

            if (tipoPuerta === "corredizas") {
              return (
                <Door
                  key={`door-${col.id}`}
                  width={colWidth + PANEL_THICKNESS}
                  height={h - PANEL_THICKNESS * 2}
                  position={[colXCenter, h / 2, 0]}
                  {...matProps}
                />
              );
            }

            return (
              <Door
                key={`door-${col.id}`}
                width={colWidth}
                height={h - PANEL_THICKNESS * 2}
                position={[colXCenter, h / 2, 0]}
                {...matProps}
              />
            );
          })}
        </group>
      )}
    </group>
  );
}

function computeColumnXOffset(
  columnas: { anchoRelativo: number }[],
  targetIndex: number,
  interiorW: number
): number {
  let offset = 0;
  for (let i = 0; i < targetIndex; i++) {
    offset += columnas[i].anchoRelativo * interiorW;
  }
  return offset;
}

function computeColumnCenterX(
  columnas: { anchoRelativo: number }[],
  colIdx: number,
  interiorW: number
): number {
  let offset = 0;
  for (let i = 0; i < colIdx; i++) {
    offset += columnas[i].anchoRelativo * interiorW;
  }
  const colWidth = columnas[colIdx].anchoRelativo * interiorW;
  return -interiorW / 2 + offset + colWidth / 2;
}
