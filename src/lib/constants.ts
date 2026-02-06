import type { Dimensiones, Columna, Material, TipoPuerta } from "@/schemas/wardrobe-schema";

// Espesor de paneles en metros (18mm)
export const PANEL_THICKNESS = 0.018;
// Espesor del panel trasero en metros (5mm)
export const BACK_PANEL_THICKNESS = 0.005;

// Limites de dimensiones (cm)
export const DIMENSION_LIMITS = {
  ancho: { min: 60, max: 300 },
  alto: { min: 180, max: 280 },
  profundidad: { min: 40, max: 70 },
} as const;

// Valores por defecto
export const DEFAULT_DIMENSIONES: Dimensiones = {
  ancho: 180,
  alto: 240,
  profundidad: 60,
};

export const DEFAULT_COLUMNAS: Columna[] = [
  {
    id: "col-1",
    anchoRelativo: 1,
    modulos: [
      { id: "mod-1", tipo: "barra", altura: 100 },
      { id: "mod-2", tipo: "estante", altura: 40 },
      { id: "mod-3", tipo: "estante", altura: 40 },
      { id: "mod-4", tipo: "cajon", altura: 25 },
      { id: "mod-5", tipo: "cajon", altura: 25 },
    ],
  },
];

export const DEFAULT_MATERIAL: Material = "roble";
export const DEFAULT_TIPO_PUERTA: TipoPuerta = "batientes";

// Materiales disponibles con sus propiedades visuales
export const MATERIALES = {
  roble: {
    label: "Roble",
    color: "#C19A6B",
    roughness: 0.8,
    metalness: 0.05,
  },
  nogal: {
    label: "Nogal",
    color: "#5C4033",
    roughness: 0.75,
    metalness: 0.05,
  },
  blanco: {
    label: "Blanco",
    color: "#F5F5F0",
    roughness: 0.9,
    metalness: 0.0,
  },
  gris: {
    label: "Gris",
    color: "#8C8C8C",
    roughness: 0.85,
    metalness: 0.1,
  },
} as const;

// Tipos de modulo con labels en espanol
export const MODULO_LABELS = {
  estante: "Estante",
  cajon: "Cajon",
  barra: "Barra de colgar",
  espacio: "Espacio libre",
} as const;

// Tipos de puerta con labels
export const PUERTA_OPTIONS = [
  {
    value: "sin_puertas" as const,
    label: "Sin puertas",
    description: "Placard abierto sin puertas",
  },
  {
    value: "batientes" as const,
    label: "Puertas batientes",
    description: "Puertas clasicas que se abren hacia afuera",
  },
  {
    value: "corredizas" as const,
    label: "Puertas corredizas",
    description: "Puertas que se deslizan lateralmente",
  },
] as const;

// Pasos del wizard
export const WIZARD_STEPS = [
  { id: 1, label: "Dimensiones" },
  { id: 2, label: "Modulos" },
  { id: 3, label: "Materiales" },
  { id: 4, label: "Puertas" },
] as const;
