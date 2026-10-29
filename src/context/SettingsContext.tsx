"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Quality = "low" | "high";
interface SettingsValue {
  quality: Quality;
  sound: boolean;
  reducedMotion: boolean; // follows the OS setting live
  update: (patch: { quality?: Quality; sound?: boolean }) => void;
}

const KEY = "portfolio-settings";
const Ctx = createContext<SettingsValue>({
  quality: "high",
  sound: false,
  reducedMotion: false,
  update: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQuality] = useState<Quality>("high");
  const [sound, setSound] = useState(false);
  const [reducedMotion, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    /* eslint-disable react-hooks/set-state-in-effect */
    sync();
    try {
      const p = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as { quality?: string };
      if (p.quality === "low") setQuality("low");
    } catch {
      // Storage unavailable or corrupt: keep defaults.
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const update = useCallback((patch: { quality?: Quality; sound?: boolean }) => {
    if (patch.quality) {
      setQuality(patch.quality);
      try {
        window.localStorage.setItem(KEY, JSON.stringify({ quality: patch.quality }));
      } catch {
        // Storage unavailable: keep the in-memory state.
      }
    }
    if (patch.sound !== undefined) setSound(patch.sound);
  }, []);

  const value = useMemo(
    () => ({ quality, sound, reducedMotion, update }),
    [quality, sound, reducedMotion, update],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsValue {
  return useContext(Ctx);
}
