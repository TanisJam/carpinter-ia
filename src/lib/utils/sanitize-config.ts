import type { PlacardConfig } from "@/schemas/wardrobe-schema";
import { DIMENSION_LIMITS, SECTION_WIDTH_LIMITS } from "@/lib/constants";

/**
 * Sanitizes a PlacardConfig to ensure all values are within valid limits.
 * Instead of throwing errors, it adjusts values to the nearest valid limit.
 */
export function sanitizePlacardConfig(config: PlacardConfig): PlacardConfig {
  const sanitized = { ...config };

  // 1. Sanitize dimensions
  sanitized.dimensions = {
    width: clamp(config.dimensions.width, DIMENSION_LIMITS.width.min, DIMENSION_LIMITS.width.max),
    height: clamp(config.dimensions.height, DIMENSION_LIMITS.height.min, DIMENSION_LIMITS.height.max),
    depth: clamp(config.dimensions.depth, DIMENSION_LIMITS.depth.min, DIMENSION_LIMITS.depth.max),
  };

  // 2. Sanitize sections
  sanitized.sections = config.sections.map((section, index) => {
    let sectionWidth = section.width;

    // If section width exceeds max, clamp it
    if (sectionWidth > SECTION_WIDTH_LIMITS.max) {
      console.warn(`Section ${index} width ${sectionWidth}mm exceeds max ${SECTION_WIDTH_LIMITS.max}mm. Clamping.`);
      sectionWidth = SECTION_WIDTH_LIMITS.max;
    }

    // If section width is below min, clamp it
    if (sectionWidth < SECTION_WIDTH_LIMITS.min) {
      console.warn(`Section ${index} width ${sectionWidth}mm below min ${SECTION_WIDTH_LIMITS.min}mm. Clamping.`);
      sectionWidth = SECTION_WIDTH_LIMITS.min;
    }

    // Sanitize modules
    const sanitizedModules = section.modules.map((module) => {
      if (module.type === "hanging") {
        return {
          ...module,
          height: clamp(module.height, 700, 1800),
          rodPositionFromTop: module.rodPositionFromTop ?? 50,
          rodDiameter: module.rodDiameter ?? 25,
          garmentSpacing: module.garmentSpacing ?? 40,
        };
      }

      if (module.type === "drawers") {
        return {
          ...module,
          height: clamp(module.height, 80, 1200),
          drawerCount: clamp(module.drawerCount, 1, 6),
          drawerFrontHeight: clamp(module.drawerFrontHeight, 80, 300),
          slideClearance: module.slideClearance ?? 12.7,
          slideType: module.slideType ?? "extraccion_total",
          hasDividers: module.hasDividers ?? false,
        };
      }

      if (module.type === "shelving") {
        return {
          ...module,
          height: clamp(module.height, 250, 1800),
          shelfCount: clamp(module.shelfCount, 1, 8),
          shelfSpacing: clamp(module.shelfSpacing, 200, 500),
          adjustable: module.adjustable ?? true,
        };
      }

      return module;
    });

    return {
      ...section,
      width: sectionWidth,
      modules: sanitizedModules,
    };
  });

  // 3. If total section widths don't match placard width, adjust
  const targetWidth = sanitized.dimensions.width;

  // Check if we need more sections to fit the target width
  const minSectionsNeeded = Math.ceil(targetWidth / SECTION_WIDTH_LIMITS.max);

  if (minSectionsNeeded > sanitized.sections.length) {
    console.warn(
      `Need ${minSectionsNeeded} sections to fit ${targetWidth}mm (max section width: ${SECTION_WIDTH_LIMITS.max}mm). Currently have ${sanitized.sections.length}. Adding sections.`
    );

    // Add sections by cloning the last section's module pattern
    const templateSection = sanitized.sections[sanitized.sections.length - 1];
    while (sanitized.sections.length < minSectionsNeeded) {
      const newIndex = sanitized.sections.length;
      sanitized.sections.push({
        ...templateSection,
        id: `sec-auto-${newIndex + 1}`,
        order: newIndex,
        modules: templateSection.modules.map((m, mi) => ({
          ...m,
          id: `mod-auto-${newIndex + 1}-${mi + 1}`,
        })),
      });
    }
  }

  // Now distribute width proportionally
  const totalSectionWidth = sanitized.sections.reduce((sum, s) => sum + s.width, 0);

  if (Math.abs(totalSectionWidth - targetWidth) > 10) {
    console.warn(`Total section width ${totalSectionWidth}mm doesn't match placard width ${targetWidth}mm. Adjusting proportionally.`);

    const evenWidth = Math.round(targetWidth / sanitized.sections.length);
    let remainingWidth = targetWidth;

    sanitized.sections = sanitized.sections.map((section, index) => {
      if (index === sanitized.sections.length - 1) {
        return { ...section, width: clamp(remainingWidth, SECTION_WIDTH_LIMITS.min, SECTION_WIDTH_LIMITS.max) };
      }

      const clampedWidth = clamp(evenWidth, SECTION_WIDTH_LIMITS.min, SECTION_WIDTH_LIMITS.max);
      remainingWidth -= clampedWidth;

      return { ...section, width: clampedWidth };
    });
  }

  return sanitized;
}

/**
 * Clamps a number between min and max values
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
