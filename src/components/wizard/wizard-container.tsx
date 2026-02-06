import { useWardrobeStore } from "@/stores/wardrobe-store";
import { WIZARD_STEPS } from "@/lib/constants";
import { StepDimensiones } from "./step-dimensiones";
import { StepModulos } from "./step-modulos";
import { StepMateriales } from "./step-materiales";
import { StepPuertas } from "./step-puertas";
import { StepIndicator } from "@/components/shared/step-indicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const STEP_COMPONENTS = [
  StepDimensiones,
  StepModulos,
  StepMateriales,
  StepPuertas,
];

export function WizardContainer() {
  const currentStep = useWardrobeStore((s) => s.currentStep);
  const nextStep = useWardrobeStore((s) => s.nextStep);
  const prevStep = useWardrobeStore((s) => s.prevStep);
  const isAIGenerated = useWardrobeStore((s) => s.isAIGenerated);

  const StepComponent = STEP_COMPONENTS[currentStep - 1];
  const isFirst = currentStep === 1;
  const isLast = currentStep === WIZARD_STEPS.length;

  return (
    <div className="flex flex-col h-full">
      {isAIGenerated && (
        <div className="px-6 pt-4">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Configurado con IA
          </Badge>
        </div>
      )}
      
      <StepIndicator
        steps={WIZARD_STEPS}
        currentStep={currentStep}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <StepComponent />
      </div>

      <div className="flex justify-between items-center p-4 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isFirst}
        >
          Anterior
        </Button>

        {isLast ? (
          <Button>Finalizar</Button>
        ) : (
          <Button onClick={() => window.location.assign("/export")}>Siguiente</Button>
        )}
      </div>
    </div>
  );
}
