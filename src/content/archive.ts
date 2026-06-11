import type { ArchiveEntry } from "./types";

export const archive: ArchiveEntry[] = [
  {
    id: "parameter-golf",
    name: "OpenAI Parameter Golf",
    year: "2025",
    oneLiner: "16MB language model, 10-min training cap on 8×H100 — 0.8128 bits/byte (−27%) via classical-compression eval mixing.",
    detail:
      "OpenAI's Model Craft competition: best LM that fits a 16MB artifact and trains in under 10 minutes on 8×H100. " +
      "I combined the strongest community record stack (11-layer/512-dim transformer, squared-LeakyReLU MLPs, partial " +
      "RoPE, EMA+SWA averaging, Muon optimizer, int6+lzma quantization) with a novel contribution: eval-time n-gram " +
      "hash tables (orders 2–7, built during evaluation at zero artifact cost, inspired by cmix/PAQ8) mixed with the " +
      "neural model via entropy-adaptive alpha. Validation went 1.1218 → 0.8128 bits/byte on the same trained model. " +
      "Scores sat in top-10 territory mid-competition; sponsored credits arrived too late for the final merged leaderboard — " +
      "full logs, submission JSON, and technique writeup in the fork.",
    chips: [{ label: "GITHUB", href: "https://github.com/shinegami-2002/parameter-golf", kind: "github" }],
    kind: "project",
  },
  {
    id: "chimera-ar",
    name: "ChimeraAR",
    year: "2025",
    oneLiner: "Mixed-reality painting on Meta Quest 3 — paint your actual walls, in Unity 6 + passthrough AR.",
    detail:
      "Room scanning via Meta's MRUK classifies real surfaces; a raycast decal system stamps paint flush against " +
      "walls, floors, and furniture with correct normal alignment. Two painting modes, four tile sizes, grouped undo " +
      "for continuous strokes, wrist-mounted UI, haptics and audio cues. Everything had to justify its frame cost — " +
      "passthrough AR on mobile-class hardware punishes anything expensive on the render path.",
    chips: [
      { label: "GITHUB", href: "https://github.com/shinegami-2002/ChimeraAR", kind: "github" },
      { label: "DEMO ▶", href: "https://github.com/shinegami-2002/ChimeraAR#demo", kind: "video" },
    ],
    kind: "project",
  },
  {
    id: "llms4pcg",
    name: "LLMs4PCG — AAAI 2026",
    year: "2025",
    oneLiner: "Small open LLMs generating physics-stable game levels; 100% structural stability by construction, ViT-judged.",
    detail:
      "Prompt-compilation pipeline for Phi-3 / Gemma-2 / Qwen-2.5: block-placement rules, physics constraints, and a " +
      "structural grammar encoded as staged few-shot generation, so each step is too small to get wrong. A custom " +
      "rendering pipeline + ViT classifier scores recognizability automatically — every prompt change judged by " +
      "stability and recognizability metrics, not vibes. Contributing author on the AAAI 2026 position paper.",
    chips: [],
    kind: "project",
  },
  {
    id: "linkvault",
    name: "LinkVault",
    year: "2025",
    oneLiner: "Production-grade Go REST API: dual JWT/API-key auth, atomic Redis rate limiting, Postgres FTS.",
    detail:
      "Chi v5 with an explicit middleware chain (request IDs, structured logging, panic recovery, auth, rate limit, " +
      "gzip), clean handler/service/repository layering, keys hashed at rest, tsvector full-text search, OpenAPI-first " +
      "design, graceful shutdown, CI with lint + full test suite. The instructive bugs were the ones that only appear " +
      "under production conditions: limiter concurrency semantics and FTS query plans.",
    chips: [{ label: "GITHUB", href: "https://github.com/shinegami-2002/linkvault", kind: "github" }],
    kind: "project",
  },
  {
    id: "slackpoint",
    name: "SlackPoint v3",
    year: "2024",
    oneLiner: "Gamified task management inside Slack — inherited OSS codebase, team release with 85% coverage.",
    detail:
      "Flask + PostgreSQL Slack app: tasks with points and deadlines, leaderboards, and our v3 addition — RPG " +
      "characters that consume earned points. Third team in the project's lineage: onboarding into inherited data " +
      "models, backward compatibility, PR review discipline, Codecov + GitHub Actions + Zenodo DOI.",
    chips: [{ label: "GITHUB", href: "https://github.com/brianhhuynh38/slackpoint-v3", kind: "github" }],
    kind: "project",
  },
  {
    id: "ai-chatbot",
    name: "AI ChatBot",
    year: "2025",
    oneLiner: "Multi-provider LLM service with transparent failover — 99.5% availability over flaky upstreams.",
    detail:
      "FastAPI + LangChain with provider failover across Groq/OpenAI and Tavily web grounding; async request path cut " +
      "latency ~40%. Deployed publicly (Render + Streamlit Cloud). The provider-abstraction lessons — prompt " +
      "portability, capped retry budgets, per-provider cost — carried into everything I built after.",
    chips: [{ label: "GITHUB", href: "https://github.com/shinegami-2002/AI_ChatBot", kind: "github" }],
    kind: "project",
  },
  {
    id: "gait",
    name: "IMU Gait Recognition",
    year: "2025",
    oneLiner: "Terrain/stairs classification from wearable IMU signals — honest baselining before neural anything.",
    detail:
      "EDA on accelerometer/gyroscope streams, hand-crafted windowed features, Random Forest as calibration baseline, " +
      "then a tuned MLP with strict validation/test separation. Error patterns landed exactly where the signal " +
      "analysis predicted: subtle terrain pairs, not stairs.",
    chips: [],
    kind: "project",
  },
  {
    id: "pub-potato",
    name: "Potato Disease Classification — HIS 2023 (Springer)",
    year: "2023",
    oneLiner: "First-author. Diverse feature extraction + ML models.",
    detail: "C. Shanmukha Srinivas Sai et al., Hybrid Intelligent Systems 2023, Springer LNNS. DOI: 10.1007/978-3-031-78925-0_7",
    chips: [{ label: "DOI ¶", href: "https://doi.org/10.1007/978-3-031-78925-0_7", kind: "paper" }],
    kind: "publication",
  },
  {
    id: "pub-tea",
    name: "Tea Leaf Disease Classification — ICDLAIR 2024",
    year: "2024",
    oneLiner: "Ensemble stacking with data augmentation and diverse feature extraction.",
    detail: "Somesh K, C. Shanmukha Srinivas Sai et al., ICDLAIR 2024, Atlantis/Springer. DOI: 10.2991/978-94-6463-740-3_14",
    chips: [{ label: "DOI ¶", href: "https://doi.org/10.2991/978-94-6463-740-3_14", kind: "paper" }],
    kind: "publication",
  },
  {
    id: "pub-aaai",
    name: "LLMs4PCG Position Paper — AAAI 2026",
    year: "2026",
    oneLiner: "Contributing author.",
    detail: "Position paper from the LLMs4PCG competition community, AAAI 2026.",
    chips: [],
    kind: "publication",
  },
  {
    id: "cert-nvidia",
    name: "NVIDIA DLI — Generative AI with Diffusion Models",
    year: "2026",
    oneLiner: "Plus: Deep Learning fundamentals (NVIDIA), Cisco Data Analytics & Python, UIUC Accelerated CS, Imperial Math for ML.",
    detail: "Selected certifications, 2023–2026.",
    chips: [],
    kind: "certification",
  },
  {
    id: "lead-zer01",
    name: "Co-founder, Zer01Coded",
    year: "2021–22",
    oneLiner: "Founded NIT Puducherry's coding club; taught Python to 150+ students.",
    detail:
      "Also President of the Rotaract Club and VP of the CS association at NIT Puducherry — workshops, hackathons, " +
      "and the discovery that teaching something is the fastest way to find out you don't understand it.",
    chips: [],
    kind: "leadership",
  },
];
