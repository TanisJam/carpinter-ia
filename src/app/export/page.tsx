"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Grid3x3, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AppHeader } from "@/components/shared/app-header";
import { DownloadPDFButton } from "@/components/pdf/DownloadPDFButton";

export default function ExportPage() {
  const router = useRouter();
  const config = useWardrobeStore((s) => s.config);
  const dimensions = config.dimensions;

  // Convert mm to cm for display
  const widthCm = Math.round(dimensions.width / 10);
  const heightCm = Math.round(dimensions.height / 10);
  const depthCm = Math.round(dimensions.depth / 10);

  const totalSections = config.sections.length;
  const totalComponents = config.sections.reduce(
    (sum, section) => sum + section.modules.length,
    0
  );

  // Checklist state
  const [includeDrawings, setIncludeDrawings] = useState(true);
  const [includeMaterials, setIncludeMaterials] = useState(true);
  const [includeInstructions, setIncludeInstructions] = useState(true);
  const [includeHardware, setIncludeHardware] = useState(true);
  const [include3DViews, setInclude3DViews] = useState(false);
  const [includeQRCodes, setIncludeQRCodes] = useState(true);

  // Format options
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "web">("pdf");

  // Mock materials list
  const materialsList = [
    { component: "Side Panels", qty: 2, size: "50×220cm" },
    { component: "Top/Bottom Panels", qty: 2, size: "200×50cm" },
    { component: "Back Panel", qty: 1, size: "200×220cm" },
    { component: "Module Dividers", qty: 1, size: "50×220cm" },
    { component: "Hanging_bar", qty: 1, size: "100×8cm" },
    { component: "Shelf", qty: 1, size: "100×30cm" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader />

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-6 md:py-12">
        {/* Mobile Top Actions */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => router.push("/configurador")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO EDITOR
          </button>
          <button className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 border border-gray-300 rounded">
            <Grid3x3 className="w-3 h-3" />
            SHORTCUTS
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Export Options */}
          <div className="space-y-6 md:space-y-8">
            {/* Hero Section */}
            <section className="border border-gray-200 rounded-lg p-6 md:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    EXPORT
                    <br />
                    ASSEMBLY
                    <br />
                    GUIDE
                  </h1>
                  <p className="text-gray-600 text-sm max-w-md">
                    Generate your complete building documentation. Includes all
                    necessary schematics and lists for assembly.
                  </p>
                </div>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </section>

            {/* Contents Manifest */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-6">
                CONTENTS_MANIFEST
              </h2>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  YOUR GUIDE INCLUDES:
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={includeDrawings}
                      onCheckedChange={(checked: boolean) =>
                        setIncludeDrawings(checked)
                      }
                    />
                    <span className="text-sm text-gray-700">
                      Technical drawings (front, side, top views)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={includeMaterials}
                      onCheckedChange={(checked: boolean) =>
                        setIncludeMaterials(checked)
                      }
                    />
                    <span className="text-sm text-gray-700">
                      Complete materials list with quantities
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={includeInstructions}
                      onCheckedChange={(checked: boolean) =>
                        setIncludeInstructions(checked)
                      }
                    />
                    <span className="text-sm text-gray-700">
                      Step-by-step assembly instructions
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={includeHardware}
                      onCheckedChange={(checked: boolean) =>
                        setIncludeHardware(checked)
                      }
                    />
                    <span className="text-sm text-gray-700">
                      Hardware and tools checklist
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={include3DViews}
                      onCheckedChange={(checked: boolean) =>
                        setInclude3DViews(checked)
                      }
                    />
                    <span className="text-sm text-gray-700">
                      3D exploded view diagrams (Beta)
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* Format Options */}
            <section className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                  FORMAT_OPTIONS
                </h2>
                <span className="text-xs text-gray-400">V.1.0</span>
              </div>

              <div className="space-y-3">
                {/* PDF Option */}
                <button
                  onClick={() => setSelectedFormat("pdf")}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    selectedFormat === "pdf"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        PDF (PRINTABLE)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Best for printing and offline use on site.
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === "pdf"
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedFormat === "pdf" && (
                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Web Guide Option */}
                <button
                  onClick={() => setSelectedFormat("web")}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    selectedFormat === "web"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        INTERACTIVE WEB GUIDE
                      </h3>
                      <p className="text-xs text-gray-500">
                        Mobile-friendly step-by-step viewer.
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === "web"
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedFormat === "web" && (
                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Digital Assets */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
                  DIGITAL_ASSETS
                </h3>
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  INCLUDE QR CODES LINKING TO:
                </p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={includeQRCodes}
                    onCheckedChange={(checked: boolean) =>
                      setIncludeQRCodes(checked)
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Video tutorials (recommended)
                  </span>
                </label>
              </div>
            </section>

            {/* Back Button - Desktop only */}
            <button
              onClick={() => router.push("/configurador")}
              className="hidden lg:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO EDITOR
            </button>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <section className="border border-gray-900 rounded-lg p-6">
              {/* Configuration Summary */}

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                  CONFIGURATION SUMMARY
                </h2>
                <span className="text-xs text-gray-400">REF.2024</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Dimensions</span>
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {widthCm}×{heightCm}×{depthCm}cm
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Modules</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalSections} sections
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Style</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Nordic
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Material</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Melamine
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Components</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalComponents} items
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-900">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    ESTIMATED COST
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    $26803
                  </span>
                </div>
              </div>
            </section>

            {/* Materials List Preview */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
                MATERIALS LIST PREVIEW
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-[1fr,auto,auto] gap-4 text-xs font-semibold text-gray-500 uppercase pb-2 border-b border-gray-200">
                  <span>Component</span>
                  <span>Qty</span>
                  <span>Size</span>
                </div>

                {materialsList.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr,auto,auto] gap-4 text-sm py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-700">{item.component}</span>
                    <span className="text-gray-900 font-semibold text-center">
                      {item.qty}
                    </span>
                    <span className="text-gray-600 font-mono text-xs">
                      {item.size}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-xs text-gray-500 hover:text-gray-900 uppercase tracking-wider">
                VIEW ALL ITEMS
              </button>
            </section>

            {/* Download Button */}
      {/* PDF Export Section */}
      <div className="pt-6 border-t border-border">
        <div className="space-y-3">
          <DownloadPDFButton />
        </div>
      </div>
            

            <p className="text-xs text-gray-500 text-center">
              By downloading, you agree to our Terms of Service regarding custom
              manufacturing data.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <span className="text-center md:text-left">
            © 2024 STUDIO — ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="p-1 hover:bg-gray-100 rounded">
              <HelpCircle className="w-4 h-4" />
            </button>
            <span className="font-mono hidden sm:inline">
              47.3109° N, 8.5417 E
            </span>
            <span>ZURICH, CH</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
