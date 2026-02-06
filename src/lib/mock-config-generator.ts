import { v4 as uuidv4 } from "uuid";
import type { PlacardConfig } from "@/types/wardrobe";
import { MATERIAL_CATALOG, DOOR_CIRCULATION } from "@/lib/constants";

/**
 * Generates a mock PlacardConfig based on simple keyword detection
 * This is used as a fallback when the AI API is unavailable
 */
export function generateMockConfig(transcript: string): PlacardConfig {
  const lowerTranscript = transcript.toLowerCase();

  // Extract dimensions from transcript
  const widthMatch = lowerTranscript.match(/(\d+(?:\.\d+)?)\s*(?:m|metros?|cm|centimetros?)?\s*(?:de\s+)?(?:ancho|width)/);
  const heightMatch = lowerTranscript.match(/(\d+(?:\.\d+)?)\s*(?:m|metros?|cm|centimetros?)?\s*(?:de\s+)?(?:alto|height)/);
  const depthMatch = lowerTranscript.match(/(\d+(?:\.\d+)?)\s*(?:m|metros?|cm|centimetros?)?\s*(?:de\s+)?(?:profund|depth)/);

  // Parse dimensions (convert to mm)
  let width = 1800;
  let height = 2400;
  let depth = 600;

  if (widthMatch) {
    const value = parseFloat(widthMatch[1]);
    width = value > 10 ? value : value * 1000; // If > 10, assume cm, else meters
  }

  if (heightMatch) {
    const value = parseFloat(heightMatch[1]);
    height = value > 10 ? value : value * 1000;
  }

  if (depthMatch) {
    const value = parseFloat(depthMatch[1]);
    depth = value > 10 ? value : value * 1000;
  }

  // Detect module types
  const hasCajones = /cajon|drawer|gaveta/i.test(transcript);
  const hasColgado = /colg|hang|vestid|camis|saco|ropa/i.test(transcript);
  const hasEstantes = /estante|shelf|zapato|shoe/i.test(transcript);

  // Detect material preference
  let materialId: "melamina_blanco" | "melamina_roble" | "melamina_nogal" | "melamina_gris" = "melamina_roble";
  if (/blanco|white/i.test(transcript)) materialId = "melamina_blanco";
  if (/nogal|walnut/i.test(transcript)) materialId = "melamina_nogal";
  if (/gris|gray|grey/i.test(transcript)) materialId = "melamina_gris";

  // Create sections based on detected modules
  const sections: any[] = [];
  const sectionWidth = Math.floor(width / (hasCajones && hasColgado ? 2 : 1));

  if (hasColgado) {
    sections.push({
      id: `sec-${uuidv4().slice(0, 8)}`,
      order: sections.length,
      width: sectionWidth,
      modules: [
        {
          type: "hanging",
          id: `mod-${uuidv4().slice(0, 8)}`,
          variant: "largo",
          height: 1600,
          rodPositionFromTop: 50,
          rodDiameter: 25,
          garmentSpacing: 40,
        },
      ],
    });
  }

  if (hasCajones) {
    sections.push({
      id: `sec-${uuidv4().slice(0, 8)}`,
      order: sections.length,
      width: sectionWidth,
      modules: [
        {
          type: "drawers",
          id: `mod-${uuidv4().slice(0, 8)}`,
          variant: "estandar",
          height: 600,
          drawerCount: 4,
          drawerFrontHeight: 150,
          slideClearance: 12.7,
          slideType: "extraccion_total",
          hasDividers: false,
        },
      ],
    });
  }

  if (hasEstantes) {
    sections.push({
      id: `sec-${uuidv4().slice(0, 8)}`,
      order: sections.length,
      width: sectionWidth,
      modules: [
        {
          type: "shelving",
          id: `mod-${uuidv4().slice(0, 8)}`,
          height: 800,
          shelfCount: 4,
          shelfSpacing: 200,
          adjustable: true,
        },
      ],
    });
  }

  // If no modules detected, add a default hanging section
  if (sections.length === 0) {
    sections.push({
      id: `sec-${uuidv4().slice(0, 8)}`,
      order: 0,
      width: width,
      modules: [
        {
          type: "hanging",
          id: `mod-${uuidv4().slice(0, 8)}`,
          variant: "medio",
          height: 1200,
          rodPositionFromTop: 50,
          rodDiameter: 25,
          garmentSpacing: 40,
        },
      ],
    });
  }

  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    schemaVersion: "1.0.0",
    metadata: {
      name: "Placard Generado (Mock)",
      description: `Configuración generada a partir de: "${transcript}"`,
      createdAt: now,
      updatedAt: now,
      author: "Mock Generator",
    },
    dimensions: {
      width,
      height,
      depth,
    },
    structure: {
      material: MATERIAL_CATALOG[materialId],
      backPanel: { thickness: 5, color: "#D4C8B0" },
      zocalo: { enabled: true, height: 80 },
      maletero: { enabled: true, height: 450 },
      ventilationGap: 20,
    },
    doors: {
      type: "batientes",
      depthConsumption: DOOR_CIRCULATION.batientes.depthConsumption,
      circulationRequired: DOOR_CIRCULATION.batientes.required,
      circulationRecommended: DOOR_CIRCULATION.batientes.recommended,
    },
    sections,
  };
}
