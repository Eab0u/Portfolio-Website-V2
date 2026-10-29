import type { Metadata } from "next";
import "./globals.css";
import { PanelProvider } from "@/context/PanelContext";
import { SettingsProvider } from "@/context/SettingsContext";

export const metadata: Metadata = {
  title: "Rahul Manchanda-Izquierdo",
  description: "A portfolio that builds itself, one small commit at a time.",
  openGraph: {
    title: "Rahul Manchanda-Izquierdo",
    description: "A portfolio that builds itself, one small commit at a time.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="absolute left-4 top-4 z-50 -translate-y-20 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-transform focus:translate-y-0 motion-reduce:transition-none"
        >
          Skip to content
        </a>
        <SettingsProvider>
          <PanelProvider>{children}</PanelProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
