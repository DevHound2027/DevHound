// All replaceable resources live here. null means a visibly unavailable resource.
export const paperTitle =
  "Remembering Why, Answering Adaptively: Repository-Level Question Answering by Learning from Development Traces";

export const assetUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const resources = {
  paper: assetUrl("paper/devhound.pdf"),
  dataset: assetUrl("dataset/devhound.zip") as string | null,
  code: null as string | null,
  // Use a direct .mp4/.webm URL for videoUrl, or a trusted video embed URL for embedUrl.
  demos: [
    {
      id: "memory",
      title: "Learning from development",
      label: "Memory construction",
      description:
        "Follow IDE operations and agent conversations as they become Traces, Tasks, and validated Rationale Memory.",
      videoUrl: assetUrl("videos/过程知识沉淀.mp4"),
      embedUrl: null as string | null,
      poster: assetUrl("videos/memory-construction-poster.jpg"),
      steps: ["Observe development", "Identify Tasks", "Validate rationale"],
    },
    {
      id: "qa",
      title: "Answering with context",
      label: "Repository Q&A",
      description:
        "See a repository question refined, answered with historical evidence, and explained at the depth a developer needs.",
      videoUrl: assetUrl("videos/问答.mp4"),
      embedUrl: null as string | null,
      poster: assetUrl("videos/repository-qa-poster.jpg"),
      steps: [
        "Understand the question",
        "Retrieve evidence",
        "Adapt the explanation",
      ],
    },
  ],
};

export const navigation = [
  { id: "motivation", label: "Motivation" },
  { id: "approach", label: "Approach" },
  { id: "evaluation", label: "Evaluation" },
  { id: "demo", label: "Demo" },
  { id: "resources", label: "Dataset & resources" },
];

export const studyStats = [
  { value: "8", label: "weeks of observation" },
  { value: "10", label: "developers" },
  { value: "10", label: "repositories" },
  { value: "200", label: "repository questions" },
];

export const pipeline = [
  {
    title: "Understand the question",
    icon: "search",
    text: "Use recent development context to resolve ambiguous entities and make the task intent explicit.",
  },
  {
    title: "Search & reason",
    icon: "layers",
    text: "Plan, retrieve, and verify evidence from the current repository and Rationale Memory until the question can be answered.",
  },
  {
    title: "Adapt the explanation",
    icon: "memory",
    text: "Build an evidence-backed answer outline, then adjust the explanation depth for each knowledge point.",
  },
];

