"use client";

import { Boxes } from "@/components/ui/background-boxes";

export function SceneContainer() {
  return (
    <>
      {/* Base background layer - behind everything */}
      <div className="fixed inset-0 -z-20 bg-[#0a0a0f]">
        {/* Animated gradient orbs that slowly drift */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px] animate-drift bg-[#00d4ff]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-drift-reverse bg-[#e8b04a]" />
        <div className="absolute top-[40%] left-[50%] w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[150px] animate-drift-slow bg-[#6b8afd]" />
      </div>

      {/* Interactive boxes layer - sits on top of page, pointer events pass through to boxes */}
      <div className="fixed inset-0 z-0 overflow-hidden">
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
    </>
  );
}
