import { useEffect } from "react";
import { reducedMotion } from "./springs";

const CHANNELS = ["mihin", "scholar", "mcp", "pruning", "queue"] as const;

/**
 * The console retunes itself: whichever flagship owns the viewport sets a
 * global channel on <html>, cascading its color into the header, status bar,
 * signal layer — everything. A sweep line marks each retune.
 */
export function useChannel(): void {
  useEffect(() => {
    let current: string | null = null;
    const visible = new Map<string, number>();

    const apply = (ch: string | null) => {
      if (ch === current) return;
      current = ch;
      if (ch) document.documentElement.dataset.ch = ch;
      else delete document.documentElement.dataset.ch;
      // sweep flash in the new color
      if (!reducedMotion()) {
        const s = document.createElement("div");
        s.className = "ch-sweep";
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 520);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set((e.target as HTMLElement).id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let best: string | null = null;
        let bestV = 0.18; // needs meaningful presence to retune
        for (const [id, v] of visible) {
          if (v > bestV) {
            bestV = v;
            best = id;
          }
        }
        apply(best ? best.replace("work-", "") : null);
      },
      { threshold: [0, 0.2, 0.45, 0.7] },
    );

    for (const ch of CHANNELS) {
      const el = document.getElementById(`work-${ch}`);
      if (el) io.observe(el);
    }
    return () => {
      io.disconnect();
      delete document.documentElement.dataset.ch;
    };
  }, []);
}
