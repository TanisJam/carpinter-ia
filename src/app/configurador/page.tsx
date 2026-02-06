"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/shared/header";
import { WizardContainer } from "@/components/wizard/wizard-container";
import { CustomizationPanel } from "@/components/panels/customization-panel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import { placardConfigSchema } from "@/schemas/wardrobe-schema";

const WardrobeCanvas = dynamic(
  () =>
    import("@/components/three/wardrobe-canvas").then(
      (mod) => mod.WardrobeCanvas
    ),
  { ssr: false, loading: () => <CanvasPlaceholder /> }
);

function CanvasPlaceholder() {
  return (
    <div className="w-full h-full min-h-[400px] rounded-lg bg-linear-to-b from-slate-100 to-slate-200 flex items-center justify-center">
      <p className="text-muted-foreground">Cargando vista 3D...</p>
    </div>
  );
}

function ConfiguradorContent() {
  const searchParams = useSearchParams();
  const setIsAIGenerated = useWardrobeStore((s) => s.setIsAIGenerated);
  const loadConfigFromAI = useWardrobeStore((s) => s.loadConfigFromAI);

  useEffect(() => {
    const aiConfigParam = searchParams.get("aiConfig");
    
    if (aiConfigParam) {
      try {
        const configJson = atob(decodeURIComponent(aiConfigParam));
        const config = JSON.parse(configJson);
        const validatedConfig = placardConfigSchema.parse(config);
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
      <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
        <div className="w-full lg:w-[420px] border-r flex flex-col bg-background">
          <ScrollArea className="flex-1">
            <WizardContainer />
          </ScrollArea>
        </div>

        <div className="flex-1 relative">
          <WardrobeCanvas />

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

          <div className="hidden lg:block absolute top-4 right-4 w-[280px] max-h-[calc(100%-2rem)] bg-background/95 backdrop-blur border rounded-lg shadow-lg overflow-hidden">
            <ScrollArea className="max-h-[calc(100vh-6rem)]">
              <CustomizationPanel />
            </ScrollArea>
          </div>
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
