import { useState } from "react";
import { profile } from "../content/profile";
import { Chip } from "../components/Chip";
import { phosphorPulse } from "../lib/phosphor";

export function Contact() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="contact">
      <div className="contact__status" data-stamp>
        <span className="dot dot--live" />
        <span className="mono-label contact__statusText">
          {profile.status} · FULL-TIME AI/ML ROLES · {profile.location.toUpperCase()} · {profile.relocation.toUpperCase()}
        </span>
      </div>

      <button
        className="contact__email"
        data-stamp
        style={{ ["--stagger" as never]: "1" }}
        onClick={(e) => {
          navigator.clipboard?.writeText(profile.email).then(() => {
            setCopied(true);
            phosphorPulse(e.target as Element);
            setTimeout(() => setCopied(false), 1800);
          });
        }}
        aria-label={`Copy email address ${profile.email}`}
      >
        {profile.email}
        <span className="contact__copyHint mono-label">{copied ? "COPIED ✓" : "CLICK TO COPY"}</span>
      </button>

      <div className="contact__links" data-stamp style={{ ["--stagger" as never]: "2" }}>
        <Chip chip={{ label: "GITHUB", href: profile.github, kind: "github" }} />
        <Chip chip={{ label: "LINKEDIN", href: profile.linkedin, kind: "github" }} />
        <Chip chip={{ label: "RESUME.PDF", href: profile.resume, kind: "paper" }} />
      </div>

      <footer className="contact__foot mono-label" data-stamp style={{ ["--stagger" as never]: "3" }}>
        <span>chatadi.sys v2.0 · built by hand, no framework templates</span>
        <span>
          <a href="https://github.com/shinegami-2002/portfolio" target="_blank" rel="noreferrer">
            view source ↗
          </a>
        </span>
      </footer>
    </div>
  );
}
