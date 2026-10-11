<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import Icon from "./components/Icon.vue";
import AdditionalResults from "./components/AdditionalResults.vue";
import { locale, t, localize, setLocale } from "./i18n";
import {
  assetUrl,
  datasetItems as datasetItemsContent,
  explanationLevels as explanationLevelsContent,
  navigation as navigationContent,
  paperTitle,
  pipeline as pipelineContent,
  qaResults as qaResultsContent,
  questionViews as questionViewsContent,
  resources as resourcesContent,
  studyStats as studyStatsContent,
} from "./content";

const datasetItems = computed(() => localize(datasetItemsContent));
const explanationLevels = computed(() => localize(explanationLevelsContent));
const navigation = computed(() => localize(navigationContent));
const pipeline = computed(() => localize(pipelineContent));
const qaResults = computed(() => localize(qaResultsContent));
const questionViews = computed(() => localize(questionViewsContent));
const resources = computed(() => localize(resourcesContent));
const studyStats = computed(() => localize(studyStatsContent));

const menuOpen = ref(false);
const activeSection = ref("");
const modelIndex = ref(0);
const questionView = ref<"snapshot" | "process" | "all">("process");
const currentResult = computed(
  () => qaResults.value[modelIndex.value] ?? qaResults.value[0]!,
);
const levelIndex = ref(1);
const currentLevel = computed(
  () =>
    explanationLevels.value[levelIndex.value] ?? explanationLevels.value[1]!,
);
const figureDialog = ref<HTMLDialogElement | null>(null);
const enlargedFigure = ref({ src: "", title: "" });
const titleCopied = ref(false);
const copyError = ref(false);
let observer: IntersectionObserver | undefined;
let copyTimer: ReturnType<typeof setTimeout> | undefined;

function showFigure(src: string, title: string) {
  enlargedFigure.value = { src: assetUrl(src), title };
  figureDialog.value?.showModal();
}
function closeOnBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) figureDialog.value?.close();
}
async function copyTitle() {
  copyError.value = false;
  try {
    await navigator.clipboard.writeText(t(paperTitle));
    titleCopied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      titleCopied.value = false;
    }, 2500);
  } catch {
    copyError.value = true;
  }
}
function closeMenu(event: KeyboardEvent) {
  if (event.key === "Escape") menuOpen.value = false;
}
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) activeSection.value = entry.target.id;
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );
  for (const item of navigation.value) {
    const element = document.getElementById(item.id);
    if (element) observer.observe(element);
  }
  document.addEventListener("keydown", closeMenu);
});
onUnmounted(() => {
  observer?.disconnect();
  clearTimeout(copyTimer);
  document.removeEventListener("keydown", closeMenu);
});
</script>

