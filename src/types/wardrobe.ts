export type {
  Dimensiones,
  ModuloTipo,
  Modulo,
  Columna,
  Material,
  TipoPuerta,
  WardrobeConfig,
} from "@/schemas/wardrobe-schema";

export interface AISuggestion {
  id: string;
  descripcion: string;
  columnas: import("@/schemas/wardrobe-schema").Columna[];
}
