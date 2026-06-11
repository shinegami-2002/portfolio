import { useRef, useState } from "react";
import { useRafLoop } from "../lib/springs";
import { pulseSignal } from "../lib/scrollBus";
import { SimShell } from "./SimShell";

type Ev = { id: number; kind: "retry" | "dlq" | "scale"; text: string };
type Dot = { id: number; born: number; lane: number; toPod: number };

type S = {
  t: number; // sim-time, accumulated — survives pause/resume
  depth: number;
  workers: number;
  target: number;
  lastScale: number;
  done: number;
  retries: number;
  dlq: number;
  rate: number;
  events: Ev[];
  evId: number;
  failCarry: number;
  dots: Dot[];
  dotId: number;
  spawnCarry: number;
};

const init = (): S => ({
  t: 0,
  depth: 6,
  workers: 2,
  target: 2,
  lastScale: 0,
  done: 0,
  retries: 0,
  dlq: 0,
  rate: 0,
  events: [],
  evId: 0,
  failCarry: 0,
  dots: [],
  dotId: 0,
  spawnCarry: 0,
});

const DOT_LIFE = 1.1; // seconds from spawn to absorbed-by-pod

/** Drag the load. Watch HPA do its job. Real semantics: lag, retries, dead-letters. */
export function QueueSim() {
  const depthRef = useRef(6);
  return (
    <SimShell
      name="DISTRIBUTED-QUEUE"
      readout={(x) => `t+${(x * 60).toFixed(0)}s · depth ${depthRef.current.toFixed(0)}`}
    >
      {(running) => <Body running={running} depthRef={depthRef} />}
    </SimShell>
  );
}

function Body({
  running,
  depthRef,
}: {
  running: boolean;
  depthRef: React.MutableRefObject<number>;
}) {
  const [load, setLoad] = useState(0.35);
  const s = useRef<S | null>(null);
  if (s.current === null) s.current = init();
  const [, force] = useState(0);

  useRafLoop((_, dt) => {
    const st = s.current!;
    st.t += dt;
    const t = st.t;
    // arrivals
    const arrivals = load * 26 * dt;
    st.depth += arrivals;
    // processing
    const cap = st.workers * 4.2 * dt;
    const processed = Math.min(st.depth, cap);
    st.depth -= processed;
    st.done += processed;
    st.rate += (processed / Math.max(dt, 1e-4) - st.rate) * 0.08;
    // failures: 8% of processed fail; 2 retries then DLQ
    st.failCarry += processed * 0.08;
    if (st.failCarry >= 1) {
      const n = Math.floor(st.failCarry);
      st.failCarry -= n;
      st.retries += n;
      st.depth += n * 0.7;
      if (Math.random() < 0.3) {
        st.dlq += 1;
        st.events = [
          { id: st.evId++, kind: "dlq" as const, text: `task#${(st.done | 0) + 17} → dead-letter after 2 retries` },
          ...st.events,
        ].slice(0, 4);
      } else if (Math.random() < 0.4) {
        st.events = [
          { id: st.evId++, kind: "retry" as const, text: `task#${(st.done | 0) + 9} retry · backoff ${(1 + Math.random() * 3).toFixed(1)}s` },
          ...st.events,
        ].slice(0, 4);
      }
    }
    // flying task dots: spawn ∝ load, fly queue→pod, capped pool
    st.spawnCarry += load * 6 * dt;
    while (st.spawnCarry >= 1 && st.dots.length < 12) {
      st.spawnCarry -= 1;
      st.dots.push({
        id: st.dotId++,
        born: t,
        lane: Math.random(),
        toPod: Math.floor(Math.random() * st.workers),
      });
    }
    st.dots = st.dots.filter((d) => t - d.born < DOT_LIFE);

    // HPA with reaction lag
    st.target = Math.max(2, Math.min(8, Math.ceil(st.depth / 11)));
    if (t - st.lastScale > 1.4 && st.workers !== st.target) {
      st.workers += Math.sign(st.target - st.workers);
      st.lastScale = t;
      st.events = [
        { id: st.evId++, kind: "scale" as const, text: `hpa: queue_depth=${st.depth.toFixed(0)} → workers=${st.workers}` },
        ...st.events,
      ].slice(0, 4);
      pulseSignal(0.25);
    }
    st.depth = Math.max(0, Math.min(100, st.depth));
    depthRef.current = st.depth;
    force((n) => n + 1);
  }, running);

  const st = s.current;
  const depthPct = Math.min(100, st.depth);

  return (
    <div className="qsim">
      <div className="qsim__row">
        <label className="qsim__load">
          <span className="mono-label">LOAD</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={load}
            onChange={(e) => setLoad(parseFloat(e.target.value))}
            aria-label="Producer load"
          />
          <span className="mono-label qsim__loadV">{Math.round(load * 26)}/s</span>
        </label>
        <div className="qsim__tickers mono-label">
          <span>
            THROUGHPUT <b>{st.rate.toFixed(1)}/s</b>
          </span>
          <span>
            P95 <b>{(40 + depthPct * 6).toFixed(0)}ms</b>
          </span>
          <span>
            RETRIES <b>{st.retries | 0}</b>
          </span>
          <span className={st.dlq > 0 ? "qsim__dlqCount" : ""}>
            DLQ <b>{st.dlq}</b>
          </span>
        </div>
      </div>

      <div className="qsim__queue">
        <span className="mono-label">QUEUE</span>
        <div className="qsim__bar">
          <div
            className={`qsim__fill ${depthPct > 80 ? "qsim__fill--hot" : ""}`}
            style={{ width: `${depthPct}%` }}
          />
          {[25, 50, 75].map((p) => (
            <span key={p} className="qsim__rule" style={{ left: `${p}%` }} />
          ))}
        </div>
        <span className="mono-label qsim__depth">{st.depth.toFixed(0)}</span>
      </div>

      <div className="qsim__pods">
        <span className="mono-label">
          WORKERS × {st.workers} {st.target !== st.workers && <i>→ {st.target}</i>}
        </span>
        <div className="qsim__podWrap">
          <div className="qsim__podGrid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`qsim__pod ${i < st.workers ? "qsim__pod--on" : ""}`}>
                <span className="qsim__podBlink" />
              </div>
            ))}
          </div>
          <div className="qsim__flight" aria-hidden="true">
            {st.dots.map((d) => (
              <span
                key={d.id}
                className="qsim__dot"
                style={{
                  ["--fromX" as never]: `${8 + d.lane * 84}%`,
                  ["--toX" as never]: `${6 + d.toPod * 46}px`,
                  ["--life" as never]: `${DOT_LIFE}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="qsim__log">
        {st.events.length === 0 && <div className="qsim__ev mono-label">— no incidents yet. push the load.</div>}
        {st.events.map((e) => (
          <div key={e.id} className={`qsim__ev mono-label qsim__ev--${e.kind}`}>
            {e.kind === "dlq" ? "✗" : e.kind === "retry" ? "↻" : "▲"} {e.text}
          </div>
        ))}
      </div>
    </div>
  );
}
