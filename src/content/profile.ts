export const profile = {
  name: "Shanmukha Chatadi",
  brand: "S.CHATADI",
  role: "Applied AI/ML Engineer",
  status: "AVAILABLE NOW",
  statusDetail: "MS CS · NC State · May 2026",
  location: "Raleigh, NC",
  relocation: "Open to relocate",
  email: "shanmukh.nitpy@gmail.com",
  github: "https://github.com/shinegami-2002",
  linkedin: "https://linkedin.com/in/shanmukha-chatadi",
  resume: "/resume.pdf",
  // The one-paragraph truth. No adjectives without numbers.
  summary:
    "I build AI systems that have to survive production: a RAG platform 230+ people use daily at a healthcare " +
    "nonprofit, agent pipelines that grade their own retrievals before answering, and the Go infrastructure " +
    "underneath. Two published papers, one AAAI contribution, and a habit of measuring everything.",
  badge: {
    src: "/photos/me.webp",
    rows: [
      ["OPERATOR", "S. CHATADI"],
      ["UNIT", "NC STATE · MS CS '26"],
      ["BASE", "RALEIGH, NC"],
    ] as [string, string][],
  },
  heroMetrics: [
    { value: 2.5, suffix: "+", label: "years shipping", decimals: 1 },
    { value: 230, suffix: "+", label: "users in prod" },
    { value: 3, label: "publications" },
  ],
  currently: [
    "shipping A2A agents on Bedrock AgentCore @ MiHIN",
    "open for full-time AI/ML roles — available now",
    "latest: 11 pruned ResNets, fingerprinted from one image",
    "teaching agents to cite their sources or stay quiet",
  ],
};
