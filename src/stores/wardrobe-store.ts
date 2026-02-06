import { create } from "zustand";
import type {
  PlacardConfig,
  Dimensions,
  Structure,
  Section,
  Module,
  MaterialId,
  DoorType,
  AISuggestion,
} from "@/schemas/wardrobe-schema";
import {
  createDefaultPlacardConfig,
  MATERIAL_CATALOG,
  DOOR_CIRCULATION,
} from "@/lib/constants";

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

interface WardrobeState {
  // ── Wizard ──
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // ── Config raiz (fuente de verdad) ──
  config: PlacardConfig;

  // ── Acciones sobre dimensions ──
  setDimensions: (dims: Partial<Dimensions>) => void;

  // ── Acciones sobre structure ──
  setMaterialId: (id: MaterialId) => void;
  setStructure: (s: Partial<Structure>) => void;

  // ── Acciones sobre doors ──
  setDoorType: (type: DoorType) => void;

  // ── Acciones sobre sections ──
  setSections: (sections: Section[]) => void;
  addSection: (width: number) => void;
  removeSection: (id: string) => void;
  updateSectionWidth: (id: string, width: number) => void;

  // ── Acciones sobre modules dentro de una section ──
  addModule: (sectionId: string, module: DistributiveOmit<Module, "id">) => void;
  removeModule: (sectionId: string, moduleId: string) => void;
  updateModule: (sectionId: string, moduleId: string, updates: Partial<Module>) => void;

  // ── IA ──
  aiSuggestions: AISuggestion[];
  setAiSuggestions: (suggestions: AISuggestion[]) => void;
  applySuggestion: (suggestion: AISuggestion) => void;
  isLoadingAI: boolean;
  setIsLoadingAI: (loading: boolean) => void;

  // ── AI Generated Config ──
  isAIGenerated: boolean;
  setIsAIGenerated: (value: boolean) => void;
  loadConfigFromAI: (config: PlacardConfig) => void;

  // ── Reset ──
  reset: () => void;
}

let idCounter = 100;
function genId(prefix: string) {
  return `${prefix}-${++idCounter}`;
}

export const useWardrobeStore = create<WardrobeState>((set) => ({
  // ── Wizard ──
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  // ── Config ──
  config: createDefaultPlacardConfig(),

  // ── Dimensions ──
  setDimensions: (dims) =>
    set((s) => ({
      config: {
        ...s.config,
        dimensions: { ...s.config.dimensions, ...dims },
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // ── Structure / Material ──
  setMaterialId: (id) =>
    set((s) => {
      const mat = MATERIAL_CATALOG[id];
      if (!mat) return s;
      return {
        config: {
          ...s.config,
          structure: { ...s.config.structure, material: mat },
          metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  setStructure: (partial) =>
    set((s) => ({
      config: {
        ...s.config,
        structure: { ...s.config.structure, ...partial },
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // ── Doors ──
  setDoorType: (type) =>
    set((s) => {
      const circ = DOOR_CIRCULATION[type];
      return {
        config: {
          ...s.config,
          doors: {
            ...s.config.doors,
            type,
            depthConsumption: circ.depthConsumption,
            circulationRequired: circ.required,
            circulationRecommended: circ.recommended,
          },
          metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  // ── Sections ──
  setSections: (sections) =>
    set((s) => ({
      config: {
        ...s.config,
        sections,
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  addSection: (width) =>
    set((s) => {
      const newSection: Section = {
        id: genId("sec"),
        order: s.config.sections.length,
        width,
        modules: [
          {
            type: "shelving",
            id: genId("mod"),
            height: 1740,
            shelfCount: 5,
            shelfSpacing: 290,
            adjustable: true,
          },
        ],
      };
      return {
        config: {
          ...s.config,
          sections: [...s.config.sections, newSection],
          metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  removeSection: (id) =>
    set((s) => {
      if (s.config.sections.length <= 1) return s;
      const filtered = s.config.sections
        .filter((sec) => sec.id !== id)
        .map((sec, i) => ({ ...sec, order: i }));
      return {
        config: {
          ...s.config,
          sections: filtered,
          metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  updateSectionWidth: (id, width) =>
    set((s) => ({
      config: {
        ...s.config,
        sections: s.config.sections.map((sec) =>
          sec.id === id ? { ...sec, width } : sec
        ),
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // ── Modules ──
  addModule: (sectionId, module) =>
    set((s) => ({
      config: {
        ...s.config,
        sections: s.config.sections.map((sec) =>
          sec.id === sectionId && sec.modules.length < 3
            ? {
                ...sec,
                modules: [
                  ...sec.modules,
                  { ...module, id: genId("mod") } as Module,
                ],
              }
            : sec
        ),
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  removeModule: (sectionId, moduleId) =>
    set((s) => ({
      config: {
        ...s.config,
        sections: s.config.sections.map((sec) =>
          sec.id === sectionId && sec.modules.length > 1
            ? { ...sec, modules: sec.modules.filter((m) => m.id !== moduleId) }
            : sec
        ),
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  updateModule: (sectionId, moduleId, updates) =>
    set((s) => ({
      config: {
        ...s.config,
        sections: s.config.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                modules: sec.modules.map((m) =>
                  m.id === moduleId ? ({ ...m, ...updates } as Module) : m
                ),
              }
            : sec
        ),
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // ── IA ──
  aiSuggestions: [],
  setAiSuggestions: (suggestions) => set({ aiSuggestions: suggestions }),
  applySuggestion: (suggestion) =>
    set((s) => ({
      config: {
        ...s.config,
        sections: suggestion.sections,
        metadata: { ...s.config.metadata, updatedAt: new Date().toISOString() },
      },
    })),
  isLoadingAI: false,
  setIsLoadingAI: (loading) => set({ isLoadingAI: loading }),

  // ── AI Generated Config ──
  isAIGenerated: false,
  setIsAIGenerated: (value) => set({ isAIGenerated: value }),
  loadConfigFromAI: (config) =>
    set({
      config,
      currentStep: 1, // Start from step 1
      isAIGenerated: true,
    }),

  // ── Reset ──
  reset: () =>
    set({
      currentStep: 1,
      config: createDefaultPlacardConfig(),
      aiSuggestions: [],
      isLoadingAI: false,
      isAIGenerated: false,
    }),
}));

