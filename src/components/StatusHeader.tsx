import { PANES, jumpTo, type PaneId } from "../lib/useActivePane";
import { useTheme } from "../lib/theme";
import { phosphorPulse } from "../lib/phosphor";

export function StatusHeader({
  active,
  progress,
  onPalette,
}: {
  active: PaneId;
  progress: number;
  onPalette: () => void;
}) {
  const [theme, flip] = useTheme();
  return (
    <header className="hdr" role="banner">
      <div className="hdr__inner">
        <button className="hdr__brand" onClick={() => jumpTo("hero")} aria-label="chatadi.sys — back to top">
          chatadi.sys<span className="hdr__cursor">▮</span>
        </button>

        <nav className="hdr__trace" aria-label="Sections">
          {PANES.map((p) => (
            <button
              key={p.id}
              className={`hdr__tick ${active === p.id ? "hdr__tick--on" : ""}`}
              onClick={(e) => {
                phosphorPulse(e.currentTarget);
                jumpTo(p.id);
              }}
            >
              <span className="hdr__tickmark" />
              <span className="hdr__ticklabel">{p.label}</span>
            </button>
          ))}
        </nav>

        <div className="hdr__right">
          <button
            className="hdr__theme"
            onClick={flip}
            aria-label={`Switch to ${theme === "graphite" ? "paper" : "graphite"} theme`}
            title="theme"
          >
            ◐
          </button>
          <button className="hdr__ask" onClick={onPalette}>
            <kbd>⌘K</kbd> ASK / JUMP
          </button>
        </div>
      </div>
      <div className="hdr__progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
