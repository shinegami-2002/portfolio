// Projects — cinematic full-bleed horizontal gallery with real imagery

function Projects() {
  const ref = React.useRef(null);
  const p = usePinP(ref);
  const d = window.PORTFOLIO_DATA;
  const projects = d.projects;
  const n = projects.length;
  const activeFloat = p * (n - 1);
  const active = Math.min(n - 1, Math.floor(p * n));
  // sub-progress within the active card 0→1 (used for image cross-fade easing)
  const sub = Math.min(1, Math.max(0, (activeFloat - active)));
  return (
    <section id="work" ref={ref} style={{ height: `${n * 120}vh`, position: 'relative', background: C.bg }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', color: C.ink }}>
        {/* WebGL aurora — colour shifts as you scroll between projects */}
        <ShaderBg active={active} progress={sub} intensity={0.9} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: '100px 40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          background: `linear-gradient(180deg, ${C.bg}ee, transparent)`,
        }}>
          <div>
            <div style={{ ...S.mono, color: C.muted }}>№ 02 / SELECTED WORK</div>
            <div style={{ ...S.serif, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, marginTop: 10 }}>
              Things I've <em style={{ color: C.accent }}>shipped</em>.
            </div>
          </div>
          <div style={{ ...S.mono, color: C.ink, textAlign: 'right' }}>
            <div style={{ ...S.serif, fontSize: 64, lineHeight: 1, fontStyle: 'italic', color: C.accent }}>
              {String(active + 1).padStart(2, '0')}<span style={{ color: C.muted }}>/{String(n).padStart(2, '0')}</span>
            </div>
            <div style={{ marginTop: 8, color: C.muted }}>SCROLL →</div>
          </div>
        </div>

        <div style={{
          display: 'flex', height: '100vh', width: `${n * 100}vw`,
          transform: `translateX(-${p * (n - 1) * 100}vw)`,
          willChange: 'transform',
        }}>
          {projects.map((pr, i) => (
            <article key={pr.n} style={{
              width: '100vw', flexShrink: 0, position: 'relative', overflow: 'hidden',
              background: C.bg,
            }}>
              {/* Two-pane editorial layout: image left, story right */}
              <div style={{
                position: 'relative', height: '100%', display: 'grid',
                gridTemplateColumns: '0.95fr 1.05fr', paddingTop: 130,
              }}>
                {/* LEFT: image plate with project numeral */}
                <div style={{ position: 'relative', overflow: 'hidden', borderRight: `1px solid ${C.line}` }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${pr.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    transform: `scale(${i === active ? 1.04 : 1.14})`,
                    transition: 'transform 1400ms cubic-bezier(.2,.8,.2,1)',
                    filter: 'saturate(0.85) contrast(1.05) brightness(0.9)',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,9,6,0.25), rgba(10,9,6,0.55))' }} />
                  {/* Giant numeral */}
                  <div style={{
                    position: 'absolute', left: 48, bottom: 48,
                    ...S.serif, fontSize: 'clamp(180px, 22vw, 360px)', lineHeight: 0.85,
                    color: C.cream, fontStyle: 'italic', letterSpacing: '-0.04em',
                    mixBlendMode: 'overlay', opacity: 0.95,
                    textShadow: i === active ? `0 0 80px ${C.accent}66, 0 0 160px ${C.accent}33` : 'none',
                    transition: 'text-shadow 1200ms ease-out',
                  }}>
                    {pr.n}
                  </div>
                  {/* Year label */}
                  <div style={{
                    position: 'absolute', left: 48, top: 32, ...S.mono,
                    color: C.cream, letterSpacing: '0.3em', fontSize: 11,
                  }}>
                    {pr.year}
                  </div>
                  {/* Live preview badge — bottom right of image */}
                  <div style={{
                    position: 'absolute', right: 32, bottom: 32, width: 220,
                    background: 'rgba(10,9,6,0.7)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(244,237,225,0.18)',
                  }}>
                    <ProjectPreview idx={i} active={i === active} />
                  </div>
                </div>

                {/* RIGHT: story column — generous breathing room, no internal scroll */}
                <div style={{
                  padding: '20px 64px 60px 64px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  height: 'calc(100vh - 130px)',
                }}>
                  {/* Top: title block */}
                  <div>
                    <div style={{ ...S.mono, color: C.accent, letterSpacing: '0.32em', fontSize: 11 }}>
                      {pr.subtitle}
                    </div>
                    <h2 style={{
                      ...S.serif, fontSize: 'clamp(56px, 6.5vw, 104px)', lineHeight: 0.92,
                      letterSpacing: '-0.025em', color: C.cream, margin: '14px 0 0',
                      fontWeight: 400,
                    }}>
                      {pr.title}
                    </h2>
                    <p style={{
                      ...S.serif, fontSize: 'clamp(20px, 1.6vw, 26px)', fontStyle: 'italic',
                      lineHeight: 1.4, marginTop: 22, color: C.ink, maxWidth: 600,
                    }}>
                      {pr.tagline}
                    </p>
                  </div>

                  {/* Middle: timeline of problem → approach → impact */}
                  <div style={{ display: 'grid', gap: 22, margin: '24px 0', maxWidth: 640 }}>
                    <ProjectBeat label="THE PROBLEM" body={pr.problem} />
                    <ProjectBeat label="THE APPROACH" body={pr.approach} />
                    <div>
                      <div style={{ ...S.mono, color: C.accent, fontSize: 10, letterSpacing: '0.32em' }}>
                        THE IMPACT
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'grid', gap: 10 }}>
                        {pr.impact.map((im, j) => (
                          <li key={j} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                            <span style={{
                              ...S.serif, fontStyle: 'italic', color: C.accent,
                              fontSize: 22, lineHeight: 1, flexShrink: 0, width: 28,
                            }}>0{j + 1}</span>
                            <span style={{ fontSize: 14, lineHeight: 1.55, color: C.ink2 }}>{im}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom: tags + source link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, paddingTop: 28, borderTop: `1px solid ${C.line}` }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, rowGap: 10, maxWidth: 520 }}>
                      {pr.tags.map(t => (
                        <span key={t} style={{
                          ...S.mono, padding: '6px 12px', fontSize: 10, letterSpacing: '0.2em',
                          border: '1px solid rgba(244,237,225,0.18)', color: C.ink2,
                          lineHeight: 1,
                        }}>{t}</span>
                      ))}
                    </div>
                    {pr.href && (
                      <a href={pr.href} target="_blank" rel="noreferrer" style={{
                        ...S.mono, color: C.accent, textDecoration: 'none', fontSize: 11,
                        letterSpacing: '0.24em', whiteSpace: 'nowrap',
                        borderBottom: `1px solid ${C.accent}`, paddingBottom: 3,
                      }}>VIEW SOURCE ↗</a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ position: 'absolute', left: 40, right: 40, bottom: 30, display: 'flex', gap: 4, zIndex: 5 }}>
          {projects.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, background: i <= active ? C.accent : C.line, transition: 'background 400ms' }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Per-project micro-previews — small animated visuals that hint at what each system does.
// Active one animates; inactive are frozen frames.
function ProjectPreview({ idx, active }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let raf, start = performance.now();
    const tick = (now) => {
      setT(((now - start) / 1000) % 4); // 4s loop
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  const props = { t: active ? t : 1.5 }; // freeze inactive mid-loop
  const scenes = [PrevScholar, PrevMCP, PrevLinkVault, PrevQueue, PrevNN, PrevPCG, PrevChatBot];
  const Scene = scenes[idx] || PrevGeneric;
  return (
    <div style={{
      height: 140, position: 'relative', background: '#0f0d08',
      borderBottom: `1px solid rgba(244,237,225,0.1)`, overflow: 'hidden',
    }}>
      <Scene {...props} />
      <div style={{
        position: 'absolute', top: 10, left: 12, ...S.mono, fontSize: 9,
        color: C.muted, letterSpacing: '0.2em',
      }}>
        LIVE PREVIEW
      </div>
      <div style={{
        position: 'absolute', top: 10, right: 12, ...S.mono, fontSize: 9,
        color: active ? C.accent : C.muted, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: active ? '#8bc34a' : C.muted,
          animation: active ? 'pulse 1.5s infinite' : 'none',
        }} />
        {active ? 'RUNNING' : 'IDLE'}
      </div>
    </div>
  );
}

// 01 ScholarAgent — query flows through grader nodes, one re-queries
function PrevScholar({ t }) {
  const nodes = ['QUERY', 'RETRIEVE', 'GRADE', 'GEN', 'VERIFY'];
  const phase = (t / 4) * (nodes.length + 1);
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
      {/* connection line */}
      <line x1="20" y1="75" x2="380" y2="75" stroke={C.line} strokeWidth="1" strokeDasharray="2 3" />
      {nodes.map((n, i) => {
        const x = 20 + (i / (nodes.length - 1)) * 360;
        const lit = Math.abs(phase - i) < 0.7;
        // re-query loop: grade fails and goes back
        const isGrade = i === 2;
        return (
          <g key={i}>
            {isGrade && lit && (
              <path d={`M ${x} 60 Q ${x - 40} 20 ${20 + (1 / (nodes.length - 1)) * 360} 60`}
                fill="none" stroke={C.accent} strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
            )}
            <circle cx={x} cy="75" r={lit ? 8 : 5} fill={lit ? C.accent : '#3a352d'}
              style={{ transition: 'all 200ms' }} />
            <text x={x} y="105" fontSize="8" fontFamily="JetBrains Mono, monospace"
              fill={lit ? C.cream : C.muted} textAnchor="middle" letterSpacing="1">{n}</text>
          </g>
        );
      })}
      <text x="200" y="35" fontSize="10" fontFamily="Instrument Serif, serif" fontStyle="italic"
        fill={C.cream} textAnchor="middle" opacity="0.8">
        7-node LangGraph
      </text>
    </svg>
  );
}

// 02 MCP — tool calls fan out to APIs
function PrevMCP({ t }) {
  const apis = ['openFDA', 'PubMed', 'NLM', 'Trials'];
  const calls = Math.floor((t / 4) * 12);
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
      {/* LLM node (left) */}
      <rect x="20" y="55" width="60" height="30" fill="none" stroke={C.accent} strokeWidth="1" />
      <text x="50" y="74" fontSize="9" fontFamily="JetBrains Mono, monospace"
        fill={C.cream} textAnchor="middle">LLM</text>
      {/* MCP hub */}
      <circle cx="160" cy="70" r="12" fill="none" stroke={C.cream} strokeWidth="1" />
      <text x="160" y="73" fontSize="7" fontFamily="JetBrains Mono, monospace"
        fill={C.cream} textAnchor="middle">MCP</text>
      {/* pulse line LLM→MCP */}
      <line x1="80" y1="70" x2="148" y2="70" stroke={C.accent} strokeWidth="1" />
      {apis.map((a, i) => {
        const y = 20 + i * 30;
        const active = (calls + i) % apis.length === i && (t % 1) < 0.5;
        return (
          <g key={i}>
            <line x1="172" y1="70" x2="320" y2={y}
              stroke={active ? C.accent : C.line} strokeWidth={active ? 1.5 : 0.5} opacity={active ? 1 : 0.4} />
            <rect x="320" y={y - 8} width="64" height="16"
              fill={active ? C.accent : 'none'} stroke={C.line} strokeWidth="1" />
            <text x="352" y={y + 3} fontSize="8" fontFamily="JetBrains Mono, monospace"
              fill={active ? C.bg : C.muted} textAnchor="middle">{a}</text>
          </g>
        );
      })}
    </svg>
  );
}

// 03 LinkVault — REST request/response bar (p95 latency)
function PrevLinkVault({ t }) {
  const bars = 40;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
      <line x1="20" y1="110" x2="380" y2="110" stroke={C.line} strokeWidth="0.5" />
      <text x="20" y="20" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.muted}>
        GET /links — p95 latency
      </text>
      <text x="380" y="20" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.accent} textAnchor="end">
        48ms
      </text>
      {Array.from({ length: bars }).map((_, i) => {
        const x = 20 + (i / (bars - 1)) * 360;
        const seed = (i * 137) % 100;
        const height = 15 + (seed / 100) * 55;
        const appeared = ((t / 4) * bars) > i;
        return (
          <rect key={i} x={x - 3} y={110 - (appeared ? height : 0)}
            width="5" height={appeared ? height : 0}
            fill={height > 55 ? '#8a4a3a' : C.accent} opacity={appeared ? 0.8 : 0}
            style={{ transition: 'all 200ms' }} />
        );
      })}
    </svg>
  );
}

