import { useRef } from "react";
import type { ChipT } from "../content/types";
import { reducedMotion } from "../lib/springs";

const GLYPH: Record<ChipT["kind"], string> = {
  github: "↗",
  video: "▶",
  paper: "¶",
  live: "●",
  action: "",
};

/** Mono chip with magnetic hover. Real link or button, always. */
export function Chip({
  chip,
  onClick,
}: {
  chip: ChipT;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reducedMotion() || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 4;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const inner = (
    <>
      {chip.label}
      {GLYPH[chip.kind] && <span className="chip__glyph"> {GLYPH[chip.kind]}</span>}
    </>
  );

  if (chip.href) {
    return (
      <a
        ref={(n) => (ref.current = n)}
        className="chip"
        href={chip.href}
        target="_blank"
        rel="noreferrer"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={(n) => (ref.current = n)}
      className="chip"
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {inner}
    </button>
  );
}
