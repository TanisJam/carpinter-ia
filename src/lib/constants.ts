import type {
  MaterialSpec,
  BackPanelSpec,
  DoorSystem,
  Structure,
  Section,
  Dimensions,
  PlacardConfig,
  HangingVariant,
  DrawerVariant,
  DoorType,
} from "@/schemas/wardrobe-schema";

// ════════════════════════════════════════════════════════
// CONSTANTES TECNICAS — basadas en el PDF de especificaciones
// ════════════════════════════════════════════════════════

// ── Espesores de paneles (en metros para Three.js) ──────

/** Espesor de paneles laterales, superiores, inferiores y divisores (18mm) */
export const PANEL_THICKNESS_M = 0.018;
/** Espesor del panel trasero (5mm MDF) */
export const BACK_PANEL_THICKNESS_M = 0.005;

// ── Limites dimensionales (mm) ──────────────────────────

export const DIMENSION_LIMITS = {
  width:  { min: 600, max: 6000, step: 10 },
  height: { min: 2100, max: 2800, step: 10 },
  depth:  { min: 350, max: 700,  step: 10 },
} as const;

export const SECTION_WIDTH_LIMITS = {
  min: 400,
  max: 900,
  /** Modulacion recomendada segun optimizacion de corte de tableros */
  recommended: [600, 800, 900] as const,
} as const;

// ── Reglas ergonomicas del PDF ──────────────────────────

export const ERGONOMIC_RULES = {
  /** Max altura para cajones (visibilidad interior): 1400mm desde suelo */
  maxDrawerHeight: 1400,
  /** Max altura para barral accesible sin asistencia: 2000mm */
  maxRodHeight: 2000,
  /** Zona de confort y visualizacion: 600-1600mm desde suelo */
  comfortZone: { min: 600, max: 1600 },
  /** Profundidad minima para colgado frontal */
  minDepthForHanging: 550,
  /** Max ancho de estante sin soporte central */
  maxShelfSpanWithoutSupport: 900,
} as const;

// ── Rangos de altura por variante de colgado (mm) ───────

export const HANGING_HEIGHT_RANGES: Record<
  HangingVariant,
  { min: number; max: number; label: string; description: string }
> = {
  largo: {
    min: 1500,
    max: 1800,
    label: "Colgado Largo",
    description: "Vestidos de fiesta, abrigos, tapados",
  },
  medio: {
    min: 1000,
    max: 1150,
    label: "Colgado Medio",
    description: "Camisas, blusas, sacos, chaquetas",
  },
  corto: {
    min: 700,
    max: 900,
    label: "Colgado Corto",
    description: "Pantalones doblados, faldas",
  },
};

// ── Rangos por variante de cajon (mm) ───────────────────

export const DRAWER_FRONT_RANGES: Record<
  DrawerVariant,
  { min: number; max: number; label: string; description: string }
> = {
  accesorios: {
    min: 80,
    max: 100,
    label: "Cajon Accesorios",
    description: "Joyeros, corbateros, cinturones",
  },
  estandar: {
    min: 150,
    max: 200,
    label: "Cajon Estandar",
    description: "Ropa interior, remeras, medias",
  },
  profundo: {
    min: 250,
    max: 300,
    label: "Cajon Profundo",
    description: "Ropa deportiva, sweaters, prendas voluminosas",
  },
};

// ── Estanteria ──────────────────────────────────────────

export const SHELVING_SPACING_RANGES = {
  cotidiana: { min: 250, max: 350, label: "Ropa cotidiana" },
  blancos:   { min: 350, max: 500, label: "Blancos / Toallas" },
} as const;

// ── Circulacion segun tipo de puerta (mm) ───────────────

export const DOOR_CIRCULATION: Record<
  DoorType,
  { required: number; recommended: number; depthConsumption: number }
> = {
  sin_puertas: { required: 600, recommended: 600, depthConsumption: 0 },
  batientes:   { required: 900, recommended: 1100, depthConsumption: 0 },
  corredizas:  { required: 600, recommended: 800, depthConsumption: 90 },
};

// ── Catalogo de materiales ──────────────────────────────

