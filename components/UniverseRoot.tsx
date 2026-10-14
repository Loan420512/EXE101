"use client";

/**
 * FILE: components/UniverseRoot.tsx
 * Gắn lớp html.universe-* và biến CSS --uni-* khi đổi vũ trụ.
 * Lắng nghe ngucung:set-universe qua useUniverse.
 */

import { useEffect } from "react";
import { UNIVERSES } from "@/config/universes";
import { useUniverse } from "@/lib/useUniverse";
import { dispatchSceneChange } from "@/data/scenes";

export default function UniverseRoot({ children }: { children: React.ReactNode }) {
  const { universe } = useUniverse();

  useEffect(() => {
    const html = document.documentElement;
    for (const kit of Object.values(UNIVERSES)) {
      html.classList.remove(kit.htmlClass);
    }
    html.classList.add(universe.htmlClass);

    const c = universe.colors;
    html.style.setProperty("--uni-bg", c.bg);
    html.style.setProperty("--uni-surface", c.surface);
    html.style.setProperty("--uni-accent", c.accent);
    html.style.setProperty("--uni-accent-muted", c.accentMuted);
    html.style.setProperty("--uni-text", c.textPrimary);
    html.style.setProperty("--uni-text-muted", c.textMuted);
    html.style.setProperty("--uni-text-on-accent", c.textOnAccent);
    html.style.setProperty("--uni-border", c.border);
    html.style.setProperty("--uni-shadow", c.shadow);
    html.style.setProperty("--uni-glow", c.glow);

    if (universe.id === "united") {
      dispatchSceneChange("default");
    } else {
      dispatchSceneChange(universe.id);
    }
  }, [universe]);

  return <>{children}</>;
}
