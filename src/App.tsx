import { useState } from "react";
import { StatusHeader } from "./components/StatusHeader";
import { Hero } from "./panes/Hero";
import { Pane } from "./components/Pane";
import { useActivePane } from "./lib/useActivePane";
import { Trace } from "./trace/Trace";
import { Flagship } from "./panes/Flagship";
import { QueueSim } from "./sims/QueueSim";
import { flagships } from "./content/flagships";
import "./styles/console.css";
import "./styles/panes.css";
import "./styles/trace.css";
import "./styles/sims.css";
import "./styles/flagship.css";

const SIMS: Record<string, React.ReactNode> = {
  queue: <QueueSim />,
};

export default function App() {
  const { active, progress } = useActivePane();
  const [, setPaletteOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#work">
        skip to work
      </a>
      <StatusHeader active={active} progress={progress} onPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero />
        <Pane id="trace" number="01" title="The Trace" aside="2022 → NOW">
          <Trace />
        </Pane>
        <div id="work">
          <Pane id="work-head" number="02" title="Flagship Systems" aside="5 SERVICES">
            <p data-stamp className="work__intro">
              Five systems, told the way an engineer would actually tell them: the problem, the approach,
              the numbers, and what broke along the way. Every panel below is a live simulation of the real
              architecture — touch them.
            </p>
          </Pane>
          {flagships.map((f) => (
            <Flagship key={f.id} f={f} sim={SIMS[f.id] ?? <div className="sim sim--soon mono-label">SIM LOADING…</div>} />
          ))}
        </div>
        <Pane id="archive" number="03" title="The Archive" aside="EVERYTHING ELSE">
          <p data-stamp style={{ color: "var(--muted)" }}>
            archive indexing…
          </p>
        </Pane>
        <Pane id="field" number="04" title="Field Log" aside="OFF-DUTY">
          <p data-stamp style={{ color: "var(--muted)" }}>
            photos developing…
          </p>
        </Pane>
        <Pane id="contact" number="05" title="Open Channel" aside="REACH OUT">
          <p data-stamp style={{ color: "var(--muted)" }}>
            channel opening…
          </p>
        </Pane>
      </main>
    </>
  );
}