// 04 Task queue — HPA scales workers
function PrevQueue({ t }) {
  const depth = Math.sin(t * 1.5) * 40 + 50;
  const workers = Math.max(2, Math.min(8, Math.ceil(depth / 15)));
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
      <text x="20" y="25" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.muted}>
        QUEUE DEPTH
      </text>
      {/* queue bar */}
      <rect x="20" y="35" width="200" height="8" fill="none" stroke={C.line} />
      <rect x="20" y="35" width={depth * 2} height="8" fill={C.accent} />
      <text x="226" y="42" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.cream}>
        {Math.round(depth)}
      </text>

      <text x="20" y="75" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.muted}>
        HPA · WORKERS × {workers}
      </text>
      {Array.from({ length: 8 }).map((_, i) => {
        const active = i < workers;
        return (
          <rect key={i} x={20 + i * 26} y="85" width="20" height="24"
            fill={active ? C.accent : 'none'} stroke={C.line} strokeWidth="1" opacity={active ? 0.85 : 0.3}
            style={{ transition: 'all 300ms' }} />
        );
      })}
      <text x="20" y="130" fontSize="8" fontFamily="JetBrains Mono, monospace" fill={C.muted}>
        AUTOSCALING ON queue_depth
      </text>
    </svg>
  );
}

