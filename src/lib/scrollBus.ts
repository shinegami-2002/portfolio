/**
 * Global signal bus: scroll velocity + activity pulses.
 * The SignalLayer shader and header read from here; sims/palette write pulses.
 */

type Listener = (v: { velocity: number; pulse: number }) => void;

let velocity = 0; // normalized 0..1
let pulse = 0; // decays toward 0
const listeners = new Set<Listener>();

let lastY = typeof window !== "undefined" ? window.scrollY : 0;
let lastT = typeof performance !== "undefined" ? performance.now() : 0;
let raf = 0;
let running = false;

function loop(now: number) {
  const dt = Math.max(1, now - lastT);
  const dy = Math.abs(window.scrollY - lastY);
  const instant = Math.min(1, (dy / dt) * 0.6);
  velocity += (instant - velocity) * 0.12;
  pulse *= Math.pow(0.05, dt / 1000); // ~95% decay per second
  lastY = window.scrollY;
  lastT = now;
  for (const l of listeners) l({ velocity, pulse });
  if (velocity > 0.001 || pulse > 0.001 || listeners.size > 0) {
    raf = requestAnimationFrame(loop);
  } else {
    running = false;
  }
}

function ensureRunning() {
  if (!running && typeof window !== "undefined") {
    running = true;
    lastT = performance.now();
    raf = requestAnimationFrame(loop);
  }
}

export function subscribeSignal(l: Listener): () => void {
  listeners.add(l);
  ensureRunning();
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) {
      cancelAnimationFrame(raf);
      running = false;
    }
  };
}

/** Something happened (sim ran, agent answered). Kick the signal field. */
export function pulseSignal(intensity = 0.8): void {
  pulse = Math.min(1.2, pulse + intensity);
  ensureRunning();
}
