# Portfolio Site Redesign — Shanmukha Chatadi

## Goal
Full redesign of https://shinegami-2002.github.io/sssc/ — both content and UI/UX. The current site is massively outdated compared to the resumes. This is the primary portfolio recruiters and hiring managers will see.

## Source Code Location
- Current site: `/Users/shanmukhachatadi/sssc_portfolio/` (single `index.html`, ~776 lines)
- Git remote: `https://github.com/shinegami-2002/sssc.git`
- Deployed via GitHub Pages

## Resume Sources (ground truth for content)
- AI/ML resume: `/Users/shanmukhachatadi/job_new/create_resume_on_jd/existing_resume_in_latex/Ai_ML_resume.pdf`
- SWE resume: `/Users/shanmukhachatadi/job_new/create_resume_on_jd/existing_resume_in_latex/SWE_resume.pdf`
- Project bank: `/Users/shanmukhachatadi/job_new/create_resume_on_jd/project_bank.md`

---

## Content Gap Analysis (Portfolio vs. Resumes)

### MISSING from portfolio — must add:

#### 1. MiHIN Experience (AI Research Intern, Jul 2025 - Present)
- Architected production Document AI/RAG platform on AWS Bedrock, OpenSearch Serverless (k-NN vector search), Lambda
- 230+ employees querying 1T+ documents via natural language at 75% less cost
- NLP ingestion pipeline: document parsing, Titan V2 embeddings (1,024-dim), configurable chunking, HITL feedback, 30% hallucination reduction
- AI governance framework: HITRUST CSF, NIST, HIPAA. Trained 5+ cross-functional teams
- Serverless REST API: API Gateway, Lambda, Cognito (SSO + 2FA), presented to CEO

