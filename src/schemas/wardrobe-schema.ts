import { z } from "zod";

// Step 1: Dimensiones
export const dimensionesSchema = z.object({
  ancho: z
    .number()
    .min(60, { error: "El ancho minimo es 60 cm" })
    .max(300, { error: "El ancho maximo es 300 cm" }),
  alto: z
    .number()
    .min(180, { error: "La altura minima es 180 cm" })
    .max(280, { error: "La altura maxima es 280 cm" }),
  profundidad: z
    .number()
    .min(40, { error: "La profundidad minima es 40 cm" })
    .max(70, { error: "La profundidad maxima es 70 cm" }),
});

// Tipos de modulo interior
export const moduloTipoSchema = z.enum([
  "estante",
  "cajon",
  "barra",
  "espacio",
]);

export const moduloSchema = z.object({
  id: z.string(),
  tipo: moduloTipoSchema,
  altura: z
    .number()
    .min(10, { error: "La altura minima de un modulo es 10 cm" })
    .max(150, { error: "La altura maxima de un modulo es 150 cm" }),
});

// Columna
export const columnaSchema = z.object({
  id: z.string(),
  anchoRelativo: z.number().min(0.1).max(1),
  modulos: z
    .array(moduloSchema)
    .min(1, { error: "Cada columna necesita al menos un modulo" }),
});

// Step 2: Validacion de columnas
export const columnasSchema = z
  .array(columnaSchema)
  .min(1, { error: "Necesitas al menos una columna" })
  .max(4, { error: "Maximo 4 columnas" });

// Step 3: Material
export const materialSchema = z.enum(["roble", "nogal", "blanco", "gris"]);

// Step 4: Tipo de puerta
export const tipoPuertaSchema = z.enum([
  "sin_puertas",
  "batientes",
  "corredizas",
]);

// Config completa del placard
export const wardrobeConfigSchema = z.object({
  dimensiones: dimensionesSchema,
  columnas: columnasSchema,
  material: materialSchema,
  tipoPuerta: tipoPuertaSchema,
});

// Request de sugerencias IA
export const aiSuggestionRequestSchema = z.object({
  dimensiones: dimensionesSchema,
  uso: z.string().optional(),
});

// Tipos inferidos de Zod
export type Dimensiones = z.infer<typeof dimensionesSchema>;
export type ModuloTipo = z.infer<typeof moduloTipoSchema>;
export type Modulo = z.infer<typeof moduloSchema>;
export type Columna = z.infer<typeof columnaSchema>;
export type Material = z.infer<typeof materialSchema>;
export type TipoPuerta = z.infer<typeof tipoPuertaSchema>;
export type WardrobeConfig = z.infer<typeof wardrobeConfigSchema>;
