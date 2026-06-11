import { useRef, useState } from "react";
import { pulseSignal } from "../lib/scrollBus";
import { SimShell } from "./SimShell";

type Preset = {
  id: string;
  label: string;
  tool: string;
  run: () => Promise<{ raw: string; summary: string[] }>;
  canned: { raw: string; summary: string[] };
};

const fetchJson = async (url: string) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 6000);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
};

const PRESETS: Preset[] = [
  {
    id: "interactions",
    label: "warfarin × interactions",
    tool: "check_drug_interactions",
    run: async () => {
      const j = await fetchJson(
        'https://api.fda.gov/drug/label.json?search=openfda.generic_name:"warfarin"&limit=1',
      );
      const text: string = j.results?.[0]?.drug_interactions?.[0] ?? "";
      return {
        raw: JSON.stringify(j.results?.[0]?.openfda ?? j, null, 1).slice(0, 700),
        summary: [
          "FDA label · drug interactions (excerpt):",
          text.replace(/\s+/g, " ").slice(0, 360) + "…",
        ],
      };
    },
    canned: {
      raw: '{ "openfda": { "generic_name": ["WARFARIN SODIUM"], "route": ["ORAL"] } …',
      summary: [
        "FDA label · drug interactions (excerpt):",
        "Drugs may interact with warfarin through pharmacodynamic or pharmacokinetic mechanisms… inhibitors of CYP2C9, 1A2, or 3A4 increase bleeding risk…",
      ],
    },
  },
  {
    id: "adverse",
    label: "metformin adverse events",
    tool: "get_adverse_events",
    run: async () => {
      const j = await fetchJson(
        'https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"metformin"&count=patient.reaction.reactionmeddrapt.exact',
      );
      const top = (j.results ?? []).slice(0, 5) as { term: string; count: number }[];
      return {
        raw: JSON.stringify(j.results?.slice(0, 8) ?? j, null, 1).slice(0, 700),
        summary: [
          "Top reported reactions (FAERS, live):",
          ...top.map((r) => `${r.term.toLowerCase()} — ${r.count.toLocaleString()} reports`),
        ],
      };
    },
    canned: {
      raw: '[ { "term": "NAUSEA", "count": 23311 }, { "term": "DIARRHOEA", "count": 21044 } …',
      summary: [
        "Top reported reactions (FAERS, cached):",
        "nausea — 23,311 reports",
        "diarrhoea — 21,044 reports",
        "lactic acidosis — 18,972 reports",
      ],
    },
  },
  {
    id: "icd10",
    label: 'ICD-10: "diabetic foot ulcer"',
    tool: "lookup_icd10",
    run: async () => {
      const j = await fetchJson(
        "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=diabetic%20foot%20ulcer&maxList=5",
      );
      const rows = (j[3] ?? []) as [string, string][];
      return {
        raw: JSON.stringify(j, null, 1).slice(0, 700),
        summary: ["NLM Clinical Tables (live):", ...rows.map(([c, n]) => `${c} — ${n}`)],
      };
    },
    canned: {
      raw: '[143, ["E11.621"], null, [["E11.621","Type 2 diabetes mellitus with foot ulcer"]] ]',
      summary: [
        "NLM Clinical Tables (cached):",
        "E11.621 — Type 2 diabetes mellitus with foot ulcer",
        "L97.509 — Non-pressure chronic ulcer of other part of unspecified foot",
      ],
    },
  },
];

type Status = "idle" | "selecting" | "fetching" | "done";

export function McpSim() {
  return (
    <SimShell name="MCP-HEALTHCARE" readout={() => "live federal APIs"}>
      {() => <Body />}
    </SimShell>
  );
}

function Body() {
  const [status, setStatus] = useState<Status>("idle");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [raw, setRaw] = useState("");
  const [summary, setSummary] = useState<string[]>([]);
  const [live, setLive] = useState(true);
  const runId = useRef(0);

  const fire = async (p: Preset) => {
    const id = ++runId.current;
    pulseSignal(0.6);
    setStatus("selecting");
    setActiveTool(p.tool);
    setRaw("");
    setSummary([]);
    await new Promise((r) => setTimeout(r, 550));
    if (id !== runId.current) return;
    setStatus("fetching");
    let result: { raw: string; summary: string[] };
    let isLive = true;
    try {
      result = await p.run();
    } catch {
      result = p.canned;
      isLive = false;
    }
    if (id !== runId.current) return;
    setLive(isLive);
    // stream the raw JSON into the terminal
    const text = result.raw;
    for (let i = 0; i <= text.length; i += 24) {
      setRaw(text.slice(0, i));
      await new Promise((r) => setTimeout(r, 16));
      if (id !== runId.current) return;
    }
    setRaw(text);
    setSummary(result.summary);
    setStatus("done");
  };

  return (
    <div className="csim">
      <div className="csim__presets">
        {PRESETS.map((p) => (
          <button key={p.id} className="chip" onClick={() => fire(p)} disabled={status === "fetching"}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="csim__tools mono-label">
        {PRESETS.map((p) => (
          <span key={p.tool} className={`csim__tool ${activeTool === p.tool ? "csim__tool--on" : ""}`}>
            ⚙ {p.tool}
          </span>
        ))}
      </div>

      <div className="csim__term" aria-live="polite">
        {status === "idle" && <span className="csim__dim">// pick a query — these hit api.fda.gov and clinicaltables.nlm.nih.gov from YOUR browser</span>}
        {status === "selecting" && <span className="csim__dim">mcp: selecting tool…</span>}
        {(status === "fetching" || status === "done") && (
          <>
            <span className="csim__dim">
              {status === "fetching" ? "→ awaiting response…" : live ? "→ 200 OK · LIVE" : "→ network unavailable · CACHED RESPONSE (labeled)"}
            </span>
            {"\n"}
            {raw}
            {status === "fetching" && <span className="hero__caret">▮</span>}
          </>
        )}
      </div>

      {summary.length > 0 && (
        <div className="csim__result">
          {summary.map((s, i) => (
            <div key={i} className={i === 0 ? "csim__resultHead mono-label" : "csim__resultLine"}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
