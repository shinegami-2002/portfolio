import { describe, it, expect } from "vitest";
import { BM25 } from "../src/agent/bm25";
import { buildCorpus } from "../src/agent/corpus";
import { LocalRetrievalProvider } from "../src/agent/provider";

const corpus = buildCorpus();
const index = new BM25(corpus.map((c) => ({ id: c.id, text: c.text })));
const top = (q: string) => index.search(q)[0]?.id;

describe("corpus retrieval sanity", () => {
  it("production platform questions hit MiHIN", () => {
    expect(["flag-mihin", "role-mihin"]).toContain(top("what has he shipped to production"));
  });
  it("go questions hit go projects", () => {
    expect(["flag-queue", "arch-linkvault"]).toContain(top("does he know go and kubernetes"));
  });
  it("hallucination questions hit scholaragent", () => {
    expect(top("how do you prevent hallucinations in rag")).toBe("flag-scholar");
  });
  it("availability questions hit profile", () => {
    expect(top("is he looking for work right now")).toBe("profile");
  });
  it("mcp questions hit the mcp server", () => {
    expect(["flag-mcp", "role-mihin", "flag-mihin"]).toContain(top("model context protocol tools"));
  });
  it("pruning questions hit the research", () => {
    expect(top("what did the pruning study find")).toBe("flag-pruning");
  });
  it("hobby questions hit field log", () => {
    expect(top("what does he do outside of work hobbies")).toBe("field");
  });
});

describe("LocalRetrievalProvider", () => {
  it("answers with citations for a real query", async () => {
    const p = new LocalRetrievalProvider();
    const a = await p.answer("tell me about the rag platform");
    expect(a.text.length).toBeGreaterThan(40);
    expect(a.citations.length).toBeGreaterThan(0);
    expect(a.steps[0].tool).toBe("search_corpus");
  });
  it("is honest about misses", async () => {
    const p = new LocalRetrievalProvider();
    const a = await p.answer("qqzz underwater xylophone juggling");
    expect(a.text).toMatch(/Nothing indexed/);
    expect(a.citations).toHaveLength(0);
  });
});
