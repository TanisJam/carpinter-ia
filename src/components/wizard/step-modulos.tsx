"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { HANGING_HEIGHT_RANGES, DRAWER_FRONT_RANGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { Module } from "@/schemas/wardrobe-schema";

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
type ModulePreset = "hanging" | "shelving" | "drawers";

const MODULE_TYPE_LABELS: Record<ModulePreset, string> = {
  hanging: "Colgado",
  shelving: "Estantes",
  drawers: "Cajones",
};

/** Returns a label for a module based on its type and variant */
function getModuleLabel(mod: Module): string {
  switch (mod.type) {
    case "hanging":
      return HANGING_HEIGHT_RANGES[mod.variant].label;
    case "shelving":
      return "Estantes";
    case "drawers":
      return DRAWER_FRONT_RANGES[mod.variant].label;
  }
}

/** Creates a default module object (without id) for a given type */
function createDefaultModule(type: ModulePreset): DistributiveOmit<Module, "id"> {
  switch (type) {
    case "hanging":
      return {
        type: "hanging",
        variant: "medio",
        height: 1100,
        rodPositionFromTop: 50,
        rodDiameter: 25,
        garmentSpacing: 40,
      };
    case "shelving":
      return {
        type: "shelving",
        height: 900,
        shelfCount: 3,
        shelfSpacing: 290,
        adjustable: true,
      };
    case "drawers":
      return {
        type: "drawers",
        variant: "estandar",
        height: 640,
        drawerCount: 4,
        drawerFrontHeight: 160,
        slideClearance: 12.7,
        slideType: "extraccion_total",
        hasDividers: false,
      };
  }
}

export function StepModulos() {
  const sections = useWardrobeStore((s) => s.config.sections);
  const addSection = useWardrobeStore((s) => s.addSection);
  const removeSection = useWardrobeStore((s) => s.removeSection);
  const addModule = useWardrobeStore((s) => s.addModule);
  const removeModule = useWardrobeStore((s) => s.removeModule);
  const [selectedType, setSelectedType] = useState<ModulePreset>("shelving");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Modulos interiores</h2>
        <p className="text-sm text-muted-foreground">
          Divide tu placard en secciones y agrega modulos a cada una.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => addSection(600)}
          variant="outline"
          size="sm"
          disabled={sections.length >= 8}
        >
          + Agregar seccion
        </Button>
        <span className="text-sm text-muted-foreground">
          {sections.length} de 8 secciones
        </span>
      </div>

      <div className="space-y-4">
        {sections.map((sec, secIdx) => (
          <Card key={sec.id}>
            <CardHeader className="py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  Seccion {secIdx + 1} ({sec.width / 10} cm)
                </CardTitle>
                {sections.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(sec.id)}
                    className="text-destructive h-7 px-2"
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {sec.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {getModuleLabel(mod)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {mod.height / 10} cm
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(sec.id, mod.id)}
                        className="h-6 px-2 text-xs"
                        disabled={sec.modules.length <= 1}
                      >
                        x
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-3" />

              <div className="flex items-center gap-2">
                <Select
                  value={selectedType}
                  onValueChange={(v) => setSelectedType(v as ModulePreset)}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MODULE_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  disabled={sec.modules.length >= 3}
                  onClick={() =>
                    addModule(sec.id, createDefaultModule(selectedType))
                  }
                >
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
