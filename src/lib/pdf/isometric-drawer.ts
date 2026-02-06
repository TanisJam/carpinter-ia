import jsPDF from "jspdf";

/**
 * Utility functions for drawing isometric views in PDF
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Convert 3D coordinates to 2D isometric projection
 */
export function toIsometric(x: number, y: number, z: number, scale: number = 0.1): Point2D {
  // Standard isometric angles (30°)
  const angleX = Math.PI / 6; // 30 degrees
  const angleY = Math.PI / 6; // 30 degrees

  return {
    x: (x - z) * Math.cos(angleX) * scale,
    y: y * scale - (x + z) * Math.sin(angleY) * scale,
  };
}

/**
 * Draw an isometric box (wardrobe body)
 */
export function drawIsometricBox(
  doc: jsPDF,
  origin: Point2D,
  width: number,
  height: number,
  depth: number,
  scale: number = 0.1
) {
  // Convert dimensions to isometric points
  const p1 = toIsometric(0, 0, 0, scale);
  const p2 = toIsometric(width, 0, 0, scale);
  const p3 = toIsometric(width, height, 0, scale);
  const p4 = toIsometric(0, height, 0, scale);
  const p5 = toIsometric(0, 0, depth, scale);
  const p6 = toIsometric(width, 0, depth, scale);
  const p7 = toIsometric(width, height, depth, scale);
  const p8 = toIsometric(0, height, depth, scale);

  // Offset by origin
  const points = [p1, p2, p3, p4, p5, p6, p7, p8].map((p) => ({
    x: origin.x + p.x,
    y: origin.y - p.y, // Invert Y for PDF coordinates
  }));

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  // Front face
  doc.line(points[0].x, points[0].y, points[1].x, points[1].y);
  doc.line(points[1].x, points[1].y, points[2].x, points[2].y);
  doc.line(points[2].x, points[2].y, points[3].x, points[3].y);
  doc.line(points[3].x, points[3].y, points[0].x, points[0].y);

  // Right face
  doc.line(points[1].x, points[1].y, points[5].x, points[5].y);
  doc.line(points[5].x, points[5].y, points[6].x, points[6].y);
  doc.line(points[6].x, points[6].y, points[2].x, points[2].y);

  // Top face
  doc.line(points[3].x, points[3].y, points[7].x, points[7].y);
  doc.line(points[7].x, points[7].y, points[6].x, points[6].y);
  doc.line(points[7].x, points[7].y, points[4].x, points[4].y);
  doc.line(points[4].x, points[4].y, points[0].x, points[0].y);
  doc.line(points[4].x, points[4].y, points[5].x, points[5].y);

  return points;
}

/**
 * Draw a dimension line with arrows and label
 */
export function drawDimensionLine(
  doc: jsPDF,
  from: Point2D,
  to: Point2D,
  label: string,
  offset: number = 5,
  side: "top" | "bottom" | "left" | "right" = "top"
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Perpendicular offset
  let offsetX = 0;
  let offsetY = 0;

  if (side === "top" || side === "bottom") {
    offsetY = side === "top" ? -offset : offset;
  } else {
    offsetX = side === "left" ? -offset : offset;
  }

  const start = { x: from.x + offsetX, y: from.y + offsetY };
  const end = { x: to.x + offsetX, y: to.y + offsetY };

  // Draw dimension line
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(start.x, start.y, end.x, end.y);

  // Draw extension lines
  doc.line(from.x, from.y, start.x, start.y);
  doc.line(to.x, to.y, end.x, end.y);

  // Draw arrows
  const arrowSize = 2;
  drawArrow(doc, start, end, arrowSize);
  drawArrow(doc, end, start, arrowSize);

  // Draw label
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  // Background for text
  const textWidth = doc.getTextWidth(label);
  doc.setFillColor(255, 255, 255);
  doc.rect(midX - textWidth / 2 - 1, midY - 3, textWidth + 2, 5, "F");
  
  doc.text(label, midX, midY, { align: "center" });
}

