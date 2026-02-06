import { z } from "zod";

// ============================================================
// CARPINTER-IA — Esquema autocontenido del placard
// ============================================================
// Este schema es la fuente de verdad unica para:
//   1. Renderizado 3D (Three.js)
//   2. Generacion de planos de corte y construccion
//   3. Lista de materiales (BOM)
//   4. Instrucciones de armado
//   5. Validacion de reglas ergonomicas y estructurales
//
// Jerarquia:  Placard → Sections → Modules (1-3 por section)
// Nomenclatura alineada al PDF de especificaciones tecnicas.
// Todas las medidas en milimetros (mm) salvo donde se indique.
// ============================================================

// ────────────────────────────────────────────────────────
// 1. MATERIALES
// ────────────────────────────────────────────────────────

export const materialIdSchema = z.enum([
  "melamina_blanco",
  "melamina_roble",
  "melamina_nogal",
  "melamina_gris",
]);

/** Especificacion completa de un material para paneles */
export const materialSpecSchema = z.object({
  id: materialIdSchema,
  label: z.string(),
  /** Espesor del tablero en mm (estandar Argentina: 18mm) */
  thickness: z.number().int().min(15).max(25),
  /** Color hex para renderizado 3D */
  color: z.string(),
  /** Rugosidad PBR para Three.js (0-1) */
  roughness: z.number().min(0).max(1),
  /** Metalness PBR para Three.js (0-1) */
  metalness: z.number().min(0).max(1),
  /** ID de textura opcional (ruta relativa en /public/textures/) */
  textureId: z.string().optional(),
});

/** Especificacion del panel trasero (fondo) */
export const backPanelSpecSchema = z.object({
  /** Espesor en mm (tipicamente 3mm fibrofacil o 5mm MDF) */
  thickness: z.number().int().min(3).max(6),
  color: z.string(),
});

// ────────────────────────────────────────────────────────
// 2. SISTEMA DE PUERTAS
// ────────────────────────────────────────────────────────

export const doorTypeSchema = z.enum([
  "sin_puertas",
  "batientes",
  "corredizas",
]);

export const doorSystemSchema = z.object({
  type: doorTypeSchema,
  /**
   * Profundidad consumida por el sistema de puertas en mm.
   * - corredizas: 80-100mm (guias + traslape)
   * - batientes: 0mm (no consume profundidad interna)
   * - sin_puertas: 0mm
   */
  depthConsumption: z.number().int().min(0).max(100),
  /**
   * Espacio de circulacion requerido frente al placard en mm.
   * - batientes: min 900, recomendado 1100
   * - corredizas: min 600, recomendado 800
   * - sin_puertas: min 600
   */
  circulationRequired: z.number().int().min(0),
  circulationRecommended: z.number().int().min(0),
  /** Material de las puertas (mismo o diferente al cuerpo) */
  materialId: materialIdSchema.optional(),
});

// ────────────────────────────────────────────────────────
// 3. ESTRUCTURA (zocalo, maletero, ventilacion)
// ────────────────────────────────────────────────────────

export const zocaloSchema = z.object({
  enabled: z.boolean(),
  /** Altura del zocalo en mm (70-100mm segun PDF) */
  height: z.number().int().min(0).max(100),
});

export const maleteroSchema = z.object({
  enabled: z.boolean(),
  /** Altura del maletero/altillo superior en mm (400-500mm) */
  height: z.number().int().min(0).max(500),
});

export const structureSchema = z.object({
  /** Material principal del cuerpo */
  material: materialSpecSchema,
  /** Panel trasero */
  backPanel: backPanelSpecSchema,
  /** Zocalo inferior */
  zocalo: zocaloSchema,
  /** Maletero superior (altillo) */
  maletero: maleteroSchema,
  /**
   * Gap de ventilacion entre fondo y pared en mm.
   * Recomendado: 20mm para flujo de conveccion.
   */
  ventilationGap: z.number().int().min(0).max(50),
});

// ────────────────────────────────────────────────────────
// 4. MODULOS — Hanging (Barra de colgar)
// ────────────────────────────────────────────────────────

export const hangingVariantSchema = z.enum([
  "largo",  // Vestidos, abrigos: 1500-1800mm
  "medio",  // Camisas, sacos:   1000-1150mm
  "corto",  // Pantalones, faldas: 700-900mm
]);

