import { useEffect, useState } from "react";

export const PANES = [
  { id: "hero", label: "SYS" },
  { id: "trace", label: "TRACE" },
  { id: "work", label: "WORK" },
  { id: "archive", label: "ARCHIVE" },
  { id: "field", label: "FIELD" },
  { id: "contact", label: "CONTACT" },
] as const;

export type PaneId = (typeof PANES)[number]["id"];

/** Which top-level pane owns the viewport right now + global scroll progress. */
export function useActivePane(): { active: PaneId; progress: number } {
  const [active, setActive] = useState<PaneId>("hero");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let best: string | null = null;
        let bestV = 0;
        for (const [id, v] of visible) {
          if (v > bestV) {
            bestV = v;
            best = id;
          }
        }
        if (best) setActive(best as PaneId);
      },
      { threshold: [0, 0.2, 0.5, 0.8] },
    );
    for (const p of PANES) {
      const el = document.getElementById(p.id);
      if (el) io.observe(el);
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? window.scrollY / h : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { active, progress };
}

export function jumpTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
