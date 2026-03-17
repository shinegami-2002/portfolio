export function SceneContainer() {
  return (
    <>
      {/* Base background layer */}
      <div className="fixed inset-0 -z-20 bg-[#f5f3ee] dark:bg-[#0a0a0f]">
        {/* Light mode gradient orbs */}
        <div className="dark:hidden absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[100px] bg-[#0e7490] animate-drift" />
        <div className="dark:hidden absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[80px] bg-[#4338ca] animate-drift-reverse" />
        <div className="dark:hidden absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full opacity-[0.06] blur-[90px] bg-[#a16207] animate-drift-slow" />

        {/* Dark mode animated gradient orbs */}
        <div className="hidden dark:block absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px] animate-drift bg-[#00d4ff]" />
        <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-drift-reverse bg-[#e8b04a]" />
        <div className="hidden dark:block absolute top-[40%] left-[50%] w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[150px] animate-drift-slow bg-[#6b8afd]" />
      </div>

      {/* Light mode texture layers */}
      <div className="fixed inset-0 -z-10 dark:hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 0%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(245,243,238,0.3) 60%, rgba(245,243,238,0.7) 100%)",
          }}
        />
      </div>
    </>
  );
}
