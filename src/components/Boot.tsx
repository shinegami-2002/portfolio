import { useEffect, useState } from "react";
import { reducedMotion } from "../lib/springs";

const LINES = [
  "operator console — shanmukha chatadi",
  "mounting corpus… 22 chunks indexed",
  "sims armed: queue · langgraph · mcp · cka · a2a",
  "signal online. welcome.",
];

/** First-visit boot. ≤1.5s, any key skips, reduced-motion skips entirely. */
export function Boot({ onDone }: { onDone: () => void }) {
  const [skip, setSkip] = useState(
    () => reducedMotion() || sessionStorage.getItem("booted") === "1",
  );
  const [shown, setShown] = useState(0);
  const [lift, setLift] = useState(false);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    sessionStorage.setItem("booted", "1");
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), 160 + i * 220)));
    timers.push(setTimeout(() => setLift(true), 1180));
    timers.push(setTimeout(() => { setSkip(true); onDone(); }, 1500));
    const skipNow = () => {
      timers.forEach(clearTimeout);
      setSkip(true);
      onDone();
    };
    window.addEventListener("keydown", skipNow, { once: true });
    window.addEventListener("pointerdown", skipNow, { once: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skipNow);
      window.removeEventListener("pointerdown", skipNow);
    };
  }, [skip, onDone]);

  if (skip) return null;
  return (
    <div className={`boot ${lift ? "boot--lift" : ""}`} aria-hidden="true">
      <div className="boot__flash" />
      <div className="boot__scan" />
      <div className="boot__lines">
        {LINES.slice(0, shown).map((l, i) => (
          <div key={i} className="boot__line mono-label">
            <span className="boot__ok">▸</span> {l}
          </div>
        ))}
      </div>
    </div>
  );
}
