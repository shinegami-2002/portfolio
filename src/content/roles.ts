import type { Role } from "./types";

export const roles: Role[] = [
  {
    org: "MiHIN",
    title: "AI Research Intern",
    period: "Aug 2025 — present",
    location: "Michigan Health Information Network · remote from Raleigh",
    summary:
      "Michigan's statewide health information exchange moves clinical data for 13M+ patients. I sit on the AI " +
      "team and my work spans the full arc of its generative-AI adoption: I proposed and prototyped the original " +
      "internal AI platform, wrote the governance program that lets a HIPAA-regulated nonprofit use LLMs at all, " +
      "and now own day-to-day production engineering on the deployed enterprise AI chat platform.",
    bullets: [
      "Architected the serverless RAG prototype on AWS — Bedrock (Claude Sonnet + Titan V2 embeddings), OpenSearch Serverless, Pinecone, Lambda, Cognito — for 230+ employees over 10K+ enterprise documents; pitched the architecture and cost model (~75% under Copilot licensing) to the C-suite and won an org-wide pilot.",
      "Own production deploys on the enterprise chat platform (200+ users, 20+ official bots): React/CloudFront front, FastAPI-on-Lambda back, DynamoDB, Bedrock Knowledge Bases, CDK-in-TypeScript infra. Ship features and fixes without disrupting active users.",
      "Building the agentic layer: A2A protocol support on Bedrock AgentCore Runtime — agents expose streamable HTTP A2A servers and publish Agent Cards — plus tool-calling agents on the Strands SDK orchestrating Claude over MCP servers wired to HL7/FHIR interoperability systems.",
      "Tuned chunking and retrieval-K with human-in-the-loop feedback: −30% ungrounded responses, document lookup from ~15 min to <30 s with citations. CloudWatch dashboards, alarms, dead-letter routing: −60% mean time to detection.",
      "Authored the AI governance framework (HITRUST CSF, NIST AI RMF, HIPAA); analyzed 40K+ audit records across 900+ apps for control gaps, unblocking 5+ engineering teams. Support 10+ internal builders shipping their own bots.",
    ],
    tags: ["Bedrock", "AgentCore", "A2A", "MCP", "Strands SDK", "OpenSearch", "Pinecone", "CDK", "FastAPI", "HITRUST"],
    spanStart: 2025.6,
    spanEnd: null,
  },
  {
    org: "Rygen BioPharma",
    title: "Software Engineer",
    period: "Mar 2023 — Aug 2024",
    location: "Hyderabad, India",
    summary:
      "Primary engineer on the internal clinical data platform for a pharma research company — four departments " +
      "ran on emailed spreadsheets before it, and the platform outlived my tenure.",
    bullets: [
      "Built the platform end to end: Flask + React + PostgreSQL, 15+ documented REST endpoints, role-based access per department. Cut manual reporting overhead ~40%.",
      "Python ETL over 100K+ clinical records daily with schema validation at ingestion and PostgreSQL trigger checks at insert — data-entry errors down ~50%.",
      "Trained XGBoost/Random Forest models on 100K+ historical records (0.89 AUC-ROC) and served predictions through the same APIs researchers already used.",
      "Docker + Kubernetes + Jenkins CI/CD across 3 environments; 200+ pytest tests at 85%+ coverage as a hard pipeline gate. Releases went from ~2 days to <3 hours.",
    ],
    tags: ["Flask", "React", "PostgreSQL", "Pandas", "Docker", "Kubernetes", "Jenkins", "scikit-learn"],
    spanStart: 2023.2,
    spanEnd: 2024.6,
  },
  {
    org: "TreoSoft IT",
    title: "Data Science Intern",
    period: "Jun — Sep 2022",
    location: "Bengaluru, India · remote",
    summary:
      "Market-basket analysis for a retail client, taken from raw point-of-sale exports to a deployed recommendation API.",
    bullets: [
      "Mined association rules (Apriori, FP-Growth) over 100K+ transactions; tuned support/confidence/lift until thousands of useless rules became a short actionable list of bundles.",
      "Shipped the recommendation logic as a Flask REST API on PostgreSQL; the client's bundle rollout was associated with a 15% net sales lift.",
    ],
    tags: ["FP-Growth", "Pandas", "Flask", "PostgreSQL", "K-Means"],
    spanStart: 2022.45,
    spanEnd: 2022.7,
  },
];

export const education = {
  ms: { school: "North Carolina State University", degree: "MS Computer Science", period: "2024 — 2026", spanStart: 2024.6, spanEnd: 2026.4 },
  btech: { school: "NIT Puducherry", degree: "BTech CSE", period: "2020 — 2024" },
};
