import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "../lib/springs";

const GLYPHS = "▓▒░◆◇/\\|=+*#<>_";

/** Text resolves left→right out of glyph noise. Pane titles only. */
export function GlyphDecode({ text, go = true }: { text: string; go?: boolean }) {
  const [shown, setShown] = useState(() => (go && !reducedMotion() ? "" : text));
  const done = useRef(false);

  useEffect(() => {
    if (!go || done.current) return;
    if (reducedMotion()) {
      setShown(text);
      done.current = true;
      return;
    }
    const dur = Math.min(900, 220 + text.length * 28);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const solid = Math.floor(k * text.length);
      let s = text.slice(0, solid);
      for (let i = solid; i < text.length; i++) {
        const c = text[i];
        s += c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setShown(s);
      if (k < 1) raf = requestAnimationFrame(tick);
      else done.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, text]);

  return <span aria-label={text}>{shown}</span>;
}
