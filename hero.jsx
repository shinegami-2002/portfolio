// Hero + Principles + Kinetic marquee — clean rebuild

function Nav({ p }) {
  const mob = useIsMobile();
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '20px clamp(16px, 5vw, 40px)',
      background: `linear-gradient(180deg, ${C.bg}f0, ${C.bg}b0 60%, transparent)`,
      color: C.ink, pointerEvents: 'none',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1800, margin: '0 auto', pointerEvents: 'auto' }}>
        <div style={{ ...S.mono, display: 'flex', alignItems: 'baseline', gap: 14, fontSize: 11, letterSpacing: '0.28em' }}>
          <span style={{ ...S.serif, fontSize: 26, fontStyle: 'italic', letterSpacing: 0, color: C.accent }}>s.</span>
          <span style={{ color: C.ink2 }}>CHATADI</span>
          <span style={{ color: C.muted }}>—</span>
          <span style={{ color: C.muted }}>2026</span>
        </div>
        <div style={{ display: mob ? 'none' : 'flex', gap: 36, ...S.mono, color: C.ink2, fontSize: 11, letterSpacing: '0.24em' }}>
          <a href="#work" style={{ color: 'inherit', textDecoration: 'none' }}>WORK</a>
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>ABOUT</a>
          <a href="#cv" style={{ color: 'inherit', textDecoration: 'none' }}>CV</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>CONTACT</a>
        </div>
        <div style={{ ...S.mono, display: 'flex', alignItems: 'center', gap: 8, color: C.ink2, fontSize: mob ? 9 : 11, letterSpacing: '0.24em' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#8bc34a', boxShadow: '0 0 8px #8bc34a' }} />
          {mob ? 'OPEN' : 'OPEN TO WORK'}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: C.line }}>
        <div style={{ height: '100%', width: `${p * 100}%`, background: C.accent, transition: 'width 80ms linear' }} />
      </div>
    </div>
  );
}