export const hangingModuleSchema = z.object({
  type: z.literal("hanging"),
  id: z.string(),

  /** Subtipo de colgado que define rangos de altura */
  variant: hangingVariantSchema,

  /** Altura total del modulo en mm */
  height: z.number().int().min(700).max(1800),

  /**
   * Posicion del barral medida desde el tope del modulo en mm.
   * Tipicamente 40-60mm desde el tope para dejar espacio al gancho.
   */
  rodPositionFromTop: z.number().int().min(30).max(80),

  /** Diametro del barral en mm (estandar: 25mm cromado) */
  rodDiameter: z.number().int().min(20).max(32),

  /**
   * Espacio lineal por prenda en mm.
   * Largo: 50-100mm, Medio/Corto: 30-50mm
   */
  garmentSpacing: z.number().int().min(20).max(100),
});

// ────────────────────────────────────────────────────────
// 5. MODULOS — Shelving (Estantes)
// ────────────────────────────────────────────────────────

export const shelvingModuleSchema = z.object({
  type: z.literal("shelving"),
  id: z.string(),

  /** Altura total del modulo en mm */
  height: z.number().int().min(250).max(1800),

  /** Cantidad de estantes dentro de este modulo */
  shelfCount: z.number().int().min(1).max(8),

  /**
   * Distancia vertical entre estantes en mm.
   * Ropa cotidiana: 250-350mm, Blancos: hasta 500mm
   */
  shelfSpacing: z.number().int().min(200).max(500),

  /** Si los estantes tienen cremallera/perforaciones para regular altura */
  adjustable: z.boolean(),
});

// ────────────────────────────────────────────────────────
// 6. MODULOS — Drawers (Cajones)
// ────────────────────────────────────────────────────────

export const drawerVariantSchema = z.enum([
  "accesorios",  // Joyeros/Corbateros: frente 80-100mm
  "estandar",    // Ropa interior/Remeras: frente 150-200mm
  "profundo",    // Sweaters/Deportiva: frente 250-300mm
]);

export const drawerModuleSchema = z.object({
  type: z.literal("drawers"),
  id: z.string(),

  /** Subtipo de cajon que define rangos de frente */
  variant: drawerVariantSchema,

  /** Altura total del modulo (todos los cajones apilados) en mm */
  height: z.number().int().min(80).max(1200),

  /** Cantidad de cajones en el bloque (tipico 2-4) */
  drawerCount: z.number().int().min(1).max(6),

  /** Altura del frente de cada cajon en mm */
  drawerFrontHeight: z.number().int().min(80).max(300),

  /**
   * Holgura lateral para correderas en mm por lado.
   * Estandar: 12.7mm (1/2") para extraccion total con cierre suave.
   */
  slideClearance: z.number().min(10).max(15),

  /** Tipo de corredera */
  slideType: z.enum(["extraccion_total", "extraccion_3_4", "oculta"]),

  /** Si incluye divisores internos (para variante accesorios) */
  hasDividers: z.boolean(),
});

// ────────────────────────────────────────────────────────
// 7. MODULO — Union discriminada
// ────────────────────────────────────────────────────────

export const moduleSchema = z.discriminatedUnion("type", [
  hangingModuleSchema,
  shelvingModuleSchema,
  drawerModuleSchema,
]);

// ────────────────────────────────────────────────────────
// 8. SECTION (seccion vertical)
// ────────────────────────────────────────────────────────

export const sectionSchema = z.object({
  id: z.string(),

  /** Orden de la seccion de izquierda a derecha (0-indexed) */
  order: z.number().int().min(0),

  /**
   * Ancho de la seccion en mm.
   * Modulacion recomendada: 600, 800 o 850mm.
   * Max 850mm sin soporte central (regla de estabilidad).
   */
  width: z.number().int().min(400).max(850),

  /**
   * Modulos dentro de la seccion, ordenados de ABAJO hacia ARRIBA.
   * Minimo 1, maximo 3 por seccion.
   * La suma de alturas debe coincidir con la altura util de la seccion.
   */
  modules: z
    .array(moduleSchema)
    .min(1, { error: "Cada seccion necesita al menos un modulo" })
    .max(3, { error: "Maximo 3 modulos por seccion" }),
});

