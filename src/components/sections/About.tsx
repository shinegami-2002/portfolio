'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function NumberCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { label: 'Years Experience', value: 2, suffix: '+', color: 'cyan' as const },
  { label: 'Projects Shipped', value: 7, suffix: '+', color: 'gold' as const },
  { label: 'Publications', value: 2, suffix: '', color: 'blue' as const },
  { label: 'Users Served', value: 230, suffix: '+', color: 'cyan' as const },
];

const colorMap: Record<string, string> = {
  cyan: 'text-cyan-accent',
  blue: 'text-blue-accent',
  gold: 'text-gold-accent',
};

const glowColorMap: Record<string, 'cyan' | 'blue' | 'gold' | 'none'> = {
  cyan: 'cyan',
  blue: 'blue',
  gold: 'gold',
};

export function About() {
  const reducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="about" title="About" number={1}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left column: summary */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-text-primary text-lg leading-relaxed">
            Applied AI/ML Engineer building agentic AI systems, production LLM
            pipelines, and scalable cloud deployments. Architected enterprise RAG
            platform serving 230+ users at 75% lower cost; shipped multi-agent
            LangGraph research assistant with corrective RAG and hallucination
            detection. Published researcher (Springer, IEEE) in deep learning,
            NLP, and computer vision.
          </p>
        </motion.div>

        {/* Right column: 2x2 stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <GlassCard
              key={stat.label}
              glowColor={glowColorMap[stat.color]}
              className="flex flex-col items-center justify-center text-center py-6"
              transition={{
                duration: 0.5,
                delay: reducedMotion ? 0 : index * 0.1,
              }}
            >
              <span
                className={`font-heading text-3xl md:text-4xl font-bold ${colorMap[stat.color]}`}
              >
                <NumberCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-text-muted text-sm mt-2">{stat.label}</span>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
