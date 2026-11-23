import { PALETTE } from "./palette";

// A soft violet band at the top (dusk), then a warm coral to violet glow at the horizon (hex alpha 40) over the night to navy sky.
export const SKY = `linear-gradient(to bottom, ${PALETTE.violet}38 0%, transparent 20%), linear-gradient(to top, ${PALETTE.coral}40 0%, ${PALETTE.violet}40 22%, transparent 48%), linear-gradient(to bottom, ${PALETTE.night} 0%, ${PALETTE.navy} 100%)`;
