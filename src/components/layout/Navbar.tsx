'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Publications', href: '#publications' },
  { label: 'Education', href: '#education' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Beyond', href: '#beyond' },
  { label: 'Contact', href: '#contact' },
] as const;

export function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMobile();
  const reducedMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);

  // Show/hide navbar based on scroll position (past hero ~100vh)
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection via Intersection Observer
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') || '');
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <AnimatePresence>
        {visible && !isMobile && (
          <motion.nav
            ref={navRef}
            className="fixed top-4 left-4 right-4 z-50 glass-nav rounded-xl px-6 py-3 hidden md:flex items-center justify-between"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Left: Logo */}
            <a
              href="#"
              className="font-heading text-lg font-semibold text-text-primary shrink-0"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              SC
            </a>

            {/* Center: Section links */}
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={cn(
                        'relative text-sm font-body px-3 py-1.5 rounded-lg transition-colors group/nav',
                        isActive
                          ? 'text-cyan-accent'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      {link.label}
                      {/* Hover underline that slides in from left */}
                      {!isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-px bg-text-primary/40 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left" />
                      )}
                      {isActive && (
                        <motion.span
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-accent"
                          layoutId="nav-dot"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Right: Theme toggle + Resume button */}
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <a
                href="/resume/Shanmukha_Chatadi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-heading text-cyan-accent border border-cyan-accent/30 px-3 py-1.5 rounded-lg hover:bg-cyan-accent/10 hover:scale-[1.03] transition-all duration-300"
              >
                Resume
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile: Hamburger button */}
      <AnimatePresence>
        {visible && isMobile && !mobileOpen && (
          <motion.button
            className="fixed top-4 right-4 z-50 glass-nav rounded-xl p-3"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 text-text-primary" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile: Slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-deep/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.nav
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-deep/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-white/[0.06] flex flex-col"
              initial={reducedMotion ? { opacity: 0 } : { x: '100%' }}
              animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6 text-text-muted" />
                </button>
              </div>

              {/* Links */}
              <ul className="flex flex-col gap-1 px-4 mt-4">
                {NAV_LINKS.map((link, i) => {
                  const sectionId = link.href.replace('#', '');
                  const isActive = activeSection === sectionId;
                  return (
                    <motion.li
                      key={link.href}
                      initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <a
                        href={link.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'block text-lg font-body py-3 px-4 rounded-lg transition-colors',
                          isActive
                            ? 'text-cyan-accent bg-cyan-accent/5'
                            : 'text-text-muted hover:text-text-primary hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                        )}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Resume button */}
              <div className="mt-auto p-6">
                <a
                  href="/resume/Shanmukha_Chatadi_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="block text-center text-sm font-heading text-cyan-accent border border-cyan-accent/30 px-4 py-3 rounded-lg hover:bg-cyan-accent/10 transition-colors"
                >
                  Resume
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
