export type ChipT = {
  label: string;
  href?: string;
  kind: "github" | "video" | "paper" | "live" | "action";
};

export type SpecRow = { k: string; v: string };

export type Metric = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
};

export type Flagship = {
  id: "mihin" | "scholar" | "mcp" | "pruning" | "queue";
  name: string;
  status: "PROD" | "OSS" | "RESEARCH";
  period: string;
  oneLiner: string;
  chips: ChipT[];
  metrics: Metric[];
  problem: string;
  approach: string;
  logLines: string[];
  tags: string[];
};

export type ArchiveEntry = {
  id: string;
  name: string;
  year: string;
  oneLiner: string;
  detail: string;
  chips: ChipT[];
  kind: "project" | "publication" | "certification" | "leadership";
};

export type Role = {
  org: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
  tags: string[];
  spanStart: number;
  spanEnd: number | null;
};

export type Photo = { src: string; caption: string; place: string };

export type CorpusChunk = {
  id: string;
  title: string;
  anchor: string;
  text: string;
};
