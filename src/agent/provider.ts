import { BM25 } from "./bm25";
import { buildCorpus } from "./corpus";
import type { CorpusChunk } from "../content/types";

export type ToolStep = { tool: string; arg: string; result: string };
export type Citation = { title: string; anchor: string };
export type AgentAnswer = {
  steps: ToolStep[];
  text: string;
  citations: Citation[];
};

export interface AnswerProvider {
  answer(q: string): Promise<AgentAnswer>;
}

/** Pull the 1–2 sentences of a chunk that best match the query terms. */
function bestExcerpt(chunk: CorpusChunk, q: string, maxLen = 260): string {
  const terms = q.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const sents = chunk.text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 30);
  const scored = sents
    .map((s) => {
      const sl = s.toLowerCase();
      return { s, n: terms.filter((t) => sl.includes(t)).length };
    })
    .sort((a, b) => b.n - a.n);
  let out = scored[0]?.s ?? chunk.text.slice(0, maxLen);
  if (scored[1] && scored[1].n > 0 && (out + scored[1].s).length < maxLen * 1.6) {
    out += " " + scored[1].s;
  }
  return out.replace(/\s+/g, " ").trim();
}

/**
 * v1 provider: local BM25 retrieval + excerpt assembly. Honest by construction —
 * it only ever says things that exist in the corpus, and says so when nothing matches.
 * Swap point for a future LLM-backed provider (see spec §6).
 */
export class LocalRetrievalProvider implements AnswerProvider {
  private corpus = buildCorpus();
  private index = new BM25(this.corpus.map((c) => ({ id: c.id, text: c.text })));
  private byId = new Map(this.corpus.map((c) => [c.id, c]));

  async answer(q: string): Promise<AgentAnswer> {
    const hits = this.index.search(q, 3);
    const steps: ToolStep[] = [
      {
        tool: "search_corpus",
        arg: q.length > 42 ? q.slice(0, 40) + "…" : q,
        result: `${hits.length} hit${hits.length === 1 ? "" : "s"}`,
      },
    ];

    if (hits.length === 0) {
      return {
        steps,
        text:
          "Nothing indexed for that. This agent only answers from what's actually on this page — " +
          "try asking about production RAG, agent pipelines, Go infrastructure, or the pruning research.",
        citations: [],
      };
    }

    const top = hits
      .map((h) => this.byId.get(h.id)!)
      .filter(Boolean);

    steps.push({
      tool: "read_chunks",
      arg: top.map((c) => c.id).join(", "),
      result: "ok",
    });

    const parts = top.slice(0, 2).map((c, i) => `${bestExcerpt(c, q)} [${i + 1}]`);
    return {
      steps,
      text: parts.join(" "),
      citations: top.slice(0, 3).map((c) => ({ title: c.title, anchor: c.anchor })),
    };
  }
}
