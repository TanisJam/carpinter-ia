"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/shared/header";
import { WizardContainer } from "@/components/wizard/wizard-container";
import { CustomizationPanel } from "@/components/panels/customization-panel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";


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

export default function ConfiguradorPage() {
  const [isWizardExpanded, setIsWizardExpanded] = useState(true);

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

          {/* Boton para abrir panel de personalizacion en mobile */}
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

          {/* Panel lateral de personalizacion (visible en desktop) */}
          <div className="hidden lg:block absolute top-4 right-4 w-[280px] max-h-[calc(100%-2rem)] bg-background/95 backdrop-blur border rounded-lg shadow-lg overflow-hidden">
            <ScrollArea className="max-h-[calc(100vh-6rem)]">
              <CustomizationPanel />
            </ScrollArea>
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
