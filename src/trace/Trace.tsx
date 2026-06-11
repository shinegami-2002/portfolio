import { useState } from "react";
import { roles } from "../content/roles";
import { jumpTo } from "../lib/useActivePane";
import { phosphorPulse } from "../lib/phosphor";

const T0 = 2020;
const T1 = 2026.7;
const NOW = 2026.45;
const pct = (t: number) => ((t - T0) / (T1 - T0)) * 100;
const x = (t: number) => `${pct(t).toFixed(2)}%`;
const w = (a: number, b: number | null) => `${(pct(b ?? NOW) - pct(a)).toFixed(2)}%`;

const EDU = [
  { label: "BTECH CSE · NIT PUDUCHERRY", start: 2020.95, end: 2024.25 },
  { label: "MS CS · NC STATE", start: 2024.6, end: 2026.4 },
];

/** Flagship + notable project spans — channel-colored, click → service pane. */
const PROJECTS: { id: string; label: string; start: number; end: number; row: number; ch: string }[] = [
  { id: "work-queue", label: "task-queue", start: 2025.0, end: 2025.25, row: 0, ch: "queue" },
  { id: "work-mcp", label: "mcp-server", start: 2025.1, end: 2025.4, row: 1, ch: "mcp" },
  { id: "work-scholar", label: "scholar-agent", start: 2025.15, end: 2025.5, row: 0, ch: "scholar" },
  { id: "work-pruning", label: "pruning-study", start: 2026.0, end: 2026.42, row: 0, ch: "pruning" },
  { id: "archive", label: "undergrad dl research", start: 2023.0, end: 2023.9, row: 0, ch: "scholar" },
  { id: "archive", label: "chimera-ar", start: 2025.55, end: 2025.8, row: 1, ch: "pruning" },
];

/** Point events — diamonds. From the BTech CV + later milestones. */
const EVENTS: { t: number; label: string; up?: boolean }[] = [
  { t: 2021.7, label: "co-founded zer01coded · taught python to 150+" },
  { t: 2022.6, label: "president, rotaract · vp, ace", up: true },
  { t: 2023.95, label: "HIS 2023 paper (springer) — first author" },
  { t: 2024.5, label: "ICDLAIR 2024 paper", up: true },
  { t: 2025.6, label: "openai parameter golf — 0.8128 bpb" },
  { t: 2026.08, label: "AAAI 2026 — llms4pcg", up: true },
];

export function Trace() {
  const [sel, setSel] = useState(0);

  return (
    <div className="trace">
      <div className="trace__chart" role="img" aria-label="Timeline 2020 to now: education, roles, projects, milestones">
        {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
          <div key={yr} className="trace__grid" style={{ left: x(yr) }}>
            <span className="trace__yr mono-label">{yr}</span>
          </div>
        ))}
        <div className="trace__now" style={{ left: x(NOW) }}>
          <span className="mono-label">NOW</span>
        </div>

        {/* lane labels */}
        {[
          ["EDU", 24],
          ["ROLES", 74],
          ["PROJECTS", 208],
          ["EVENTS", 286],
        ].map(([l, top]) => (
          <span key={l} className="trace__lane mono-label" style={{ top: Number(top) }}>
            {l}
          </span>
        ))}

        {/* education */}
        {EDU.map((e, i) => (
          <div
            key={e.label}
            className="trace__span trace__span--edu"
            style={{ left: x(e.start), width: w(e.start, e.end), top: 18, ["--d" as never]: String(i) }}
          >
            {e.label}
          </div>
        ))}

        {/* roles — short spans get their label outside */}
        {roles.map((r, i) => {
          const top = 58 + i * 40;
          const narrow = pct(r.spanEnd ?? NOW) - pct(r.spanStart) < 7;
          return (
            <div key={r.org} style={{ display: "contents" }}>
              <button
                className={`trace__span trace__span--role ${sel === i ? "trace__span--sel" : ""} ${r.spanEnd === null ? "trace__span--open" : ""}`}
                style={{ left: x(r.spanStart), width: w(r.spanStart, r.spanEnd), top, ["--d" as never]: String(i + 1) }}
                onClick={(e) => {
                  setSel(i);
                  phosphorPulse(e.currentTarget);
                }}
                aria-label={`${r.title} at ${r.org}, ${r.period}`}
              >
                {!narrow && r.org.toUpperCase()}
              </button>
              {narrow && (
                <span
                  className="trace__outLabel mono-label"
                  style={{ left: `calc(${x(r.spanEnd ?? NOW)} + 8px)`, top: top + 6 }}
                >
                  ← {r.org.toUpperCase()}
                </span>
              )}
            </div>
          );
        })}

        {/* projects */}
        {PROJECTS.map((p, i) => (
          <button
            key={p.label}
            className="trace__span trace__span--proj"
            data-ch={p.ch}
            style={{ left: x(p.start), width: w(p.start, p.end), top: 196 + p.row * 26, ["--d" as never]: String(i + 4) }}
            onClick={(e) => {
              phosphorPulse(e.currentTarget);
              jumpTo(p.id);
            }}
            title={`jump to ${p.label}`}
          >
            {p.label}
          </button>
        ))}

        {/* events */}
        {EVENTS.map((ev) => (
          <div key={ev.label} className="trace__event" style={{ left: x(ev.t) }}>
            <span className="trace__diamond" />
            <span className={`trace__evLabel mono-label ${ev.up ? "trace__evLabel--up" : ""}`}>{ev.label}</span>
          </div>
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