function NowPlaying() {
  const items = [
    { label: 'NOW', text: 'Shipping a RAG platform at MiHIN — 230+ users, AWS Bedrock' },
    { label: 'BUILDING', text: 'A LangGraph agent that grades its own retrievals' },
    { label: 'LEARNING', text: 'Distributed systems — Go services, K8s HPA, queue theory' },
    { label: 'WRITING', text: 'Published in HIS 2023 (Springer) · ICDLAIR 2024 (IEEE)' },
    { label: 'NEXT', text: 'Graduating summer \'26 — full-time Applied AI/ML roles' },
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % items.length), 3200);
    return () => clearInterval(id);
  }, []);
  const cur = items[idx];
  return (
    <div style={{
      marginTop: 48, maxWidth: 760,
      borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
      padding: '14px 0', display: 'flex', alignItems: 'center', gap: 20,
      ...S.mono, fontSize: 12, color: C.ink2,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, animation: 'pulse 1.4s infinite', boxShadow: `0 0 10px ${C.accent}` }} />
        <span style={{ color: C.accent, letterSpacing: '0.2em' }}>{cur.label}</span>
      </div>
      <div style={{ width: 1, height: 14, background: C.line, flexShrink: 0 }} />
      <div key={idx} style={{
        color: C.cream, fontFamily: 'Inter, sans-serif', fontSize: 14, letterSpacing: '0',
        animation: 'fadeInUp 500ms ease-out',
      }}>
        {cur.text}
      </div>
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function Hero() {
  const mob = useIsMobile();
  const d = window.PORTFOLIO_DATA;
  const ref = React.useRef(null);
  const p = useScrollP(ref);
  return (
    <section ref={ref} style={{
      position: 'relative', minHeight: '100vh', background: C.bg, color: C.ink, overflow: 'hidden',
    }}>
      {/* Background image — bottom-right, atmospheric only */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
        backgroundImage: `url(${d.images.nebula})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transform: `scale(${1 + p * 0.15}) translateY(${p * 50}px)`,
        opacity: 0.22,
        maskImage: `radial-gradient(ellipse at 75% 55%, black 0%, transparent 72%)`,
        WebkitMaskImage: `radial-gradient(ellipse at 75% 55%, black 0%, transparent 72%)`,
        willChange: 'transform',
      }} />

      {/* Portrait — sits to the right of the headline, Polaroid frame */}
      <div style={{
        position: mob ? 'relative' : 'absolute',
        top: mob ? 'auto' : '28%',
        right: mob ? 'auto' : 'max(220px, 18vw)',
        zIndex: 3,
        width: mob ? '160px' : 'min(240px, 18vw)',
        margin: mob ? '80px auto 0' : undefined,
        transform: mob ? 'rotate(2deg)' : `translateY(${p * -30}px) rotate(3deg)`,
        animation: 'fadeUp 1400ms cubic-bezier(.2,.8,.2,1) 400ms forwards',
        opacity: 0,
      }}>
        <div style={{
          background: C.cream, padding: '14px 14px 56px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.3)',
        }}>
          <img src="photos/me.jpeg" alt="Shanmukha Chatadi" style={{
            width: '100%', display: 'block', filter: 'saturate(0.95) contrast(1.02)',
          }} />
          <div style={{
            position: 'absolute', bottom: 18, left: 14, right: 14,
            fontFamily: '"Caveat", "Bradley Hand", cursive', fontSize: 18,
            color: C.bg, textAlign: 'center', letterSpacing: 0,
          }}>
            grad day · NC State '26
          </div>
        </div>
        {/* Tape strip */}
        <div style={{
          position: 'absolute', top: -10, left: '50%',
          transform: 'translateX(-50%) rotate(-3deg)',
          width: 90, height: 22,
          background: 'rgba(244, 237, 225, 0.35)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 2,
        padding: mob ? '100px 20px 40px' : '140px 60px 60px',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        maxWidth: 1800, margin: '0 auto',
      }}>
        {/* Top: small metadata strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', ...S.mono, color: C.muted, fontSize: 11, letterSpacing: '0.3em' }}>
          <span>№ 01 — INDEX</span>
          <span>RALEIGH, NC</span>
          <span>MMXXVI</span>
        </div>

        {/* Center: name as headline, role as the line beneath */}
        <div style={{ marginTop: '6vh', maxWidth: 1600 }}>
          <Fade>
            <div style={{ ...S.mono, color: C.accent, fontSize: 12, letterSpacing: '0.32em' }}>
              ✦ PORTFOLIO · MMXXVI
            </div>
          </Fade>

          <div style={{
            ...S.serif,
            fontSize: 'clamp(36px, 11.5vw, 200px)',
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
            marginTop: 36,
            color: C.cream,
            fontWeight: 400,
          }}>
            <Fade delay={120}><div>Shanmukha</div></Fade>
            <Fade delay={260}>
              <div>
                <span style={{ fontStyle: 'italic', color: C.accent }}>Chatadi</span><span style={{ color: C.cream }}>.</span>
              </div>
            </Fade>
          </div>

          <Fade delay={460}>
            <div style={{
              marginTop: 40, paddingTop: 22,
              borderTop: `1px solid ${C.line}`,
              display: 'flex', alignItems: 'baseline', gap: 28, flexWrap: 'wrap',
              maxWidth: 1100,
            }}>
              <div style={{
                ...S.mono, color: C.cream, fontSize: 13, letterSpacing: '0.22em',
              }}>
                APPLIED AI/ML ENGINEER
              </div>
              <div style={{
                ...S.serif, fontStyle: 'italic', color: C.muted, fontSize: 18, letterSpacing: 0,
              }}>
                NC State M.S. Computer Science · Class of ’26
              </div>
            </div>
          </Fade>
        </div>

        {/* Bottom: now playing only — quiet, single line */}
        <Fade delay={700}>
          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 24 }}>
            <NowPlaying />
            <div style={{
              ...S.mono, color: C.muted, marginTop: 28, fontSize: 11, letterSpacing: '0.3em',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8bc34a' }} />
                AVAILABLE FROM SUMMER ’26
              </span>
              <span style={{ ...S.serif, fontStyle: 'italic', fontSize: 14, letterSpacing: 0, color: C.muted }}>
                scroll to read on
              </span>
              <span>VOL. I · FOUR CHAPTERS</span>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

function Kinetic() {
  const row1 = ['AGENTIC AI', '✦', 'RAG AT SCALE', '✦', 'PRODUCTION LLM', '✦', 'VECTOR SEARCH', '✦', 'LANGGRAPH', '✦', 'AWS BEDROCK', '✦', 'MULTI-AGENT', '✦'];
  return (
    <div style={{ background: C.cream, color: C.bg, padding: '50px 0', borderTop: `1px solid ${C.bg}`, borderBottom: `1px solid ${C.bg}`, overflow: 'hidden' }}>
      <Marq speed={70}>
        {row1.concat(row1).map((t, i) => (
          <span key={i} style={{
            ...S.serif, fontSize: 'clamp(50px, 8vw, 120px)', lineHeight: 1, padding: '0 32px',
            color: t === '✦' ? C.accent : C.bg, fontStyle: i % 4 === 2 ? 'italic' : 'normal',
          }}>{t}</span>
        ))}
      </Marq>
    </div>
  );
}

// Principles — three alternating panels with full-bleed imagery
function Manifesto() {
  const mob = useIsMobile();
  const d = window.PORTFOLIO_DATA;
  const items = [
    { n: '01', word: 'Research', italic: 'that ships.', body: 'Most research dies on a notebook. I take it the rest of the way — through deployment, monitoring, and the messy feedback loops that separate a demo from a product.', image: d.images.data },
    { n: '02', word: 'Systems', italic: 'over models.', body: 'Any model is three months from obsolete. The system around it — retrieval, grounding, evaluation, fallbacks — is what actually keeps working when the world changes.', image: d.images.grid },
    { n: '03', word: 'Honest', italic: 'outputs.', body: 'Hallucination isn\'t a UX problem — it\'s an architecture problem. Grading, corrective loops, and claim-level verification are non-negotiable, not afterthoughts.', image: d.images.abstract },
  ];
  return (
    <section id="about" style={{ background: C.bg, color: C.ink }}>
      <div style={{ padding: '120px 60px 40px', maxWidth: 1800, margin: '0 auto' }}>
        <div style={{ ...S.mono, color: C.muted }}>№ 02 · PRINCIPLES</div>
        <Fade>
          <div style={{ ...S.serif, fontSize: 'clamp(28px, 6vw, 96px)', lineHeight: 1, letterSpacing: '-0.03em', marginTop: 20, maxWidth: 1200 }}>
            Three rules I <em style={{ color: C.accent }}>design against</em>.
          </div>
        </Fade>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
          borderTop: `1px solid ${C.line}`,
        }}>
          {/* Text panel */}
          <div style={{
            padding: mob ? '40px 20px' : '100px 60px',
            order: i % 2 === 0 ? 1 : 2,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 560,
          }}>
            <Fade>
              <div style={{ ...S.mono, color: C.accent, marginBottom: 28 }}>PRINCIPLE № {item.n}</div>
              <div style={{ ...S.serif, fontSize: 'clamp(32px, 6vw, 104px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
                {item.word}<br/>
                <span style={{ fontStyle: 'italic', color: C.accent }}>{item.italic}</span>
              </div>
              <div style={{ marginTop: 32, fontSize: 18, lineHeight: 1.6, color: C.ink2, maxWidth: 520 }}>
                {item.body}
              </div>
            </Fade>
          </div>
          {/* Image panel */}
          <div style={{
            order: i % 2 === 0 ? 2 : 1, minHeight: mob ? 300 : 560,
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(10,9,6,0.3), rgba(10,9,6,0.5))` }} />
            <div style={{ position: 'absolute', top: 32, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', ...S.mono, color: C.cream }}>
              <span>№ {item.n}</span>
              <span>— {item.word.toUpperCase()}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

Object.assign(window, { Nav, Hero, Kinetic, Manifesto });