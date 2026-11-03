import { PALETTE } from "./palette";

// Warm coral to violet glow at the horizon (about 25 percent, hex alpha 40) over the night to navy sky.
export const SKY = `linear-gradient(to top, ${PALETTE.coral}40 0%, ${PALETTE.violet}40 22%, transparent 48%), linear-gradient(to bottom, ${PALETTE.night} 0%, ${PALETTE.navy} 100%)`;
