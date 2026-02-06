"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/shared/header";
import { WizardContainer } from "@/components/wizard/wizard-container";
import { CustomizationPanel } from "@/components/panels/customization-panel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  return (
    <>
      <Header />
      <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
        {/* Wizard (izquierda en desktop) */}
        <div className="w-full lg:w-[420px] border-r flex flex-col bg-background">
          <ScrollArea className="flex-1">
            <WizardContainer />
          </ScrollArea>
        </div>

        {/* Canvas 3D (derecha en desktop) */}
        <div className="flex-1 relative">
          <WardrobeCanvas />

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
      </div>
    </>
  );
}
