// Beyond the Code — scattered Polaroid collage of personal photos
// Lives between Projects and CV (where Stats used to be).

function Hobbies() {
  const mob = useIsMobile();
  // Each photo: src, caption (handwritten), tag (hobby), rotation, scale, x/y offset (percent of section).
  // Hand-tuned to overlap nicely without ever fully covering each other.
  const photos = [
    { src: 'photos/belltower.png',    caption: 'NC State', tag: 'campus',     x: 4,   y: 12,  r: -3.5, scale: 0.95 },
    { src: 'photos/bellagio.png',     caption: 'Bellagio Halloween', tag: 'travel', x: 22,  y: 18,  r: 2.5,  scale: 1.0  },
    { src: 'photos/changi.png',       caption: 'Changi · Singapore', tag: 'travel', x: 44,  y: 14,  r: -2.5, scale: 1.05 },
    { src: 'photos/sun-sea.png',      caption: 'OBX sunrise', tag: 'beach',     x: 66,  y: 16,  r: 3.5,  scale: 0.9  },
    { src: 'photos/nyc.png',          caption: 'NYC skyline', tag: 'travel',    x: 86,  y: 14,  r: -2,   scale: 0.85 },

    { src: 'photos/ramen.png',        caption: 'shoyu · 11pm', tag: 'food',     x: 8,   y: 44,  r: 4,    scale: 0.9  },
    { src: 'photos/beach-wide.png',   caption: 'low tide', tag: 'beach',       x: 26,  y: 50,  r: -3,   scale: 1.0  },
    { src: 'photos/wtc.png',          caption: 'WTC · 2am', tag: 'travel',     x: 50,  y: 46,  r: 2.5,  scale: 0.95 },
    { src: 'photos/oculus.png',       caption: 'Oculus', tag: 'travel',        x: 68,  y: 50,  r: -3,   scale: 1.0  },
    { src: 'photos/hawk.png',         caption: 'backyard visitor', tag: 'nature', x: 88,  y: 46,  r: 3,    scale: 0.9  },

    { src: 'photos/dunes.png',        caption: 'Jockey\'s Ridge', tag: 'beach',  x: 4,   y: 78,  r: -2.5, scale: 1.0  },
    { src: 'photos/sunset-pier.png',  caption: 'pier evening', tag: 'beach',   x: 24,  y: 84,  r: 2.5,  scale: 0.95 },
    { src: 'photos/mural.png',        caption: 'cardinal mural', tag: 'art',   x: 46,  y: 80,  r: -3.5, scale: 0.9  },
    { src: 'photos/pine.png',         caption: 'pine + rain', tag: 'nature',   x: 66,  y: 86,  r: 3,    scale: 0.95 },
    { src: 'photos/beach-houses.png', caption: 'Kure beach', tag: 'beach',     x: 84,  y: 82,  r: -2.5, scale: 1.0  },
  ];

  const [hovered, setHovered] = React.useState(null);

  return (
    <section style={{
      position: 'relative', background: C.bg, color: C.ink, overflow: 'hidden',
      padding: mob ? '60px 0 40px' : '140px 0 100px',
    }}>
      {/* Section header */}
      <div style={{ padding: mob ? '0 16px 24px' : '0 60px 40px', maxWidth: 1800, margin: '0 auto', position: 'relative' }}>
        <div style={{ ...S.mono, color: C.muted, fontSize: 11, letterSpacing: '0.32em' }}>
          № 04 — MARGINALIA
        </div>
        <div style={{
          ...S.serif, fontSize: 'clamp(48px, 7vw, 112px)', lineHeight: 0.96,
          letterSpacing: '-0.035em', marginTop: 18, color: C.cream, position: 'relative',
        }}>
          Beyond <span style={{ fontStyle: 'italic', color: C.accent }}>the code</span>.
          <Margin side="right" top={20} rotate={-3} inset={-10}>
            phone snaps, in no particular order ✦
          </Margin>
        </div>
        <div style={{
          marginTop: 22, fontSize: 17, lineHeight: 1.55, color: C.ink2,
          ...S.serif, fontStyle: 'italic', maxWidth: 640,
        }}>
          Places I've walked, things I've eaten, and the occasional hawk that landed in the backyard.
        </div>
      </div>

      {/* Collage canvas — fixed aspect so positions stay predictable */}
      <div style={{
        position: 'relative', maxWidth: 1800, margin: '60px auto 0',
        height: mob ? 'auto' : 'clamp(820px, 86vw, 1300px)',
        padding: mob ? '0 16px' : '0 40px',
      }}>
        <div style={{
          position: mob ? 'relative' : 'absolute',
          inset: mob ? undefined : '0 40px',
          perspective: '1200px',
          display: mob ? 'grid' : 'block',
          gridTemplateColumns: mob ? '1fr 1fr' : undefined,
          gap: mob ? 12 : undefined,
        }}>
          {photos.map((ph, i) => {
            const isHover = hovered === i;
            const isOther = hovered !== null && !isHover;
            return (
              <Polaroid key={i}
                {...ph}
                mob={mob}
                idx={i}
                isHover={isHover}
                isOther={isOther}
                onEnter={() => setHovered(i)}
                onLeave={() => setHovered(null)}
              />
            );
          })}
        </div>
      </div>

      {/* Footer caption */}
      <div style={{
        marginTop: 40, padding: mob ? '0 16px' : '0 60px', maxWidth: 1800, margin: '40px auto 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        ...S.mono, color: C.muted, fontSize: 11, letterSpacing: '0.3em',
      }}>
        <span>HOVER A FRAME — IT'LL LIFT</span>
        <span>{photos.length} FRAMES · ALL REAL</span>
      </div>
    </section>
  );
}

