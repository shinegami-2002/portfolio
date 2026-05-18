// Signature moment — "How I Work": scroll-pinned cinematic
// A document flows through 5 stages: chunk → embed → retrieve → grade → answer.
// Abstract type/shape composition, not a diagram.

function Signature() {
  const ref = React.useRef(null);
  // Pin duration: 5 stages × 80vh + 60vh buffer
  const p = usePinP(ref);
  const stages = [
    {
      n: '01', label: 'CHUNK',
      heading: 'Documents, broken into meaning.',
      body: 'Semantic chunking along natural boundaries — headings respected, sentences preserved, context carried. Not every 500 tokens.',
    },
    {
      n: '02', label: 'EMBED',
      heading: 'Projected into vector space.',
      body: 'Each chunk becomes a point in a 1024-dimensional space. Similar ideas land near each other; unrelated ones drift apart.',
    },
    {
      n: '03', label: 'RETRIEVE & GRADE',
      heading: 'A question finds its neighbors — and they\'re scored.',
      body: 'Top-k nearest neighbors pulled, then each is graded for relevance. Low-signal chunks dropped, query rewritten, search re-runs. No silent failures.',
    },
    {
      n: '04', label: 'GROUND',
      heading: 'Answer with receipts.',
      body: 'The LLM synthesizes — but every claim gets a source. If it cannot cite, it declines. If it hallucinates, the verifier catches it before the user sees it.',
    },
  ];

  // 6 stages, each holds for 1/6 of the scroll
  const stageFloat = p * stages.length;
  const active = Math.min(stages.length - 1, Math.floor(stageFloat));
  const stageProg = stageFloat - active; // 0..1 within current stage

  return (
    <section id="process" ref={ref} style={{
      height: `${stages.length * 100 + 60}vh`,
      background: C.bg, color: C.ink, position: 'relative',
    }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        {/* LEFT: narrative */}
        <div style={{
          padding: '80px 60px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          borderRight: `1px solid ${C.line}`,
        }}>
          <div>
            <div style={{ ...S.mono, color: C.muted }}>№ 03 · SIGNATURE</div>
            <div style={{ ...S.serif, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, marginTop: 20, letterSpacing: '-0.03em' }}>
              How I <em style={{ color: C.accent }}>work</em>.
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: C.ink2, marginTop: 18, maxWidth: 440 }}>
              The anatomy of a RAG system I'd be proud to ship — every stage earns its place.
            </div>
          </div>

          {/* Stage list — active one expanded */}
          <div style={{ marginTop: 60 }}>
            {stages.map((s, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <div key={i} style={{
                  padding: '18px 0', borderTop: `1px solid ${C.line}`,
                  opacity: isPast ? 0.35 : 1,
                  transition: 'opacity 400ms',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
                    <span style={{ ...S.mono, color: isActive ? C.accent : C.muted, width: 28 }}>
                      {s.n}
                    </span>
                    <span style={{
                      ...S.serif, fontSize: isActive ? 40 : 22,
                      fontStyle: isActive ? 'italic' : 'normal',
                      color: isActive ? C.cream : C.ink2,
                      transition: 'all 500ms cubic-bezier(.2,.8,.2,1)',
                      lineHeight: 1.1,
                    }}>
                      {s.label.toLowerCase()}
                    </span>
                  </div>
                  {isActive && (
                    <div style={{ paddingLeft: 48, marginTop: 12 }}>
                      <div style={{ ...S.serif, fontSize: 28, lineHeight: 1.15, color: C.cream }}>
                        {s.heading}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.55, color: C.ink2, marginTop: 10, maxWidth: 440 }}>
                        {s.body}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16, ...S.mono, color: C.muted, display: 'flex', justifyContent: 'space-between' }}>
              <span>STAGE {String(active + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}</span>
              <span>{Math.round(p * 100)}%</span>
            </div>
          </div>
        </div>

        {/* RIGHT: cinematic visual stage */}
        <div style={{ position: 'relative', overflow: 'hidden', background: C.bg }}>
          <StageVisual active={active} stageProg={stageProg} p={p} />
          {/* Stage number, huge, in background */}
          <div style={{
            position: 'absolute', top: 32, right: 32, ...S.serif,
            fontSize: 'clamp(120px, 18vw, 280px)', lineHeight: 0.8,
            color: 'transparent',
            WebkitTextStroke: `1px ${C.accent}33`,
            pointerEvents: 'none', fontStyle: 'italic', letterSpacing: '-0.05em',
          }}>
            {String(active + 1).padStart(2, '0')}
          </div>
          {/* Label */}
          <div style={{
            position: 'absolute', bottom: 40, left: 40, ...S.mono, color: C.accent,
            fontSize: 14, letterSpacing: '0.3em',
          }}>
            — {stages[active].label}
          </div>
        </div>
      </div>
    </section>
  );
}

// The visual stage — shows different abstract scenes per active stage
function StageVisual({ active, stageProg, p }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {active === 0 && <SceneChunk prog={stageProg} />}
      {active === 1 && <SceneEmbed prog={stageProg} />}
      {active === 2 && <SceneRetrieveGrade prog={stageProg} />}
      {active === 3 && <SceneGround prog={stageProg} />}
    </div>
  );
}

// Scene 1: INGEST — a document floats in, lines of text populate
function SceneIngest({ prog }) {
  const lines = 22;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '58%', aspectRatio: '3/4', background: C.cream, color: C.bg,
        padding: '32px 36px',
        boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.accent}`,
        transform: `translateY(${(1 - Math.min(1, prog * 2)) * 40}px) rotate(${-2 + prog * 2}deg)`,
        opacity: Math.min(1, prog * 3),
        position: 'relative',
      }}>
        <div style={{ ...S.serif, fontSize: 24, fontStyle: 'italic', borderBottom: `1px solid ${C.bg}33`, paddingBottom: 12, marginBottom: 16 }}>
          Clinical Guidance — v2.3
        </div>
        {Array.from({ length: lines }).map((_, i) => {
          const show = prog * lines * 1.5 > i;
          return (
            <div key={i} style={{
              height: 7, background: C.bg, opacity: show ? (i % 5 === 0 ? 0.9 : 0.35) : 0,
              marginBottom: 8,
              width: `${40 + ((i * 37) % 55)}%`,
              transition: 'opacity 200ms',
            }} />
          );
        })}
        <div style={{ position: 'absolute', bottom: 20, right: 24, ...S.mono, fontSize: 10, color: `${C.bg}88` }}>
          PAGE 01 · 120 PAGES
        </div>
      </div>
    </div>
  );
}

// Scene 2: CHUNK — document splits into tiles
function SceneChunk({ prog }) {
  const tiles = 12;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        width: '65%', aspectRatio: '3/4',
      }}>
        {Array.from({ length: tiles }).map((_, i) => {
          const stagger = i / tiles;
          const split = Math.max(0, (prog - stagger * 0.2) * 2);
          const rot = (i % 2 === 0 ? -1 : 1) * (3 + (i % 4));
          return (
            <div key={i} style={{
              background: C.cream, color: C.bg, padding: '14px 12px',
              transform: `translate(${(i % 3 - 1) * split * 20}px, ${(Math.floor(i / 3) - 2) * split * 15}px) rotate(${split * rot}deg)`,
              opacity: Math.min(1, prog * 4 + 0.2),
              boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px ${C.accent}66`,
              transition: 'transform 600ms',
            }}>
              <div style={{ ...S.mono, fontSize: 9, color: `${C.bg}88`, marginBottom: 6 }}>CHUNK {String(i + 1).padStart(2, '0')}</div>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ height: 4, background: C.bg, opacity: j === 0 ? 0.9 : 0.4, marginBottom: 5, width: `${55 + ((i + j) * 13) % 40}%` }} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 3: EMBED — tiles become points in space
