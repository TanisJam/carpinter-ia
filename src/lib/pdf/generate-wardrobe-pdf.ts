import jsPDF from "jspdf";
import type { PlacardConfig } from "@/schemas/wardrobe-schema";
import {
  drawIsometricBox,
  drawDimensionLine,
  drawSectionDividers,
  drawModule,
  toIsometric,
  type Point2D,
} from "./isometric-drawer";
import { MATERIAL_CATALOG, DOOR_TYPE_OPTIONS } from "@/lib/constants";

/**
 * Generate a complete technical PDF for the wardrobe configuration
 */
export async function generateWardrobePDF(config: PlacardConfig): Promise<Blob> {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Page 1: Overview with isometric view
  addHeaderPage(doc, config, pageWidth);
  addIsometricView(doc, config, pageWidth, pageHeight);
  addGeneralSpecs(doc, config, pageWidth);

  // Page 2: Sections breakdown
  doc.addPage();
  addSectionsBreakdown(doc, config, pageWidth);

  // Page 3: Materials list
  doc.addPage();
  addMaterialsList(doc, config, pageWidth);

  return doc.output("blob");
}

/**
 * Add header with title and metadata
 */
function addHeaderPage(doc: jsPDF, config: PlacardConfig, pageWidth: number) {
  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PLANO TÉCNICO - PLACARD", pageWidth / 2, 20, { align: "center" });

  // Metadata - more compact
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const date = new Date().toLocaleDateString("es-AR");
  doc.text(`Fecha: ${date}`, 20, 30);
  doc.text(`ID: ${config.id.substring(0, 8)}`, 80, 30);
  
  if (config.metadata.name) {
    doc.text(`Nombre: ${config.metadata.name}`, 140, 30);
  }

  // Removed separator line to save space
}

/**
 * Add isometric view of the wardrobe
 */
function addIsometricView(
  doc: jsPDF,
  config: PlacardConfig,
  pageWidth: number,
  pageHeight: number
) {
  const { width, height, depth } = config.dimensions;

  // Label at top
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Vista Isométrica", pageWidth / 2, 45, { align: "center" });

  // Calculate scale to fit on page - make it smaller
  const maxWidth = pageWidth - 80;
  const maxHeight = 90; // Even smaller to ensure no overlap
  const scale = Math.min(maxWidth / (width + depth), maxHeight / height) * 0.7;

  // Center the drawing - moved much lower
  const origin: Point2D = {
    x: pageWidth / 2 - (width * scale * 0.5),
    y: 130, // Moved down significantly
  };

  // Draw main box
  const boxPoints = drawIsometricBox(doc, origin, width, height, depth, scale);

  // Draw section dividers
  const sectionWidths = config.sections.map((s) => s.width);
  drawSectionDividers(doc, origin, sectionWidths, height, depth, scale);

  // Draw modules (simplified)
  let currentX = 0;
  config.sections.forEach((section) => {
    section.modules.forEach((module) => {
      drawModule(
        doc,
        origin,
        module.type,
        currentX,
        0,
        section.width,
        module.height,
        depth,
        scale
      );
    });
    currentX += section.width;
  });

  // Add dimension lines
  addDimensionLines(doc, origin, width, height, depth, scale);
}

/**
 * Add dimension lines to the isometric view
 */
function addDimensionLines(
  doc: jsPDF,
  origin: Point2D,
  width: number,
  height: number,
  depth: number,
  scale: number
) {
  // Width dimension (bottom front)
  const widthStart = toIsometric(0, 0, 0, scale);
  const widthEnd = toIsometric(width, 0, 0, scale);
  
  drawDimensionLine(
    doc,
    { x: origin.x + widthStart.x, y: origin.y - widthStart.y },
    { x: origin.x + widthEnd.x, y: origin.y - widthEnd.y },
    `${width} MM`,
    15,
    "bottom"
  );

  // Height dimension (left front)
  const heightStart = toIsometric(0, 0, 0, scale);
  const heightEnd = toIsometric(0, height, 0, scale);
  
  drawDimensionLine(
    doc,
    { x: origin.x + heightStart.x, y: origin.y - heightStart.y },
    { x: origin.x + heightEnd.x, y: origin.y - heightEnd.y },
    `${height} MM`,
    15,
    "left"
  );

  // Depth dimension (bottom right)
  const depthStart = toIsometric(width, 0, 0, scale);
  const depthEnd = toIsometric(width, 0, depth, scale);
  
  drawDimensionLine(
    doc,
    { x: origin.x + depthStart.x, y: origin.y - depthStart.y },
    { x: origin.x + depthEnd.x, y: origin.y - depthEnd.y },
    `${depth} MM`,
    15,
    "right"
  );
}

/**
 * Add general specifications
 */
function addGeneralSpecs(doc: jsPDF, config: PlacardConfig, pageWidth: number) {
  const startY = 230; // Moved down from 200 to avoid overlap

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ESPECIFICACIONES GENERALES", 20, startY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const specs = [
    `Material: ${config.structure.material.label}`,
    `Espesor: ${config.structure.material.thickness}mm`,
    `Puertas: ${DOOR_TYPE_OPTIONS.find((d) => d.value === config.doors.type)?.label || config.doors.type}`,
    `Zócalo: ${config.structure.zocalo.enabled ? `${config.structure.zocalo.height}mm` : "No"}`,
    `Maletero: ${config.structure.maletero.enabled ? `${config.structure.maletero.height}mm` : "No"}`,
    `Panel trasero: ${config.structure.backPanel.thickness}mm`,
  ];

  specs.forEach((spec, index) => {
    doc.text(`• ${spec}`, 25, startY + 10 + index * 6);
  });
}

