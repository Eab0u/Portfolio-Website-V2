"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface PanelValue {
  active: string | null;
  setActive: (id: string | null) => void;
}

const Ctx = createContext<PanelValue>({ active: null, setActive: () => {} });

// Tracks which window is open so only one WindowPanel shows at a time.
export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [active, set] = useState<string | null>(null);
  const setActive = useCallback((id: string | null) => set(id), []);
  const value = useMemo(() => ({ active, setActive }), [active, setActive]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePanel(id: string) {
  const { active, setActive } = useContext(Ctx);
  const show = useCallback(() => setActive(id), [setActive, id]);
  const close = useCallback(() => setActive(null), [setActive]);
  return { open: active === id, show, close };
}
