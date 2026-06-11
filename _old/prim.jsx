// Primitives: scroll hooks + animations
const C = {
  bg: '#0a0906', ink: '#f4ede1', ink2: '#f4ede1cc', muted: '#9a8f7c',
  accent: '#d4a373', neon: '#ff5722', line: '#f4ede11a', card: '#14110c',
  cream: '#f4ede1',
};
const S = {
  mono: { fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' },
  serif: { fontFamily: '"Instrument Serif", "Cormorant Garamond", Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' },
  sans: { fontFamily: '"Inter", system-ui, sans-serif' },
};

function useScrollP(ref) {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0;
    const up = () => {
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      setP(Math.max(0, Math.min(1, (vh - r.top) / (r.height + vh))));
    };
    const onS = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(up); };
    up(); window.addEventListener('scroll', onS, { passive: true });
    window.addEventListener('resize', onS);
    return () => { window.removeEventListener('scroll', onS); window.removeEventListener('resize', onS); cancelAnimationFrame(raf); };
  }, []);
  return p;
}
function usePinP(ref) {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0;
    const up = () => {
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const total = r.height - vh;
      setP(total <= 0 ? 0 : Math.max(0, Math.min(1, -r.top / total)));
    };
    const onS = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(up); };
    up(); window.addEventListener('scroll', onS, { passive: true });
    window.addEventListener('resize', onS);
    return () => { window.removeEventListener('scroll', onS); window.removeEventListener('resize', onS); cancelAnimationFrame(raf); };
  }, []);
  return p;
}
function useSeen(ref, t = 0.12) {
  const [s, setS] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let cancelled = false;
    const reveal = () => { if (!cancelled) setS(true); };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { reveal(); return true; }
      return false;
    };
    if (check()) return () => { cancelled = true; };
    // Re-check after layout/fonts settle
    const t1 = setTimeout(check, 200);
    // Hard deadline: reveal after 700ms no matter what — Babel-transpiled
    // pages can have late mount + observer races. Better to show than to hide.
    const t2 = setTimeout(reveal, 700);
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && reveal()), { threshold: t });
    io.observe(el);
    return () => {
      cancelled = true; io.disconnect();
      clearTimeout(t1); clearTimeout(t2);
    };
  }, []);
  return s;
}
function Counter({ to, suffix = '', prefix = '', dur = 1600 }) {
  const ref = React.useRef(null), seen = useSeen(ref);
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (!seen) return;
    const s = performance.now(); let raf = 0;
    const tick = t => {
      const k = Math.min(1, (t - s) / dur), e = 1 - Math.pow(1 - k, 3);
      setV(e * to); if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  const shown = Number.isInteger(to) ? Math.round(v) : v.toFixed(1);
  return <span ref={ref}>{prefix}{shown}{suffix}</span>;
}
function Reveal({ children, tag: T = 'span', delay = 0, style = {} }) {
  const ref = React.useRef(null), seen = useSeen(ref, 0.1);
  return (
    <T ref={ref} style={{ display: 'block', overflow: 'hidden', ...style }}>
      <span style={{
        display: 'inline-block',
        transform: seen ? 'translateY(0)' : 'translateY(105%)',
        opacity: seen ? 1 : 0,
        transition: `transform 1100ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity 800ms ${delay}ms`,
      }}>{children}</span>
    </T>
  );
}
function Fade({ children, delay = 0, y = 40, ...rest }) {
  // Uses GLOBAL @keyframes fadeUp defined in Portfolio.html <head>.
  // y is ignored (kept for API compat); global keyframe uses fixed 40px.
  // Visible by default — animation is decoration, content shows even if anim fails.
  return (
    <div {...rest} style={{
      opacity: 1,
      animation: `fadeUp 1100ms cubic-bezier(.2,.8,.2,1) ${delay}ms forwards`,
      ...(rest.style || {}),
    }}>{children}</div>
  );
}
// Margin annotation — handwritten-style note placed INSIDE the parent rail.
// Uses GLOBAL @keyframes marginInRight/Left from Portfolio.html <head>,
// parameterized via --rot custom property for rotation angle.
function Margin({ children, side = 'right', top = 0, rotate = -2, color, inset = 12 }) {
  const accent = color || C.accent;
  const animName = side === 'left' ? 'marginInLeft' : 'marginInRight';
  return (
    <div style={{
      position: 'absolute',
      [side]: inset, top,
      width: 'min(220px, 26vw)',
      fontFamily: '"Caveat", "Bradley Hand", cursive',
      fontSize: 18, lineHeight: 1.25, color: accent,
      transform: `rotate(${rotate}deg)`,
      opacity: 0.85,
      ['--rot']: `${rotate}deg`,
      animation: `${animName} 900ms cubic-bezier(.2,.8,.2,1) 400ms forwards`,
      pointerEvents: 'none',
      zIndex: 5,
      textAlign: side === 'left' ? 'left' : 'right',
    }}>
      {children}
    </div>
  );
}
function Marq({ children, speed = 60, reverse = false, style = {} }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <div style={{ overflow: 'hidden', width: '100%', ...style }}>
      <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: `m_${id} ${speed}s linear infinite ${reverse ? 'reverse' : ''}` }}>
        <div style={{ display: 'inline-flex' }}>{children}</div>
        <div style={{ display: 'inline-flex' }}>{children}</div>
      </div>
      <style>{`@keyframes m_${id}{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
// Parallax image layer
function Parallax({ src, speed = 0.3, style = {}, children, overlay = 0.4 }) {
  const ref = React.useRef(null);
  const p = useScrollP(ref);
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <div style={{
        position: 'absolute', inset: '-20%',
        backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
        transform: `translateY(${(p - 0.5) * speed * 200}px) scale(1.1)`,
        willChange: 'transform',
      }} />
      {overlay > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(10,9,6,${overlay})` }} />}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  );
}
// Custom cursor — amber orb with lag, grows near interactive targets, inverts over cream sections
function Cursor() {
  const mob = useIsMobile();
  const dotRef = React.useRef(null);
  const ringRef = React.useRef(null);
  const [label, setLabel] = React.useState('');
  const [mode, setMode] = React.useState('default'); // default | link | drag | light
  React.useEffect(() => {
    if (mob) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my; // ring lags
    let dx = mx, dy = my;
    let raf;
    const loop = () => {
      // dot follows fast
      dx += (mx - dx) * 0.45;
      dy += (my - dy) * 0.45;
      // ring lags
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      // detect hovered target
      const el = document.elementFromPoint(mx, my);
      if (!el) return;
      const link = el.closest('a, button, [data-cursor]');
      if (link) {
        const cur = link.getAttribute('data-cursor');
        setLabel(cur || (link.tagName === 'A' ? 'VIEW' : ''));
        setMode('link');
      } else {
        setLabel('');
        // detect light background section
        const section = el.closest('section');
        if (section) {
          const bg = getComputedStyle(section).backgroundColor;
          // cream bg => inverted cursor
          if (bg.includes('244') || bg.includes('237')) setMode('light');
          else setMode('default');
        } else setMode('default');
      }
    };
    const onDown = () => setMode(m => m === 'link' ? 'link' : 'drag');
    const onUp = () => setMode(m => m === 'drag' ? 'default' : m);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); window.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp); };
  }, []);

  const isLink = mode === 'link';
  const isLight = mode === 'light';
  const dotBG = isLight ? '#0a0906' : '#d4a373';
  const ringBorder = isLight ? '#0a0906' : '#d4a373';

  if (mob) return null;

  return (
    <React.Fragment>
      {/* ring */}
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9998, pointerEvents: 'none',
        width: isLink ? 72 : 36, height: isLink ? 72 : 36,
        border: `1.5px solid ${ringBorder}`,
        borderRadius: '50%',
        mixBlendMode: 'normal',
        transition: 'width 350ms cubic-bezier(.2,.8,.2,1), height 350ms cubic-bezier(.2,.8,.2,1), border-color 200ms',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.2em',
        color: ringBorder, textTransform: 'uppercase',
      }}>
        {isLink && label}
      </div>
      {/* dot */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
        width: isLink ? 0 : 8, height: isLink ? 0 : 8,
        background: dotBG, borderRadius: '50%',
        boxShadow: isLight ? 'none' : '0 0 24px #d4a37366',
        transition: 'width 250ms, height 250ms, background 200ms',
      }} />
      <style>{`* { cursor: none !important; }`}</style>
    </React.Fragment>
  );
}

function useIsMobile(bp = 768) {
  const [m, setM] = React.useState(() => window.innerWidth < bp);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const h = (e) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [bp]);
  return m;
}

Object.assign(window, { C, S, useScrollP, usePinP, useSeen, Counter, Reveal, Fade, Margin, Marq, Parallax, Cursor, useIsMobile });
