import { useState } from "react";
import { StatusHeader } from "./components/StatusHeader";
import { Hero } from "./panes/Hero";
import { Pane } from "./components/Pane";
import { useActivePane } from "./lib/useActivePane";
import "./styles/console.css";
import "./styles/panes.css";

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
          <p data-stamp style={{ color: "var(--muted)" }}>
            trace coming online…
          </p>
        </Pane>
        <Pane id="work" number="02" title="Flagship Systems" aside="5 SERVICES">
          <p data-stamp style={{ color: "var(--muted)" }}>
            services coming online…
          </p>
        </Pane>
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
