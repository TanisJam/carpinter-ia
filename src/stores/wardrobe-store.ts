import { create } from "zustand";
import type {
  Dimensiones,
  Modulo,
  Columna,
  Material,
  TipoPuerta,
} from "@/schemas/wardrobe-schema";
import type { AISuggestion } from "@/types/wardrobe";
import {
  DEFAULT_DIMENSIONES,
  DEFAULT_COLUMNAS,
  DEFAULT_MATERIAL,
  DEFAULT_TIPO_PUERTA,
} from "@/lib/constants";

interface WardrobeState {
  // Navegacion del wizard
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Paso 1: Dimensiones
  dimensiones: Dimensiones;
  setDimensiones: (dims: Partial<Dimensiones>) => void;

  // Paso 2: Columnas y modulos
  columnas: Columna[];
  setColumnas: (cols: Columna[]) => void;
  addColumna: () => void;
  removeColumna: (id: string) => void;
  addModulo: (columnaId: string, modulo: Omit<Modulo, "id">) => void;
  removeModulo: (columnaId: string, moduloId: string) => void;

  // Paso 3: Material
  material: Material;
  setMaterial: (m: Material) => void;

  // Paso 4: Puertas
  tipoPuerta: TipoPuerta;
  setTipoPuerta: (t: TipoPuerta) => void;

  // Sugerencias IA
  aiSuggestions: AISuggestion[];
  setAiSuggestions: (suggestions: AISuggestion[]) => void;
  applySuggestion: (suggestion: AISuggestion) => void;
  isLoadingAI: boolean;
  setIsLoadingAI: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

let moduleCounter = 100;
let columnCounter = 10;

function generateModuleId() {
  return `mod-${++moduleCounter}`;
}

function generateColumnId() {
  return `col-${++columnCounter}`;
}

export const useWardrobeStore = create<WardrobeState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  dimensiones: DEFAULT_DIMENSIONES,
  setDimensiones: (dims) =>
    set((s) => ({ dimensiones: { ...s.dimensiones, ...dims } })),

  columnas: DEFAULT_COLUMNAS,
  setColumnas: (cols) => set({ columnas: cols }),

  addColumna: () =>
    set((s) => {
      if (s.columnas.length >= 4) return s;
      const newCount = s.columnas.length + 1;
      const anchoRelativo = 1 / newCount;
      const updated = s.columnas.map((c) => ({ ...c, anchoRelativo }));
      const newCol: Columna = {
        id: generateColumnId(),
        anchoRelativo,
        modulos: [
          { id: generateModuleId(), tipo: "estante" as const, altura: 40 },
          { id: generateModuleId(), tipo: "estante" as const, altura: 40 },
        ],
      };
      return { columnas: [...updated, newCol] };
    }),

  removeColumna: (id) =>
    set((s) => {
      if (s.columnas.length <= 1) return s;
      const filtered = s.columnas.filter((c) => c.id !== id);
      const anchoRelativo = 1 / filtered.length;
      return {
        columnas: filtered.map((c) => ({ ...c, anchoRelativo })),
      };
    }),

  addModulo: (columnaId, modulo) =>
    set((s) => ({
      columnas: s.columnas.map((c) =>
        c.id === columnaId
          ? {
              ...c,
              modulos: [
                ...c.modulos,
                { ...modulo, id: generateModuleId() },
              ],
            }
          : c
      ),
    })),

  removeModulo: (columnaId, moduloId) =>
    set((s) => ({
      columnas: s.columnas.map((c) =>
        c.id === columnaId
          ? { ...c, modulos: c.modulos.filter((m) => m.id !== moduloId) }
          : c
      ),
    })),

  material: DEFAULT_MATERIAL,
  setMaterial: (m) => set({ material: m }),

  tipoPuerta: DEFAULT_TIPO_PUERTA,
  setTipoPuerta: (t) => set({ tipoPuerta: t }),

  aiSuggestions: [],
  setAiSuggestions: (suggestions) => set({ aiSuggestions: suggestions }),
  applySuggestion: (suggestion) => set({ columnas: suggestion.columnas }),
  isLoadingAI: false,
  setIsLoadingAI: (loading) => set({ isLoadingAI: loading }),

  reset: () =>
    set({
      currentStep: 1,
      dimensiones: DEFAULT_DIMENSIONES,
      columnas: DEFAULT_COLUMNAS,
      material: DEFAULT_MATERIAL,
      tipoPuerta: DEFAULT_TIPO_PUERTA,
      aiSuggestions: [],
      isLoadingAI: false,
    }),
}));
