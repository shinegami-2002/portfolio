import { profile } from "../content/profile";
import { NumberTicker } from "../components/NumberTicker";

export function Hero() {
  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <div className="hero__inner">
        <div className="hero__meta mono-label" data-boot-line>
          <span>// OPERATOR CONSOLE</span>
          <span className="hero__metaRight">EST. 2022 · REV 2026.06</span>
        </div>

        <div className="hero__grid">
          <div className="hero__main">
            <h1 className="hero__name">
              <span className="hero__nameLine" data-boot-name>
                SHANMUKHA
              </span>
              <span className="hero__nameLine" data-boot-name>
                CHATADI<span className="hero__caret">▮</span>
              </span>
            </h1>

            <div className="hero__roleRow">
              <span className="hero__role mono-label">{profile.role}</span>
              <span className="hero__status mono-label">
                <span className="dot dot--live" /> {profile.status}
              </span>
            </div>

            <p className="hero__sum">{profile.summary}</p>

            <div className="hero__loc mono-label">
              {profile.location} · {profile.relocation} · {profile.statusDetail}
            </div>
          </div>

          <aside className="badge" aria-label="Operator ID card">
            <div className="badge__photo">
              <img src={profile.badge.src} alt="Shanmukha Chatadi" width={280} height={350} />
              <div className="badge__scan" aria-hidden="true" />
            </div>
            {profile.badge.rows.map(([k, v]) => (
              <div className="badge__row" key={k}>
                <span className="badge__k">{k}</span>
                <span className="badge__v">{v}</span>
              </div>
            ))}
          </aside>
        </div>

        <div className="hero__metrics">
          {profile.heroMetrics.map((m) => (
            <div className="hero__metric" key={m.label}>
              <span className="hero__metricN">
                <NumberTicker m={m} />
              </span>
              <span className="hero__metricL mono-label">{m.label}</span>
            </div>
          ))}
          <div className="hero__scrollHint mono-label" aria-hidden="true">
            SCROLL ▾ OR ⌘K
          </div>
        </div>
      </div>
    </section>
  );
}
