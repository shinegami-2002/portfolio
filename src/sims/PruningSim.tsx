import { useMemo, useState } from "react";
import { SimShell } from "./SimShell";

/**
 * CKA explorer. Matrix reconstructed to honor the study's published statistics
 * (CKA spread 0.73–0.95, CKA↔mistake-overlap r=+0.95) — labeled as such in the UI.
 */
const CONFIGS = ["E30", "E50", "E70", "E90", "E97", "M50", "M70", "M90", "L50", "L70", "L97"];
const ratio = (c: string) => parseInt(c.slice(1));
const timing = (c: string) => ({ E: 0, M: 1, L: 2 })[c[0] as "E" | "M" | "L"];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildData() {
  const rnd = mulberry32(20260611);
  const n = CONFIGS.length;
  const cka: number[][] = Array.from({ length: n }, () => Array(n).fill(1));
  const overlap: number[][] = Array.from({ length: n }, () => Array(n).fill(1));
  const pts: { cka: number; ov: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dr = Math.abs(ratio(CONFIGS[i]) - ratio(CONFIGS[j])) / 67;
      const dt = Math.abs(timing(CONFIGS[i])! - timing(CONFIGS[j])!) / 2;
      let c = 0.95 - 0.115 * dr - 0.075 * dt + (rnd() - 0.5) * 0.022;
      c = Math.max(0.73, Math.min(0.95, c));
      let o = 0.2 + ((c - 0.73) / 0.22) * 0.48 + (rnd() - 0.5) * 0.035;
      o = Math.max(0.14, Math.min(0.72, o));
      cka[i][j] = cka[j][i] = c;
      overlap[i][j] = overlap[j][i] = o;
      pts.push({ cka: c, ov: o });
    }
  }
  return { cka, overlap, pts };
}

export function PruningSim() {
  const { cka, overlap, pts } = useMemo(buildData, []);
  const [sel, setSel] = useState<[number, number] | null>(null);

  const minC = 0.73;
  const maxC = 0.95;
  const shade = (v: number) => (v - minC) / (maxC - minC);

  return (
    <SimShell name="CKA-EXPLORER" readout={() => (sel ? `${CONFIGS[sel[0]]}×${CONFIGS[sel[1]]}` : "hover the matrix")}>
      {() => (
        <div className="psim">
          <div className="psim__left">
            <div className="psim__matrix" role="img" aria-label="Pairwise CKA similarity matrix of 11 pruning configurations">
              <div className="psim__corner mono-label">CKA</div>
              {CONFIGS.map((c) => (
                <div key={`h${c}`} className="psim__axis mono-label">
                  {c}
                </div>
              ))}
              {CONFIGS.map((r, i) => (
                <>
                  <div key={`r${r}`} className="psim__axis psim__axis--row mono-label">
                    {r}
                  </div>
                  {CONFIGS.map((c, j) => {
                    const v = cka[i][j];
                    const isSel = sel && ((sel[0] === i && sel[1] === j) || (sel[0] === j && sel[1] === i));
                    return (
                      <button
                        key={`${i}-${j}`}
                        className={`psim__cell ${isSel ? "psim__cell--sel" : ""}`}
                        style={
                          i === j
                            ? { background: "var(--line)" }
                            : { background: `rgba(var(--signal-rgb), ${(0.06 + shade(v) * 0.72).toFixed(2)})` }
                        }
                        onPointerEnter={() => i !== j && setSel([i, j])}
                        onFocus={() => i !== j && setSel([i, j])}
                        aria-label={i === j ? `${r} self` : `${r} vs ${c}: CKA ${v.toFixed(2)}`}
                      />
                    );
                  })}
                </>
              ))}
            </div>
            <div className="psim__read mono-label">
              {sel
                ? `${CONFIGS[sel[0]]} × ${CONFIGS[sel[1]]} · CKA ${cka[sel[0]][sel[1]].toFixed(2)} · mistake overlap ${overlap[sel[0]][sel[1]].toFixed(2)}`
                : "11 configs · timing (E/M/L) × sparsity (30–97%) · accuracy held within 1.48pp"}
            </div>
          </div>

          <div className="psim__right">
            <svg viewBox="0 0 240 200" className="psim__scatter" aria-label="CKA versus mistake overlap scatter, r = +0.95">
              <line x1={30} y1={170} x2={230} y2={170} className="psim__axisline" />
              <line x1={30} y1={10} x2={30} y2={170} className="psim__axisline" />
              {pts.map((p, i) => (
                <circle
                  key={i}
                  cx={30 + ((p.cka - 0.72) / 0.24) * 200}
                  cy={170 - ((p.ov - 0.1) / 0.65) * 160}
                  r={2.2}
                  className="psim__pt"
                />
              ))}
              {/* fitted line through the synthetic relation */}
              <line
                x1={30 + ((0.73 - 0.72) / 0.24) * 200}
                y1={170 - ((0.2 - 0.1) / 0.65) * 160}
                x2={30 + ((0.95 - 0.72) / 0.24) * 200}
                y2={170 - ((0.68 - 0.1) / 0.65) * 160}
                className="psim__fit"
              />
              <text x={228} y={24} textAnchor="end" className="psim__r">
                r = +0.95
              </text>
              <text x={130} y={192} textAnchor="middle" className="psim__axlabel">
                CKA SIMILARITY →
              </text>
              <text x={12} y={90} textAnchor="middle" className="psim__axlabel" transform="rotate(-90 12 90)">
                SHARED MISTAKES →
              </text>
            </svg>
            <div className="psim__probe">
              <span className="psim__probeN">89.2%</span>
              <span className="mono-label">
                linear probe IDs pruning timing
                <br />
                from ONE image · chance = 25%
              </span>
            </div>
            <div className="psim__note mono-label">reconstructed from study results</div>
          </div>
        </div>
      )}
    </SimShell>
  );
}
