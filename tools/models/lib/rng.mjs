// Seeded random numbers shared by all model generators: same seed, same model.
// Call setSeed(n) once at the top of a generator before drawing any numbers.
let seed = 1;
export const setSeed = (n) => { seed = n >>> 0; };
export const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
export const rr = (a, b) => a + (b - a) * rnd();
