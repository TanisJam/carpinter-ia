"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import { WIZARD_STEPS } from "@/lib/constants";
import { StepDimensiones } from "@/components/wizard/step-dimensiones";
import { StepModulos } from "@/components/wizard/step-modulos";
import { StepMateriales } from "@/components/wizard/step-materiales";
import { StepPuertas } from "@/components/wizard/step-puertas";
import { Button } from "@/components/ui/button";
import { HelpCircle, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { placardConfigSchema } from "@/schemas/wardrobe-schema";

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

export default function ConfiguradorPage() {
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

  const StepComponent = STEP_COMPONENTS[currentStep - 1];
  const isFirst = currentStep === 1;
  const isLast = currentStep === WIZARD_STEPS.length;

  const totalUnits = sections.length;
  const estimatedCost = 1240;

  useEffect(() => {
    const aiConfigParam = searchParams.get("aiConfig");

    if (aiConfigParam) {
      try {
        // Decode base64 and parse JSON
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
    <div className="h-screen flex flex-col bg-white">
      {/* Top Header */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
            <span className="font-semibold text-sm tracking-tight">
              WARDROBE<span className="font-normal">CRAFT</span>
            </span>
            <span className="text-xs text-gray-400 ml-2">V.2.0 BETA</span>
          </div>

          {/* Progress Steps */}
          <nav className="flex items-center gap-6 text-sm">
            <button className="text-gray-400 hover:text-gray-900">
              1. SETUP
            </button>
            <button className="text-gray-900 font-medium underline underline-offset-4">
              2. CONFIGURE
            </button>
            <button className="text-gray-400 hover:text-gray-900">
              3. MATERIAL
            </button>
            <button className="text-gray-400 hover:text-gray-900">
              4. REVIEW
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm">
            SAVE PROJECT
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Visualization */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* View Mode Tabs */}
          <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-2 bg-white">
            <button
              onClick={() => setViewMode("2d")}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${
                viewMode === "2d"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              2D VIEW
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${
                viewMode === "3d"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              3D MODEL
            </button>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 relative">
            {viewMode === "2d" ? <Canvas2DPlaceholder /> : <WardrobeCanvas />}
          </div>

          {/* Bottom Summary Bar */}
          <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8 text-sm">
              <div>
                <span className="text-gray-500 text-xs uppercase">
                  Total Modules
                </span>
                <div className="font-semibold text-lg">{totalUnits} Units</div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div>
                <span className="text-gray-500 text-xs uppercase">
                  Est. Cost
                </span>
                <div className="font-semibold text-lg">
                  ${estimatedCost.toLocaleString()}
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/export")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              PROCEED
            </Button>
          </div>
        </div>

        {/* Right Panel - Configuration */}
        <div className="w-[400px] border-l border-gray-200 flex flex-col bg-white">
          {/* Step Tabs */}
          <div className="border-b border-gray-200 flex overflow-x-auto">
            {WIZARD_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                  currentStep === step.id
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-auto p-6">
            <StepComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
