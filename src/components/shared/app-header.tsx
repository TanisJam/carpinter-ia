"use client";

import { useRouter, usePathname } from "next/navigation";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import Image from "next/image";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isAIGenerated = useWardrobeStore((s) => s.isAIGenerated);
  const config = useWardrobeStore((s) => s.config);

  // Determine which step is active based on pathname
  const currentStep =
    pathname === "/"
      ? "setup"
      : pathname === "/configurador"
      ? "configure"
      : pathname === "/export"
      ? "export"
      : "setup";

  // Configure is enabled if AI config is generated or we're already on that page
  const isConfigureEnabled = isAIGenerated || pathname === "/configurador";

  // Export is enabled if we have sections configured
  const isExportEnabled = config.sections.length > 0;

  const handleStepClick = (step: string) => {
    if (step === "setup") {
      router.push("/");
    } else if (step === "configure" && isConfigureEnabled) {
      router.push("/configurador");
    } else if (step === "export" && isExportEnabled) {
      router.push("/export");
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image src="/logo.svg" alt="Wardrobe Craft" width={120} height={32} />
        </button>

        {/* Step Tabs - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-2 md:gap-4 text-sm">
          <button
            onClick={() => handleStepClick("setup")}
            className={`px-3 md:px-4 py-2 rounded transition-colors ${
              currentStep === "setup"
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <span className="hidden sm:inline">01 </span>Setup
          </button>

          <button
            onClick={() => handleStepClick("configure")}
            disabled={!isConfigureEnabled}
            className={`px-3 md:px-4 py-2 rounded transition-colors ${
              currentStep === "configure"
                ? "bg-gray-900 text-white font-medium"
                : isConfigureEnabled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <span className="hidden sm:inline">02 </span>Configure
          </button>

          <button
            onClick={() => handleStepClick("export")}
            disabled={!isExportEnabled}
            className={`px-3 md:px-4 py-2 rounded transition-colors ${
              currentStep === "export"
                ? "bg-gray-900 text-white font-medium"
                : isExportEnabled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <span className="hidden sm:inline">03 </span>Export
          </button>
        </nav>
      </div>
    </header>
  );
}