/**
 * Add sections breakdown (Page 2)
 */
function addSectionsBreakdown(doc: jsPDF, config: PlacardConfig, pageWidth: number) {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("DESGLOSE DE SECCIONES", pageWidth / 2, 20, { align: "center" });

  let currentY = 35;

  config.sections.forEach((section, sectionIndex) => {
    // Section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(20, currentY - 5, pageWidth - 40, 8, "F");
    doc.text(`Sección ${sectionIndex + 1} (${section.width}mm de ancho)`, 25, currentY);
    currentY += 12;

    // Modules
    section.modules.forEach((module, moduleIndex) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`  Módulo ${moduleIndex + 1}: ${getModuleTypeName(module.type)}`, 25, currentY);
      currentY += 6;

      doc.setFont("helvetica", "normal");
      const moduleDetails = getModuleDetails(module);
      moduleDetails.forEach((detail) => {
        doc.text(`    • ${detail}`, 30, currentY);
        currentY += 5;
      });

      currentY += 3;
    });

    currentY += 5;

    // Check if we need a new page
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
  });
}

/**
 * Add materials list (Page 3)
 */
function addMaterialsList(doc: jsPDF, config: PlacardConfig, pageWidth: number) {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("LISTA DE MATERIALES", pageWidth / 2, 20, { align: "center" });

  let currentY = 35;

  // Panels section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PANELES (Melamina 18mm)", 20, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const panels = calculatePanels(config);
  panels.forEach((panel) => {
    doc.text(`• ${panel}`, 25, currentY);
    currentY += 6;
  });

  currentY += 10;

  // Hardware section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("HERRAJES", 20, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const hardware = calculateHardware(config);
  hardware.forEach((item) => {
    doc.text(`• ${item}`, 25, currentY);
    currentY += 6;
  });

  currentY += 10;

  // Notes
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text("Nota: Las medidas son aproximadas. Verificar en obra antes de cortar.", 20, currentY);
}

/**
 * Helper: Get module type name in Spanish
 */
function getModuleTypeName(type: string): string {
  const names: Record<string, string> = {
    hanging: "Colgado",
    drawers: "Cajones",
    shelving: "Estantes",
  };
  return names[type] || type;
}

/**
 * Helper: Get module details
 */
function getModuleDetails(module: any): string[] {
  const details: string[] = [];

  if (module.type === "hanging") {
    details.push(`Altura: ${module.height}mm`);
    details.push(`Variante: ${module.variant}`);
    details.push(`Barral: Ø${module.rodDiameter}mm`);
  } else if (module.type === "drawers") {
    details.push(`Altura total: ${module.height}mm`);
    details.push(`Cantidad de cajones: ${module.drawerCount}`);
    details.push(`Frente de cajón: ${module.drawerFrontHeight}mm`);
    details.push(`Variante: ${module.variant}`);
  } else if (module.type === "shelving") {
    details.push(`Altura total: ${module.height}mm`);
    details.push(`Cantidad de estantes: ${module.shelfCount}`);
    details.push(`Espaciado: ${module.shelfSpacing}mm`);
  }

  return details;
}

/**
 * Helper: Calculate panels needed
 */
function calculatePanels(config: PlacardConfig): string[] {
  const { width, height, depth } = config.dimensions;
  const panels: string[] = [];

  panels.push(`2x Laterales: ${height} x ${depth}mm`);
  panels.push(`1x Superior: ${width} x ${depth}mm`);
  panels.push(`1x Inferior: ${width} x ${depth}mm`);
  panels.push(`${config.sections.length - 1}x Divisores: ${height} x ${depth}mm`);
  panels.push(`1x Panel trasero (MDF 5mm): ${width} x ${height}mm`);

  return panels;
}

/**
 * Helper: Calculate hardware needed
 */
function calculateHardware(config: PlacardConfig): string[] {
  const hardware: string[] = [];

  // Count hanging rods
  const hangingModules = config.sections.flatMap((s) =>
    s.modules.filter((m) => m.type === "hanging")
  );
  if (hangingModules.length > 0) {
    hardware.push(`${hangingModules.length}x Barral cromado Ø25mm`);
    hardware.push(`${hangingModules.length * 2}x Soporte para barral`);
  }

  // Count drawer slides
  const drawerModules = config.sections.flatMap((s) =>
    s.modules.filter((m) => m.type === "drawers")
  );
  const totalDrawers = drawerModules.reduce(
    (sum, m: any) => sum + m.drawerCount,
    0
  );
  if (totalDrawers > 0) {
    hardware.push(`${totalDrawers * 2}x Corredera de cajón (extracción total)`);
  }

  // Count shelf supports
  const shelvingModules = config.sections.flatMap((s) =>
    s.modules.filter((m) => m.type === "shelving")
  );
  const totalShelves = shelvingModules.reduce(
    (sum, m: any) => sum + m.shelfCount,
    0
  );
  if (totalShelves > 0) {
    hardware.push(`${totalShelves * 4}x Soporte de estante regulable`);
  }

  // Door hinges
  if (config.doors.type === "batientes") {
    const doorCount = Math.ceil(config.dimensions.width / 600);
    hardware.push(`${doorCount * 3}x Bisagra de puerta`);
  } else if (config.doors.type === "corredizas") {
    hardware.push(`2x Riel superior para puertas corredizas`);
    hardware.push(`2x Riel inferior para puertas corredizas`);
  }

  return hardware;
}
