import type { Flagship } from "./types";

export const flagships: Flagship[] = [
  {
    id: "mihin",
    name: "MiHIN Enterprise AI Platform",
    status: "PROD",
    period: "2025 — present",
    oneLiner:
      "The AI platform of Michigan's statewide health information exchange — I prototyped it, wrote the governance that made it legal, and now push its production code.",
    chips: [],
    metrics: [
      { value: 230, suffix: "+", label: "daily users" },
      { value: 20, suffix: "+", label: "official bots" },
      { value: 30, prefix: "−", suffix: "%", label: "ungrounded responses" },
      { value: 60, prefix: "−", suffix: "%", label: "time to detection" },
    ],
    problem:
      "A HIPAA-regulated nonprofit needed employees to query 10K+ policies, contracts, and compliance documents — " +
      "without leaking PHI, without hallucinated answers, and at a price a nonprofit can pay.",
    approach:
      "Serverless RAG on AWS: Bedrock (Claude Sonnet, Titan V2 embeddings), OpenSearch Serverless + Pinecone " +
      "retrieval, Lambda + API Gateway + Cognito. Pitched to the C-suite at ~75% under Copilot licensing; won the " +
      "org-wide pilot. Today: production engineering on the deployed platform and its agentic layer — A2A protocol " +
      "on Bedrock AgentCore, Strands SDK agents calling MCP servers wired to HL7/FHIR systems.",
    logLines: [
      "the hardest retrieval problem was messy heterogeneous enterprise documents — configurable chunking, dedup at ingestion, and a human-in-the-loop eval loop got ungrounded answers down 30%",
      "taking ownership of a production codebase I didn't write — and extending it with A2A + MCP without disrupting active users — has been the most valuable engineering experience of the role",
      "something breaks essentially every day; I'm the one who answers. 10+ internal builders ship their own bots on the platform because they can get unblocked fast",
    ],
    tags: ["AWS Bedrock", "AgentCore", "A2A", "MCP", "Strands SDK", "OpenSearch", "Pinecone", "Cognito", "HITRUST", "HIPAA"],
  },
  {
    id: "scholar",
    name: "ScholarAgent",
    status: "OSS",
    period: "2025",
    oneLiner:
      "A research assistant that detects and corrects its own failures before you ever see an answer.",
    chips: [{ label: "GITHUB", href: "https://github.com/shinegami-2002/scholar-agent", kind: "github" }],
    metrics: [
      { value: 35, prefix: "+", suffix: "%", label: "groundedness vs naive RAG" },
      { value: 10, suffix: "K+", label: "papers indexed" },
      { value: 99, suffix: "%", label: "cascade uptime" },
      { value: 21, suffix: "+", label: "hermetic tests" },
    ],
    problem:
      "A single retrieve-then-generate pass fails quietly: weak retrieval in, hallucinated answer out, nobody notices.",
    approach:
      "A 7-node LangGraph state machine where every node has one job: router → retriever (arXiv/PubMed → ChromaDB) " +
      "→ LLM grader → query rewriter (loops back, capped at 2 retries) → generator → hallucination checker scoring " +
      "groundedness 0–1 and forcing regeneration → synthesizer. Every LLM call returns Pydantic-validated structured " +
      "output — that's what makes grading reliable enough to gate answers instead of just logging warnings. " +
      "3-model Gemini cascade for provider failures; FastAPI + WebSocket streaming of intermediate graph state; " +
      "Next.js 14 frontend renders each agent step live.",
    logLines: [
      "agent pipelines multiply failure modes, so every node boundary needs a contract — typed Pydantic models per node made the graph debuggable: a failure points at a node, not at a blob of prompt text",
      "watching a rejected generation get retried in the UI turned out to matter as much as accuracy — an agent whose reasoning is inspectable earns trust a black box never does",
      "the suite runs deterministically offline with mocked LLM responses; CI doesn't need API keys",
    ],
    tags: ["LangGraph", "ChromaDB", "Gemini", "Pydantic", "FastAPI", "WebSockets", "Next.js 14", "TypeScript"],
  },
  {
    id: "mcp",
    name: "MCP Healthcare Server",
    status: "OSS",
    period: "2025",
    oneLiner:
      "Six healthcare tools any MCP client can call — wired to four federal APIs, no keys required. The demo below hits the real ones.",
    chips: [{ label: "GITHUB", href: "https://github.com/shinegami-2002/mcp-healthcare-server", kind: "github" }],
    metrics: [
      { value: 6, label: "tools exposed" },
      { value: 4, label: "federal APIs" },
      { value: 70, suffix: "K+", label: "ICD-10 codes searchable" },
      { value: 21, label: "hermetic unit tests" },
    ],
    problem:
      "Ask an LLM a medical question and it will confidently hallucinate drug interactions and billing codes — while " +
      "the authoritative answers sit in free public federal APIs nobody wired into the models.",
    approach:
      "A FastMCP server exposing drug–drug interaction checks and adverse-event reports (openFDA), ICD-10-CM lookup " +
      "and fuzzy keyword search over 70K+ codes (NLM Clinical Tables), Medicare Part D prescribing stats (CMS), and " +
      "clinical literature search (PubMed E-utilities). Async httpx, concurrent requests, sub-second typical calls, " +
      "every response normalized into structured output designed for an LLM reader. Every data source keyless by design.",
    logLines: [
      "in MCP, documentation is functionally part of the API — a one-sentence improvement to a tool description measurably changed how often Claude picked the right tool",
      "the consumer is a language model: responses must be self-describing, not terse JSON that assumes a human read the docs",
      "21 respx-mocked tests, CI across Python 3.11–3.13 — the repo is treated as a product, not a demo",
    ],
    tags: ["Python", "FastMCP", "httpx", "openFDA", "NLM", "CMS", "PubMed", "Docker"],
  },
  {
    id: "pruning",
    name: "Pruned-Network Fingerprinting",
    status: "RESEARCH",
    period: "2026",
    oneLiner:
      "Two pruned networks with identical accuracy are not the same network — and you can prove it from a single image.",
    chips: [],
    metrics: [
      { value: 0.95, prefix: "r = +", label: "CKA predicts shared mistakes", decimals: 2 },
      { value: 89.2, suffix: "%", label: "probe accuracy (chance: 25%)", decimals: 1 },
      { value: 11, label: "configs on 3× H100" },
      { value: 1.48, suffix: "pp", label: "accuracy spread (held tight)", decimals: 2 },
    ],
    problem:
      "Magnitude pruning is everywhere, and everyone checks only accuracy. What does pruning change inside the " +
      "network when accuracy stays flat?",
    approach:
      "An 11-config prune-and-retrain grid of ResNet-18 on CIFAR-100 (timing × ratio, 30–97% sparsity) with final " +
      "accuracy deliberately held within 1.48pp — so any representational difference can't be dismissed as " +
      "better-vs-worse models. On top: pairwise linear CKA, held-out linear probes, error-pattern Jaccard overlap, " +
      "a 100K-permutation Mantel test, and partial correlations to keep the claims statistically defensible.",
    logLines: [
      "CKA similarity predicted pairwise mistake overlap at r = +0.95 — models with similar internals fail on the same inputs",
      "pruning timing is decodable from behavior on ONE held-out image at 89.2% balanced accuracy. when you prune leaves a detectable signature",
      "practical upshot: equal-accuracy compressed models fail on different users' inputs, and ensembles of differently-pruned models gain real diversity",
    ],
    tags: ["PyTorch", "ResNet-18", "CIFAR-100", "Linear CKA", "Mantel test", "3× H100", "forward hooks"],
  },
  {
    id: "queue",
    name: "Distributed Task Queue",
    status: "OSS",
    period: "2025",
    oneLiner:
      "A Celery-class task queue built from scratch in Go — because queue semantics are something you earn, not read about.",
    chips: [{ label: "GITHUB", href: "https://github.com/shinegami-2002/distributed-task-queue", kind: "github" }],
    metrics: [
      { value: 8, label: "workers, HPA-scaled" },
      { value: 2, label: "retry budget before DLQ" },
      { value: 100, suffix: "%", label: "drain on graceful shutdown" },
    ],
    problem:
      "SQS, Sidekiq, and Celery hide the semantics that matter: delivery guarantees, retry policy, failure isolation, " +
      "scaling signals. Buying the tool means never learning them.",
    approach:
      "gRPC + Protobuf service interface; Redis sorted sets as the priority queue; Postgres for durable state and " +
      "history. Visibility timeouts plus idempotent handlers give effectively-once processing; exponential-backoff " +
      "retries route exhausted tasks to a dead-letter queue. Deployed on Kubernetes with Helm; HPA scales workers on " +
      "a custom Prometheus metric — queue depth, not CPU, because CPU lies during I/O-bound work.",
    logLines: [
      "every behavior sounds simple stated in one sentence and took real design to get correct under concurrency",
      "the load tester taught me backpressure viscerally: throughput rises with worker count until Postgres becomes the bottleneck — past that, more workers just deepen contention",
      "this is why I have earned answers when system-design interviews reach for 'build a job queue' — I've made every mistake the question probes for",
    ],
    tags: ["Go", "gRPC", "Protobuf", "Redis", "PostgreSQL", "Kubernetes", "Helm", "Prometheus", "Grafana"],
  },
];
