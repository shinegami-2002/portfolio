import { describe, it, expect } from "vitest";
import { BM25 } from "../src/agent/bm25";

const docs = [
  { id: "a", text: "go grpc kubernetes task queue redis priority workers helm" },
  { id: "b", text: "langgraph rag hallucination grader gemini research papers" },
  { id: "c", text: "aws bedrock production platform cognito lambda healthcare" },
];

describe("BM25", () => {
  it("ranks the queue doc first for a queue query", () => {
    const idx = new BM25(docs);
    const hits = idx.search("distributed task queue in go");
    expect(hits[0].id).toBe("a");
  });

  it("ranks the rag doc first for a hallucination query", () => {
    const idx = new BM25(docs);
    expect(idx.search("how do you prevent hallucination in rag")[0].id).toBe("b");
  });

  it("returns empty for nonsense", () => {
    const idx = new BM25(docs);
    expect(idx.search("zzqq xylophone")).toHaveLength(0);
  });

  it("respects topK", () => {
    const idx = new BM25(docs);
    expect(idx.search("go bedrock langgraph", 2).length).toBeLessThanOrEqual(2);
  });
});
