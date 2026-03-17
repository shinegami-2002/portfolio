"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(0.08) }
    );
  }, [scope, animate, filter, duration]);

  return (
    <div className={cn("font-body", className)} ref={scope}>
      <div className="leading-snug tracking-wide">
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0 inline-block mr-[0.3em]"
            style={{ filter: filter ? "blur(10px)" : "none" }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