function SceneEmbed({ prog }) {
  const points = 48;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Axis lines */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke={C.ink} strokeWidth="0.5" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke={C.ink} strokeWidth="0.5" />
        ))}
      </svg>
      {Array.from({ length: points }).map((_, i) => {
        // Pseudo-random but deterministic positions in clusters
        const cluster = i % 4;
        const cx = [30, 70, 50, 25][cluster];
        const cy = [35, 40, 70, 65][cluster];
        const jitter = ((i * 73) % 100) / 100;
        const jitter2 = ((i * 113) % 100) / 100;
        const x = cx + (jitter - 0.5) * 18;
        const y = cy + (jitter2 - 0.5) * 18;
        const delay = (i / points) * 0.4;
        const show = Math.max(0, Math.min(1, (prog - delay) * 5));
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: 6 + (i % 3) * 2, height: 6 + (i % 3) * 2,
            borderRadius: '50%',
            background: cluster === 0 ? C.accent : cluster === 1 ? '#c0a080' : cluster === 2 ? '#7a8a6a' : C.cream,
            transform: `scale(${show}) translate(-50%, -50%)`,
            opacity: show * 0.9,
            transition: 'transform 300ms',
            boxShadow: `0 0 12px currentColor`,
          }} />
        );
      })}
    </div>
  );
}