#### 2. Projects missing entirely:
- **ScholarAgent** — Multi-agent research assistant, 7-node LangGraph pipeline, corrective RAG, hallucination detection, ChromaDB, Next.js 14, TypeScript. [GitHub](https://github.com/shinegami-2002/scholar-agent)
- **MCP Healthcare Server** — 6 healthcare tools via FastMCP, 4 federal APIs, 21 unit tests, CI matrix. [GitHub](https://github.com/shinegami-2002/mcp-healthcare-server)
- **LinkVault (Go API Platform)** — Go REST API, JWT + API-key auth, Redis rate limiting, PostgreSQL full-text search, OpenAPI/Swagger, Docker. [GitHub](https://github.com/shinegami-2002/linkvault)
- **Neural Network Training Dynamics & Pruning** — PyTorch, ResNet-18, ViT-Tiny, CIFAR-100, transfer learning, UMAP/t-SNE, CKA, 50% L1 pruning
- **LLM-Driven Procedural Content Generation (LLMs4PCG)** — Phi-3, Gemma-2, Qwen-2.5, prompt engineering, ViT classification, AAAI 2026
- **Distributed Task Queue** — Go, gRPC/Protobuf, Redis priority queue, PostgreSQL, Kubernetes, Helm, Prometheus, Grafana. [GitHub](https://github.com/shinegami-2002/distributed-task-queue)
- **AI ChatBot** — FastAPI, LangChain, multi-provider LLM, Docker, 40% latency reduction, 99.5% availability. [GitHub](https://github.com/shinegami-2002/AI_ChatBot)

### WRONG on portfolio — must fix:
- Rygen title: should be "Data & Software Development Analyst" (not "Data Analyst & Software Developer")
- Rygen dates: "Mar 2023 - Aug 2024" (shows "Aug 202" — truncated)
- Rygen bullets: way weaker than resume. Resume has ML pipelines, 0.89 AUC-ROC, ETL/100K+ records, Docker/K8s/CI/CD
- TreoSoft bullets: resume is much stronger. Flask REST APIs, Apriori/FP-Growth, K-Means, 100K+ transactions, 15% sales + 35% revenue
- NCSU graduation: Jun 2026 (not Mar 2026). GPA: 3.71 (not 3.73)
- Publications: HIS 2023 is now published (Springer). Tea Leaf is IEEE ICDLAIR 2024. Remove "Accepted & To be Published"
- Summary: should position as Applied AI/ML Engineer building agentic AI systems, not "full-stack development and data science"

### REMOVE or DEMOTE from portfolio:
- PackTravel (course group project, not on resume)
- SlackPoint (course group project, not on resume)
- Movie Recommendation System (not on resume)
- GetNet / Hyperspectral Images (not on resume, weak)
- LULC can stay but demote to bottom/academic section
- High school education (not recruiter-relevant, remove FIITJEE and Kennedy High)
- Soft skills section (Leadership section already covers this)

### Skills update (from resumes):
**AI/ML:** RAG, Agentic RAG, LLMs, NLP, Agentic AI, Multi-Agent Systems, MCP, Deep Learning, CNNs, Transformers, Computer Vision, Fine-tuning, Transfer Learning, HITL, MLOps
**Languages:** Python, TypeScript, JavaScript, Go, SQL, C++, Java, Bash, HTML/CSS
**Frameworks:** Next.js, React, Node.js, Express.js, FastAPI, Flask, Django, REST APIs, GraphQL
**Cloud & DevOps:** AWS (Bedrock, SageMaker, Lambda, S3, OpenSearch, EKS, EC2, API Gateway, Cognito), Docker, Kubernetes, GitHub Actions, Jenkins, CI/CD, Git
**Libraries:** LangGraph, LangChain, AWS Bedrock, ChromaDB, OpenSearch k-NN, Hugging Face, PyTorch, TensorFlow, scikit-learn, Pandas, NumPy, XGBoost, spaCy
**Databases:** PostgreSQL, MongoDB, MySQL, Redis, OpenSearch, Vector Databases
**Tools:** Selenium, Jira, Agile/Scrum, Tailwind CSS

---

## Current Site Technical Details
- Single-page HTML with embedded CSS + JS
- Dark cyberpunk theme: cyan (#00f2ff), magenta (#ff00c1), blue (#4d88ff) on #02040a background
- Fonts: Orbitron (display), Roboto Mono (body)
- Three.js nebula/particle background
- GSAP ScrollTrigger animations
- Lottie icons for skills
- Responsive, mobile-optimized
- Deployed on GitHub Pages

## Design Direction (for redesign)
- Keep dark theme aesthetic (recruiter-memorable, fits the brand)
- Modern, professional, but still visually distinctive
- Projects should be the star — large cards with tech tags, descriptions, GitHub links
- Experience section needs to be prominent (MiHIN is the crown jewel)
- Mobile-first responsive
- Fast load times (current Three.js is heavy)
- Accessible (a11y compliant)

## Contact Info
- Phone: +1 (984)-381-0808
- Email: schatad@ncsu.edu (primary) / shanmukh.nitpy@gmail.com
- LinkedIn: linkedin.com/in/shanmukha-chatadi
- GitHub: github.com/shinegami-2002

---

## Full Resume Content (exact wording for portfolio)

### Summary (use as About section)
Applied AI/ML Engineer building agentic AI systems, production LLM pipelines, and scalable cloud deployments. Architected enterprise RAG platform serving 230+ users at 75% lower cost; shipped multi-agent LangGraph research assistant with corrective RAG and hallucination detection. Published researcher (Springer, IEEE) in deep learning, NLP, and computer vision.

### Experience — AI Research Intern, MiHIN, Lansing MI (Jul 2025 - Present)
- Architected production Document AI/RAG platform on AWS Bedrock, OpenSearch Serverless (k-NN vector search), and Lambda, enabling 230+ employees to query 1T+ documents via natural language at 75% less than competitors.
- Engineered NLP ingestion pipeline with document parsing, Titan V2 embedding generation (1,024-dim), configurable chunking, vector indexing, and retrieval; incorporated human-in-the-loop (HITL) feedback to tune chunk size, overlap, and top-k parameters, reducing LLM hallucination rates by 30%.
- Developed AI governance framework aligned with HITRUST CSF, NIST, HIPAA; spearheaded AI Task Force training across DevOps, Legal, and HR, authoring playbooks that enabled 5+ cross-functional teams to integrate generative AI into production workflows.
- Delivered serverless REST API with API Gateway, Lambda, Cognito (SSO + 2FA) supporting 230+ users; presented cost analysis to CEO, securing approval for org-wide pilot cutting costs by 75%.
- Reduced mean time to detection by 60% through CloudWatch dashboards, structured logging, and custom alarms for real-time monitoring; implemented error handling and retry logic across Lambda functions with dead letter routing for fault tolerance.

### Experience — Data & Software Development Analyst, Rygen BioPharma, Hyderabad India (Mar 2023 - Aug 2024)
- Developed full-stack clinical data web application using Flask, React.js, PostgreSQL, REST APIs; centralized data from 4+ research departments, reducing manual reporting time by 40%.
- Built end-to-end ML pipelines with Python (scikit-learn, Pandas, NumPy) for clinical outcome prediction: feature engineering, XGBoost/Random Forest with GridSearchCV, achieving 0.89 AUC-ROC across 100K+ records.
- Designed ETL/data pipelines processing 100K+ records daily with schema validation and feature extraction; standardized ingestion from 4+ departments, accelerating data delivery by 50%.
- Deployed containerized microservices on AWS with Docker and Kubernetes; implemented CI/CD pipelines with Jenkins, reducing release cycles by 35%.
- Established API error handling patterns with structured error responses, input validation middleware; achieved 90%+ code coverage through comprehensive unit and integration tests.

### Experience — Data Science Intern, TreoSoft IT Solutions, Bengaluru India (Jun 2022 - Sep 2022)
- Built ML-powered recommendation engine with Flask REST APIs and PostgreSQL; applied Apriori/FP-Growth association mining and K-Means segmentation on 100K+ transactions, driving 15% increase in net sales and 35% revenue uplift.

### Project Details (full bullets from resume + project bank)

**ScholarAgent** — LangGraph, ChromaDB, Gemini API, FastAPI, Next.js 14, TypeScript [GitHub](https://github.com/shinegami-2002/scholar-agent) | Jan 2025 - Mar 2025
- Orchestrated multi-agent research assistant with 7-node LangGraph pipeline (router, retriever, grader, rewriter, generator, hallucination checker, synthesizer); implemented corrective RAG with query rewriting and hallucination detection, improving groundedness by 35%.
- Integrated ChromaDB vector search with HuggingFace sentence-transformer embeddings indexing 10K+ arXiv/PubMed papers; constructed 3-model Gemini cascade achieving 99% uptime and Next.js 14 + TypeScript frontend with real-time agent pipeline visualization.

**MCP Healthcare Server** — Python, FastMCP, httpx, openFDA/PubMed/NLM/CMS APIs, Docker [GitHub](https://github.com/shinegami-2002/mcp-healthcare-server) | Feb 2025 - Mar 2025
- Launched Model Context Protocol server exposing 6 healthcare tools (drug safety, clinical trials, ICD-10 lookup, medical literature, Medicare data, drug interactions) via FastMCP; integrated 4 federal APIs with async httpx achieving sub-second response times. Wrote 21 unit tests, CI across Python 3.11-3.13 matrix.

**LinkVault (Go API Platform)** — Go, Chi v5, PostgreSQL, Redis, JWT, Docker, GitHub Actions, OpenAPI/Swagger [GitHub](https://github.com/shinegami-2002/linkvault)
- Engineered Go REST API platform with JWT and API-key authentication, Redis-backed rate limiting, and PostgreSQL full-text search; designed OpenAPI-first endpoints with versioned routes, structured logging, and automated CI pipeline, containerized with Docker Compose.

**Neural Network Training Dynamics & Pruning** — PyTorch, UMAP/t-SNE, ResNet-18, ViT-Tiny | Jan 2026 - Present
- Trained ResNet-18 and ViT-Tiny on CIFAR-100 using transfer learning; analyzed CNN vs. Transformer representation learning via UMAP/t-SNE and CKA similarity. Applied 50% L1 unstructured pruning, pruned ViT retained 92% top-5 accuracy vs. 3% drop in pruned ResNet, quantifying model compression trade-offs.

**LLM-Driven Procedural Content Generation (LLMs4PCG)** — Python, Phi-3, Gemma-2, Qwen-2.5, Prompt Engineering, ViT Classification
- Applied latest open-source LLMs (Phi-3, Gemma-2, Qwen-2.5) to procedural game-level generation; designed prompt compilation pipeline with constraint satisfaction achieving 100% structural stability. Validated outputs via ViT-based image classification and custom rendering pipeline, bridging NLP and computer vision evaluation with precision/recall metrics. (AAAI 2026 position paper)

**Distributed Task Queue** — Go, gRPC/Protobuf, Redis, PostgreSQL, Docker, Kubernetes, Helm, Prometheus, Grafana [GitHub](https://github.com/shinegami-2002/distributed-task-queue)
- Built distributed task queue in Go with gRPC/Protobuf service interfaces, Redis-backed priority queue (sorted sets), and PostgreSQL persistence; implemented exponential backoff retry logic, dead-letter routing, and pluggable handler registry with configurable worker concurrency.
- Deployed on Kubernetes with Helm charts and horizontal pod autoscaling on custom Prometheus metrics (queue depth); instrumented with Grafana dashboards, structured logging (zerolog), and health checks via Chi v5 HTTP server.

**AI ChatBot** — Python, FastAPI, LangChain, Docker, Node.js, Groq/OpenAI APIs [GitHub](https://github.com/shinegami-2002/AI_ChatBot) | Jan 2025 - Apr 2025
- Deployed multi-provider generative AI web service with FastAPI backend and LangChain orchestration; implemented async API calls to multiple LLM providers achieving 40% latency reduction. Containerized with Docker and provider failover logic for 99.5% availability.

### Publications
- C. Shanmukha Srinivas Sai et al., "Potato Disease Classification Using Diverse Feature Extraction Methods and Machine Learning Models," HIS 2023 (Springer)
- Somesh K, C. Shanmukha Srinivas Sai et al., "Tea Leaf Disease Classification with Ensemble Stacking," ICDLAIR 2024 (IEEE)

### Education
- North Carolina State University, MS Computer Science (Data Science Track), GPA 3.71, Aug 2024 - Jun 2026
- National Institute of Technology Puducherry, BTech Computer Science & Engineering, GPA 8.48/10, Dec 2020 - Mar 2024
- Coursework: Deep Learning, Machine Learning, Neural Networks, Algorithms, Software Engineering, Database Management Systems

### Leadership (keep from current site)
- President, Rotaract Club, NITPY (2022-2023) — 10+ events, blood donation camps, social awareness
- Vice-President, ACE (CS Association), NITPY (2022-2023) — workshops, hackathons, industry talks
- Co-founder, Zer01Coded, NITPY (2021-2022) — coding club, Python classes for 150+ students

### Achievements (keep from current site)
- First position: Blind Coding Challenge, Gyanith Tech Fest, NIT Puducherry (2023)
- Third prize: Hackathon, NIE Mysore, ~90 competitors (2023)
- All India Rank 206: Inter NIT coding marathon, MNIT Bhopal (2022)
- 99.1 percentile: JEE-Mains (top 1% of 1M+ students) (2020)

---

## Owner
Shanmukha Chatadi (shinegami-2002)
MS CS @ NC State, graduating Jun 2026
F-1 visa, targeting New Grad SWE / AI-ML / Data Science roles
