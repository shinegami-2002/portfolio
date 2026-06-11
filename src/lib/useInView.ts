import { useEffect, useRef, useState } from "react";

/**
 * True once the element has entered the viewport (sticky).
 * Hard 1200ms fallback so content can never be trapped hidden.
 */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && setSeen(true),
      { threshold },
    );
    io.observe(el);
    const deadline = setTimeout(() => {
      const rr = el.getBoundingClientRect();
      if (rr.top < window.innerHeight && rr.bottom > 0) setSeen(true);
    }, 1200);
    return () => {
      io.disconnect();
      clearTimeout(deadline);
    };
  }, [seen, threshold]);
  return { ref, seen };
}

/** Continuously tracks whether element is on screen (for pausing sims). */
export function useOnScreen<T extends HTMLElement>(margin = "120px") {
  const ref = useRef<T | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => setOn(es.some((e) => e.isIntersecting)),
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, on };
}
