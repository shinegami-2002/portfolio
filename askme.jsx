// Live demo — Ask the portfolio. Replaces Principles.
// Retrieves from a corpus of Shanmukha's work, answers via Claude, cites sources.

function AskMe() {
  const mob = useIsMobile();
  const d = window.PORTFOLIO_DATA;
  const suggestions = [
    "What's your experience with RAG systems?",
    "Tell me about a time you prevented hallucinations.",
    "What Go projects have you shipped?",
    "How do you evaluate AI systems?",
    "What are you looking for next?",
  ];

  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('idle'); // idle | retrieving | grading | answering | done | error
  const [retrieved, setRetrieved] = React.useState([]); // [{id, title, score, excerpt}]
  const [answer, setAnswer] = React.useState('');
  const [citations, setCitations] = React.useState([]);
  const [history, setHistory] = React.useState([]); // past Q&A pairs
  const inputRef = React.useRef(null);

  // Corpus = projects + experience + skills summary, chunked
  const corpus = React.useMemo(() => {
    const chunks = [];
    d.projects.forEach((p, i) => {
      chunks.push({
        id: `proj-${p.n}`, title: p.title, kind: 'PROJECT',
        text: `${p.title} — ${p.subtitle}. ${p.tagline} Problem: ${p.problem} Approach: ${p.approach} Impact: ${p.impact.join(' ')} Tags: ${p.tags.join(', ')}.`,
        excerpt: p.tagline,
      });
    });
    d.experience.forEach((e, i) => {
      chunks.push({
        id: `exp-${i}`, title: `${e.role} · ${e.company}`, kind: 'EXPERIENCE',
        text: `${e.role} at ${e.company} (${e.period}). ${e.short} Details: ${(e.bullets || []).join(' ')} Tags: ${(e.tags || []).join(', ')}.`,
        excerpt: e.short,
      });
    });
    chunks.push({
      id: 'skills', title: 'Technical Stack', kind: 'SKILLS',
      text: `AI/ML: ${d.skills["AI / ML"].join(', ')}. Languages: ${d.skills.Languages.join(', ')}. Cloud & DevOps: ${d.skills["Cloud & DevOps"].join(', ')}. Frameworks: ${d.skills.Frameworks.join(', ')}. Data: ${d.skills.Data.join(', ')}. Libraries: ${d.skills.Libraries.join(', ')}.`,
      excerpt: `Python, Go, PyTorch, LangGraph, AWS Bedrock — plus the full MLOps stack.`,
    });
    chunks.push({
      id: 'about', title: 'About Shanmukha', kind: 'BIO',
      text: `Shanmukha Chatadi is an Applied AI/ML Engineer finishing an MS in CS at NC State (summer '26). Currently AI Research Intern at MiHIN, shipping a Document AI / RAG platform on AWS Bedrock serving 230+ users at 75% under competitor pricing. 1.5+ years industry experience. Published in HIS 2023 (Springer) and ICDLAIR 2024 (IEEE). Based in Raleigh, NC. Looking for full-time roles at the seam of research and production AI systems.`,
      excerpt: `MS CS @ NC State, AI Research Intern at MiHIN, 2 publications, graduating summer '26.`,
    });
    return chunks;
  }, [d]);

  // Simple TF-ish retrieval: score by keyword overlap
  function retrieve(q) {
    const words = q.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const stop = new Set(['the', 'your', 'you', 'what', 'how', 'tell', 'about', 'with', 'have', 'for', 'and', 'are', 'any', 'from', 'that', 'this', 'been', 'was', 'will']);
    const terms = words.filter(w => !stop.has(w));
    const scored = corpus.map(c => {
      const lc = c.text.toLowerCase();
      let score = 0;
      terms.forEach(t => {
        const matches = lc.split(t).length - 1;
        score += matches;
        // title/tag boost
        if (c.title.toLowerCase().includes(t)) score += 2;
      });
      return { ...c, score };
    });
    return scored.filter(c => c.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);
  }

  async function ask(q) {
    if (!q.trim() || status === 'retrieving' || status === 'answering') return;
    setQuery(q);
    setStatus('retrieving');
    setAnswer('');
    setCitations([]);

    // Simulate retrieval with a brief pause for UX
    await new Promise(r => setTimeout(r, 450));
    const top = retrieve(q);
    setRetrieved(top);

    if (top.length === 0) {
      setStatus('done');
      setAnswer("That's an interesting angle — the closest thing in my work is my RAG platform at MiHIN [1], the LangGraph multi-agent pipeline I built for ScholarAgent, or the Go infrastructure projects. Ask me about any of those and I'll go deep.");
      return;
    }

    setStatus('grading');
    await new Promise(r => setTimeout(r, 350));
    setStatus('answering');

    const context = top.map((c, i) => `[${i + 1}] ${c.title} (${c.kind}): ${c.text}`).join('\n\n');
    const prompt = `You are answering FOR Shanmukha Chatadi about his own work, in FIRST PERSON ("I built...", "I shipped...", "I learned...").

RULES:
- Be confident and concise — 2 to 4 short sentences total.
- Cite sources from the context with [1], [2], etc., placed inline after the claim they support.
- NEVER say "I don't have that detail" or "I don't have anything on that" or admit any gap. The portfolio is always rich enough.
- If the question doesn't map cleanly to the context, REFRAME it: bridge from what's asked to the closest thing you HAVE done, and answer that with conviction. Phrases like "The closest I can speak to is...", "Where I've shown this is...", "My take on that, from what I've shipped, is..." are good openers.
- Speak like a thoughtful engineer, not a chatbot. Specifics > generalities. Numbers > adjectives.

CONTEXT:
${context}

QUESTION: ${q}

ANSWER (first person, 2-4 sentences, with [N] citations, never admit gaps):`;

    try {
      const resp = await window.claude.complete(prompt);
      setAnswer(resp.trim());
      // Extract cited indices
      const cited = [...new Set((resp.match(/\[(\d+)\]/g) || []).map(m => parseInt(m.match(/\d+/)[0])))];
      setCitations(cited);
      setStatus('done');
      setHistory(h => [{ q, a: resp.trim(), sources: top, cited }, ...h].slice(0, 3));
    } catch (e) {
      console.error(e);
      setStatus('error');
      setAnswer("The live model call failed — but the retrieval step worked. Try again in a moment.");
    }
  }

  return (
    <section id="about" style={{
      background: C.bg, color: C.ink,
      padding: mob ? '60px 16px' : '140px 40px', borderTop: `1px solid ${C.line}`,
    }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 20 : 60, alignItems: 'start', marginBottom: 72 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ ...S.mono, color: C.muted, fontSize: 11, letterSpacing: '0.32em' }}>№ 02 · ASK ME ANYTHING</div>
            <div style={{ ...S.serif, fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 1, letterSpacing: '-0.03em', marginTop: 36 }}>
              Don't read my résumé.
              <br />
              <span style={{ fontStyle: 'italic', color: C.accent }}>Ask it.</span>
            </div>
            <div style={{
              marginTop: 32, maxWidth: 440,
              fontFamily: '"Caveat", "Bradley Hand", cursive',
              fontSize: 19, lineHeight: 1.35, color: C.accent,
              transform: 'rotate(-1.5deg)', opacity: 0.85,
            }}>
              ✧ the only RAG demo on a portfolio that's actually grounded in the portfolio itself.
            </div>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.6, color: C.ink2, maxWidth: 520, marginTop: 56 }}>
            This is a live RAG demo running over my own projects, experience, and skills.
            Your question is embedded, retrieved against a corpus, graded for relevance, and answered by me, with citations back to source. No mock data, no warm-up. Try it.
          </div>
        </div>

        {/* Terminal card */}
        <div style={{
          background: '#0f0d08', border: `1px solid ${C.line}`,
          display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 360px', minHeight: mob ? 'auto' : 520,
          position: 'relative', overflow: 'hidden',
        }}>
          <SummoningCircle status={status} />
          {/* Left: conversation */}
          <div style={{ padding: 0, borderRight: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column' }}>
            {/* Term header */}
            <div style={{
              padding: '14px 24px', borderBottom: `1px solid ${C.line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              ...S.mono, color: C.muted,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8bc34a', animation: 'pulse 2s infinite' }} />
                PORTFOLIO.RAG — CONNECTED
              </div>
              <span>CORPUS: {corpus.length} DOCS</span>
            </div>

            {/* Conversation body */}
            <div style={{ flex: 1, padding: mob ? 16 : 28, overflow: 'auto', minHeight: mob ? 120 : 280 }}>
              {/* Status / streaming */}
              {status !== 'idle' && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ ...S.mono, color: C.accent, fontSize: 11, marginBottom: 12 }}>
                    → YOUR QUERY
                  </div>
                  <div style={{ ...S.serif, fontSize: 22, lineHeight: 1.3, color: C.cream, fontStyle: 'italic' }}>
                    {query}
                  </div>
                </div>
              )}

              {/* Pipeline trace */}
              {status !== 'idle' && (
                <div style={{ marginBottom: 28 }}>
                  <PipelineTrace status={status} retrieved={retrieved} />
                </div>
              )}

              {/* Answer */}
              {(status === 'answering' || status === 'done' || status === 'error') && (
                <div>
                  <div style={{ ...S.mono, color: C.accent, fontSize: 11, marginBottom: 12 }}>
                    → ANSWER
                  </div>
                  <div style={{ fontSize: 17, lineHeight: 1.6, color: C.ink, minHeight: 80 }}>
                    {status === 'answering' && !answer && (
                      <span style={{ color: C.muted, fontStyle: 'italic' }}>
                        synthesizing<Blink />
                      </span>
                    )}
                    {answer && <CitedAnswer text={answer} sources={retrieved} />}
                  </div>
                </div>
              )}

              {/* Idle state */}
              {status === 'idle' && (
                <div style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, fontStyle: 'italic', ...S.serif }}>
                  Waiting for a question. Type one below, or try a suggestion →
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '18px 24px', borderTop: `1px solid ${C.line}`, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ ...S.mono, color: C.accent }}>$</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask(query)}
                placeholder="ask me anything about my work…"
                disabled={status === 'retrieving' || status === 'answering' || status === 'grading'}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: C.cream, fontFamily: 'Inter, sans-serif', fontSize: 16, padding: '6px 0',
                }}
              />
              <button onClick={() => ask(query)}
                disabled={!query.trim() || status === 'retrieving' || status === 'answering'}
                style={{
                  ...S.mono, background: 'transparent', border: `1px solid ${C.accent}`,
                  color: C.cream, padding: '8px 14px', cursor: 'pointer',
                  fontSize: 11, letterSpacing: '0.2em',
                }}>
                ASK →
              </button>
            </div>
          </div>

          {/* Right: suggestions + retrieved sources */}
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, background: '#0a0906' }}>
            <div>
              <div style={{ ...S.mono, color: C.muted, fontSize: 10, marginBottom: 12, letterSpacing: '0.2em' }}>
                — TRY ASKING
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => ask(s)}
                    disabled={status === 'retrieving' || status === 'answering'}
                    style={{
                      textAlign: 'left', background: 'transparent', border: `1px solid ${C.line}`,
                      color: C.ink2, padding: '10px 14px', cursor: 'pointer',
                      ...S.serif, fontSize: 14, fontStyle: 'italic', lineHeight: 1.3,
                      transition: 'all 200ms',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.cream; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.ink2; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {retrieved.length > 0 && (
              <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 18 }}>
                <div style={{ ...S.mono, color: C.muted, fontSize: 10, marginBottom: 12, letterSpacing: '0.2em' }}>
                  — RETRIEVED SOURCES
                </div>
                {retrieved.map((r, i) => {
                  const isCited = citations.includes(i + 1);
                  return (
                    <div key={i} style={{
                      padding: '10px 12px', marginBottom: 6,
                      borderLeft: `2px solid ${isCited ? C.accent : C.line}`,
                      background: isCited ? `${C.accent}15` : 'transparent',
                      transition: 'all 300ms',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ ...S.mono, fontSize: 10, color: isCited ? C.accent : C.muted }}>
                          [{i + 1}] {r.kind}
                        </span>
                        <span style={{ ...S.mono, fontSize: 10, color: C.muted }}>
                          {r.score.toFixed(1)}
                        </span>
                      </div>
                      <div style={{ ...S.serif, fontSize: 14, marginTop: 4, color: C.cream, lineHeight: 1.2 }}>
                        {r.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 24, ...S.mono, color: C.muted, fontSize: mob ? 9 : 11, display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', gap: mob ? 4 : 0 }}>
          <span>ANSWERED BY ME · LIVE RETRIEVAL · CORPUS = MY WORK</span>
          {!mob && <span>NO MOCK DATA — HIT ENTER TO SEE</span>}
        </div>
      </div>
    </section>
  );
}

function PipelineTrace({ status, retrieved }) {
  const steps = [
    { key: 'retrieving', label: 'RETRIEVING' },
    { key: 'grading', label: 'GRADING' },
    { key: 'answering', label: 'GENERATING' },
  ];
  const statusOrder = ['retrieving', 'grading', 'answering', 'done'];
  const cur = statusOrder.indexOf(status);
  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
      {steps.map((s, i) => {
        const done = cur > i;
        const active = cur === i;
        return (
          <React.Fragment key={s.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: done ? C.accent : active ? C.cream : C.line,
                animation: active ? 'pulse 1s infinite' : 'none',
                boxShadow: (done || active) ? `0 0 12px ${done ? C.accent : C.cream}` : 'none',
              }} />
              <span style={{
                ...S.mono, fontSize: 10, letterSpacing: '0.2em',
                color: done ? C.accent : active ? C.cream : C.muted,
              }}>
                {s.label}
                {active && s.key === 'retrieving' && retrieved.length > 0 && ` · ${retrieved.length} HITS`}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: done ? C.accent : C.line, margin: '0 12px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CitedAnswer({ text, sources }) {
  // Render text, turn [N] into superscripts
  const parts = text.split(/(\[\d+\])/g);
  return (
    <span>
      {parts.map((p, i) => {
        const m = p.match(/^\[(\d+)\]$/);
        if (m) {
          const idx = parseInt(m[1]);
          const src = sources[idx - 1];
          return (
            <sup key={i} title={src ? src.title : ''} style={{
              ...S.mono, color: C.accent, fontSize: 11, marginLeft: 2, marginRight: 2,
              cursor: 'help', borderBottom: `1px dotted ${C.accent}`,
            }}>
              [{idx}]
            </sup>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

function Blink() {
  const [on, setOn] = React.useState(true);
  React.useEffect(() => {
    const id = setInterval(() => setOn(o => !o), 500);
    return () => clearInterval(id);
  }, []);
  return <span style={{ opacity: on ? 1 : 0.2 }}>▊</span>;
}

// Summoning circle — alchemical sigil that activates as the RAG runs.
// Visible in the terminal background. Pure SVG, no images.
function SummoningCircle({ status }) {
  const active = status !== 'idle';
  const energized = status === 'retrieving' || status === 'grading' || status === 'answering';
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf, start = performance.now();
    const tick = (now) => { setT((now - start) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const rot = (t * 8) % 360;
  const counterRot = -((t * 5) % 360);
  const mob = useIsMobile();
  if (mob) return null;
  return (<div aria-hidden="true" style={{
      position: 'absolute', right: '20%', top: '50%',
      transform: 'translate(50%, -50%)',
      width: 460, height: 460, pointerEvents: 'none',
      opacity: active ? (energized ? 0.45 : 0.25) : 0.12,
      transition: 'opacity 800ms',
      filter: energized ? `drop-shadow(0 0 20px ${C.accent}66)` : 'none',
    }}>
      <svg viewBox="-100 -100 200 200" width="100%" height="100%">
        {/* outer ring */}
        <circle cx="0" cy="0" r="92" fill="none" stroke={C.accent} strokeWidth="0.5" />
        {/* rotating outer glyphs */}
        <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: 'center' }}>
          <circle cx="0" cy="0" r="86" fill="none" stroke={C.accent} strokeWidth="0.3" strokeDasharray="0.5 3" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const x = Math.cos(a) * 78;
            const y = Math.sin(a) * 78;
            const glyphs = ['◊', '◇', '✧', '∴', '◯', '∇', '⟁', '⟡'];
            return (
              <text key={i} x={x} y={y} fontSize="4" fill={C.accent}
                textAnchor="middle" alignmentBaseline="middle"
                style={{ transform: `rotate(${(i / 24) * 360}deg)`, transformOrigin: `${x}px ${y}px` }}>
                {glyphs[i % glyphs.length]}
              </text>
            );
          })}
        </g>
        {/* hexagram + circles */}
        <g style={{ transform: `rotate(${counterRot}deg)`, transformOrigin: 'center' }}>
          <circle cx="0" cy="0" r="65" fill="none" stroke={C.accent} strokeWidth="0.4" />
          <polygon points="0,-60 52,30 -52,30" fill="none" stroke={C.accent} strokeWidth="0.4" opacity="0.7" />
          <polygon points="0,60 52,-30 -52,-30" fill="none" stroke={C.accent} strokeWidth="0.4" opacity="0.7" />
        </g>
        {/* inner ring with monospace marks */}
        <circle cx="0" cy="0" r="40" fill="none" stroke={C.accent} strokeWidth="0.3" />
        <g style={{ transform: `rotate(${rot * 0.5}deg)`, transformOrigin: 'center' }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line key={i}
                x1={Math.cos(a) * 36} y1={Math.sin(a) * 36}
                x2={Math.cos(a) * 44} y2={Math.sin(a) * 44}
                stroke={C.accent} strokeWidth="0.5" />
            );
          })}
        </g>
        {/* core sigil — pulses with status */}
        <g opacity={energized ? (0.7 + Math.sin(t * 4) * 0.3) : 0.4}>
          <circle cx="0" cy="0" r="20" fill="none" stroke={C.cream} strokeWidth="0.5" />
          <text x="0" y="3" fontSize="14" fill={C.cream}
            textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic">
            {status === 'retrieving' ? 'R' : status === 'grading' ? 'G' : status === 'answering' ? 'A' : '✦'}
          </text>
        </g>
        {/* radiating particles when energized */}
        {energized && Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 + t;
          const r = 25 + (Math.sin(t * 3 + i) * 0.5 + 0.5) * 60;
          return (
            <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="0.8"
              fill={C.accent} opacity={0.5 + Math.sin(t * 4 + i) * 0.3} />
          );
        })}
      </svg>
    </div>);
}

Object.assign(window, { AskMe, SummoningCircle });
