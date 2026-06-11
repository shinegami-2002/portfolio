import { useRef, useState } from "react";
import { useRafLoop } from "../lib/springs";
import { pulseSignal } from "../lib/scrollBus";
import { SimShell } from "./SimShell";

type NodeId = "router" | "retriever" | "grader" | "rewriter" | "generator" | "check" | "synth";

const NODES: { id: NodeId; label: string; x: number; y: number }[] = [
  { id: "router", label: "ROUTER", x: 60, y: 150 },
  { id: "retriever", label: "RETRIEVE", x: 175, y: 150 },
  { id: "grader", label: "GRADE", x: 290, y: 150 },
  { id: "rewriter", label: "REWRITE", x: 232, y: 62 },
  { id: "generator", label: "GENERATE", x: 430, y: 150 },
  { id: "check", label: "HALLU-CHECK", x: 560, y: 150 },
  { id: "synth", label: "SYNTH", x: 672, y: 150 },
];

type Phase = { node: NodeId; dur: number; note: string; fail?: boolean };
const PHASES: Phase[] = [
  { node: "router", dur: 0.6, note: "classify: research query → full pipeline" },
  { node: "retriever", dur: 0.9, note: "arXiv + PubMed → ChromaDB → top 4 candidates" },
  { node: "grader", dur: 1.0, note: "LLM judge scores relevance… doc#2 FAILS", fail: true },
  { node: "rewriter", dur: 0.7, note: "query reformulated · retry 1/2" },
  { node: "retriever", dur: 0.5, note: "re-retrieve with sharper terms" },
  { node: "grader", dur: 0.6, note: "4/4 documents pass grading" },
  { node: "generator", dur: 0.9, note: "cited answer from graded docs only" },
  { node: "check", dur: 0.8, note: "groundedness 0.91 ≥ threshold → PASS", fail: true },
  { node: "synth", dur: 0.6, note: "citations cleaned · dangling refs removed" },
];
const TOTAL = PHASES.reduce((a, p) => a + p.dur, 0);

export function ScholarSim() {
  return (
    <SimShell name="LANGGRAPH-PIPELINE" readout={(x) => `graph t=${(x * TOTAL).toFixed(1)}s`}>
      {(running) => <Body running={running} />}
    </SimShell>
  );
}

function Body({ running }: { running: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const tRef = useRef(0);

  useRafLoop((_, dt) => {
    if (!playing) return;
    tRef.current += dt;
    if (tRef.current >= TOTAL + 1.2) {
      setPlaying(false);
    }
    setElapsed(tRef.current);
  }, running && playing);

  const run = () => {
    tRef.current = 0;
    setElapsed(0);
    setPlaying(true);
    pulseSignal(0.6);
  };
  const step = () => {
    // jump to start of next phase boundary
    let acc = 0;
    for (const p of PHASES) {
      acc += p.dur;
      if (acc > tRef.current + 0.01) break;
    }
    tRef.current = Math.min(acc, TOTAL + 0.01);
    setElapsed(tRef.current);
    pulseSignal(0.2);
  };

  // derive current phase
  let acc = 0;
  let cur = -1;
  for (let i = 0; i < PHASES.length; i++) {
    if (elapsed >= acc && elapsed < acc + PHASES[i].dur) {
      cur = i;
      break;
    }
    acc += PHASES[i].dur;
  }
  const done = elapsed >= TOTAL;
  const activeNode = cur >= 0 ? PHASES[cur].node : null;
  const visited = new Set<NodeId>();
  {
    let a = 0;
    for (const p of PHASES) {
      if (elapsed > a) visited.add(p.node);
      a += p.dur;
    }
  }
  const failNow = cur >= 0 && PHASES[cur].fail && elapsed - (acc - 0) > PHASES[cur].dur * 0.45;
  const note = done
    ? "answer grounded · every claim cited · +35% vs naive RAG"
    : cur >= 0
      ? PHASES[cur].note
      : "press RUN to execute the real graph topology";

  const nodeState = (id: NodeId) =>
    activeNode === id ? (failNow && id === "grader" && cur === 2 ? "fail" : "active") : visited.has(id) ? "done" : "idle";

  return (
    <div className="ssim">
      <div className="ssim__controls">
        <button className="chip" onClick={run}>
          {playing ? "RUNNING…" : done ? "RUN AGAIN ▶" : "RUN ▶"}
        </button>
        <button className="chip" onClick={step} disabled={playing}>
          STEP →
        </button>
        <span className="mono-label ssim__clock">
          t = {Math.min(elapsed, TOTAL).toFixed(1)}s / {TOTAL.toFixed(1)}s
        </span>
      </div>

      <svg viewBox="0 0 720 210" className="ssim__svg" aria-label="LangGraph pipeline execution">
        {/* edges */}
        <g className="ssim__edges">
          <Edge x1={88} y1={150} x2={147} y2={150} on={cur >= 1} />
          <Edge x1={203} y1={150} x2={262} y2={150} on={cur >= 2} />
          <Edge x1={318} y1={150} x2={402} y2={150} on={cur >= 6} />
          <Edge x1={458} y1={150} x2={532} y2={150} on={cur >= 7} />
          <Edge x1={588} y1={150} x2={644} y2={150} on={cur >= 8} />
          {/* rewrite loop */}
          <path
            d="M 290 138 Q 280 62 250 62"
            fill="none"
            className={`ssim__edge ${cur === 3 ? "ssim__edge--on ssim__edge--danger" : ""}`}
            strokeDasharray="4 3"
          />
          <path
            d="M 214 62 Q 175 62 175 138"
            fill="none"
            className={`ssim__edge ${cur === 4 ? "ssim__edge--on" : ""}`}
            strokeDasharray="4 3"
          />
        </g>
        {/* nodes */}
        {NODES.map((n) => {
          const st = nodeState(n.id);
          return (
            <g key={n.id} className={`ssim__node ssim__node--${st}`}>
              <circle cx={n.x} cy={n.y} r={st === "active" ? 15 : 11} />
              <text x={n.x} y={n.y + 32} textAnchor="middle">
                {n.label}
              </text>
            </g>
          );
        })}
        {/* doc chips near grader */}
        {cur >= 2 &&
          [0, 1, 2, 3].map((i) => {
            const failed = i === 1 && cur >= 2 && cur < 5;
            return (
              <g key={i} className={`ssim__doc ${failed ? "ssim__doc--fail" : "ssim__doc--ok"}`}>
                <rect x={270 + i * 14} y={178 + (failed && cur >= 3 ? 14 : 0)} width={11} height={14} rx={1} />
                <text x={275.5 + i * 14} y={188 + (failed && cur >= 3 ? 14 : 0)} textAnchor="middle">
                  {failed ? "✗" : "✓"}
                </text>
              </g>
            );
          })}
      </svg>

      <div className={`ssim__note mono-label ${done ? "ssim__note--done" : ""}`}>
        {done ? "▮ " : "> "}
        {note}
      </div>
    </div>
  );
}

function Edge({ x1, y1, x2, y2, on }: { x1: number; y1: number; x2: number; y2: number; on: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={`ssim__edge ${on ? "ssim__edge--on" : ""}`} />;
}
