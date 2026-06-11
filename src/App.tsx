import { useCallback, useState } from "react";
import { Boot } from "./components/Boot";
import { SignalLayer } from "./components/SignalLayer";
import { StatusHeader } from "./components/StatusHeader";
import { Hero } from "./panes/Hero";
import { Pane } from "./components/Pane";
import { Keymap } from "./components/Keymap";
import { useActivePane } from "./lib/useActivePane";
import { Trace } from "./trace/Trace";
import { Flagship } from "./panes/Flagship";
import { Archive } from "./panes/Archive";
import { FieldLog } from "./panes/FieldLog";
import { Contact } from "./panes/Contact";
import { Palette } from "./palette/Palette";
import { QueueSim } from "./sims/QueueSim";
import { ScholarSim } from "./sims/ScholarSim";
import { MihinSim } from "./sims/MihinSim";
import { McpSim } from "./sims/McpSim";
import { PruningSim } from "./sims/PruningSim";
import { flagships } from "./content/flagships";
import "./styles/console.css";
import "./styles/panes.css";
import "./styles/trace.css";
import "./styles/sims.css";
import "./styles/flagship.css";
import "./styles/palette.css";
import "./styles/archive.css";

const SIMS: Record<string, React.ReactNode> = {
  mihin: <MihinSim />,
  scholar: <ScholarSim />,
  mcp: <McpSim />,
  pruning: <PruningSim />,
  queue: <QueueSim />,
};

export default function App() {
  const { active, progress } = useActivePane();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const onBootDone = useCallback(() => setBooted(true), []);

  return (
    <>
      <Boot onDone={onBootDone} />
      {booted && <SignalLayer />}
      <a className="skip-link" href="#work">
        skip to work
      </a>
      <StatusHeader active={active} progress={progress} onPalette={openPalette} />
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
            <Flagship key={f.id} f={f} sim={SIMS[f.id]} />
          ))}
        </div>
        <Pane id="archive" number="03" title="The Archive" aside="EVERYTHING ELSE">
          <Archive />
        </Pane>
        <Pane id="field" number="04" title="Field Log" aside="OFF-DUTY">
          <FieldLog />
        </Pane>
        <Pane id="contact" number="05" title="Open Channel" aside="REACH OUT">
          <Contact />
        </Pane>
      </main>
      <button className="fab" onClick={openPalette} aria-label="Open command palette">
        ⌘ ASK
      </button>
      <Palette open={paletteOpen} onClose={closePalette} />
      <Keymap active={active} paletteOpen={paletteOpen} openPalette={openPalette} />
    </>
  );
}
