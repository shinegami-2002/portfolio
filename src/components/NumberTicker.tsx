import { useInView } from "../lib/useInView";
import { useEasedProgress } from "../lib/springs";
import type { Metric } from "../content/types";

/** Counts to its real value on first sight. Tabular mono — numbers are data here. */
export function NumberTicker({ m }: { m: Metric }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.4);
  const p = useEasedProgress(seen);
  const v = m.value * p;
  const text = m.decimals != null ? v.toFixed(m.decimals) : Math.round(v).toString();
  return (
    <span ref={ref} className="ticker">
      {m.prefix}
      {text}
      {m.suffix}
    </span>
  );
}
