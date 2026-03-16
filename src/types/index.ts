export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  tags: string[];
  accent: 'cyan' | 'magenta' | 'blue';
  expanded?: boolean;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  period: string;
  description: string;
  bullets: string[];
  tags: string[];
  githubUrl?: string;
  accent: 'cyan' | 'magenta' | 'blue';
  categories: ('ai-ml' | 'backend' | 'full-stack' | 'research')[];
}

export interface SkillNode {
  name: string;
  category: 'ai-ml' | 'languages' | 'cloud' | 'web' | 'databases' | 'libraries';
  proficiency: number;
  position: { x: number; y: number; z: number };
  connections: string[];
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  publisher: 'springer' | 'ieee';
  status: string;
}

export interface Education {
  institution: string;
  degree: string;
  gpa: string;
  period: string;
  coursework?: string[];
}

export interface LeadershipEntry {
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface Achievement {
  title: string;
  year: number;
}

export interface FunFact {
  icon: string;
  title: string;
  detail: string;
}
