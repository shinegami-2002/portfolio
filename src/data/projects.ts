import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'scholar-agent',
    title: 'ScholarAgent',
    subtitle: 'Multi-Agent Research Assistant',
    period: 'Jan 2025 - Mar 2025',
    description:
      'Multi-agent research assistant with a 7-node LangGraph pipeline featuring corrective RAG, query rewriting, and hallucination detection.',
    bullets: [
      'Orchestrated multi-agent research assistant with 7-node LangGraph pipeline (router, retriever, grader, rewriter, generator, hallucination checker, synthesizer); implemented corrective RAG with query rewriting and hallucination detection, improving groundedness by 35%.',
      'Integrated ChromaDB vector search with HuggingFace sentence-transformer embeddings indexing 10K+ arXiv/PubMed papers; constructed 3-model Gemini cascade achieving 99% uptime and Next.js 14 + TypeScript frontend with real-time agent pipeline visualization.',
    ],
    tags: ['LangGraph', 'ChromaDB', 'Gemini API', 'FastAPI', 'Next.js 14', 'TypeScript'],
    githubUrl: 'https://github.com/shinegami-2002/scholar-agent',
    accent: 'cyan',
    categories: ['ai-ml', 'full-stack'],
  },
  {
    id: 'mcp-healthcare',
    title: 'MCP Healthcare Server',
    subtitle: 'Model Context Protocol Server',
    period: 'Feb 2025 - Mar 2025',
    description:
      'MCP server exposing 6 healthcare tools via FastMCP, integrated with 4 federal APIs for drug safety, clinical trials, ICD-10 lookup, and more.',
    bullets: [
      'Launched Model Context Protocol server exposing 6 healthcare tools (drug safety, clinical trials, ICD-10 lookup, medical literature, Medicare data, drug interactions) via FastMCP; integrated 4 federal APIs with async httpx achieving sub-second response times. Wrote 21 unit tests, CI across Python 3.11-3.13 matrix.',
    ],
    tags: ['Python', 'FastMCP', 'httpx', 'openFDA', 'PubMed', 'NLM', 'CMS', 'Docker'],
    githubUrl: 'https://github.com/shinegami-2002/mcp-healthcare-server',
    accent: 'blue',
    categories: ['ai-ml'],
  },
  {
    id: 'linkvault',
    title: 'LinkVault',
    subtitle: 'Go REST API Platform',
    period: 'Mar 2025',
    description:
      'Go REST API platform with JWT and API-key authentication, Redis-backed rate limiting, and PostgreSQL full-text search.',
    bullets: [
      'Engineered Go REST API platform with JWT and API-key authentication, Redis-backed rate limiting, and PostgreSQL full-text search; designed OpenAPI-first endpoints with versioned routes, structured logging, and automated CI pipeline, containerized with Docker Compose.',
    ],
    tags: ['Go', 'Chi v5', 'PostgreSQL', 'Redis', 'JWT', 'Docker', 'OpenAPI/Swagger'],
    githubUrl: 'https://github.com/shinegami-2002/linkvault',
    accent: 'blue',
    categories: ['backend'],
  },
  {
    id: 'distributed-task-queue',
    title: 'Distributed Task Queue',
    subtitle: 'Go + gRPC + Kubernetes',
    period: 'Feb 2025 - Mar 2025',
    description:
      'Distributed task queue in Go with gRPC/Protobuf service interfaces, Redis-backed priority queue, and Kubernetes deployment with autoscaling.',
    bullets: [
      'Built distributed task queue in Go with gRPC/Protobuf service interfaces, Redis-backed priority queue (sorted sets), and PostgreSQL persistence; implemented exponential backoff retry logic, dead-letter routing, and pluggable handler registry with configurable worker concurrency.',
      'Deployed on Kubernetes with Helm charts and horizontal pod autoscaling on custom Prometheus metrics (queue depth); instrumented with Grafana dashboards, structured logging (zerolog), and health checks via Chi v5 HTTP server.',
    ],
    tags: ['Go', 'gRPC', 'Protobuf', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes', 'Helm', 'Prometheus', 'Grafana'],
    githubUrl: 'https://github.com/shinegami-2002/distributed-task-queue',
    accent: 'cyan',
    categories: ['backend'],
  },
  {
    id: 'neural-network-pruning',
    title: 'Neural Network Training Dynamics & Pruning',
    subtitle: 'PyTorch Research Project',
    period: 'Jan 2026 - Present',
    description:
      'Research into CNN vs. Transformer representation learning via UMAP/t-SNE and CKA similarity, with L1 unstructured pruning analysis.',
    bullets: [
      'Trained ResNet-18 and ViT-Tiny on CIFAR-100 using transfer learning; analyzed CNN vs. Transformer representation learning via UMAP/t-SNE and CKA similarity. Applied 50% L1 unstructured pruning, pruned ViT retained 92% top-5 accuracy vs. 3% drop in pruned ResNet, quantifying model compression trade-offs.',
    ],
    tags: ['PyTorch', 'ResNet-18', 'ViT-Tiny', 'CIFAR-100', 'UMAP', 't-SNE', 'CKA'],
    accent: 'blue',
    categories: ['research', 'ai-ml'],
  },
  {
    id: 'llms4pcg',
    title: 'LLM-Driven Procedural Content Generation',
    subtitle: 'LLMs4PCG - AAAI 2026',
    period: '2025',
    description:
      'Applied open-source LLMs to procedural game-level generation with constraint satisfaction and ViT-based validation.',
    bullets: [
      'Applied latest open-source LLMs (Phi-3, Gemma-2, Qwen-2.5) to procedural game-level generation; designed prompt compilation pipeline with constraint satisfaction achieving 100% structural stability. Validated outputs via ViT-based image classification and custom rendering pipeline, bridging NLP and computer vision evaluation with precision/recall metrics. (AAAI 2026 position paper)',
    ],
    tags: ['Python', 'Phi-3', 'Gemma-2', 'Qwen-2.5', 'Prompt Engineering', 'ViT'],
    accent: 'blue',
    categories: ['research', 'ai-ml'],
  },
  {
    id: 'ai-chatbot',
    title: 'AI ChatBot',
    subtitle: 'Multi-Provider LLM Service',
    period: 'Jan 2025 - Apr 2025',
    description:
      'Multi-provider generative AI web service with FastAPI backend and LangChain orchestration, featuring provider failover for high availability.',
    bullets: [
      'Deployed multi-provider generative AI web service with FastAPI backend and LangChain orchestration; implemented async API calls to multiple LLM providers achieving 40% latency reduction. Containerized with Docker and provider failover logic for 99.5% availability.',
    ],
    tags: ['Python', 'FastAPI', 'LangChain', 'Docker', 'Node.js', 'Groq', 'OpenAI'],
    githubUrl: 'https://github.com/shinegami-2002/AI_ChatBot',
    accent: 'cyan',
    categories: ['ai-ml', 'full-stack'],
  },
];