export const MATERIAL_CATALOG: Record<string, MaterialSpec> = {
  melamina_blanco: {
    id: "melamina_blanco",
    label: "Melamina Blanco",
    thickness: 18,
    color: "#F5F5F0",
    roughness: 0.9,
    metalness: 0.0,
  },
  melamina_roble: {
    id: "melamina_roble",
    label: "Melamina Roble",
    thickness: 18,
    color: "#C19A6B",
    roughness: 0.8,
    metalness: 0.05,
  },
  melamina_nogal: {
    id: "melamina_nogal",
    label: "Melamina Nogal",
    thickness: 18,
    color: "#5C4033",
    roughness: 0.75,
    metalness: 0.05,
  },
  melamina_gris: {
    id: "melamina_gris",
    label: "Melamina Gris",
    thickness: 18,
    color: "#8C8C8C",
    roughness: 0.85,
    metalness: 0.1,
  },
};

export const DEFAULT_BACK_PANEL: BackPanelSpec = {
  thickness: 5,
  color: "#D4C8B0",
};

// ── Herrajes (metal) ────────────────────────────────────

export const METAL_FINISH = {
  color: "#B8B8B8",
  roughness: 0.3,
  metalness: 0.8,
} as const;

export const DEFAULT_ROD_DIAMETER = 25; // mm
export const DEFAULT_SLIDE_CLEARANCE = 12.7; // mm por lado

// ── Puertas labels ──────────────────────────────────────

export const DOOR_TYPE_OPTIONS = [
  {
    value: "sin_puertas" as const,
    label: "Sin puertas",
    description: "Placard abierto, acceso inmediato",
  },
  {
    value: "batientes" as const,
    label: "Puertas batientes",
    description: "Puertas clasicas que se abren hacia afuera. Requieren 90cm de espacio frontal",
  },
  {
    value: "corredizas" as const,
    label: "Puertas corredizas",
    description: "Se deslizan lateralmente. Consumen 9cm de profundidad interna",
  },
] as const;

// ── Pasos del wizard ────────────────────────────────────

export const WIZARD_STEPS = [
  { id: 1, label: "Dimensiones" },
  { id: 2, label: "Secciones" },
  { id: 3, label: "Materiales" },
  { id: 4, label: "Puertas" },
] as const;

// ── Defaults ────────────────────────────────────────────

export const DEFAULT_DIMENSIONS: Dimensions = {
  width: 1800,
  height: 2400,
  depth: 600,
};

export const DEFAULT_STRUCTURE: Structure = {
  material: MATERIAL_CATALOG.melamina_roble,
  backPanel: DEFAULT_BACK_PANEL,
  zocalo: { enabled: true, height: 80 },
  maletero: { enabled: true, height: 450 },
  ventilationGap: 20,
};

export const DEFAULT_DOOR_SYSTEM: DoorSystem = {
  type: "batientes",
  depthConsumption: 0,
  circulationRequired: 900,
  circulationRecommended: 1100,
};

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: "sec-1",
    order: 0,
    width: 600,
    modules: [
      {
        type: "drawers",
        id: "mod-1",
        variant: "estandar",
        height: 640,
        drawerCount: 4,
        drawerFrontHeight: 160,
        slideClearance: 12.7,
        slideType: "extraccion_total",
        hasDividers: false,
      },
      {
        type: "hanging",
        id: "mod-2",
        variant: "medio",
        height: 1100,
        rodPositionFromTop: 50,
        rodDiameter: 25,
        garmentSpacing: 40,
      },
    ],
  },
  {
    id: "sec-2",
    order: 1,
    width: 600,
    modules: [
      {
        type: "shelving",
        id: "mod-3",
        height: 1740,
        shelfCount: 5,
        shelfSpacing: 290,
        adjustable: true,
      },
    ],
  },
];

/**
 * Calcula la altura util de una seccion (espacio disponible para modulos).
 * Descuenta: zocalo + maletero + paneles superior/inferior.
 */
export function computeUsableHeight(config: {
  height: number;
  zocalo: { enabled: boolean; height: number };
  maletero: { enabled: boolean; height: number };
  panelThickness: number;
}): number {
  const zocaloH = config.zocalo.enabled ? config.zocalo.height : 0;
  const maleteroH = config.maletero.enabled ? config.maletero.height : 0;
  // Dos paneles horizontales: tapa superior y base
  return config.height - zocaloH - maleteroH - config.panelThickness * 2;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Genera un PlacardConfig por defecto listo para usar.
 */
export function createDefaultPlacardConfig(): PlacardConfig {
  const now = new Date().toISOString();
  return {
    id: generateUUID(),
    schemaVersion: "1.0.0",
    metadata: {
      name: "Mi Placard",
      createdAt: now,
      updatedAt: now,
    },
    dimensions: DEFAULT_DIMENSIONS,
    structure: DEFAULT_STRUCTURE,
    doors: DEFAULT_DOOR_SYSTEM,
    sections: DEFAULT_SECTIONS,
  };
}