// Transcribed from sections/05-results.tex, RQ1 main results. KAC is scored out of 10.
// Manuscript-reported values; these are not independently reproduced website runs.
export const qaResults = [
  {
    model: "Sonnet 5",
    rows: [
      {
        method: "DevHound",
        snapshot: 8.97,
        process: 9.03,
        all: 9.0,
        time: 152,
      },
      {
        method: "w/o Rationale Memory",
        snapshot: 8.65,
        process: 5.02,
        all: 6.84,
        time: 172,
      },
      { method: "Cursor", snapshot: 8.46, process: 4.46, all: 6.46, time: 192 },
      {
        method: "SWE-QA-Agent",
        snapshot: 8.31,
        process: 4.18,
        all: 6.25,
        time: 193.5,
      },
      {
        method: "DeepRepoQA",
        snapshot: 8.55,
        process: 4.62,
        all: 6.59,
        time: 222,
      },
    ],
  },
  {
    model: "GPT 5.6 Terra",
    rows: [
      {
        method: "DevHound",
        snapshot: 8.74,
        process: 8.95,
        all: 8.85,
        time: 148.5,
      },
      {
        method: "w/o Rationale Memory",
        snapshot: 8.76,
        process: 4.72,
        all: 6.74,
        time: 175,
      },
      {
        method: "Cursor",
        snapshot: 8.74,
        process: 4.28,
        all: 6.51,
        time: 199.5,
      },
      {
        method: "SWE-QA-Agent",
        snapshot: 8.18,
        process: 3.94,
        all: 6.06,
        time: 194.5,
      },
      {
        method: "DeepRepoQA",
        snapshot: 8.37,
        process: 4.4,
        all: 6.39,
        time: 223,
      },
    ],
  },
  {
    model: "DeepSeek V4.1 Flash",
    rows: [
      {
        method: "DevHound",
        snapshot: 8.36,
        process: 8.53,
        all: 8.45,
        time: 121,
      },
      {
        method: "w/o Rationale Memory",
        snapshot: 8.18,
        process: 4.1,
        all: 6.14,
        time: 156,
      },
      {
        method: "Cursor",
        snapshot: 8.12,
        process: 3.98,
        all: 6.05,
        time: 165.5,
      },
      {
        method: "SWE-QA-Agent",
        snapshot: 7.75,
        process: 3.72,
        all: 5.74,
        time: 162.5,
      },
      {
        method: "DeepRepoQA",
        snapshot: 7.98,
        process: 4.05,
        all: 6.02,
        time: 185.5,
      },
    ],
  },
  {
    model: "GLM 5.3 Flash",
    rows: [
      {
        method: "DevHound",
        snapshot: 8.52,
        process: 8.68,
        all: 8.6,
        time: 126,
      },
      {
        method: "w/o Rationale Memory",
        snapshot: 8.24,
        process: 4.19,
        all: 6.22,
        time: 162,
      },
      { method: "Cursor", snapshot: 8.28, process: 4.05, all: 6.17, time: 171 },
      {
        method: "SWE-QA-Agent",
        snapshot: 7.91,
        process: 3.81,
        all: 5.86,
        time: 168,
      },
      {
        method: "DeepRepoQA",
        snapshot: 8.11,
        process: 4.16,
        all: 6.14,
        time: 192,
      },
    ],
  },
];

export const questionViews = [
  { id: "process", label: "Process-based" },
  { id: "snapshot", label: "Snapshot-based" },
  { id: "all", label: "All questions" },
] as const;

// Reading aid paraphrased from the paper's Kubernetes example; not a live agent response.
export const explanationLevels = [
  {
    id: "novice",
    label: "Novice",
    detail: "Concepts + reasoning",
    paragraphs: [
      "A NodePort makes a Service reachable through a port on each node. Traffic may arrive from outside the cluster or from a client inside it. These two sources can need different routing behavior.",
      "Applying the external Local policy to all NodePort traffic was rejected: an internal request could be dropped on a node with no local endpoint. Existing users also relied on reaching local NodePorts from inside the cluster, so changing that behavior risked breaking compatibility.",
      "Independent policies preserve the intended combination: local routing for external traffic and cluster-wide routing for internal traffic. The current implementation shows the behavior; the development discussion explains the decision.",
    ],
  },
  {
    id: "regular",
    label: "Regular",
    detail: "Mechanism + rationale",
    paragraphs: [
      "externalTrafficPolicy and internalTrafficPolicy control their respective traffic scopes independently. Treating all NodePort traffic as external was rejected because internal requests could be dropped when a node had no local endpoint.",
      "Existing in-cluster NodePort access also created a compatibility constraint. Independent policies allow external traffic to remain local while internal traffic can reach endpoints across the cluster.",
    ],
  },
  {
    id: "expert",
    label: "Expert",
    detail: "Conclusion + boundary",
    paragraphs: [
      "Keep external and internal routing policies independent: applying external Local behavior to all NodePort traffic risks dropping internal requests on nodes without local endpoints and breaking existing in-cluster NodePort access.",
      "The design supports external-local and internal-cluster routing together. This rationale comes from the development discussion, alongside the current implementation evidence.",
    ],
  },
] as const;

export const datasetItems = [
  {
    name: "Repository Q&A",
    scope: "200 questions",
    description:
      "100 Snapshot-based and 100 Process-based Questions, with key-point scoring rubrics and supporting evidence.",
  },
  {
    name: "Cognitive needs",
    scope: "Human evaluation materials",
    description:
      "Participant-specific familiarity labels, answer-fit ratings, assessment guides, and the cognition annotation interface.",
  },
];
