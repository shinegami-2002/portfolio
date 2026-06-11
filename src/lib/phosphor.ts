import { reducedMotion } from "./springs";

/**
 * Phosphor persistence — leave a decaying glow at an element's position.
 * The site's signature effect. Pooled; max 12 live trails.
 */
let live = 0;

export function phosphorPulse(el: Element | null): void {
  if (!el || reducedMotion() || live >= 12) return;
  const r = el.getBoundingClientRect();
  if (r.width === 0) return;
  const ghost = document.createElement("div");
  ghost.className = "phosphor-ghost";
  ghost.style.left = `${r.left - 4}px`;
  ghost.style.top = `${r.top - 4}px`;
  ghost.style.width = `${r.width + 8}px`;
  ghost.style.height = `${r.height + 8}px`;
  document.body.appendChild(ghost);
  live++;
  setTimeout(() => {
    ghost.remove();
    live--;
  }, 650);
}
