"use client";

import { useRouter } from "next/navigation";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, FileText, Image, Package } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/configurador")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Export Project
              </h1>
              <p className="text-sm text-gray-500">
                Download your wardrobe design and assembly guide
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
            <span className="font-semibold text-sm tracking-tight">
              WARDROBE<span className="font-normal">CRAFT</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Export Options */}
            <div className="space-y-6">
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Export Options
                </h2>

                <div className="space-y-4">
                  {/* PDF Export */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Complete PDF Guide
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Full assembly instructions, cut list, and 3D renders
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  {/* Images Export */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Image className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        3D Renders
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        High-resolution images from multiple angles
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Images
                      </Button>
                    </div>
                  </div>

                  {/* Materials List */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Materials List
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Detailed cut list and hardware specifications
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Project Summary */}
            <div className="space-y-6">
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Summary
                </h2>

                <div className="space-y-4">
                  {/* Dimensions */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Dimensions
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase mb-1">
                          Width
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {widthCm} cm
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase mb-1">
                          Height
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {heightCm} cm
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase mb-1">
                          Depth
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {depthCm} cm
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuration */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Configuration
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Total Sections
                        </span>
                        <span className="font-semibold text-gray-900">
                          {totalSections}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Total Components
                        </span>
                        <span className="font-semibold text-gray-900">
                          {totalComponents}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Material</span>
                        <span className="font-semibold text-gray-900">
                          {config.structure.material.label}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Door Type</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {config.doors.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Cost */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-blue-900">
                        Estimated Cost
                      </span>
                      <span className="text-2xl font-bold text-blue-900">
                        $1,240
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      * Final cost may vary based on material availability and
                      installation
                    </p>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/configurador")}
                  className="flex-1"
                >
                  Back to Editor
                </Button>
                <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
                  Save Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2024 Wardrobe Architect Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
