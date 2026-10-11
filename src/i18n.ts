import { ref, watch } from "vue";
import chinese from "./locales/zh.json";

export type Locale = "en" | "zh";
const dictionary: Record<string, string> = chinese;
function initialLocale(): Locale {
  const query = new URLSearchParams(location.search).get("lang");
  if (query === "en" || query === "zh") return query;
  try {
    return localStorage.getItem("devhound-language") === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}
export const locale = ref<Locale>(initialLocale());
export function t(text: string): string {
  return locale.value === "zh"
    ? (dictionary[text.replace(/\s+/g, " ").trim()] ?? text)
    : text;
}
export function localize<T>(content: T): T {
  if (typeof content === "string") return t(content) as T;
  if (Array.isArray(content)) return content.map(localize) as T;
  if (content && typeof content === "object") {
    return Object.fromEntries(
      Object.entries(content).map(([key, value]) => [
        key,
        [
          "id",
          "icon",
          "model",
          "videoUrl",
          "embedUrl",
          "poster",
          "paper",
          "dataset",
          "code",
        ].includes(key)
          ? value
          : localize(value),
      ]),
    ) as T;
  }
  return content;
}
export function setLocale(value: Locale) {
  locale.value = value;
  const url = new URL(location.href);
  url.searchParams.set("lang", value);
  history.replaceState(history.state, "", url);
}
watch(
  locale,
  (value) => {
    document.documentElement.lang = value === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = value;
    document.title =
      value === "zh"
        ? "DevHound：记住为什么，自适应回答"
        : "DevHound — Remembering Why, Answering Adaptively";
    const description =
      value === "zh"
        ? "DevHound 从开发轨迹中学习，保留历史决策依据，并按开发者的认知需求调整仓库级问答。了解方法、最终实验结果与研究资源。"
        : "DevHound learns from development traces to preserve historical decision evidence and adapt repository-level answers to developers’ cognitive needs. Explore the approach, final results, and research resources.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    try {
      localStorage.setItem("devhound-language", value);
    } catch {
      /* Private browser storage can be unavailable. */
    }
  },
  { immediate: true },
);
