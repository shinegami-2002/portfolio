'use client';

export function SceneContainer() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
      {/* Animated gradient orbs that slowly drift */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px] animate-drift bg-[#00d4ff]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-drift-reverse bg-[#e8b04a]" />
      <div className="absolute top-[40%] left-[50%] w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[150px] animate-drift-slow bg-[#6b8afd]" />

      {/* Grid lines that subtly pulse */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(240,236,226,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,236,226,0.2) 1px, transparent 1px)
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
            'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.9) 100%)',
        }}
      />
    </div>
  );
}
