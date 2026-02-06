"use client";

import { Progress } from "@/components/ui/progress";

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: readonly Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="px-6 pt-4 pb-2 space-y-3">
      <Progress value={progressValue} className="h-1.5" />

      <div className="flex justify-between">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className="flex items-center gap-1.5"
            >
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? "\u2713" : step.id}
              </div>
              <span
                className={`text-xs hidden sm:inline ${
                  isActive ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
