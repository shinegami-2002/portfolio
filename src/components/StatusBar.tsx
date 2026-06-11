import { useEffect, useState } from "react";
import { PANES, type PaneId } from "../lib/useActivePane";
import { useTheme } from "../lib/theme";

/** vim-style statusline pinned to the bottom. Desktop only. */
export function StatusBar({ active, progress }: { active: PaneId; progress: number }) {
  const [theme] = useTheme();
  const [ch, setCh] = useState<string | null>(null);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const mo = new MutationObserver(() =>
      setCh(document.documentElement.dataset.ch ?? null),
    );
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ch"] });
    return () => mo.disconnect();
  }, []);

  // coarse fps meter — counts frames per second, honest and cheap
  useEffect(() => {
    let frames = 0;
    let raf = 0;
    const loop = () => {
      frames++;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const id = setInterval(() => {
      setFps(Math.min(120, frames));
      frames = 0;
    }, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const label = PANES.find((p) => p.id === active)?.label ?? "SYS";

  return (
    <div className="sbar mono-label" aria-hidden="true">
      <span className="sbar__mode">▮ {label}</span>
      {ch && <span className="sbar__ch">CH/{ch.toUpperCase()}</span>}
      <span className="sbar__spacer" />
      <span>{fps}FPS</span>
      <span>{Math.round(progress * 100)}%</span>
      <span>{theme.toUpperCase()}</span>
    </div>
  );
}