/**
 * Draw an arrow at the end of a line
 */
function drawArrow(doc: jsPDF, from: Point2D, to: Point2D, size: number) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  const arrowAngle1 = angle + (3 * Math.PI) / 4;
  const arrowAngle2 = angle - (3 * Math.PI) / 4;

  const x1 = from.x + size * Math.cos(arrowAngle1);
  const y1 = from.y + size * Math.sin(arrowAngle1);
  const x2 = from.x + size * Math.cos(arrowAngle2);
  const y2 = from.y + size * Math.sin(arrowAngle2);

  doc.line(from.x, from.y, x1, y1);
  doc.line(from.x, from.y, x2, y2);
}

/**
 * Draw section dividers inside the wardrobe
 */
export function drawSectionDividers(
  doc: jsPDF,
  origin: Point2D,
  sections: number[],
  height: number,
  depth: number,
  scale: number = 0.1
) {
  let currentX = 0;

  sections.forEach((sectionWidth, index) => {
    if (index > 0) {
      // Draw vertical divider
      const p1 = toIsometric(currentX, 0, 0, scale);
      const p2 = toIsometric(currentX, height, 0, scale);
      const p3 = toIsometric(currentX, height, depth, scale);
      const p4 = toIsometric(currentX, 0, depth, scale);

      const points = [p1, p2, p3, p4].map((p) => ({
        x: origin.x + p.x,
        y: origin.y - p.y,
      }));

      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.line(points[0].x, points[0].y, points[1].x, points[1].y);
      doc.line(points[1].x, points[1].y, points[2].x, points[2].y);
      doc.line(points[2].x, points[2].y, points[3].x, points[3].y);
    }

    currentX += sectionWidth;
  });
}

/**
 * Draw a module inside a section (simplified representation)
 */
export function drawModule(
  doc: jsPDF,
  origin: Point2D,
  moduleType: "hanging" | "drawers" | "shelving",
  x: number,
  y: number,
  width: number,
  height: number,
  depth: number,
  scale: number = 0.1
) {
  if (moduleType === "hanging") {
    // Draw hanging rod
    const rodY = y + height - 50; // 50mm from top
    const p1 = toIsometric(x + 50, rodY, depth / 2, scale);
    const p2 = toIsometric(x + width - 50, rodY, depth / 2, scale);

    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(1);
    doc.line(
      origin.x + p1.x,
      origin.y - p1.y,
      origin.x + p2.x,
      origin.y - p2.y
    );
  } else if (moduleType === "drawers") {
    // Draw drawer fronts (simplified)
    const drawerCount = Math.floor(height / 150);
    for (let i = 0; i < drawerCount; i++) {
      const drawerY = y + i * (height / drawerCount);
      const p1 = toIsometric(x, drawerY, 0, scale);
      const p2 = toIsometric(x + width, drawerY, 0, scale);

      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.2);
      doc.line(
        origin.x + p1.x,
        origin.y - p1.y,
        origin.x + p2.x,
        origin.y - p2.y
      );
    }
  } else if (moduleType === "shelving") {
    // Draw shelves
    const shelfCount = Math.floor(height / 300);
    for (let i = 0; i <= shelfCount; i++) {
      const shelfY = y + i * (height / shelfCount);
      const p1 = toIsometric(x, shelfY, 0, scale);
      const p2 = toIsometric(x + width, shelfY, 0, scale);
      const p3 = toIsometric(x + width, shelfY, depth, scale);
      const p4 = toIsometric(x, shelfY, depth, scale);

      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.2);
      doc.line(
        origin.x + p1.x,
        origin.y - p1.y,
        origin.x + p2.x,
        origin.y - p2.y
      );
      doc.line(
        origin.x + p2.x,
        origin.y - p2.y,
        origin.x + p3.x,
        origin.y - p3.y
      );
    }
  }
}
