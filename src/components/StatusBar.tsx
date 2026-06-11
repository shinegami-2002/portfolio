import { useEffect, useState } from "react";
import { PANES, type PaneId } from "../lib/useActivePane";
import { useTheme } from "../lib/theme";

/** vim-style statusline pinned to the bottom. Desktop only — renders nothing on mobile. */
export function StatusBar({ active, progress }: { active: PaneId; progress: number }) {
  const [theme] = useTheme();
  const [ch, setCh] = useState<string | null>(null);
  const [mobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches,
  );

  useEffect(() => {
    if (mobile) return;
    const mo = new MutationObserver(() =>
      setCh(document.documentElement.dataset.ch ?? null),
    );
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ch"] });
    return () => mo.disconnect();
  }, [mobile]);

  if (mobile) return null;

  const label = PANES.find((p) => p.id === active)?.label ?? "SYS";

  return (
    <div className="sbar mono-label" aria-hidden="true">
      <span className="sbar__mode">▮ {label}</span>
      {ch && <span className="sbar__ch">CH/{ch.toUpperCase()}</span>}
      <span className="sbar__spacer" />
      <span>{Math.round(progress * 100)}%</span>
      <span>{theme.toUpperCase()}</span>
    </div>
  );
}
