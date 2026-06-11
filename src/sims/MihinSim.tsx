import { useRef, useState } from "react";
import { useRafLoop } from "../lib/springs";
import { SimShell } from "./SimShell";

const HOPS = [
  { label: "USER", x: 50 },
  { label: "COGNITO", x: 185 },
  { label: "API GW", x: 320 },
  { label: "LAMBDA", x: 455 },
  { label: "BEDROCK", x: 600 },
];

const AGENTS = [
  { label: "STRANDS AGENT", x: 120, y: 70 },
  { label: "KB RAG AGENT", x: 360, y: 52 },
  { label: "CUSTOM BOT", x: 580, y: 70 },
];

export function MihinSim() {
  return (
    <SimShell name="ENTERPRISE-AI-PLATFORM" readout={(x, y) => `probe ${(x * 100) | 0}.${(y * 100) | 0}`}>
      {(running) => <Body running={running} />}
    </SimShell>
  );
}

function Body({ running }: { running: boolean }) {
  const [mode, setMode] = useState<"request" | "mesh">("request");
  const pinned = useRef(false);
  const t = useRef(0);
  const [, force] = useState(0);

  useRafLoop((_, dt) => {
    t.current += dt;
    if (!pinned.current && t.current > 0 && Math.floor(t.current / 7) % 2 === (mode === "request" ? 1 : 0)) {
      setMode((m) => (m === "request" ? "mesh" : "request"));
    }
    force((n) => n + 1);
  }, running);

  const pick = (m: "request" | "mesh") => {
    pinned.current = true;
    setMode(m);
  };

  const cycle = (t.current % 7) / 7; // 0..1 within current mode period

  return (
    <div className="msim">
      <div className="msim__tabs">
        <button className={`chip ${mode === "request" ? "msim__tab--on" : ""}`} onClick={() => pick("request")}>
          REQUEST PATH
        </button>
        <button className={`chip ${mode === "mesh" ? "msim__tab--on" : ""}`} onClick={() => pick("mesh")}>
          A2A AGENT MESH
        </button>
        <span className="mono-label msim__hint">
          {mode === "request" ? "PHI-safe path · every hop audited" : "agents discover each other via Agent Cards"}
        </span>
      </div>

      {mode === "request" ? <RequestPath k={cycle} /> : <Mesh k={cycle} />}

      <div className="msim__counters mono-label">
        <span>USERS <b>230+</b></span>
        <span>BOTS <b>20+</b></span>
        <span>DOCS <b>10K+</b></span>
        <span>UNGROUNDED <b>−30%</b></span>
        <span>MTTD <b>−60%</b></span>
      </div>
    </div>
  );
}

function RequestPath({ k }: { k: number }) {
  // packet goes out (0..0.5) and comes back (0.5..1)
  const out = Math.min(1, k * 2);
  const back = Math.max(0, k * 2 - 1);
  const px = k < 0.5 ? 50 + out * 550 : 600 - back * 550;
  const latency = k < 0.5 ? (k * 2 * 720) | 0 : ((1 - back) * 720) | 0;
  return (
    <svg viewBox="0 0 660 150" className="msim__svg" aria-label="Request flows through Cognito, API Gateway, Lambda, Bedrock">
      <line x1={50} y1={84} x2={600} y2={84} className="msim__rail" />
      {HOPS.map((h, i) => {
        const reached = px >= h.x - 8 || k >= 0.5;
        return (
          <g key={h.label} className={`msim__hop ${reached ? "msim__hop--on" : ""}`}>
            <rect x={h.x - 34} y={66} width={68} height={36} rx={2} />
            <text x={h.x} y={88} textAnchor="middle">
              {h.label}
            </text>
            {i === 1 && reached && k < 0.55 && (
              <text x={h.x} y={52} textAnchor="middle" className="msim__badge">
                ✓ SSO+MFA
              </text>
            )}
            {i === 4 && k >= 0.42 && k < 0.6 && (
              <text x={h.x} y={52} textAnchor="middle" className="msim__badge">
                CLAUDE · TITAN-V2
              </text>
            )}
          </g>
        );
      })}
      <circle cx={px} cy={84} r={5} className={`msim__packet ${k >= 0.5 ? "msim__packet--resp" : ""}`} />
      <text x={600} y={132} textAnchor="end" className="msim__latency">
        {latency}ms · audit-logged
      </text>
    </svg>
  );
}

function Mesh({ k }: { k: number }) {
  const link = (i: number) => k > 0.18 + i * 0.18;
  const mcpCall = k > 0.72;
  return (
    <svg viewBox="0 0 660 150" className="msim__svg" aria-label="Agents publishing Agent Cards and discovering each other over A2A">
      {/* A2A links */}
      <line x1={170} y1={74} x2={310} y2={56} className={`msim__a2a ${link(0) ? "msim__a2a--on" : ""}`} />
      <line x1={410} y1={56} x2={530} y2={74} className={`msim__a2a ${link(1) ? "msim__a2a--on" : ""}`} />
      <line x1={170} y1={80} x2={530} y2={80} className={`msim__a2a ${link(2) ? "msim__a2a--on" : ""}`} />
      {AGENTS.map((a, i) => (
        <g key={a.label} className="msim__agent">
          <rect x={a.x - 50} y={a.y - 16} width={100} height={32} rx={2} />
          <text x={a.x} y={a.y + 4} textAnchor="middle">
            {a.label}
          </text>
          {/* agent card pops above when its first link lights */}
          {link(i === 2 ? 1 : i) && (
            <g className="msim__card">
              <rect x={a.x - 14} y={a.y - 44} width={28} height={20} rx={2} />
              <text x={a.x} y={a.y - 30} textAnchor="middle">
                ▤
              </text>
            </g>
          )}
        </g>
      ))}
      {/* MCP tool call */}
      <line x1={360} y1={68} x2={360} y2={112} className={`msim__a2a ${mcpCall ? "msim__a2a--on" : ""}`} />
      <g className={`msim__mcp ${mcpCall ? "msim__mcp--on" : ""}`}>
        <rect x={300} y={112} width={120} height={26} rx={2} />
        <text x={360} y={129} textAnchor="middle">
          MCP · HL7/FHIR
        </text>
      </g>
      <text x={20} y={140} className="msim__latency">
        a2a: agent cards advertise capabilities · streamable http
      </text>
    </svg>
  );
}