<template>
  <a class="skip-link" href="#main">{{ t("Skip to content") }}</a>
  <header class="site-header">
    <div class="header-inner container">
      <a
        class="brand"
        href="#top"
        :aria-label="t('DevHound home')"
        @click="menuOpen = false"
      >
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path
              d="M8 18c0-3 4-6 8-6s8 3 8 6c0 5-4 7-8 7s-8-2-8-7Z"
              fill="currentColor"
            />
            <ellipse
              cx="7"
              cy="10"
              rx="3"
              ry="4"
              fill="currentColor"
              transform="rotate(-25 7 10)"
            />
            <ellipse cx="14" cy="6" rx="3" ry="4" fill="currentColor" />
            <ellipse
              cx="22"
              cy="7"
              rx="3"
              ry="4"
              fill="currentColor"
              transform="rotate(20 22 7)"
            />
            <ellipse
              cx="27"
              cy="14"
              rx="2.5"
              ry="3.5"
              fill="currentColor"
              transform="rotate(35 27 14)"
            />
            <path
              d="m12 19 3 3 5-6"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span>DevHound<span class="brand-dot">.</span></span>
      </a>
      <nav
        id="main-navigation"
        class="main-navigation"
        :class="{ 'is-open': menuOpen }"
        :aria-label="t('Main navigation')"
      >
        <a
          v-for="item in navigation"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{
            active: activeSection === item.id,
            'nav-resource': item.id === 'resources',
          }"
          :aria-current="activeSection === item.id ? 'location' : undefined"
          @click="menuOpen = false"
          >{{ item.label }}</a
        >
      </nav>
      <a
        class="header-resource-link"
        href="#resources"
        :aria-current="activeSection === 'resources' ? 'location' : undefined"
        @click="menuOpen = false"
        >{{ t("Dataset & resources") }} <Icon name="arrow" :size="15"
      /></a>
      <div class="language-switch" role="group" :aria-label="t('Language')">
        <button
          type="button"
          :class="{ selected: locale === 'en' }"
          :aria-pressed="locale === 'en'"
          @click="setLocale('en')"
          lang="en"
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          :class="{ selected: locale === 'zh' }"
          :aria-pressed="locale === 'zh'"
          @click="setLocale('zh')"
          lang="zh-CN"
          aria-label="切换到中文"
        >
          中文
        </button>
      </div>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="main-navigation"
        :aria-label="t(menuOpen ? 'Close navigation' : 'Open navigation')"
        @click="menuOpen = !menuOpen"
      >
        <Icon :name="menuOpen ? 'close' : 'menu'" />
      </button>
    </div>
  </header>

  <main id="main">
    <section id="top" class="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="container hero-content">
        <p class="eyebrow hero-eyebrow">
          <span class="status-dot"></span>
          {{ t("Learning from development traces") }}
        </p>
        <h1>
          {{ t("Remembering Why,") }}<br /><em>{{
            t("Answering Adaptively.")
          }}</em>
        </h1>
        <p class="hero-subtitle">
          {{ t("Repository-Level Question Answering")
          }}<br class="desktop-break" />
          {{ t("by Learning from Development Traces") }}
        </p>
        <p class="hero-description">
          {{
            t(
              "Your code preserves the outcome. DevHound remembers the reasoning",
            )
          }}<br class="desktop-break" />
          {{
            t(
              "behind it, and explains what each developer needs to understand.",
            )
          }}
        </p>
        <div class="hero-actions">
          <a
            class="button button-secondary"
            :href="resources.paper"
            target="_blank"
            rel="noopener"
            ><Icon name="file" :size="18" /> {{ t("Read the paper") }}</a
          >
          <a class="button button-secondary" href="#approach"
            ><Icon name="layers" :size="18" />
            {{ t("Explore the approach") }}</a
          >
          <a class="button button-secondary" href="#resources"
            ><Icon name="database" :size="18" />
            {{ t("Dataset & resources") }}</a
          >
        </div>

        <div
          class="hero-flow"
          :aria-label="
            t(
              'Development traces build two complementary memories that support evidence-grounded and adaptive answers',
            )
          "
        >
          <div class="flow-source">
            <span class="flow-icon"><Icon name="trace" :size="24" /></span>
            <div>
              <span class="micro-label">{{ t("01 / Observe") }}</span
              ><strong>{{ t("Development traces") }}</strong
              ><span>{{ t("IDE operations & agent conversations") }}</span>
            </div>
          </div>
          <Icon class="flow-arrow" name="arrow" :size="24" />
          <div class="flow-memories">
            <div class="flow-memory rationale">
              <Icon name="database" :size="19" /><strong>{{
                t("Rationale Memory")
              }}</strong
              ><span>{{ t("Remember why") }}</span>
            </div>
            <div class="flow-memory cognition">
              <Icon name="memory" :size="19" /><strong>{{
                t("Cognition Memory")
              }}</strong
              ><span>{{ t("Know what to explain") }}</span>
            </div>
          </div>
          <Icon class="flow-arrow" name="arrow" :size="24" />
          <div class="flow-answer">
            <span class="flow-icon"><Icon name="check" :size="24" /></span>
            <div>
              <span class="micro-label">{{ t("03 / Answer") }}</span
              ><strong>{{ t("Correct. Contextual. Adaptive.") }}</strong
              ><span>{{ t("Evidence first, explanation second") }}</span>
            </div>
          </div>
        </div>
        <p class="hero-footnote">
          {{
            t("Two complementary memories. One continuous learning process.")
          }}
        </p>
      </div>
    </section>

    <div class="study-band">
      <div class="container study-stats">
        <div class="study-caption">
          <span class="micro-label">{{ t("The study") }}</span
          ><span
            >{{ t("Learning from") }}<br />{{ t("real development.") }}</span
          >
        </div>
        <div v-for="stat in studyStats" :key="stat.label" class="study-stat">
          <strong>{{ stat.value }}</strong
          ><span>{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <section
      class="abstract-section container"
      aria-labelledby="abstract-title"
    >
      <div>
        <p class="eyebrow">{{ t("The idea") }}</p>
        <h2 id="abstract-title">
          {{ t("Development experience,") }} <br />{{ t("made reusable.") }}
        </h2>
      </div>
      <div class="abstract-copy">
        <p>
          {{
            t(
              "Repository question answering requires more than understanding the current code. Historical decisions may no longer be visible, and the same explanation may be too shallow for one developer and redundant for another.",
            )
          }}
        </p>
        <p>
          <strong>{{
            t("DevHound continuously learns from development processes.")
          }}</strong>
          {{
            t(
              "It transforms IDE operations and interactions with AI coding agents into Traces, preserves validated decision evidence in Rationale Memory, and estimates familiarity with individual knowledge points in Developer Cognition Memory. At query time, it combines repository and historical evidence to answer correctly, then adapts the depth of the explanation.",
            )
          }}
        </p>
      </div>
    </section>

    <section id="motivation" class="section section-tinted">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">
            <span class="section-number">01</span> {{ t("Motivation") }}
          </p>
          <h2>
            {{ t("The code tells you what.") }}<br /><em>{{
              t("The process tells you why.")
            }}</em>
          </h2>
          <p>
            {{
              t(
                "Current code reveals how a system behaves. The decisions, rejected alternatives,",
              )
            }}<br class="desktop-break" />
            {{
              t(
                "and constraints that led there often live in the development process.",
              )
            }}
          </p>
        </div>
        <div class="question-callout">
          <span class="question-label"
            ><Icon name="code" :size="18" />
            {{ t("A question from Kubernetes") }}</span
          >
          <p>
            {{ t("Why doesn’t") }} <code>externalTrafficPolicy: Local</code>
            {{ t("also constrain internal NodePort traffic?") }}
          </p>
          <a
            href="https://github.com/kubernetes/kubernetes/issues/104105"
            target="_blank"
            rel="noopener"
            >{{ t("Issue #104105") }} <Icon name="external" :size="14"
          /></a>
        </div>
        <div class="comparison-grid">
          <article class="comparison-panel snapshot-panel">
            <div class="panel-heading">
              <span><Icon name="code" /> {{ t("Repository snapshot") }}</span
              ><span class="small-badge">{{ t("What & how") }}</span>
            </div>
            <h3>{{ t("The implementation is visible.") }}</h3>
            <p>
              {{
                t(
                  "Code and configuration show that external and internal traffic policies are independent, and how that behavior is implemented.",
                )
              }}
            </p>
            <div
              class="coverage-points"
              :aria-label="t('The snapshot supports key points 1 and 5')"
            >
              <span class="supported">KP1</span><span>KP2</span><span>KP3</span
              ><span>KP4</span><span class="supported">KP5</span>
            </div>
            <div class="coverage-label">
              <span>{{ t("Supported key points") }}</span
              ><strong>2 / 5</strong>
            </div>
          </article>
          <article class="comparison-panel rationale-panel">
            <div class="panel-heading">
              <span
                ><Icon name="database" />
                {{ t("Repository + Rationale Memory") }}</span
              ><span class="small-badge green">{{ t("Why") }}</span>
            </div>
            <h3>{{ t("The decision becomes explainable.") }}</h3>
            <ul class="check-list">
              <li>
                <Icon name="check" :size="17" /><span
                  ><strong>{{ t("Rejected alternative.") }}</strong>
                  {{
                    t(
                      "Treating all NodePort traffic as external could drop internal requests.",
                    )
                  }}</span
                >
              </li>
              <li>
                <Icon name="check" :size="17" /><span
                  ><strong>{{ t("Compatibility constraint.") }}</strong>
                  {{
                    t("Existing users relied on in-cluster NodePort access.")
                  }}</span
                >
              </li>
              <li>
                <Icon name="check" :size="17" /><span
                  ><strong>{{ t("Design choice.") }}</strong>
                  {{
                    t(
                      "Independent policies support external-local and internal-cluster routing together.",
                    )
                  }}</span
                >
              </li>
            </ul>
            <div
              class="coverage-points"
              :aria-label="
                t(
                  'Combining repository and process evidence supports all five key points',
                )
              "
            >
              <span class="supported">KP1</span
              ><span class="process-point">KP2</span
              ><span class="process-point">KP3</span
              ><span class="process-point">KP4</span
              ><span class="supported">KP5</span>
            </div>
            <div class="coverage-label">
              <span>{{ t("Repository + process evidence") }}</span
              ><strong>5 / 5</strong>
            </div>
          </article>
        </div>
        <div class="comparison-note">
          <p>
            {{
              t(
                "Evidence coverage in the paper’s motivating example. A plausible reason inferred from code is not historical decision evidence.",
              )
            }}
          </p>
          <button
            class="text-link"
            type="button"
            @click="
              showFigure(
                'figures/motivation.webp',
                'Motivating example from the paper',
              )
            "
          >
            {{ t("View paper figure") }} <Icon name="expand" :size="15" />
          </button>
        </div>
      </div>
    </section>

    <section id="approach" class="section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">
            <span class="section-number">02</span> {{ t("Approach") }}
          </p>
          <h2>
            {{ t("Remember the rationale.") }}<br /><em>{{
              t("Understand the developer.")
            }}</em>
          </h2>
          <p>
            {{
              t(
                "DevHound learns two different kinds of knowledge from the same development history.",
              )
            }}
          </p>
        </div>
        <div class="memory-grid">
          <article class="memory-card memory-rationale">
            <div class="memory-card-top">
              <span class="memory-icon"
                ><Icon name="database" :size="26" /></span
              ><span class="micro-label">{{
                t("Repository-level knowledge")
              }}</span>
            </div>
            <h3>{{ t("Rationale Memory") }}</h3>
            <p class="memory-question">
              {{ t("“Why was this decision made?”") }}
            </p>
            <p>
              {{
                t(
                  "Preserve historical decisions with their reasons, original Trace evidence, and repository entities.",
                )
              }}
            </p>
            <div class="mini-pipeline">
              <span>{{ t("Trace") }}</span
              ><Icon name="arrow" :size="14" /><span>{{ t("Task") }}</span
              ><Icon name="arrow" :size="14" /><span>{{ t("Rationale") }}</span
              ><Icon name="arrow" :size="14" /><strong>{{
                t("Validation")
              }}</strong>
            </div>
            <div class="tag-list">
              <span>{{ t("Intent") }}</span
              ><span>{{ t("Contract") }}</span
              ><span>{{ t("Failure") }}</span
              ><span>{{ t("Dependency") }}</span
              ><span>{{ t("Solution") }}</span>
            </div>
            <div class="memory-rule">
              <Icon name="check" :size="17" />
              {{ t("Supplies evidence for the answer") }}
            </div>
          </article>
          <article class="memory-card memory-cognition">
            <div class="memory-card-top">
              <span class="memory-icon"><Icon name="memory" :size="26" /></span
              ><span class="micro-label">{{
                t("Developer × knowledge point")
              }}</span>
            </div>
            <h3>{{ t("Developer Cognition Memory") }}</h3>
            <p class="memory-question">
              {{ t("“How much should we explain?”") }}
            </p>
            <p>
              {{
                t(
                  "Estimate familiarity from behavioral evidence, and choose the explanation depth for each knowledge point.",
                )
              }}
            </p>
            <div class="familiarity-scale">
              <span
                ><i></i>{{ t("Novice")
                }}<small>{{ t("Concepts & reasoning") }}</small></span
              ><span
                ><i></i>{{ t("Regular")
                }}<small>{{ t("Implementation") }}</small></span
              ><span
                ><i></i>{{ t("Expert")
                }}<small>{{ t("Conclusion & boundary") }}</small></span
              >
            </div>
            <div class="memory-rule">
              <Icon name="check" :size="17" />
              {{ t("Adapts depth while preserving facts and evidence") }}
            </div>
          </article>
        </div>
        <div class="pipeline-heading">
          <h3>{{ t("From a question to an answer") }}</h3>
          <span class="micro-label">{{ t("The QA pipeline") }}</span>
        </div>
        <div class="pipeline-grid">
          <article v-for="(step, index) in pipeline" :key="step.title">
            <span class="step-number">0{{ index + 1 }}</span
            ><Icon :name="step.icon" :size="25" />
            <h4>{{ step.title }}</h4>
            <p>{{ step.text }}</p>
          </article>
        </div>
        <figure class="paper-figure">
          <div class="figure-header">
            <span
              ><span class="figure-label">{{ t("System overview") }}</span>
              {{ t("The complete DevHound approach") }}</span
            ><button
              class="text-link"
              type="button"
              @click="
                showFigure(
                  'figures/approach.webp',
                  'The complete DevHound approach',
                )
              "
            >
              {{ t("Enlarge") }} <Icon name="expand" :size="16" />
            </button>
          </div>
          <button
            class="figure-image-button"
            type="button"
            :aria-label="t('Enlarge the DevHound system overview')"
            @click="
              showFigure(
                'figures/approach.webp',
                'The complete DevHound approach',
              )
            "
          >
            <img
              :src="assetUrl('figures/approach.webp')"
              width="2200"
              height="1526"
              :alt="
                t(
                  'DevHound architecture: question understanding, search and reasoning, adaptive answer generation, Trace extraction, validated Rationale Memory construction, and Cognition Memory modeling.',
                )
              "
              loading="lazy"
            />
          </button>
          <figcaption>
            {{
              t(
                "Original method figure from the manuscript. Rationale Memory supports reasoning; Cognition Memory regulates explanation depth.",
              )
            }}
          </figcaption>
        </figure>
        <div class="explanation-demo">
          <div class="explanation-intro">
            <p class="eyebrow">{{ t("Try the idea") }}</p>
            <h3>
              {{ t("Same evidence.") }} <br />{{
                t("Different explanation depth.")
              }}
            </h3>
            <p>
              {{
                t(
                  "Choose a familiarity level for the Kubernetes policy knowledge point to see how an explanation can adapt.",
                )
              }}
            </p>
            <p class="subtle-note">
              {{
                t(
                  "Illustrative paraphrases of the paper’s example. This is a reading aid, not a live agent demo.",
                )
              }}
            </p>
          </div>
          <div class="explanation-content">
            <div
              class="segmented-control"
              role="group"
              :aria-label="t('Familiarity with this knowledge point')"
            >
              <button
                v-for="(level, index) in explanationLevels"
                :key="level.id"
                type="button"
                :class="{ selected: levelIndex === index }"
                :aria-pressed="levelIndex === index"
                @click="levelIndex = index"
              >
                {{ level.label }}
              </button>
            </div>
            <div
              class="explanation-answer"
              aria-live="polite"
              aria-atomic="true"
            >
              <span class="answer-depth"
                ><span class="status-dot"></span>{{ currentLevel.detail }}</span
              >
              <p v-for="paragraph in currentLevel.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
            <div class="explanation-evidence">
              <Icon name="file" :size="16" /><span>{{
                t("Same source: paper motivation & Kubernetes Issue #104105")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="evaluation" class="section section-tinted">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">
            <span class="section-number">03</span> {{ t("Evaluation") }}
          </p>
          <h2>
            {{ t("Better answers start") }}<br /><em>{{
              t("with better evidence.")
            }}</em>
          </h2>
          <p>
            {{
              t(
                "An eight-week naturalistic study spanning 10 developers, 10 repositories,",
              )
            }}<br class="desktop-break" />
            {{
              t(
                "and 200 questions, divided equally between Snapshot-based and Process-based Questions.",
              )
            }}
          </p>
        </div>
        <div class="result-highlights">
          <div>
            <strong
              >+2.34–2.79<span>{{ t("pts") }}</span></strong
            >
            <p>
              {{ t("Overall KAC gain over") }}<br />{{
                t("same-model QA baselines")
              }}
            </p>
          </div>
          <div>
            <strong>8.45–9.00<span>/ 10</span></strong>
            <p>
              {{ t("Overall answer correctness") }}<br />{{
                t("across four models")
              }}
            </p>
          </div>
          <div>
            <strong
              >4.01–4.49<span>{{ t("pts") }}</span></strong
            >
            <p>
              {{ t("Process-based KAC loss") }}<br />{{
                t("when Rationale Memory is removed")
              }}
            </p>
          </div>
        </div>
        <div class="results-panel">
          <div class="results-top">
            <div>
              <span class="micro-label">{{
                t("RQ1 / Answer correctness")
              }}</span>
              <h3>{{ t("Where development history makes a difference") }}</h3>
            </div>
            <label class="model-selector"
              >{{ t("Foundation model")
              }}<select
                v-model="modelIndex"
                :aria-label="t('Foundation model')"
              >
                <option
                  v-for="(model, index) in qaResults"
                  :key="model.model"
                  :value="index"
                >
                  {{ model.model }}
                </option>
              </select></label
            >
          </div>
          <div class="chart-toolbar">
            <div
              class="segmented-control"
              role="group"
              :aria-label="t('Question category')"
            >
              <button
                v-for="view in questionViews"
                :key="view.id"
                type="button"
                :class="{ selected: questionView === view.id }"
                :aria-pressed="questionView === view.id"
                @click="questionView = view.id"
              >
                {{ view.label }}
              </button>
            </div>
            <span
              >{{ t("KAC / 10") }}
              <span class="chart-better">{{
                t("↑ Higher is better")
              }}</span></span
            >
          </div>
          <div
            class="bar-chart"
            role="img"
            :aria-label="
              `${currentResult.model}, ${t(questionView)} ${t('answer correctness')}. ` +
              currentResult.rows
                .map(
                  (row) =>
                    `${row.method}: ${row[questionView].toFixed(2)} / 10`,
                )
                .join('. ')
            "
          >
            <div
              class="chart-row"
              v-for="(row, index) in currentResult.rows"
              :key="row.method"
            >
              <span class="chart-method" :class="{ 'our-method': index === 0 }"
                >{{ row.method
                }}<span v-if="index === 0" class="chart-ours">{{
                  t("Ours")
                }}</span></span
              >
              <div class="bar-track">
                <div
                  class="chart-bar"
                  :class="{
                    'bar-ours': index === 0,
                    'bar-ablation': index === 1,
                  }"
                  :style="{ width: `${row[questionView] * 10}%` }"
                ></div>
              </div>
              <strong
                class="chart-value"
                :class="{ 'our-method': index === 0 }"
                >{{ row[questionView].toFixed(2) }}</strong
              >
            </div>
            <div class="chart-axis">
              <span></span>
              <div>
                <span>0</span><span>2</span><span>4</span><span>6</span
                ><span>8</span><span>10</span>
              </div>
              <span></span>
            </div>
          </div>
          <p class="chart-caption">
            {{
              t(
                "Values reported in the current manuscript’s RQ1 table. KAC sums correctly covered key points on a 10-point rubric. Switch the model and question category to inspect the comparison.",
              )
            }}
          </p>
          <details class="results-table-details">
            <summary>
              {{ t("View all values for") }} {{ currentResult.model }}
            </summary>
            <div class="table-scroll">
              <table>
                <caption class="sr-only">
                  {{
                    currentResult.model
                  }}
                  {{
                    t("answer correctness and overall latency")
                  }}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{{ t("Method") }}</th>
                    <th scope="col">{{ t("Snapshot KAC") }}</th>
                    <th scope="col">{{ t("Process KAC") }}</th>
                    <th scope="col">{{ t("Overall KAC") }}</th>
                    <th scope="col">{{ t("Overall time (s)") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in currentResult.rows" :key="row.method">
                    <th scope="row">{{ row.method }}</th>
                    <td>{{ row.snapshot.toFixed(2) }}</td>
                    <td>{{ row.process.toFixed(2) }}</td>
                    <td>{{ row.all.toFixed(2) }}</td>
                    <td>{{ row.time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>
        <AdditionalResults @enlarge="showFigure" />
        <details class="study-details">
          <summary>
            <Icon name="layers" :size="18" />
            {{ t("View the experimental procedure") }}
            <Icon name="down" :size="16" />
          </summary>
          <img
            :src="assetUrl('figures/experiment.webp')"
            width="1800"
            height="451"
            :alt="
              t(
                'Experimental procedure: participant recruitment, eight weeks of observation, de-identification, dataset construction and annotation for RQ1, RQ2 and RQ3, followed by evaluation.',
              )
            "
            loading="lazy"
          />
        </details>
      </div>
    </section>

    <section id="demo" class="section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">
            <span class="section-number">04</span> {{ t("Demonstration") }}
          </p>
          <h2>
            {{ t("See the learning.") }}<br /><em>{{
              t("Follow the reasoning.")
            }}</em>
          </h2>
          <p>
            {{
              t(
                "Two walkthroughs show how development experience becomes useful at question time.",
              )
            }}
          </p>
        </div>
        <div class="demo-grid">
          <article
            v-for="(demo, index) in resources.demos"
            :key="demo.id"
            class="demo-card"
          >
            <div class="video-frame">
              <video
                v-if="demo.videoUrl"
                controls
                playsinline
                preload="metadata"
                :poster="demo.poster ?? undefined"
                :aria-label="demo.title"
              >
                <source :src="demo.videoUrl" />
                {{ t("Your browser does not support video playback.") }}
                <a :href="demo.videoUrl">{{ t("Download the video") }}</a
                >.</video
              ><iframe
                v-else-if="demo.embedUrl"
                :src="demo.embedUrl"
                :title="demo.title"
                loading="lazy"
                allow="fullscreen; picture-in-picture"
                allowfullscreen
              ></iframe>
              <div v-else class="video-placeholder">
                <div class="video-window" aria-hidden="true">
                  <div class="window-bar">
                    <i></i><i></i><i></i
                    ><span
                      >devhound /
                      {{ t(demo.id === "memory" ? "learn" : "answer") }}</span
                    >
                  </div>
                  <div class="window-flow">
                    <span v-for="(step, stepIndex) in demo.steps" :key="step"
                      ><small>0{{ stepIndex + 1 }}</small
                      >{{ step
                      }}<Icon v-if="stepIndex < 2" name="down" :size="14"
                    /></span>
                  </div>
                </div>
                <div class="video-coming-soon">
                  <span class="play-symbol"
                    ><Icon name="play" :size="24" /></span
                  ><span>{{ t("Video coming soon") }}</span>
                </div>
              </div>
            </div>
            <div class="demo-caption">
              <span class="micro-label"
                >{{ t("Demo 0") }}{{ index + 1 }} / {{ demo.label }}</span
              >
              <h3>{{ demo.title }}</h3>
              <p>{{ demo.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="resources" class="section resources-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">
            <span class="section-number">05</span> {{ t("Research resources") }}
          </p>
          <h2>
            {{ t("Explore the work.") }}<br /><em>{{
              t("Build on the experience.")
            }}</em>
          </h2>
          <p>
            {{
              t(
                "The manuscript and dataset are available below. The implementation release will be added here.",
              )
            }}
          </p>
        </div>
        <div class="resource-banner">
          <div class="resource-banner-icon">
            <Icon name="file" :size="29" />
          </div>
          <div>
            <span class="micro-label">{{ t("Research manuscript") }}</span>
            <h3>{{ t(paperTitle) }}</h3>
            <span class="resource-meta">{{
              t("PDF · Anonymous authors · Current manuscript")
            }}</span>
          </div>
          <a
            class="button button-primary"
            :href="resources.paper"
            target="_blank"
            rel="noopener"
            >{{ t("Read paper") }} <Icon name="external" :size="16"
          /></a>
        </div>
        <div class="dataset-heading">
          <div>
            <h3>{{ t("DevHound research dataset") }}</h3>
            <p>
              {{
                t("The package includes 200 repository questions and human evaluation materials.")
              }}
            </p>
          </div>
          <a
            v-if="resources.dataset"
            class="button button-secondary"
            :href="resources.dataset"
            download
            ><Icon name="download" :size="18" /> {{ t("Download dataset") }}</a
          ><span v-else class="availability"
            ><Icon name="clock" :size="16" />
            {{ t("Release coming soon") }}</span
          >
        </div>
        <div class="dataset-list">
          <article v-for="(item, index) in datasetItems" :key="item.name">
            <span class="dataset-index">0{{ index + 1 }}</span>
            <h4>
              {{ item.name }}<span>{{ item.scope }}</span>
            </h4>
            <p>{{ item.description }}</p>
            <a
              v-if="resources.dataset"
              :href="resources.dataset"
              download
              :aria-label="`${t('Download dataset including')} ${item.name}`"
              ><Icon name="download" :size="19" /></a
            ><span v-else class="dataset-status">{{ t("Coming soon") }}</span>
          </article>
        </div>
        <div class="resource-bottom">
          <div>
            <Icon name="code" :size="19" /><span>{{
              t("DevHound implementation")
            }}</span
            ><a
              v-if="resources.code"
              class="text-link"
              :href="resources.code"
              target="_blank"
              rel="noopener"
              >{{ t("View source") }} <Icon name="external" :size="15" /></a
            ><span v-else class="subtle-note">{{
              t("Release coming soon")
            }}</span>
          </div>
          <button class="text-link" type="button" @click="copyTitle">
            <Icon :name="titleCopied ? 'check' : 'copy'" :size="16" /><span
              aria-live="polite"
              >{{
                t(titleCopied ? "Paper title copied" : "Copy paper title")
              }}</span
            >
          </button>
        </div>
        <p v-if="copyError" class="copy-error" role="status">
          {{
            t(
              "Clipboard access is unavailable. You can select and copy the paper title above.",
            )
          }}
        </p>
      </div>
    </section>
  </main>

  <footer class="site-footer container">
    <div>
      <a class="footer-brand" href="#top"
        >DevHound<span class="brand-dot">.</span></a
      >
      <p>{{ t("Remembering why. Answering adaptively.") }}</p>
    </div>
    <p>{{ t("Learning from development traces.") }}</p>
    <a class="text-link" href="#top"
      >{{ t("Back to top") }} <Icon class="up-arrow" name="down" :size="16"
    /></a>
  </footer>

  <dialog
    ref="figureDialog"
    class="figure-dialog"
    aria-labelledby="figure-dialog-title"
    @click="closeOnBackdrop"
  >
    <div class="dialog-header">
      <h2 id="figure-dialog-title">{{ t(enlargedFigure.title) }}</h2>
      <button
        class="icon-button"
        type="button"
        :aria-label="t('Close figure')"
        autofocus
        @click="figureDialog?.close()"
      >
        <Icon name="close" :size="22" />
      </button>
    </div>
    <img
      v-if="enlargedFigure.src"
      :src="enlargedFigure.src"
      :alt="t(enlargedFigure.title)"
    />
    <p>{{ t("Press Escape or click outside the figure to close.") }}</p>
  </dialog>
</template>
