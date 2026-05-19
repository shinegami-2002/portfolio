// CV, Stack, Contact — editorial finale

function Stats() {
  const mob = useIsMobile();
  const items = [
    { n: 230, suf: '+', label: 'Users on RAG platform' },
    { n: 75, suf: '%', label: 'Cost reduction vs competitors' },
    { n: 50, suf: '+', label: 'Research papers queried daily' },
    { n: 3.92, suf: '/4', label: 'GPA at NC State' },
  ];
  return (
    <section style={{ background: C.cream, color: C.bg, padding: mob ? '60px 16px' : '140px 40px', borderTop: `1px solid ${C.bg}` }}>
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ ...S.mono, color: C.bg, opacity: 0.6 }}>№ 03 / BY THE NUMBERS</div>
        <Fade>
          <div style={{ ...S.serif, fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 1, marginTop: 16, maxWidth: 1200 }}>
            The measured <em style={{ color: C.neon }}>footprint</em> of the last eighteen months.
          </div>
        </Fade>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 40, marginTop: 100 }}>
          {items.map((it, i) => (
            <Fade key={i} delay={i * 100}>
              <div style={{ borderTop: `1px solid ${C.bg}`, paddingTop: 20 }}>
                <div style={{ ...S.serif, fontSize: 'clamp(40px, 10vw, 160px)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
                  <Counter to={it.n} suffix={it.suf} />
                </div>
                <div style={{ ...S.mono, marginTop: 20, color: C.bg, opacity: 0.7 }}>{it.label}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function CV() {
  const mob = useIsMobile();
  const d = window.PORTFOLIO_DATA;
  return (
    <section id="cv" style={{ background: C.bg, color: C.ink, padding: mob ? '60px 16px 60px' : '160px 40px 100px' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ ...S.mono, color: C.muted }}>№ 04 / CURRICULUM</div>
        <Fade>
          <div style={{ ...S.serif, fontSize: 'clamp(36px, 10vw, 160px)', lineHeight: 0.9, letterSpacing: '-0.04em', marginTop: 16 }}>
            The <em style={{ color: C.accent }}>paper</em> trail.
          </div>
        </Fade>

        {/* Experience */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '200px 1fr', gap: mob ? 20 : 80, marginTop: 140, borderTop: `1px solid ${C.line}`, paddingTop: 60 }}>
          <div style={{ ...S.mono, color: C.muted, position: mob ? 'relative' : 'sticky', top: mob ? 'auto' : 120, alignSelf: 'start' }}>
            — EXPERIENCE
          </div>
          <div>
            {d.experience.map((e, i) => (
              <Fade key={i} delay={i * 60}>
                <div style={{
                  display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 240px', gap: mob ? 8 : 32,
                  padding: mob ? '24px 0' : '40px 0', borderBottom: `1px solid ${C.line}`, alignItems: 'baseline',
                }}>
                  <div>
                    <div style={{ ...S.serif, fontSize: mob ? 24 : 36, lineHeight: 1.1 }}>{e.role}</div>
                    <div style={{ ...S.mono, color: C.accent, marginTop: 10, fontSize: mob ? 10 : 11 }}>{e.company} · {e.location}</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0' }}>
                      {(e.bullets || []).map((b, j) => (
                        <li key={j} style={{ display: 'flex', gap: 12, padding: '6px 0', fontSize: mob ? 13 : 15, lineHeight: 1.55, color: C.ink2 }}>
                          <span style={{ color: C.accent, flexShrink: 0 }}>→</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ ...S.mono, color: C.muted, textAlign: mob ? 'left' : 'right', fontSize: mob ? 10 : 11, order: mob ? -1 : 0 }}>{e.period}</div>
                </div>
              </Fade>
            ))}
          </div>
        </div>

        {/* Education */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '200px 1fr', gap: mob ? 20 : 80, marginTop: 100, borderTop: `1px solid ${C.line}`, paddingTop: 60 }}>
          <div style={{ ...S.mono, color: C.muted, position: mob ? 'relative' : 'sticky', top: mob ? 'auto' : 120, alignSelf: 'start' }}>— EDUCATION</div>
          <div>
            {d.education.map((ed, i) => (
              <Fade key={i}>
                <div style={{ padding: '32px 0', borderBottom: `1px solid ${C.line}` }}>
                  <div style={{ ...S.serif, fontSize: 32 }}>{ed.degree}</div>
                  <div style={{ ...S.mono, color: C.accent, marginTop: 8 }}>{ed.school}</div>
                  <div style={{ ...S.mono, color: C.muted, marginTop: 6 }}>{ed.detail}</div>
                  {ed.courses && (
                    <div style={{ fontSize: 14, color: C.ink2, marginTop: 14, maxWidth: 780 }}>
                      {ed.courses.join(' · ')}
                    </div>
                  )}
                </div>
              </Fade>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '200px 1fr', gap: mob ? 20 : 80, marginTop: 100, borderTop: `1px solid ${C.line}`, paddingTop: 60 }}>
          <div style={{ ...S.mono, color: C.muted, position: mob ? 'relative' : 'sticky', top: mob ? 'auto' : 120, alignSelf: 'start' }}>— STACK</div>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)', gap: 40 }}>
            {Object.entries(d.skills).map(([cat, items], i) => (
              <Fade key={cat} delay={i * 40}>
                <div>
                  <div style={{ ...S.mono, color: C.accent, marginBottom: 14 }}>{cat}</div>
                  <div style={{ ...S.serif, fontSize: 20, lineHeight: 1.5, color: C.ink }}>
                    {items.join(' · ')}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>

        {/* Publications */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '200px 1fr', gap: mob ? 20 : 80, marginTop: 100, borderTop: `1px solid ${C.line}`, paddingTop: 60 }}>
          <div style={{ ...S.mono, color: C.muted, position: mob ? 'relative' : 'sticky', top: mob ? 'auto' : 120, alignSelf: 'start' }}>— PAPERS</div>
          <div>
            {d.publications.map((pub, i) => (
              <Fade key={i}>
                <div style={{ padding: '28px 0', borderBottom: `1px solid ${C.line}` }}>
                  <div style={{ ...S.serif, fontSize: 26, lineHeight: 1.3 }}>{pub.title}</div>
                  <div style={{ ...S.mono, color: C.muted, marginTop: 10 }}>{pub.venue} · {pub.year}</div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const mob = useIsMobile();
  const d = window.PORTFOLIO_DATA;
  const ref = React.useRef(null), p = useScrollP(ref);
  return (
    <section id="contact" ref={ref} style={{ position: 'relative', minHeight: '100vh', background: C.bg, color: C.ink, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${d.images.abstract})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transform: `scale(1.1) translateY(${(p - 0.5) * 120}px)`,
        opacity: 0.4, filter: 'contrast(1.1)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.bg} 0%, rgba(10,9,6,0.7) 40%, ${C.bg} 100%)` }} />

      <div style={{ position: 'relative', padding: mob ? '60px 16px 60px' : '180px 40px 100px', maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ ...S.mono, color: C.muted }}>№ 05 / CONTACT</div>
        <Fade>
          <div style={{ ...S.serif, fontSize: 'clamp(36px, 14vw, 240px)', lineHeight: 0.85, letterSpacing: '-0.05em', marginTop: 24 }}>
            Let's <em style={{ color: C.accent }}>talk.</em>
          </div>
        </Fade>

        <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.5fr 1fr', gap: 60, alignItems: 'end' }}>
          <Fade delay={200}>
            <div style={{ ...S.serif, fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: 1.3, fontStyle: 'italic', color: C.ink, maxWidth: 900 }}>
              If you're building agentic systems, research-to-ship pipelines, or AI infrastructure that needs to be honest. I'd love to hear from you.
            </div>
          </Fade>
          <Fade delay={400}>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { k: 'EMAIL', v: d.contact.email, h: `mailto:${d.contact.email}` },
                { k: 'LINKEDIN', v: d.contact.linkedin, h: `https://${d.contact.linkedin}` },
                { k: 'GITHUB', v: d.contact.github, h: `https://${d.contact.github}` },
                { k: 'LOCATION', v: 'Raleigh, NC', h: '#' },
              ].map(l => (
                <a key={l.k} href={l.h} target="_blank" rel="noreferrer" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', borderBottom: `1px solid ${C.line}`,
                  ...S.mono, color: C.ink, textDecoration: 'none',
                }}>
                  <span style={{ color: C.muted }}>{l.k}</span>
                  <span style={{ color: C.ink }}>{l.v} ↗</span>
                </a>
              ))}
            </div>
          </Fade>
        </div>

        <div style={{ marginTop: mob ? 60 : 140, display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', alignItems: mob ? 'center' : 'baseline', gap: mob ? 16 : 0, ...S.mono, color: C.muted, textAlign: mob ? 'center' : undefined }}>
          <span>© MMXXVI · SHANMUKHA CHATADI</span>
          <span style={{ ...S.serif, fontSize: 32, fontStyle: 'italic', color: C.accent, letterSpacing: 0 }}>fin.</span>
          <span>DESIGNED & BUILT BY HAND</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Stats, CV, Contact });
