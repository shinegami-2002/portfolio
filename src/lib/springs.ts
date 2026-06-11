import { useEffect, useRef, useState } from "react";

export const reducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Spring a value toward `target`. Returns the animated value. */
export function useSpring(target: number, stiffness = 170, damping = 24): number {
  const [v, setV] = useState(target);
  const ref = useRef({ v: target, vel: 0, target });
  ref.current.target = target;
  useEffect(() => {
    if (reducedMotion()) {
      setV(target);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const s = ref.current;
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const a = stiffness * (s.target - s.v) - damping * s.vel;
      s.vel += a * dt;
      s.v += s.vel * dt;
      if (Math.abs(s.target - s.v) > 1e-3 || Math.abs(s.vel) > 1e-3) {
        setV(s.v);
        raf = requestAnimationFrame(tick);
      } else {
        s.v = s.target;
        s.vel = 0;
        setV(s.target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, stiffness, damping]);
  return v;
}

/** rAF loop with elapsed time + delta; pauses cleanly on unmount or `running=false`. */
export function useRafLoop(cb: (t: number, dt: number) => void, running = true): void {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const start = last;
    const tick = (now: number) => {
      cbRef.current((now - start) / 1000, Math.min(0.05, (now - last) / 1000));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/** Eased counter 0→1 once `go` is true; for number tickers. */
export function useEasedProgress(go: boolean, dur = 950): number {
  const [p, setP] = useState(go && reducedMotion() ? 1 : 0);
  useEffect(() => {
    if (!go) return;
    if (reducedMotion()) {
      setP(1);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      setP(1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, dur]);
  return p;
}
