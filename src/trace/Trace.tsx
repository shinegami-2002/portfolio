import { useState } from "react";
import { roles, education } from "../content/roles";
import { jumpTo } from "../lib/useActivePane";
import { phosphorPulse } from "../lib/phosphor";

const T0 = 2022;
const T1 = 2026.55;
const NOW = 2026.45;
const x = (t: number) => `${(((t - T0) / (T1 - T0)) * 100).toFixed(2)}%`;
const w = (a: number, b: number | null) =>
  `${((((b ?? NOW) - a) / (T1 - T0)) * 100).toFixed(2)}%`;

/** Flagship spans nested in the waterfall — display positions, click → service pane. */
const PROJECT_SPANS: { id: string; label: string; start: number; end: number; row: number }[] = [
  { id: "work-queue", label: "task-queue", start: 2025.0, end: 2025.25, row: 0 },
  { id: "work-mcp", label: "mcp-server", start: 2025.1, end: 2025.4, row: 1 },
  { id: "work-scholar", label: "scholar-agent", start: 2025.15, end: 2025.5, row: 2 },
  { id: "work-pruning", label: "pruning-study", start: 2026.0, end: 2026.42, row: 0 },
];

export function Trace() {
  const [sel, setSel] = useState(0); // selected role index, default MiHIN (roles[0])

  return (
    <div className="trace">
      {/* waterfall */}
      <div className="trace__chart" role="img" aria-label="Career timeline 2022 to now">
        {/* year grid */}
        {[2022, 2023, 2024, 2025, 2026].map((yr) => (
          <div key={yr} className="trace__grid" style={{ left: x(yr) }}>
            <span className="trace__yr mono-label">{yr}</span>
          </div>
        ))}
        {/* playhead at NOW */}
        <div className="trace__now" style={{ left: x(NOW) }}>
          <span className="mono-label">NOW</span>
        </div>

        {/* education context bar */}
        <div
          className="trace__span trace__span--edu"
          style={{ left: x(education.ms.spanStart), width: w(education.ms.spanStart, education.ms.spanEnd), top: 18, ["--d" as never]: "3" }}
          title={`${education.ms.degree} · ${education.ms.school}`}
        >
          {education.ms.degree.toUpperCase()} · NC STATE
        </div>

        {/* role spans */}
        {roles.map((r, i) => {
          const top = 58 + i * 44;
          return (
            <button
              key={r.org}
              className={`trace__span trace__span--role ${sel === i ? "trace__span--sel" : ""} ${r.spanEnd === null ? "trace__span--open" : ""}`}
              style={{ left: x(r.spanStart), width: w(r.spanStart, r.spanEnd), top, ["--d" as never]: String(i) }}
              onClick={(e) => {
                setSel(i);
                phosphorPulse(e.currentTarget);
              }}
            >
              {r.org.toUpperCase()}
            </button>
          );
        })}

        {/* project spans */}
        {PROJECT_SPANS.map((p, i) => (
          <button
            key={p.id}
            className="trace__span trace__span--proj"
            style={{ left: x(p.start), width: w(p.start, p.end), top: 196 + p.row * 28, ["--d" as never]: String(i + 3) }}
            onClick={(e) => {
              phosphorPulse(e.currentTarget);
              jumpTo(p.id);
            }}
            title={`jump to ${p.label}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* role detail */}
      <div className="trace__detail">
        <div className="trace__tabs" role="tablist" aria-label="Roles">
          {roles.map((r, i) => (
            <button
              key={r.org}
              role="tab"
              aria-selected={sel === i}
              className={`trace__tab ${sel === i ? "trace__tab--on" : ""}`}
              onClick={() => setSel(i)}
            >
              <span className="trace__tabOrg">{r.org}</span>
              <span className="trace__tabRole mono-label">{r.title}</span>
              <span className="trace__tabPeriod mono-label">{r.period}</span>
            </button>
          ))}
        </div>
        <div className="trace__body" key={sel}>
          <p className="trace__sum">{roles[sel].summary}</p>
          <ul className="trace__bullets">
            {roles[sel].bullets.map((b, j) => (
              <li key={j} style={{ ["--stagger" as never]: String(j) }} data-stamp>
                <span className="trace__arrow">→</span> {b}
              </li>
            ))}
          </ul>
          <div className="trace__tags">
            {roles[sel].tags.map((t) => (
              <span className="trace__tag mono-label" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