function Polaroid({ src, caption, tag, x, y, r, scale, idx, isHover, isOther, onEnter, onLeave, mob }) {
  // Base width 220px scaled per-photo, centered around x/y as percentages
  const baseW = 240;
  const w = baseW * scale;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: mob ? 'relative' : 'absolute',
        left: mob ? 'auto' : `${x}%`,
        top: mob ? 'auto' : `${y}%`,
        width: mob ? '100%' : w,
        maxWidth: mob ? 200 : undefined,
        margin: mob ? '0 auto' : undefined,
        transform: mob
          ? `rotate(${isHover ? 0 : r}deg)`
          : `translate(-50%, -50%) rotate(${isHover ? 0 : r}deg) scale(${isHover ? 1.18 : 1})`,
        transition: 'transform 600ms cubic-bezier(.2,.8,.2,1), opacity 400ms, filter 400ms',
        opacity: isOther ? 0.35 : 1,
        filter: isOther ? 'saturate(0.7) brightness(0.85)' : 'none',
        zIndex: isHover ? 50 : 10 + (idx % 10),
        cursor: 'none',
        willChange: 'transform',
      }}
    >
      <div style={{
        background: C.cream,
        padding: '12px 12px 44px',
        boxShadow: isHover
          ? '0 40px 80px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.4), 0 0 40px rgba(212,163,115,0.25)'
          : '0 18px 36px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.25)',
        transition: 'box-shadow 600ms',
        position: 'relative',
      }}>
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '4 / 5',
          background: '#1a1612', overflow: 'hidden',
        }}>
          <img src={src} alt={caption} style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            filter: 'saturate(0.95) contrast(1.05)',
          }} />
        </div>
        {/* Handwritten caption */}
        <div style={{
          position: 'absolute', left: 12, right: 12, bottom: 14,
          fontFamily: '"Caveat", "Bradley Hand", cursive',
          fontSize: 18, color: C.bg, textAlign: 'center', lineHeight: 1,
        }}>
          {caption}
        </div>
        {/* Tape strip — top corner, slight variation per photo */}
        <div style={{
          position: 'absolute',
          top: -8,
          left: idx % 2 === 0 ? '20%' : 'auto',
          right: idx % 2 === 0 ? 'auto' : '20%',
          width: 60 + (idx % 3) * 10, height: 16,
          background: 'rgba(244, 237, 225, 0.4)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          transform: `rotate(${idx % 2 === 0 ? -8 : 6}deg)`,
        }} />
        {/* Tag pill in corner */}
        <div style={{
          position: 'absolute', top: 8, right: 10,
          ...S.mono, fontSize: 8, letterSpacing: '0.2em',
          color: C.bg, opacity: 0.5,
        }}>
          {tag}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Hobbies });