// ────────────────────────────────────────────────────────
// 9. DIMENSIONES EXTERIORES
// ────────────────────────────────────────────────────────

export const dimensionsSchema = z.object({
  /** Ancho total exterior del placard en mm */
  width: z.number().int()
    .min(600, { error: "El ancho minimo es 600mm" })
    .max(6000, { error: "El ancho maximo es 6000mm" }),

  /** Altura total exterior del placard en mm (210-260cm estandar) */
  height: z.number().int()
    .min(2100, { error: "La altura minima es 2100mm" })
    .max(2800, { error: "La altura maxima es 2800mm" }),

  /**
   * Profundidad total exterior del placard en mm.
   * Minimo 350mm (solo doblado), estandar 600mm (colgado).
   * Si puertas corredizas: se necesitan ~700mm exteriores para 600mm utiles.
   */
  depth: z.number().int()
    .min(350, { error: "La profundidad minima es 350mm" })
    .max(700, { error: "La profundidad maxima es 700mm" }),
});

// ────────────────────────────────────────────────────────
// 10. METADATA DEL DOCUMENTO
// ────────────────────────────────────────────────────────

export const placardMetadataSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  /** Autor o usuario que creo el diseno */
  author: z.string().optional(),
});

// ────────────────────────────────────────────────────────
// 11. PLACARD CONFIG — Raiz del esquema autocontenido
// ────────────────────────────────────────────────────────

export const placardConfigSchema = z.object({
  /** UUID unico del diseno */
  id: z.string().uuid(),

  /** Version del schema para migraciones futuras */
  schemaVersion: z.literal("1.0.0"),

  /** Metadata del documento */
  metadata: placardMetadataSchema,

  /** Dimensiones exteriores del mueble */
  dimensions: dimensionsSchema,

  /** Configuracion estructural: material, fondo, zocalo, maletero */
  structure: structureSchema,

  /** Sistema de puertas */
  doors: doorSystemSchema,

  /**
   * Secciones verticales del placard, ordenadas de izquierda a derecha.
   * El ancho total de las secciones + espesores de paneles laterales y
   * divisores debe coincidir con el ancho interior del mueble.
   */
  sections: z
    .array(sectionSchema)
    .min(1, { error: "El placard necesita al menos una seccion" })
    .max(8, { error: "Maximo 8 secciones" }),
});

// ────────────────────────────────────────────────────────
// 12. SCHEMAS AUXILIARES (AI, validacion parcial)
// ────────────────────────────────────────────────────────

/** Request para el endpoint de sugerencias IA */
export const aiSuggestionRequestSchema = z.object({
  dimensions: dimensionsSchema,
  preferences: z.object({
    hangingPercentage: z.number().min(0).max(100).optional(),
    needsShoeStorage: z.boolean().optional(),
    drawerCount: z.enum(["pocos", "medio", "muchos"]).optional(),
  }).optional(),
});

/** Una sugerencia de layout devuelta por la IA */
export const aiSuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  sections: z.array(sectionSchema),
});

// ────────────────────────────────────────────────────────
// 13. TIPOS INFERIDOS DE ZOD
// ────────────────────────────────────────────────────────

export type MaterialId = z.infer<typeof materialIdSchema>;
export type MaterialSpec = z.infer<typeof materialSpecSchema>;
export type BackPanelSpec = z.infer<typeof backPanelSpecSchema>;
export type DoorType = z.infer<typeof doorTypeSchema>;
export type DoorSystem = z.infer<typeof doorSystemSchema>;
export type Zocalo = z.infer<typeof zocaloSchema>;
export type Maletero = z.infer<typeof maleteroSchema>;
export type Structure = z.infer<typeof structureSchema>;
export type HangingVariant = z.infer<typeof hangingVariantSchema>;
export type HangingModule = z.infer<typeof hangingModuleSchema>;
export type DrawerVariant = z.infer<typeof drawerVariantSchema>;
export type DrawerModule = z.infer<typeof drawerModuleSchema>;
export type ShelvingModule = z.infer<typeof shelvingModuleSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type PlacardMetadata = z.infer<typeof placardMetadataSchema>;
export type PlacardConfig = z.infer<typeof placardConfigSchema>;
export type AISuggestion = z.infer<typeof aiSuggestionSchema>;
