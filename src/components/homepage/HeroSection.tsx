"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { VoiceInput } from "./VoiceInput";

interface HeroSectionProps {
  title: string;
  placeholder: string;
  submitButton: string;
}

export function HeroSection({
  title,
  placeholder,
  submitButton,
}: HeroSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (transcript: string) => {
    setIsProcessing(true);

    try {
      // Call API to convert natural language to config
      const response = await fetch("/api/nl-to-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const { config, warning } = data;

      // Show warning if using mock generator
      if (warning) {
        console.warn(warning);
        alert(`⚠️ ${warning}`);
      }

      // Encode config as base64 and navigate to configurator
      const configBase64 = btoa(JSON.stringify(config));
      router.push(`/configurador?aiConfig=${encodeURIComponent(configBase64)}`);
    } catch (error) {
      console.error("Error:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      alert(`Hubo un error al generar la configuración:\n\n${message}\n\nPor favor, verifica que tu OPENAI_API_KEY esté configurada en .env.local`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      </div>

      <VoiceInput onSubmit={handleSubmit} isProcessing={isProcessing} />
    </div>
  );
}
