export const colors = {
  // Primary colors
  primary: "#155DFC",
  primaryWithOpacity: "rgba(21, 93, 252, 0.5)",

  // Text colors
  textPrimary: "#0F172B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  // Background colors
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F8FAFC",
  bgGray: "#F1F5F9",

  // Border colors
  border: "#E2E8F0",
  borderHover: "#CBD5E1",

  // State colors
  hover: "#0F4FD9",
  hoverLight: "rgba(21, 93, 252, 0.1)",
} as const;

export type ColorKey = keyof typeof colors;
