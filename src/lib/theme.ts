import { useCallback, useSyncExternalStore } from "react";
import { reducedMotion } from "./springs";

export type Theme = "graphite" | "paper";

const listeners = new Set<() => void>();

function current(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "graphite";
}

function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("theme", t);
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l());
}

/** CRT power-cycle flip: collapse to a scanline, swap theme, re-expose. */
export function flipTheme(): void {
  const next: Theme = current() === "graphite" ? "paper" : "graphite";
  if (reducedMotion()) {
    apply(next);
    return;
  }
  const ov = document.createElement("div");
  ov.className = "crt-flip";
  document.body.appendChild(ov);
  // collapse
  requestAnimationFrame(() => {
    ov.classList.add("crt-flip--collapse");
    setTimeout(() => {
      apply(next);
      ov.classList.remove("crt-flip--collapse");
      ov.classList.add("crt-flip--expand");
      setTimeout(() => ov.remove(), 360);
    }, 150);
  });
}

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    current,
    () => "graphite" as Theme,
  );
  const flip = useCallback(() => flipTheme(), []);
  return [theme, flip];
}
