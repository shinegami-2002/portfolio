import { Experience } from '@/types';

export const experiences: Experience[] = [
  {
    id: 'mihin',
    title: 'AI Research Intern',
    company: 'MiHIN',
    location: 'Lansing, MI',
    period: 'Jul 2025 - Present',
    bullets: [
      'Architected production Document AI/RAG platform on AWS Bedrock, OpenSearch Serverless (k-NN vector search), and Lambda, enabling 230+ employees to query 1T+ documents via natural language at 75% less than competitors.',
      'Engineered NLP ingestion pipeline with document parsing, Titan V2 embedding generation (1,024-dim), configurable chunking, vector indexing, and retrieval; incorporated human-in-the-loop (HITL) feedback to tune chunk size, overlap, and top-k parameters, reducing LLM hallucination rates by 30%.',
      'Developed AI governance framework aligned with HITRUST CSF, NIST, HIPAA; spearheaded AI Task Force training across DevOps, Legal, and HR, authoring playbooks that enabled 5+ cross-functional teams to integrate generative AI into production workflows.',
      'Delivered serverless REST API with API Gateway, Lambda, Cognito (SSO + 2FA) supporting 230+ users; presented cost analysis to CEO, securing approval for org-wide pilot cutting costs by 75%.',
      'Reduced mean time to detection by 60% through CloudWatch dashboards, structured logging, and custom alarms for real-time monitoring; implemented error handling and retry logic across Lambda functions with dead letter routing for fault tolerance.',
    ],
    tags: ['AWS Bedrock', 'RAG', 'OpenSearch', 'Lambda', 'Python', 'Cognito', 'NLP', 'HITL'],
    accent: 'cyan',
  },
  {
    id: 'rygen',
    title: 'Data & Software Development Analyst',
    company: 'Rygen BioPharma',
    location: 'Hyderabad, India',
    period: 'Mar 2023 - Aug 2024',
    bullets: [
      'Developed full-stack clinical data web application using Flask, React.js, PostgreSQL, REST APIs; centralized data from 4+ research departments, reducing manual reporting time by 40%.',
      'Built end-to-end ML pipelines with Python (scikit-learn, Pandas, NumPy) for clinical outcome prediction: feature engineering, XGBoost/Random Forest with GridSearchCV, achieving 0.89 AUC-ROC across 100K+ records.',
      'Designed ETL/data pipelines processing 100K+ records daily with schema validation and feature extraction; standardized ingestion from 4+ departments, accelerating data delivery by 50%.',
      'Deployed containerized microservices on AWS with Docker and Kubernetes; implemented CI/CD pipelines with Jenkins, reducing release cycles by 35%.',
      'Established API error handling patterns with structured error responses, input validation middleware; achieved 90%+ code coverage through comprehensive unit and integration tests.',
    ],
    tags: ['Flask', 'React', 'PostgreSQL', 'Python', 'scikit-learn', 'Docker', 'Kubernetes', 'Jenkins'],
    accent: 'magenta',
  },
  {
    id: 'treosoft',
    title: 'Data Science Intern',
    company: 'TreoSoft IT Solutions',
    location: 'Bengaluru, India',
    period: 'Jun 2022 - Sep 2022',
    bullets: [
      'Built ML-powered recommendation engine with Flask REST APIs and PostgreSQL; applied Apriori/FP-Growth association mining and K-Means segmentation on 100K+ transactions, driving 15% increase in net sales and 35% revenue uplift.',
    ],
    tags: ['Flask', 'PostgreSQL', 'Python', 'scikit-learn', 'ML'],
    accent: 'blue',
  },
];
