// Color tokens for the whole world. Values come from ART_DIRECTION.md, plus `racing`.
// Mood colors only: no brand marks, just hues.
export const PALETTE = {
  night: "#0a0b10",
  navy: "#1a1f3a",
  mint: "#7cf0c8",
  blue: "#2f6bff",
  garnet: "#c0194f",
  racing: "#ff2e3d",
  sun: "#ffd23f",
  coral: "#ff6b57",
  violet: "#8b5cff",
  sand: "#f2c98a",
  grass: "#3ddc84",
  ice: "#9be7ff",
  offWhite: "#f4f1ea",
} as const;

// One accent per district theme.
export const THEME_ACCENTS = {
  football: [PALETTE.blue, PALETTE.garnet],
  racing: [PALETTE.racing],
  volleyball: [PALETTE.sand],
  quarry: [PALETTE.grass],
  arena: [PALETTE.ice],
} as const;

export type PaletteKey = keyof typeof PALETTE;