// Scene 3: RETRIEVE & GRADE — top-k with pass/fail scoring
function SceneRetrieveGrade({ prog }) {
  // Two halves: retrieve (first 50%), grade (second 50%)
  const retrProg = Math.min(1, prog * 2);
  const gradeProg = Math.max(0, Math.min(1, (prog - 0.45) * 2));
  const qx = 30, qy = 50;
  const points = 30;
  const pts = Array.from({ length: points }).map((_, i) => {
    const cluster = i % 4;
    const cx = [25, 60, 45, 20][cluster];
    const cy = [35, 40, 70, 65][cluster];
    const jitter = ((i * 73) % 100) / 100;
    const jitter2 = ((i * 113) % 100) / 100;
    const x = cx + (jitter - 0.5) * 16;
    const y = cy + (jitter2 - 0.5) * 16;
    const d = Math.hypot(x - qx, y - qy);
    return { x, y, d, i };
  }).sort((a, b) => a.d - b.d);
  const topK = pts.slice(0, 5);
  // Grade results
  const grades = [0.91, 0.42, 0.88, 0.76, 0.31]; // match topK order
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '50% 50%' }}>
      {/* LEFT: retrieve viz */}
      <div style={{ position: 'relative', borderRight: `1px solid ${C.line}` }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g opacity="0.1">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke={C.ink} strokeWidth="0.2" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke={C.ink} strokeWidth="0.2" />
            ))}
          </g>
          {topK.map((p, j) => {
            const show = Math.min(1, Math.max(0, (retrProg - j * 0.1) * 4));
            return (
              <line key={j}
                x1={qx} y1={qy}
                x2={qx + (p.x - qx) * show} y2={qy + (p.y - qy) * show}
                stroke={C.accent} strokeWidth="0.4" opacity={show * 0.8}
                strokeDasharray="1 1"
              />
            );
          })}
        </svg>
        {pts.map((p, j) => {
          const isTop = j < 5;
          const showWhen = isTop ? j * 0.1 : 0;
          const highlight = Math.min(1, Math.max(0, (retrProg - showWhen) * 4));
          return (
            <div key={j} style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: isTop ? 8 + highlight * 4 : 5, height: isTop ? 8 + highlight * 4 : 5,
              borderRadius: '50%',
              background: isTop ? C.accent : C.ink2,
              transform: 'translate(-50%, -50%)',
              opacity: isTop ? 0.3 + highlight * 0.7 : 0.35,
              boxShadow: isTop && highlight > 0.5 ? `0 0 14px ${C.accent}` : 'none',
            }} />
          );
        })}
        <div style={{
          position: 'absolute', left: `${qx}%`, top: `${qy}%`,
          width: 12, height: 12, borderRadius: '50%', background: C.cream,
          transform: `translate(-50%, -50%)`,
          boxShadow: `0 0 0 ${Math.min(1, retrProg * 3) * 6}px ${C.cream}22, 0 0 18px ${C.cream}`,
        }} />
        <div style={{
          position: 'absolute', top: 20, left: 20, ...S.mono, color: C.muted, fontSize: 10,
        }}>
          RETRIEVE · TOP-5
        </div>
      </div>

      {/* RIGHT: grade viz */}
      <div style={{ position: 'relative', padding: '10% 8%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ ...S.mono, color: C.muted, fontSize: 10, marginBottom: 20 }}>
          GRADE · KEEP / DROP
        </div>
        {grades.map((g, i) => {
          const delay = i * 0.1;
          const reveal = Math.max(0, Math.min(1, (gradeProg - delay) * 4));
          const pass = g > 0.5;
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 50px 60px', gap: 10, alignItems: 'center',
              marginBottom: 10,
              opacity: reveal, transform: `translateX(${(1 - reveal) * -20}px)`,
            }}>
              <span style={{ ...S.mono, color: C.muted, fontSize: 10 }}>[{i + 1}]</span>
              <div style={{ height: 3, background: `${C.ink}22`, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${g * 100}%`,
                  background: pass ? C.accent : '#8a4a3a',
                  transform: `scaleX(${reveal})`, transformOrigin: 'left',
                }} />
              </div>
              <div style={{ ...S.mono, fontSize: 10, color: C.ink2, textAlign: 'right' }}>
                {(g * reveal).toFixed(2)}
              </div>
              <div style={{
                ...S.mono, fontSize: 9, textAlign: 'right',
                color: pass ? C.accent : '#c26a52', opacity: reveal > 0.7 ? 1 : 0,
                letterSpacing: '0.15em',
              }}>
                {pass ? '✓ KEEP' : '✗ DROP'}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 20, ...S.mono, fontSize: 9, color: C.muted, letterSpacing: '0.1em' }}>
          3 KEPT · 2 DROPPED · RE-QUERY ON DROP
        </div>
      </div>
    </div>
  );
}
function SceneRetrieve({ prog }) {
  const points = 40;
  const qx = 48, qy = 50;
  // Pre-compute points with distances
  const pts = Array.from({ length: points }).map((_, i) => {
    const cluster = i % 4;
    const cx = [30, 70, 50, 25][cluster];
    const cy = [35, 40, 70, 65][cluster];
    const jitter = ((i * 73) % 100) / 100;
    const jitter2 = ((i * 113) % 100) / 100;
    const x = cx + (jitter - 0.5) * 18;
    const y = cy + (jitter2 - 0.5) * 18;
    const d = Math.hypot(x - qx, y - qy);
    return { x, y, d, i };
  }).sort((a, b) => a.d - b.d);
  const topK = pts.slice(0, 5);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* grid bg */}
        <g opacity="0.1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke={C.ink} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke={C.ink} strokeWidth="0.5" />
          ))}
        </g>
        {/* connection rays to top-k */}
        {topK.map((p, j) => {
          const show = Math.min(1, Math.max(0, (prog - 0.3 - j * 0.08) * 4));
          return (
            <line key={j}
              x1={`${qx}%`} y1={`${qy}%`}
              x2={`${qx + (p.x - qx) * show}%`} y2={`${qy + (p.y - qy) * show}%`}
              stroke={C.accent} strokeWidth="1.5" opacity={show * 0.8}
              strokeDasharray="3 3"
            />
          );
        })}
      </svg>
      {/* points */}
      {pts.map((p, j) => {
        const isTop = j < 5;
        const showWhen = isTop ? 0.3 + j * 0.08 : 0;
        const highlight = Math.min(1, Math.max(0, (prog - showWhen) * 4));
        return (
          <div key={j} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: isTop ? 10 + highlight * 4 : 6, height: isTop ? 10 + highlight * 4 : 6,
            borderRadius: '50%',
            background: isTop ? C.accent : C.ink2,
            transform: 'translate(-50%, -50%)',
            opacity: isTop ? 0.3 + highlight * 0.7 : 0.4,
            boxShadow: isTop && highlight > 0.5 ? `0 0 16px ${C.accent}` : 'none',
          }} />
        );
      })}
      {/* query point — central, large, cream */}
      <div style={{
        position: 'absolute', left: `${qx}%`, top: `${qy}%`,
        width: 16, height: 16, borderRadius: '50%', background: C.cream,
        transform: `translate(-50%, -50%) scale(${0.5 + Math.min(1, prog * 3) * 0.8})`,
        boxShadow: `0 0 0 ${Math.min(1, prog * 3) * 8}px ${C.cream}22, 0 0 24px ${C.cream}`,
      }} />
      {/* query label */}
      <div style={{
        position: 'absolute', left: `${qx}%`, top: `${qy + 6}%`,
        transform: 'translate(-50%, 0)',
        ...S.mono, fontSize: 11, color: C.cream, opacity: Math.min(1, prog * 3),
        whiteSpace: 'nowrap',
      }}>
        → QUERY
      </div>
    </div>
  );
}

// Scene 5: GRADE — chunks are evaluated, some pass, some fail
function SceneGrade({ prog }) {
  const chunks = [
    { label: 'CHUNK 01', grade: 'PASS', score: 0.91 },
    { label: 'CHUNK 02', grade: 'FAIL', score: 0.42 },
    { label: 'CHUNK 03', grade: 'PASS', score: 0.88 },
    { label: 'CHUNK 04', grade: 'PASS', score: 0.76 },
    { label: 'CHUNK 05', grade: 'FAIL', score: 0.31 },
    { label: 'CHUNK 06', grade: 'PASS', score: 0.83 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '10% 12%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
      {chunks.map((c, i) => {
        const delay = i * 0.12;
        const reveal = Math.max(0, Math.min(1, (prog - delay) * 4));
        const judgeReveal = Math.max(0, Math.min(1, (prog - delay - 0.1) * 4));
        const pass = c.grade === 'PASS';
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 100px 80px', gap: 16, alignItems: 'center',
            opacity: reveal,
            transform: `translateX(${(1 - reveal) * -40}px)`,
          }}>
            <div style={{ ...S.mono, color: C.muted, fontSize: 11 }}>{c.label}</div>
            <div style={{ height: 3, background: `${C.ink}22`, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${c.score * 100}%`,
                background: pass ? C.accent : '#8a4a3a',
                transform: `scaleX(${judgeReveal})`, transformOrigin: 'left',
                transition: 'transform 400ms',
              }} />
            </div>
            <div style={{ ...S.mono, fontSize: 11, color: C.ink2, textAlign: 'right' }}>
              {(c.score * judgeReveal).toFixed(2)}
            </div>
            <div style={{
              ...S.mono, fontSize: 11, textAlign: 'right',
              color: pass ? C.accent : '#c26a52', opacity: judgeReveal,
              fontWeight: 600, letterSpacing: '0.15em',
            }}>
              {judgeReveal > 0.7 ? (pass ? '✓ KEEP' : '✗ DROP') : '...'}
            </div>
          </div>
        );
      })}
      <div style={{ ...S.mono, color: C.muted, marginTop: 40, fontSize: 11, borderTop: `1px solid ${C.line}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
        <span>GRADED {Math.floor(prog * 6)}/6</span>
        <span>4 KEPT · 2 DROPPED · RE-QUERY ON DROP</span>
      </div>
    </div>
  );
}

// Scene 6: GROUND — answer composes with citations
function SceneGround({ prog }) {
  const text = "Based on the 2024 guidance, first-line treatment is indicated when the patient meets criteria A and B — but only after exclusion of condition C.";
  const words = text.split(' ');
  const citations = [
    { after: 9, id: '[1]' },
    { after: 16, id: '[2]' },
    { after: words.length - 1, id: '[3]' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '14% 12%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ ...S.mono, color: C.accent, fontSize: 11, marginBottom: 14 }}>
        → SYNTHESIZED ANSWER
      </div>
      <div style={{ ...S.serif, fontSize: 'clamp(22px, 2.4vw, 32px)', lineHeight: 1.45, color: C.cream }}>
        {words.map((w, i) => {
          const show = Math.max(0, Math.min(1, (prog * words.length * 1.8) - i));
          const cite = citations.find(c => c.after === i);
          return (
            <React.Fragment key={i}>
              <span style={{ opacity: show, transition: 'opacity 180ms' }}>{w}{' '}</span>
              {cite && (
                <sup style={{
                  ...S.mono, color: C.accent, fontSize: 13, marginLeft: -4, marginRight: 4,
                  opacity: show, verticalAlign: 'super',
                }}>{cite.id}</sup>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ marginTop: 40, borderTop: `1px solid ${C.line}`, paddingTop: 18, opacity: Math.max(0, Math.min(1, (prog - 0.5) * 3)) }}>
        <div style={{ ...S.mono, color: C.muted, fontSize: 11, marginBottom: 10 }}>SOURCES</div>
        {[
          { id: '[1]', src: 'clinical-guidance-v2.3.pdf · p. 47' },
          { id: '[2]', src: 'criteria-framework-2024.pdf · p. 12' },
          { id: '[3]', src: 'exclusions-appendix.pdf · p. 3' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, fontSize: 13, lineHeight: 1.6, color: C.ink2 }}>
            <span style={{ ...S.mono, color: C.accent }}>{s.id}</span>
            <span style={{ ...S.serif, fontStyle: 'italic' }}>{s.src}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Signature });
