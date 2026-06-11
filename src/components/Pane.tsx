import type { ReactNode } from "react";
import { useInView } from "../lib/useInView";

/**
 * Section shell. On first sight: border traces on, children marked
 * [data-stamp] stagger in dot-matrix style.
 */
export function Pane({
  id,
  number,
  title,
  aside,
  children,
}: {
  id: string;
  number: string;
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  const { ref, seen } = useInView<HTMLElement>(0.08);
  return (
    <section id={id} ref={ref} className={`pane ${seen ? "pane--on" : ""}`}>
      <div className="pane__inner">
        <header className="pane__head">
          <span className="pane__num mono-label">{number}</span>
          <h2 className="pane__title">{title}</h2>
          {aside && <span className="pane__aside mono-label">{aside}</span>}
        </header>
        {children}
      </div>
    </section>
  );
}
