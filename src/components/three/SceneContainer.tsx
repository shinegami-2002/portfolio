"use client";

import { Boxes } from "@/components/ui/background-boxes";

export function SceneContainer() {
  return (
    <>
      {/* Base background layer */}
      <div className="fixed inset-0 -z-20 bg-[#f5f3ee] dark:bg-[#0a0a0f]">
        {/* Light mode gradient orbs - warmer, more visible */}
        <div className="dark:hidden absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[100px] bg-[#0e7490] animate-drift" />
        <div className="dark:hidden absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[80px] bg-[#4338ca] animate-drift-reverse" />
        <div className="dark:hidden absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full opacity-[0.06] blur-[90px] bg-[#a16207] animate-drift-slow" />

        {/* Dark mode animated gradient orbs */}
        <div className="hidden dark:block absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px] animate-drift bg-[#00d4ff]" />
        <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-drift-reverse bg-[#e8b04a]" />
        <div className="hidden dark:block absolute top-[40%] left-[50%] w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[150px] animate-drift-slow bg-[#6b8afd]" />
      </div>

      {/* Interactive boxes layer - dark mode only */}
      <div className="fixed inset-0 z-0 overflow-hidden hidden dark:block">
        <Boxes className="opacity-80" />
        <div className="absolute inset-0 w-full h-full bg-[#0a0a0f] [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,15,0.4) 50%, rgba(10,10,15,0.85) 100%)",
          }}
        />
      </div>

      {/* Light mode texture layers */}
      <div className="fixed inset-0 z-0 dark:hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 0%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 65%)",
          }}
        />

        {/* Noise texture for warmth */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette for light mode */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(245,243,238,0.3) 60%, rgba(245,243,238,0.7) 100%)",
          }}
        />
      </div>
    </>
  );
}
