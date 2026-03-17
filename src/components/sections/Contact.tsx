'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const contactLines = [
  { key: 'email', value: 'schatad@ncsu.edu', color: 'text-cyan-accent', href: 'mailto:schatad@ncsu.edu' },
  { key: 'linkedin', value: 'linkedin.com/in/shanmukha-chatadi', color: 'text-blue-accent', href: 'https://linkedin.com/in/shanmukha-chatadi' },
  { key: 'github', value: 'github.com/shinegami-2002', color: 'text-blue-accent', href: 'https://github.com/shinegami-2002' },
  { key: 'location', value: 'Raleigh, NC', color: 'text-text-primary', href: null },
  { key: 'status', value: 'Open to opportunities', color: 'text-green-400', href: null },
];

export function Contact() {
  const reducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(reducedMotion ? contactLines.length : 0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLines(contactLines.length);
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!triggered || reducedMotion) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= contactLines.length) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [triggered, reducedMotion]);

  return (
    <SectionWrapper id="contact" title="Contact" number={9}>
      <motion.div
        onViewportEnter={() => setTriggered(true)}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        {/* Terminal */}
        <div className="bg-black/40 border border-white/[0.08] rounded-lg p-6 font-mono text-sm transition-all duration-300 hover:border-white/[0.16] hover:shadow-[0_0_20px_rgba(0,212,255,0.06)]">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            <span className="text-text-muted text-xs ml-2">terminal</span>
          </div>

          {/* Command */}
          <div className="text-text-muted mb-3">
            <span className="text-gold-accent">shanmukha</span>
            <span className="text-text-muted">@</span>
            <span className="text-blue-accent">portfolio</span>
            {' '}
            <span className="text-text-muted">~</span>
            {' '}
            <span className="text-blue-accent">$</span>
            {' '}
            <span className="text-text-primary">cat contact.json</span>
          </div>

          {/* JSON output */}
          <div className="text-text-muted">
            <p>{'{'}</p>
            {contactLines.map((line, i) => (
              <p
                key={line.key}
                className={`ml-4 transition-opacity duration-300 ${i < visibleLines ? 'opacity-100' : 'opacity-0'}`}
              >
                <span className="text-text-muted">&quot;{line.key}&quot;</span>
                <span className="text-text-muted">: </span>
                {line.href ? (
                  <a
                    href={line.href}
                    target={line.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className={`${line.color} hover:underline`}
                  >
                    &quot;{line.value}&quot;
                  </a>
                ) : (
                  <span className={line.color}>&quot;{line.value}&quot;</span>
                )}
                {i < contactLines.length - 1 && <span className="text-text-muted">,</span>}
              </p>
            ))}
            <p>{'}'}</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <ShimmerButton href="mailto:schatad@ncsu.edu" variant="primary">
            <Mail className="w-4 h-4" /> Email Me
          </ShimmerButton>
          <ShimmerButton href="https://linkedin.com/in/shanmukha-chatadi" variant="primary">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </ShimmerButton>
          <ShimmerButton href="https://github.com/shinegami-2002" variant="secondary">
            <Github className="w-4 h-4" /> GitHub
          </ShimmerButton>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
