"use client";

import { Boxes } from "@/components/ui/background-boxes";

export function SceneContainer() {
  return (
    <>
      {/* Base background layer */}
      <div className="fixed inset-0 -z-20 bg-[#f8f8f6] dark:bg-[#0a0a0f]">
        {/* Light mode subtle gradient orbs */}
        <div className="dark:hidden absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[120px] bg-[#0891b2]" />
        <div className="dark:hidden absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.1] blur-[100px] bg-[#4f46e5]" />

        {/* Dark mode animated gradient orbs */}
        <div className="hidden dark:block absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px] animate-drift bg-[#00d4ff]" />
        <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-drift-reverse bg-[#e8b04a]" />
        <div className="hidden dark:block absolute top-[40%] left-[50%] w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[150px] animate-drift-slow bg-[#6b8afd]" />
      </div>

      {/* Interactive boxes layer - dark mode only */}
      <div className="fixed inset-0 z-0 overflow-hidden hidden dark:block">
        <Boxes className="opacity-80" />

        {/* Mask - fades boxes at edges */}
        <div className="absolute inset-0 w-full h-full bg-[#0a0a0f] [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,15,0.4) 50%, rgba(10,10,15,0.85) 100%)",
          }}
        />
      </div>

      {/* Light mode subtle dot pattern */}
      <div
        className="fixed inset-0 z-0 dark:hidden pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </>
  );
}
