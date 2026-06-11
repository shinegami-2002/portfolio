import { useEffect, useMemo, useRef, useState } from "react";
import { LocalRetrievalProvider, type AgentAnswer } from "../agent/provider";
import { PANES, jumpTo } from "../lib/useActivePane";
import { flagships } from "../content/flagships";
import { profile } from "../content/profile";
import { flipTheme } from "../lib/theme";
import { phosphorPulse } from "../lib/phosphor";
import { pulseSignal } from "../lib/scrollBus";
import { reducedMotion } from "../lib/springs";

type Command = { id: string; label: string; hint: string; run: () => void };

const provider = new LocalRetrievalProvider();

const SUGGESTIONS = [
  "what has he shipped to production?",
  "how does he prevent hallucinations?",
  "does he know go and kubernetes?",
  "is he looking for work?",
];

export function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hover, setHover] = useState(0);
  const [answer, setAnswer] = useState<AgentAnswer | null>(null);
  const [shownSteps, setShownSteps] = useState(0);
  const [typed, setTyped] = useState("");
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const runId = useRef(0);

  const commands: Command[] = useMemo(() => {
    const close = (fn: () => void) => () => {
      fn();
      onClose();
    };
    return [
      ...PANES.filter((p) => p.id !== "hero").map((p) => ({
        id: `jump-${p.id}`,
        label: `jump: ${p.label.toLowerCase()}`,
        hint: "↵",
        run: close(() => jumpTo(p.id)),
      })),
      ...flagships.map((f) => ({
        id: `open-${f.id}`,
        label: `open: ${f.name.toLowerCase()}`,
        hint: f.status,
        run: close(() => jumpTo(`work-${f.id}`)),
      })),
      { id: "theme", label: "toggle theme (crt flip)", hint: "◐", run: close(() => flipTheme()) },
      {
        id: "email",
        label: "copy email",
        hint: "✉",
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          onClose();
        },
      },
      { id: "resume", label: "download resume.pdf", hint: "↓", run: close(() => window.open(profile.resume, "_blank")) },
    ];
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!q.trim()) return commands;
    const ql = q.toLowerCase();
    return commands.filter((c) => c.label.includes(ql) || ql.split(/\s+/).every((w) => c.label.includes(w)));
  }, [q, commands]);

  const isQuestion = q.trim().length > 0 && filtered.length === 0;

  // reset on open
  useEffect(() => {
    if (open) {
      setQ("");
      setAnswer(null);
      setTyped("");
      setShownSteps(0);
      setHover(0);
      setThinking(false);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // typewriter for the answer text
  useEffect(() => {
    if (!answer) return;
    if (reducedMotion()) {
      setShownSteps(answer.steps.length);
      setTyped(answer.text);
      return;
    }
    let alive = true;
    (async () => {
      for (let i = 1; i <= answer.steps.length; i++) {
        if (!alive) return;
        setShownSteps(i);
        await new Promise((r) => setTimeout(r, 320));
      }
      const words = answer.text.split(" ");
      for (let i = 1; i <= words.length; i += 2) {
        if (!alive) return;
        setTyped(words.slice(0, i + 1).join(" "));
        await new Promise((r) => setTimeout(r, 28));
      }
      setTyped(answer.text);
    })();
    return () => {
      alive = false;
    };
  }, [answer]);

  const ask = async (text: string) => {
    const id = ++runId.current;
    setQ(text);
    setThinking(true);
    setAnswer(null);
    setTyped("");
    setShownSteps(0);
    pulseSignal(0.8);
    await new Promise((r) => setTimeout(r, 240)); // beat for the theater
    const a = await provider.answer(text);
    if (id !== runId.current) return;
    setThinking(false);
    setAnswer(a);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHover((h) => Math.min(filtered.length - 1, h + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHover((h) => Math.max(0, h - 1));
    }
    if (e.key === "Enter") {
      if (isQuestion || answer) {
        if (q.trim()) void ask(q);
      } else if (filtered[hover]) {
        phosphorPulse(document.querySelector(".pal__row--on"));
        filtered[hover].run();
      }
    }
  };

  if (!open) return null;

  return (
    <div className="pal__scrim" onClick={onClose} role="presentation">
      <div
        className="pal"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette and portfolio agent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pal__inputRow">
          <span className="pal__prompt">&gt;</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setHover(0);
              if (answer) {
                setAnswer(null);
                setTyped("");
              }
            }}
            onKeyDown={onKey}
            placeholder="jump somewhere, or ask about the work…"
            aria-label="Command or question"
            autoComplete="off"
            spellCheck={false}
          />
          <button className="pal__esc mono-label" onClick={onClose}>
            ESC
          </button>
        </div>

        {/* command list */}
        {!answer && !thinking && !isQuestion && (
          <div className="pal__list" role="listbox">
            {filtered.map((c, i) => (
              <button
                key={c.id}
                role="option"
                aria-selected={i === hover}
                className={`pal__row ${i === hover ? "pal__row--on" : ""}`}
                onPointerEnter={() => setHover(i)}
                onClick={() => c.run()}
              >
                <span>{c.label}</span>
                <span className="pal__hint mono-label">{c.hint}</span>
              </button>
            ))}
          </div>
        )}

        {/* question mode */}
        {(isQuestion || thinking || answer) && (
          <div className="pal__agent">
            {isQuestion && !thinking && !answer && (
              <div className="pal__askHint mono-label">↵ to run the agent on “{q.trim()}”</div>
            )}
            {(thinking || answer) && (
              <div className="pal__steps">
                {thinking && <div className="pal__step mono-label">⚙ search_corpus(“{q.trim().slice(0, 38)}”)…</div>}
                {answer &&
                  answer.steps.slice(0, shownSteps).map((s, i) => (
                    <div key={i} className="pal__step pal__step--done mono-label">
                      ⚙ {s.tool}({s.arg}) → {s.result}
                    </div>
                  ))}
              </div>
            )}
            {answer && shownSteps >= answer.steps.length && (
              <div className="pal__answer">
                {typed}
                {typed !== answer.text && <span className="hero__caret">▮</span>}
                {typed === answer.text && answer.citations.length > 0 && (
                  <div className="pal__cites">
                    {answer.citations.map((c) => (
                      <button
                        key={c.anchor + c.title}
                        className="chip"
                        onClick={() => {
                          onClose();
                          jumpTo(c.anchor);
                          setTimeout(() => phosphorPulse(document.getElementById(c.anchor)), 600);
                        }}
                      >
                        {c.title} ↗
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* suggestions when empty */}
        {!q && !answer && !thinking && (
          <div className="pal__sugg">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="pal__suggBtn" onClick={() => void ask(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="pal__foot mono-label">
          local bm25 · runs in your browser · no api · no tracking · ↑↓ navigate · ↵ select
        </div>
      </div>
    </div>
  );
}
