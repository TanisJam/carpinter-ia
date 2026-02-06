"use client";

import { useWardrobeStore } from "@/stores/wardrobe-store";
import { MODULO_LABELS } from "@/lib/constants";
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
import type { ModuloTipo } from "@/types/wardrobe";

const MODULO_ALTURAS: Record<ModuloTipo, number> = {
  estante: 40,
  cajon: 25,
  barra: 100,
  espacio: 40,
};

export function StepModulos() {
  const columnas = useWardrobeStore((s) => s.columnas);
  const addColumna = useWardrobeStore((s) => s.addColumna);
  const removeColumna = useWardrobeStore((s) => s.removeColumna);
  const addModulo = useWardrobeStore((s) => s.addModulo);
  const removeModulo = useWardrobeStore((s) => s.removeModulo);
  const [selectedTipo, setSelectedTipo] = useState<ModuloTipo>("estante");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Modulos interiores</h2>
        <p className="text-sm text-muted-foreground">
          Divide tu placard en columnas y agrega modulos a cada una.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={addColumna}
          variant="outline"
          size="sm"
          disabled={columnas.length >= 4}
        >
          + Agregar columna
        </Button>
        <span className="text-sm text-muted-foreground">
          {columnas.length} de 4 columnas
        </span>
      </div>

      <div className="space-y-4">
        {columnas.map((col, colIdx) => (
          <Card key={col.id}>
            <CardHeader className="py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  Columna {colIdx + 1}
                </CardTitle>
                {columnas.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColumna(col.id)}
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
                  {col.modulos.map((mod) => (
                    <div
                      key={mod.id}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {MODULO_LABELS[mod.tipo]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {mod.altura} cm
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModulo(col.id, mod.id)}
                        className="h-6 px-2 text-xs"
                        disabled={col.modulos.length <= 1}
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
                  value={selectedTipo}
                  onValueChange={(v) => setSelectedTipo(v as ModuloTipo)}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MODULO_LABELS).map(([value, label]) => (
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
                  onClick={() =>
                    addModulo(col.id, {
                      tipo: selectedTipo,
                      altura: MODULO_ALTURAS[selectedTipo],
                    })
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
