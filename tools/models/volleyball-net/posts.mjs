// Two tall chamfered blue posts: an ice stripe near the foot, coral clamps with light bevel lips
// (the top one wears a sun band echoing the caps), an ice bevel ring under a glowing faceted sun cap,
// a chunky sun winch drum with coral flanges and crank on one post, and coral guy wires running
// out to coral stakes with garnet caps.
import { POST, POST_RING, CORAL, CORAL_LIP, GARNET, SUN } from "./palette.mjs";
import { posts, tape, glow, ball, extrude, circle, V, sandY, POST_X, POST_R, POST_TOP, NET_BOT, NET_TOP } from "./shared.mjs";

const at = (x, y) => V(x, y, 0);
const oct = (r) => circle(r, 8, 0.5);

function post(x) {
  const foot = sandY(x, 0) - 0.04, R = POST_R;
  // Body split by the ice stripe, then a narrower bevel at the top so the edge catches light.
  extrude(posts, at(x, foot), at(x, 0.42), oct(R), POST, { caps: false });
  extrude(posts, at(x, 0.42), at(x, 0.49), oct(R * 1.12), POST_RING);
  extrude(posts, at(x, 0.49), at(x, POST_TOP - 0.05), oct(R), POST, { caps: false });
  extrude(posts, at(x, POST_TOP - 0.05), at(x, POST_TOP), oct(R), POST_RING, { scaleB: 0.8, caps: false });
  // Coral clamps at the top tape and the bottom cable, each under a light coral bevel lip.
  for (const [y, h] of [[NET_TOP + 0.045, 0.13], [NET_BOT, 0.08]]) {
    extrude(tape, at(x, y - h / 2), at(x, y + h / 2), oct(R * 1.42), CORAL, { caps: "a" });
    extrude(tape, at(x, y + h / 2), at(x, y + h / 2 + 0.025), oct(R * 1.42), CORAL_LIP, { scaleB: 0.8, caps: "b" });
  }
  // Sun band around the top clamp, echoing the cap.
  extrude(glow, at(x, NET_TOP + 0.03), at(x, NET_TOP + 0.065), oct(R * 1.47), SUN, { caps: false });
  // Glowing sun cap: a short disc and a faceted dome.
  extrude(glow, at(x, POST_TOP - 0.01), at(x, POST_TOP + 0.04), oct(R * 1.45), SUN, { caps: "b" });
  ball(glow, at(x, POST_TOP + 0.08), R * 1.3, SUN, 0.8);
}

// Winch on the outer (+x) face of the +x post, sticking out sideways so it shows from front and back:
// a sun drum between coral flanges, a coral crank arm and a sun knob.
function winch() {
  const y = 0.92, x0 = POST_X + POST_R - 0.015, x1 = x0 + 0.13;
  extrude(tape, V(x0, y, 0), V(x1, y, 0), circle(0.072, 6), SUN, { caps: false });
  extrude(tape, V(x0, y, 0), V(x0 + 0.022, y, 0), circle(0.098, 6), CORAL);
  extrude(tape, V(x1 - 0.022, y, 0), V(x1, y, 0), circle(0.098, 6), CORAL);
  extrude(tape, V(x1, y, 0), V(x1, y - 0.1, 0.1), circle(0.018, 4), CORAL, { caps: false });
  extrude(tape, V(x1 - 0.01, y - 0.1, 0.1), V(x1 + 0.08, y - 0.1, 0.1), circle(0.026, 6), SUN, { caps: "b" });
}

// Coral guy wire from the post top out to a stake, plus the stake: a coral spike under a garnet cap.
function guy(x, sx, sz) {
  const sy = sandY(sx, sz), top = V(x, POST_TOP - 0.12, 0), knot = V(sx, sy + 0.1, sz);
  extrude(tape, top, knot, circle(0.017, 5), CORAL, { caps: false });
  extrude(tape, V(sx, sy - 0.03, sz), V(sx, sy + 0.08, sz), circle(0.036, 4, 0), CORAL, { scaleB: 0.55, caps: false });
  extrude(tape, V(sx, sy + 0.08, sz), V(sx, sy + 0.12, sz), circle(0.032, 6), GARNET, { caps: "b" });
}

export function buildPosts() {
  post(POST_X); post(-POST_X);
  winch();
  for (const s of [1, -1]) { guy(s * POST_X, s * 1.5, 0.3); guy(s * POST_X, s * 1.5, -0.3); }
}
