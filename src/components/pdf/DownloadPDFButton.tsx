"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWardrobeStore } from "@/stores/wardrobe-store";
import { generateWardrobePDF } from "@/lib/pdf/generate-wardrobe-pdf";

type DownloadStatus = "idle" | "generating" | "success" | "error";

export function DownloadPDFButton() {
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const config = useWardrobeStore((state) => state.config);

  const handleDownload = async () => {
    if (!config) {
      alert("No hay configuración para exportar");
      return;
    }

    setStatus("generating");

    try {
      const pdfBlob = await generateWardrobePDF(config);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `placard-${config.metadata.name || config.id.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={status === "generating"}
      size="lg"
      variant={status === "success" ? "default" : "outline"}
      className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white w-full"
    >
      {status === "generating" && (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      )}
      {status === "success" && <CheckCircle className="mr-2 h-5 w-5" />}
      {status === "error" && <FileText className="mr-2 h-5 w-5" />}
      {status === "idle" && <Download className="mr-2 h-5 w-5" />}

      {status === "generating" && "Generando PDF..."}
      {status === "success" && "¡PDF Descargado!"}
      {status === "error" && "Error - Reintentar"}
      {status === "idle" && "Descargar Guía Completa en PDF"}
    </Button>
  );
}
