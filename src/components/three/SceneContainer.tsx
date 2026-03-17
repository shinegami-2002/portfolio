'use client';

export function SceneContainer() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050510]">
      {/* Animated gradient orbs that slowly drift */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.10] blur-[120px] animate-drift bg-[#00f2ff]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[100px] animate-drift-reverse bg-[#1a3a6e]" />
      <div className="absolute top-[40%] left-[50%] w-[700px] h-[700px] rounded-full opacity-[0.06] blur-[150px] animate-drift-slow bg-[#4d88ff]" />

      {/* Grid lines that subtly pulse */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,242,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,242,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,16,0.5) 60%, rgba(5,5,16,0.9) 100%)',
        }}
      />
    </div>
  );
}