// 05 Neural net — training loss curves for CNN vs ViT
function PrevNN({ t }) {
  const progress = (t / 4);
  const pts = 60;
  const cnnPath = Array.from({ length: pts }).map((_, i) => {
    const x = 30 + (i / (pts - 1)) * 340;
    const y = 40 + 60 * Math.exp(-i / 20) + Math.sin(i / 3) * 2;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).slice(0, Math.floor(pts * progress)).join(' ');
  const vitPath = Array.from({ length: pts }).map((_, i) => {
    const x = 30 + (i / (pts - 1)) * 340;
    const y = 35 + 70 * Math.exp(-i / 25) + Math.sin(i / 4) * 3;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).slice(0, Math.floor(pts * progress)).join(' ');
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
      <text x="30" y="20" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.muted}>
        TRAINING LOSS — CIFAR-100
      </text>
      <line x1="30" y1="115" x2="370" y2="115" stroke={C.line} strokeWidth="0.5" />
      <line x1="30" y1="30" x2="30" y2="115" stroke={C.line} strokeWidth="0.5" />
      <path d={cnnPath} fill="none" stroke={C.accent} strokeWidth="1.5" />
      <path d={vitPath} fill="none" stroke={C.cream} strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="370" y="55" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.accent} textAnchor="end">— CNN</text>
      <text x="370" y="70" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.cream} textAnchor="end">-- ViT</text>
    </svg>
  );
}

