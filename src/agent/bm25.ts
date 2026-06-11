export type Doc = { id: string; text: string };
export type Hit = { id: string; score: number };

/** Light plural/suffix folding — enough for a small English corpus, no Porter needed. */
const stem = (w: string): string => {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
};

const tokenize = (s: string): string[] =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length > 1)
    .map(stem);

/** Tiny BM25 index. Built once over a small corpus; search is O(terms × docs). */
export class BM25 {
  private df = new Map<string, number>();
  private docTf = new Map<string, Map<string, number>>();
  private len = new Map<string, number>();
  private avgLen = 0;
  private N = 0;

  constructor(
    docs: Doc[],
    private k1 = 1.4,
    private b = 0.6,
  ) {
    this.N = docs.length;
    let total = 0;
    for (const d of docs) {
      const toks = tokenize(d.text);
      total += toks.length;
      this.len.set(d.id, toks.length);
      const tf = new Map<string, number>();
      for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
      this.docTf.set(d.id, tf);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    }
    this.avgLen = total / Math.max(1, this.N);
  }

  search(q: string, topK = 4): Hit[] {
    const qt = [...new Set(tokenize(q))];
    const scores = new Map<string, number>();
    for (const t of qt) {
      const df = this.df.get(t);
      if (!df) continue;
      const idf = Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
      for (const [id, tf] of this.docTf) {
        const f = tf.get(t);
        if (!f) continue;
        const L = this.len.get(id)! / this.avgLen;
        const s =
          (idf * (f * (this.k1 + 1))) /
          (f + this.k1 * (1 - this.b + this.b * L));
        scores.set(id, (scores.get(id) ?? 0) + s);
      }
    }
    return [...scores.entries()]
      .map(([id, score]) => ({ id, score }))
      .filter((h) => h.score > 0.1)
      .sort((x, y) => y.score - x.score)
      .slice(0, topK);
  }
}
