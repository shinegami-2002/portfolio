import { useState } from "react";
import { archive } from "../content/archive";
import { Chip } from "../components/Chip";
import { phosphorPulse } from "../lib/phosphor";

const FILTERS = [
  { id: "all", label: "ALL" },
  { id: "project", label: "PROJECTS" },
  { id: "publication", label: "PAPERS" },
  { id: "certification", label: "CERTS" },
  { id: "leadership", label: "LEADERSHIP" },
] as const;

export function Archive() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const rows = archive.filter((a) => filter === "all" || a.kind === filter);

  return (
    <div className="arch">
      <div className="arch__filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? "arch__filter--on" : ""}`}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </button>
        ))}
        <span className="mono-label arch__count">{rows.length} ENTRIES</span>
      </div>

      <div className="arch__table">
        {rows.map((a, i) => {
          const isOpen = open === a.id;
          return (
            <div key={a.id} className={`arch__row ${isOpen ? "arch__row--open" : ""}`} data-stamp style={{ ["--stagger" as never]: String(i % 8) }}>
              <button
                className="arch__head"
                aria-expanded={isOpen}
                onClick={(e) => {
                  setOpen(isOpen ? null : a.id);
                  if (!isOpen) phosphorPulse(e.currentTarget);
                }}
              >
                <span className="arch__year mono-label">{a.year}</span>
                <span className="arch__name">{a.name}</span>
                <span className="arch__one">{a.oneLiner}</span>
                <span className="arch__plus mono-label">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="arch__detail">
                  <p>{a.detail}</p>
                  {a.chips.length > 0 && (
                    <div className="arch__chips">
                      {a.chips.map((c) => (
                        <Chip chip={c} key={c.label} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
