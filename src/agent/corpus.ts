import type { CorpusChunk } from "../content/types";
import { profile } from "../content/profile";
import { roles } from "../content/roles";
import { flagships } from "../content/flagships";
import { archive } from "../content/archive";
import { fieldNote } from "../content/photos";

/** Derive the agent's retrieval corpus from the content model. One source of truth. */
export function buildCorpus(): CorpusChunk[] {
  const chunks: CorpusChunk[] = [];

  chunks.push({
    id: "profile",
    title: "About Shanmukha",
    anchor: "hero",
    text:
      `${profile.name}, ${profile.role}, ${profile.location}. Status: available now, open to relocation, ` +
      `full-time AI ML engineer roles, graduating MS computer science NC State May 2026. ${profile.summary} ` +
      `Contact email ${profile.email}. Hiring, looking for work, open to opportunities, job search, next role.`,
  });

  for (const r of roles) {
    chunks.push({
      id: `role-${r.org.toLowerCase().replace(/\W+/g, "-")}`,
      title: `${r.title} · ${r.org}`,
      anchor: r.org === "MiHIN" ? "work-mihin" : "trace",
      text: `${r.title} at ${r.org} (${r.period}, ${r.location}). ${r.summary} ${r.bullets.join(" ")} ${r.tags.join(", ")}.`,
    });
  }

  // Synonym expansion — query vocabulary that the prose doesn't use verbatim.
  const KEYWORDS: Record<string, string> = {
    mihin: "production RAG retrieval augmented generation enterprise deploy ship shipped",
    scholar: "corrective RAG retrieval augmented generation hallucination prevent agent self-correcting evaluate evaluation",
    mcp: "tool use tool calling agent integration drug medical",
    pruning: "research compression sparsity interpretability representations deep learning",
    queue: "golang distributed systems backend infrastructure autoscaling",
  };

  for (const f of flagships) {
    chunks.push({
      id: `flag-${f.id}`,
      title: f.name,
      anchor: `work-${f.id}`,
      text:
        `${f.name} (${f.status}, ${f.period}). ${f.oneLiner} Problem: ${f.problem} Approach: ${f.approach} ` +
        `Field notes: ${f.logLines.join(" ")} Stack: ${f.tags.join(", ")}. ${KEYWORDS[f.id] ?? ""}`,
    });
  }

  for (const a of archive) {
    chunks.push({
      id: `arch-${a.id}`,
      title: a.name,
      anchor: "archive",
      text: `${a.name} (${a.year}, ${a.kind}). ${a.oneLiner} ${a.detail}`,
    });
  }

  chunks.push({
    id: "field",
    title: "Off duty",
    anchor: "field",
    text: `Hobbies and life outside work: ${fieldNote} Travel photos, beaches, hiking, food, basketball, gym, games, cyberpunk.`,
  });

  return chunks;
}
