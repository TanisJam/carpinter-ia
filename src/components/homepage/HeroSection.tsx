"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colors } from "@/styles/colors";

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
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (description.trim()) {
      // Navigate to configurator with AI description
      router.push(`/configurador?ai=${encodeURIComponent(description)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full min-h-[120px] p-4 bg-gray-50 rounded-lg border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder:text-gray-400"
      />

      <Button
        onClick={handleSubmit}
        disabled={!description.trim()}
        className="w-full mt-4 text-white py-6 rounded-lg font-medium text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: colors.primaryWithOpacity,
          ...(description.trim() && {
            ":hover": { backgroundColor: colors.hover },
          }),
        }}
      >
        {submitButton}
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
