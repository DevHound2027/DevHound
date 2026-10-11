<script setup lang="ts">
import { computed, ref } from "vue";
import Icon from "./Icon.vue";
import data from "../results-data.json";
import { t } from "../i18n";

const emit = defineEmits<{ enlarge: [src: string, title: string] }>();
const models = [...new Set(data.rq3.map((row) => row.model))];
const selectedModel = ref(models[1]!);
const metric = ref<"precision" | "recall" | "f1">("f1");
const metrics = ["precision", "recall", "f1"] as const;
const rows = computed(() =>
  data.rq3.filter((row) => row.model === selectedModel.value),
);
const metricLabels = { precision: "Precision", recall: "Recall", f1: "F1" };
const metricNotes = [
  "Correct familiarity labels among matched key points.",
  "Balanced performance across the three familiarity levels.",
  "Reference key points both covered and assigned the correct level.",
];
const chartLabel = computed(
  () =>
    `${selectedModel.value}: ${rows.value.map((row) => `${t(row.method)} ${t(metricLabels[metric.value])} ${row[metric.value].toFixed(3)}`).join("; ")}`,
);
</script>

<template>
  <section id="rq2" class="additional-result" aria-labelledby="rq2-title">
    <div class="rq-heading">
      <div>
        <span class="micro-label">{{ t("RQ2 / Cognitive needs") }}</span>
        <h3 id="rq2-title">{{ t("Explanations that fit the developer.") }}</h3>
      </div>
      <p>
        {{
          t(
            "DevHound improves all five dimensions of cognitive fit while predicting familiarity at the knowledge-point level.",
          )
        }}
      </p>
    </div>
    <div class="rq2-grid">
      <div class="rq2-fit-panel">
        <h4>{{ t("Answer-level cognitive fit") }}</h4>
        <p class="results-subtitle">
          {{ t("Mean rating gain over Claude Code on a five-point scale") }}
        </p>
        <div class="fit-gains">
          <div
            class="fit-row"
            v-for="item in data.rq2.fitGains"
            :key="item.dimension"
          >
            <span>{{ t(item.dimension) }}</span>
            <div class="fit-track">
              <div :style="{ width: `${(item.gain / 1.2) * 100}%` }"></div>
            </div>
            <strong>+{{ item.gain.toFixed(2) }}</strong>
          </div>
        </div>
        <p class="rq2-fit-conclusion">
          {{
            t(
              "The strongest improvement is in cognitive relevance (+1.06), followed by task usefulness (+0.88) and explanation sufficiency (+0.85).",
            )
          }}
        </p>
        <button
          class="text-link"
          type="button"
          @click="
            emit(
              'enlarge',
              'figures/rq2-fit.webp',
              'Answer-level cognitive fit: five-point rating distributions',
            )
          "
        >
          {{ t("View rating distributions") }} <Icon name="expand" :size="15" />
        </button>
      </div>
      <div class="rq2-metric-panel">
        <h4>{{ t("Cognitive-level prediction") }}</h4>
        <div
          class="cognitive-metric"
          v-for="(item, index) in data.rq2.metrics"
          :key="item.label"
        >
          <strong>{{ item.value.toFixed(1) }}<span>%</span></strong>
          <div>
            <h5>
              {{ t(item.label)
              }}<span v-if="index === 2"> {{ t("(ECA)") }}</span>
            </h5>
            <p>{{ t(metricNotes[index]!) }}</p>
          </div>
        </div>
      </div>
    </div>
    <details class="results-table-details confusion-details">
      <summary>{{ t("View cognitive-level confusion matrix") }}</summary>
      <p class="matrix-description">
        {{
          t(
            "Rows are participant labels; columns are predicted levels. Percentages are normalized within each row.",
          )
        }}
      </p>
      <div class="table-scroll">
        <table class="confusion-table">
          <caption class="sr-only">
            {{
              t("Confusion matrix for 6,400 matched key points")
            }}
          </caption>
          <thead>
            <tr>
              <th scope="col">{{ t("Human label / Prediction") }}</th>
              <th
                v-for="level in ['Novice', 'Regular', 'Expert']"
                :key="level"
                scope="col"
              >
                {{ t(level) }}
              </th>
              <th scope="col">N</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in data.rq2.confusion" :key="row.label">
              <th scope="row">{{ t(row.label) }}</th>
              <td
                v-for="(count, columnIndex) in row.count"
                :key="columnIndex"
                :class="{ 'matrix-diagonal': rowIndex === columnIndex }"
              >
                {{ count.toLocaleString("en-US") }}
                <span>({{ row.percent[columnIndex]!.toFixed(1) }}%)</span>
              </td>
              <td>{{ row.total.toLocaleString("en-US") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
    <p class="result-source">
      {{
        t(
          "Final RQ2 results from the paper: cognitive-fit figure, prediction metrics, and confusion matrix.",
        )
      }}
    </p>
  </section>

  <section id="rq3" class="additional-result" aria-labelledby="rq3-title">
    <div class="rq-heading">
      <div>
        <span class="micro-label">{{ t("RQ3 / Memory construction") }}</span>
        <h3 id="rq3-title">
          {{ t("Reliable memory, across model families.") }}
        </h3>
      </div>
      <p>
        {{
          t(
            "Task construction and evidence validation improve Rationale Memory quality across all six models.",
          )
        }}
      </p>
    </div>
    <div class="construction-highlights">
      <div>
        <strong>0.771–0.964</strong><span>{{ t("F1 across six models") }}</span>
      </div>
      <div>
        <strong>0.933 <small>/ $1.36</small></strong
        ><span>{{ t("GLM 5.3 Flash: quality and total cost") }}</span>
      </div>
      <div>
        <strong>376</strong><span>{{ t("Gold Rationale records") }}</span>
      </div>
    </div>
    <div class="results-panel construction-panel">
      <div class="results-top">
        <div>
          <span class="micro-label">{{ t("Full method & ablations") }}</span>
          <h3>{{ t("The contribution of each construction stage") }}</h3>
        </div>
        <label class="model-selector"
          >{{ t("Construction model")
          }}<select
            v-model="selectedModel"
            :aria-label="t('Construction model')"
          >
            <option v-for="model in models" :key="model" :value="model">
              {{ model }}
            </option>
          </select></label
        >
      </div>
      <div class="chart-toolbar">
        <div
          class="segmented-control"
          role="group"
          :aria-label="t('Construction metric')"
        >
          <button
            v-for="item in metrics"
            :key="item"
            type="button"
            :class="{ selected: metric === item }"
            :aria-pressed="metric === item"
            @click="metric = item"
          >
            {{ t(metricLabels[item]) }}
          </button>
        </div>
        <span
          >{{ t(metricLabels[metric]) }} / 1
          <span class="chart-better">{{ t("↑ Higher is better") }}</span></span
        >
      </div>
      <div
        class="bar-chart construction-chart"
        role="img"
        :aria-label="chartLabel"
      >
        <div class="chart-row" v-for="(row, index) in rows" :key="row.method">
          <span class="chart-method" :class="{ 'our-method': index === 0 }"
            >{{ t(row.method)
            }}<span v-if="index === 0" class="chart-ours">{{
              t("Ours")
            }}</span></span
          >
          <div class="bar-track">
            <div
              class="chart-bar"
              :class="{ 'bar-ours': index === 0, 'bar-ablation': index === 1 }"
              :style="{ width: `${row[metric] * 100}%` }"
            ></div>
          </div>
          <strong class="chart-value" :class="{ 'our-method': index === 0 }">{{
            row[metric].toFixed(3)
          }}</strong>
        </div>
        <div class="chart-axis">
          <span></span>
          <div>
            <span>0</span><span>0.2</span><span>0.4</span><span>0.6</span
            ><span>0.8</span><span>1.0</span>
          </div>
          <span></span>
        </div>
      </div>
      <p class="chart-caption">
        {{
          t(
            "Task construction preserves coherent evidence boundaries. Validation filters unsupported or inconsistent candidates. Both stages improve construction quality, especially with lower-capability models.",
          )
        }}
      </p>
      <details class="results-table-details construction-table-details">
        <summary>{{ t("View all six models, ablations, and costs") }}</summary>
        <div class="table-scroll">
          <table class="construction-table">
            <caption class="sr-only">
              {{
                t(
                  "Final Rationale Memory construction results for all 18 model and method combinations",
                )
              }}
            </caption>
            <thead>
              <tr>
                <th scope="col">{{ t("Method") }}</th>
                <th scope="col">{{ t("Model") }}</th>
                <th scope="col">{{ t("Correct ↑") }}</th>
                <th scope="col">{{ t("Spurious ↓") }}</th>
                <th scope="col">{{ t("Missed ↓") }}</th>
                <th scope="col">{{ t("Precision ↑") }}</th>
                <th scope="col">{{ t("Recall ↑") }}</th>
                <th scope="col">{{ t("F1 ↑") }}</th>
                <th scope="col">{{ t("Cost (USD) ↓") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.rq3" :key="`${row.method}/${row.model}`">
                <th scope="row">{{ t(row.method) }}</th>
                <td>{{ row.model }}</td>
                <td>{{ row.correct }}</td>
                <td>{{ row.spurious }}</td>
                <td>{{ row.missed }}</td>
                <td>{{ row.precision.toFixed(3) }}</td>
                <td>{{ row.recall.toFixed(3) }}</td>
                <td>{{ row.f1.toFixed(3) }}</td>
                <td>${{ row.cost.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="chart-caption">
          {{
            t(
              "Cost covers the complete eight-week corpus, all construction stages, and retries. It is reported in US dollars.",
            )
          }}
        </p>
      </details>
    </div>
    <p class="result-source">
      {{
        t(
          "Final RQ3 results from the paper’s memory construction table. Correct, Spurious, and Missed records are determined by one-to-one semantic matching.",
        )
      }}
    </p>
  </section>
</template>
