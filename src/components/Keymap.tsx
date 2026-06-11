import { useEffect, useState } from "react";
import { PANES, jumpTo, type PaneId } from "../lib/useActivePane";

const KEYS: [string, string][] = [
  ["⌘K or /", "open palette — jump or ask"],
  ["j / k", "next / previous section"],
  ["g then h/w/a/c", "go home / work / archive / contact"],
  ["?", "this keymap"],
  ["esc", "close overlays"],
];

/** Global keyboard layer + the `?` keymap overlay. */
export function Keymap({
  active,
  paletteOpen,
  openPalette,
}: {
  active: PaneId;
  paletteOpen: boolean;
  openPalette: () => void;
}) {
  const [show, setShow] = useState(false);
  const [gPending, setGPending] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
        return;
      }
      if (typing || paletteOpen) return;

      if (e.key === "/") {
        e.preventDefault();
        openPalette();
        return;
      }
      if (e.key === "?") {
        setShow((s) => !s);
        return;
      }
      if (e.key === "Escape") {
        setShow(false);
        return;
      }
      if (gPending) {
        setGPending(false);
        const map: Record<string, string> = { h: "hero", w: "work", a: "archive", c: "contact" };
        if (map[e.key]) jumpTo(map[e.key]);
        return;
      }
      if (e.key === "g") {
        setGPending(true);
        setTimeout(() => setGPending(false), 900);
        return;
      }
      if (e.key === "j" || e.key === "k") {
        const idx = PANES.findIndex((p) => p.id === active);
        const next = e.key === "j" ? Math.min(PANES.length - 1, idx + 1) : Math.max(0, idx - 1);
        jumpTo(PANES[next].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, paletteOpen, openPalette, gPending]);

  if (!show) return null;
  return (
    <div className="pal__scrim" onClick={() => setShow(false)} role="presentation">
      <div className="pal keymap" role="dialog" aria-label="Keyboard shortcuts" onClick={(e) => e.stopPropagation()}>
        <div className="keymap__head mono-label">KEYMAP</div>
        {KEYS.map(([k, d]) => (
          <div key={k} className="keymap__row">
            <kbd>{k}</kbd>
            <span>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
