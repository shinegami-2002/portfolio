import { useRef, useState, type ReactNode } from "react";
import { useOnScreen } from "../lib/useInView";

/**
 * Shared frame for the live sims: title bar, RUNNING/IDLE status,
 * activates on screen, instrument-crosshair readout on mouse.
 */
export function SimShell({
  name,
  children,
  readout,
}: {
  name: string;
  children: (running: boolean) => ReactNode;
  /** optional: map relative (0..1, 0..1) pointer position to a readout string */
  readout?: (x: number, y: number) => string;
}) {
  const { ref, on } = useOnScreen<HTMLDivElement>();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [probe, setProbe] = useState<{ x: number; y: number; text: string } | null>(null);
  const running = on && !document.hidden;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !bodyRef.current) return;
    const r = bodyRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setProbe({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      text: readout ? readout(x, y) : `${(x * 100).toFixed(0)},${(y * 100).toFixed(0)}`,
    });
  };

  return (
    <div ref={ref} className="sim">
      <div className="sim__bar">
        <span className="sim__name mono-label">SIM · {name}</span>
        <span className={`sim__status mono-label ${running ? "sim__status--run" : ""}`}>
          <span className="dot" /> {running ? "RUNNING" : "IDLE"}
        </span>
      </div>
      <div
        ref={bodyRef}
        className="sim__body"
        onPointerMove={onMove}
        onPointerLeave={() => setProbe(null)}
      >
        {children(running)}
        {probe && (
          <div className="sim__probe" aria-hidden="true">
            <div className="sim__probeV" style={{ left: probe.x }} />
            <div className="sim__probeH" style={{ top: probe.y }} />
            <div
              className="sim__probeTip mono-label"
              style={{
                left: Math.min(probe.x + 12, (bodyRef.current?.clientWidth ?? 300) - 110),
                top: Math.max(probe.y - 26, 4),
              }}
            >
              {probe.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
