"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Quality = "low" | "high";
interface SettingsValue {
  quality: Quality;
  sound: boolean;
  reducedMotion: boolean; // the visitor's override, else the OS setting (true until synced)
  update: (patch: SettingsPatch) => void;
}
// reducedMotion: true or false overrides the OS, null goes back to following it.
type SettingsPatch = { quality?: Quality; sound?: boolean; reducedMotion?: boolean | null };

const KEY = "portfolio-settings";
const Ctx = createContext<SettingsValue>({
  quality: "high",
  sound: false,
  reducedMotion: true,
  update: () => {},
});

// Merges the patch into the stored settings. Only a change by the visitor ever writes.
function persist(patch: { quality?: Quality; reducedMotion?: boolean | null }) {
  try {
    const old = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as object;
    const next = JSON.stringify({ ...old, ...patch });
    window.localStorage.setItem(KEY, next);
  } catch {
    // Storage unavailable: keep the in-memory state.
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQuality] = useState<Quality>("high");
  const [sound, setSound] = useState(false);
  const [osReduced, setOsReduced] = useState(true);
  const [override, setOverride] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setOsReduced(mq.matches);
    /* eslint-disable react-hooks/set-state-in-effect */
    sync();
    try {
      const p = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as { quality?: string; reducedMotion?: unknown };
      if (p.quality === "low") setQuality("low");
      if (typeof p.reducedMotion === "boolean") setOverride(p.reducedMotion);
    } catch {
      // Storage unavailable or corrupt: keep defaults.
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const update = useCallback((patch: SettingsPatch) => {
    if (patch.quality) {
      setQuality(patch.quality);
      persist({ quality: patch.quality });
    }
    if (patch.sound !== undefined) setSound(patch.sound);
    if (patch.reducedMotion !== undefined) {
      setOverride(patch.reducedMotion);
      persist({ reducedMotion: patch.reducedMotion });
    }
  }, []);

  const reducedMotion = override ?? osReduced;
  const value = useMemo(
    () => ({ quality, sound, reducedMotion, update }),
    [quality, sound, reducedMotion, update],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsValue {
  return useContext(Ctx);
}
