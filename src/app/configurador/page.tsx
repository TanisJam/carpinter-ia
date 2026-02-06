"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronUpIcon, ChevronDownIcon, HelpCircle, Settings } from "lucide-react";
import { Header } from "@/components/shared/header";
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

  useEffect(() => {
    const aiConfigParam = searchParams.get("aiConfig");

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
  }, [searchParams, loadConfigFromAI, setIsAIGenerated]);

  return (
    <>
      <Header />
      <div className="h-[calc(100dvh-3.5rem)] flex flex-col lg:flex-row">
        <div className="flex-1 relative flex flex-col">
          <div className="h-1/2 lg:h-full flex-1">
            <WardrobeCanvas />
          </div>

          {/* Panel de wizard colapsable en mobile */}
          <div className={cn("lg:hidden h-1/2 border-t bg-background flex flex-col transition-all duration-300", !isWizardExpanded && "h-auto")}>
            <button
              onClick={() => setIsWizardExpanded(!isWizardExpanded)}
              className="flex items-center justify-center p-3 border-b bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <span className="text-sm font-medium mr-2">Configuración</span>
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
                  Ajustes
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
        <div className="hidden lg:block w-[420px] border-r flex flex-col bg-background">
          <ScrollArea className="flex-1">
            <WizardContainer />
          </ScrollArea>
        </div>
      </div>
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
