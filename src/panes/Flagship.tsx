import type { ReactNode } from "react";
import type { Flagship as FlagshipT } from "../content/types";
import { useInView } from "../lib/useInView";
import { GlyphDecode } from "../components/GlyphDecode";
import { NumberTicker } from "../components/NumberTicker";
import { Chip } from "../components/Chip";

/** One flagship = one internal service page: header, live sim, spec rows, incident log. */
export function Flagship({ f, sim }: { f: FlagshipT; sim: ReactNode }) {
  const { ref, seen } = useInView<HTMLElement>(0.06);
  return (
    <article id={`work-${f.id}`} ref={ref} className={`flag pane ${seen ? "pane--on" : ""}`} data-ch={f.id}>
      <div className="pane__inner">
        <div className="flag__svcbar">
          <span>▸ SVC/{f.id.toUpperCase()}</span>
          <span className="flag__svcbarRule" />
          <span>{f.status} · {f.period.toUpperCase()}</span>
        </div>
        <header className="flag__head">
          <div className="flag__title">
            <span className={`flag__chip flag__chip--${f.status.toLowerCase()}`}>
              {f.status === "PROD" && <span className="dot dot--live" />}
              {f.status}
            </span>
            <h3 className="flag__name">
              <GlyphDecode text={f.name} go={seen} />
            </h3>
            <span className="flag__period mono-label">{f.period}</span>
          </div>
          {f.chips.length > 0 && (
            <div className="flag__links">
              {f.chips.map((c) => (
                <Chip chip={c} key={c.label} />
              ))}
            </div>
          )}
        </header>

        <p className="flag__one" data-stamp style={{ ["--stagger" as never]: "0" }}>
          {f.oneLiner}
        </p>

        <div className="flag__grid">
          <div className="flag__simCol">{sim}</div>

          <div className="flag__specs">
            <div className="flag__spec" data-stamp style={{ ["--stagger" as never]: "1" }}>
              <span className="flag__specK mono-label">PROBLEM</span>
              <p>{f.problem}</p>
            </div>
            <div className="flag__spec" data-stamp style={{ ["--stagger" as never]: "2" }}>
              <span className="flag__specK mono-label">APPROACH</span>
              <p>{f.approach}</p>
            </div>
          </div>
        </div>

        <div className="flag__metrics">
          {f.metrics.map((m) => (
            <div className="flag__metric" key={m.label} data-stamp>
              <span className="flag__metricN">
                <NumberTicker m={m} />
              </span>
              <span className="mono-label">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="flag__log" data-stamp style={{ ["--stagger" as never]: "3" }}>
          <span className="mono-label flag__logHead">INCIDENT LOG</span>
          {f.logLines.map((l, i) => (
            <div className="flag__logLine" key={i}>
              <span className="flag__logTime mono-label">{String(i + 1).padStart(2, "0")}</span>
              <span className="flag__logText">{l}</span>
            </div>
          ))}
        </div>

        <div className="flag__tags">
          {f.tags.map((t) => (
            <span key={t} className="trace__tag mono-label">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