// 06 PCG — ViT judges generated levels
function PrevPCG({ t }) {
  const attempts = 4;
  const phase = (t / 4) * attempts;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
      <text x="20" y="20" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.muted}>
        LLM GEN → VIT JUDGE
      </text>
      {Array.from({ length: attempts }).map((_, i) => {
        const revealed = phase > i;
        const judged = phase > i + 0.5;
        const pass = i === 1 || i === 3;
        return (
          <g key={i}>
            <rect x={20 + i * 95} y="35" width="80" height="65" fill="none" stroke={C.line} strokeWidth="1" />
            {/* tiny level preview as grid */}
            {revealed && Array.from({ length: 6 }).map((_, j) => (
              <rect key={j} x={22 + i * 95 + (j % 3) * 25} y={37 + Math.floor(j / 3) * 30}
                width="22" height="27"
                fill={((i * 7 + j) % 3 === 0) ? C.accent : '#3a352d'}
                opacity="0.7" />
            ))}
            {judged && (
              <text x={60 + i * 95} y="120" fontSize="9" fontFamily="JetBrains Mono, monospace"
                fill={pass ? C.accent : '#c26a52'} textAnchor="middle" letterSpacing="1">
                {pass ? '✓ VALID' : '✗ REJECT'}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// 07 ChatBot — provider failover
function PrevChatBot({ t }) {
  const providers = ['OPENAI', 'GROQ', 'MISTRAL', 'LOCAL'];
  // First provider fails at t=1.5, traffic shifts
  const failedIdx = t > 1.5 && t < 3 ? 0 : -1;
  const activeIdx = failedIdx === 0 ? 1 : 0;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
      <text x="20" y="20" fontSize="9" fontFamily="JetBrains Mono, monospace" fill={C.muted}>
        MULTI-PROVIDER ROUTING
      </text>
      {/* incoming request */}
      <circle cx="30" cy="70" r="4" fill={C.cream}>
        <animate attributeName="cx" values="30;160;30" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="30" y1="70" x2="160" y2="70" stroke={C.line} strokeWidth="0.5" />
      {/* router */}
      <rect x="160" y="55" width="50" height="30" fill="none" stroke={C.cream} strokeWidth="1" />
      <text x="185" y="73" fontSize="8" fontFamily="JetBrains Mono, monospace"
        fill={C.cream} textAnchor="middle">ROUTER</text>
      {providers.map((p, i) => {
        const y = 35 + i * 20;
        const failed = i === failedIdx;
        const active = i === activeIdx;
        return (
          <g key={i}>
            <line x1="210" y1="70" x2="290" y2={y}
              stroke={active ? C.accent : (failed ? '#8a4a3a' : C.line)}
              strokeWidth={active ? 1.5 : 0.5}
              strokeDasharray={failed ? '2 2' : 'none'} opacity={failed ? 0.5 : 1} />
            <rect x="290" y={y - 7} width="80" height="14"
              fill={active ? C.accent : 'none'} stroke={failed ? '#8a4a3a' : C.line} strokeWidth="1" />
            <text x="330" y={y + 3} fontSize="8" fontFamily="JetBrains Mono, monospace"
              fill={active ? C.bg : (failed ? '#c26a52' : C.muted)} textAnchor="middle"
              textDecoration={failed ? 'line-through' : 'none'}>{p}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PrevGeneric({ t }) {
  return <svg width="100%" height="100%" viewBox="0 0 400 140">
    <text x="200" y="75" fontSize="12" fontFamily="Instrument Serif, serif" fontStyle="italic" fill={C.muted} textAnchor="middle">preview</text>
  </svg>;
}

function ProjectBeat({ label, body }) {
  return (
    <div>
      <div style={{ ...S.mono, color: C.accent, fontSize: 10, letterSpacing: '0.32em' }}>{label}</div>
      <div style={{ fontSize: 15, lineHeight: 1.55, color: C.ink2, marginTop: 10, maxWidth: 600 }}>{body}</div>
    </div>
  );
}

Object.assign(window, { Projects, ProjectPreview, ProjectBeat });
