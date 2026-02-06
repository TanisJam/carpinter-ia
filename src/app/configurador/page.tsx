"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  HelpCircle,
  Settings,
} from "lucide-react";
import { AppHeader } from "@/components/shared/app-header";
import { WizardContainer } from "@/components/wizard/wizard-container";
import { CustomizationPanel } from "@/components/panels/customization-panel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import { WIZARD_STEPS } from "@/lib/constants";
import { StepDimensiones } from "@/components/wizard/step-dimensiones";
import { StepModulos } from "@/components/wizard/step-modulos";
import { StepMateriales } from "@/components/wizard/step-materiales";
import { StepPuertas } from "@/components/wizard/step-puertas";
import { placardConfigSchema } from "@/schemas/wardrobe-schema";
import { cn } from "@/lib/utils";

const WardrobeCanvas = dynamic(
  () =>
    import("@/components/three/wardrobe-canvas").then(
      (mod) => mod.WardrobeCanvas
    ),
  { ssr: false }
);

function Canvas2DPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 text-gray-400">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">2D Blueprint View</p>
      </div>
    </div>
  );
}

const STEP_COMPONENTS = [
  StepDimensiones,
  StepModulos,
  StepMateriales,
  StepPuertas,
];

function ConfiguradorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  const currentStep = useWardrobeStore((s) => s.currentStep);
  const setCurrentStep = useWardrobeStore((s) => s.setCurrentStep);
  const nextStep = useWardrobeStore((s) => s.nextStep);
  const prevStep = useWardrobeStore((s) => s.prevStep);
  const sections = useWardrobeStore((s) => s.config.sections);
  const setIsAIGenerated = useWardrobeStore((s) => s.setIsAIGenerated);
  const loadConfigFromAI = useWardrobeStore((s) => s.loadConfigFromAI);
  const [isWizardExpanded, setIsWizardExpanded] = useState(true);

  const StepComponent = STEP_COMPONENTS[currentStep - 1];
  const isFirst = currentStep === 1;
  const isLast = currentStep === WIZARD_STEPS.length;

  const totalUnits = sections.length;
  const estimatedCost = 1240;

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const aiConfigParam = searchParams.get("aiConfig");
    const aiPrompt = searchParams.get("ai");

    // Case 1: Pre-generated config passed via URL (legacy or specific use case)
    if (aiConfigParam) {
      try {
        const configJson = atob(decodeURIComponent(aiConfigParam));
        const config = JSON.parse(configJson);

        // Validate with schema
        const validatedConfig = placardConfigSchema.parse(config);

        // Load into store
        loadConfigFromAI(validatedConfig);
        setIsAIGenerated(true);

        console.log("Loaded AI-generated config:", validatedConfig.id);
      } catch (error) {
        console.error("Error loading AI config:", error);
        alert("Error al cargar la configuración generada por IA");
      }
    } 
    // Case 2: Text prompt passed, need to generate config
    else if (aiPrompt) {
      const generateConfig = async () => {
        setIsGenerating(true);
        try {
          const response = await fetch("/api/nl-to-config", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ transcript: aiPrompt }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al generar la configuración");
          }

          const data = await response.json();
          
          if (data.config) {
            // Load into store
            loadConfigFromAI(data.config);
            setIsAIGenerated(true);
            
            // Clean URL
            const url = new URL(window.location.href);
            url.searchParams.delete("ai");
            window.history.replaceState({}, "", url);
            
            if (data.warning) {
              console.warn(data.warning);
            }
          }
        } catch (error) {
          console.error("Error generating config:", error);
          alert("Hubo un error al generar el diseño con IA. Por favor intenta nuevamente.");
        } finally {
          setIsGenerating(false);
        }
      };

      generateConfig();
    }
  }, [searchParams, loadConfigFromAI, setIsAIGenerated]);

  return (
    <>
      <AppHeader />
      <div className="h-[calc(100dvh-3.5rem)] flex flex-col lg:flex-row">
        <div className="flex-1 relative flex flex-col">
          <div className="h-1/2 lg:h-full flex-1">
            <WardrobeCanvas />
          </div>

          {/* Panel de wizard colapsable en mobile */}
          <div
            className={cn(
              "lg:hidden h-1/2 border-t bg-background flex flex-col transition-all duration-300",
              !isWizardExpanded && "h-auto"
            )}
          >
            <button
              onClick={() => setIsWizardExpanded(!isWizardExpanded)}
              className="flex items-center justify-center p-3 border-b bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <span className="text-sm font-medium mr-2">Configuration</span>
              {isWizardExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronUpIcon className="h-4 w-4" />
              )}
            </button>
            {isWizardExpanded && (
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <WizardContainer />
                </ScrollArea>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <ScrollArea className="h-full">
                  <CustomizationPanel />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Wizard (izquierda en desktop) */}
        <div className="hidden lg:flex w-[420px] border-r flex-col bg-background">
          <ScrollArea className="flex-1">
            <WizardContainer />
          </ScrollArea>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h3 className="text-xl font-semibold">Generando tu diseño...</h3>
            <p className="text-muted-foreground">La IA está analizando tu solicitud</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function ConfiguradorPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ConfiguradorContent />
    </Suspense>
  );
}
