import type {
  VoiceAssistantMemoryRecord,
  VoiceAssistantRunsSummary,
} from "@absolutejs/voice";
import { VOICE_ASSISTANT_CONFIG } from "../shared/demo";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderCountMap = (values: Record<string, number>) => {
  const entries = Object.entries(values).sort(
    (left, right) => right[1] - left[1],
  );

  if (entries.length === 0) {
    return `<p class="empty">No data yet.</p>`;
  }

  return `<div class="metric-list">${entries
    .map(
      ([label, value]) => `
        <div class="metric-row">
          <span>${escapeHtml(label)}</span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join("")}</div>`;
};

export const renderVoiceAssistantPage = (
  summary: VoiceAssistantRunsSummary,
  memories: VoiceAssistantMemoryRecord[] = [],
) => {
  const assistant = summary.assistants[0];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AbsoluteJS Voice Assistant</title>
  <style>
    :root { color-scheme: dark; }
    body { background: #09090b; color: #f4f4f5; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 24px; }
    main { max-width: 1120px; margin: 0 auto; display: grid; gap: 16px; }
    section, article { background: #13161b; border: 1px solid #27272a; border-radius: 20px; padding: 20px; }
    .grid { display: grid; gap: 14px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .wide-grid { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .stat { background: #0f1217; border: 1px solid #27272a; border-radius: 16px; padding: 16px; }
    .stat span, .empty { color: #a1a1aa; }
    .stat strong { display: block; font-size: 1.8rem; margin-top: 6px; }
    .metric-list { display: grid; gap: 8px; }
    .metric-row { align-items: center; background: #0f1217; border: 1px solid #27272a; border-radius: 12px; display: flex; justify-content: space-between; padding: 10px 12px; }
    .pill-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .pill { background: #0f1217; border: 1px solid #3f3f46; border-radius: 999px; color: #d4d4d8; padding: 6px 10px; }
    a { color: #f59e0b; }
    @media (max-width: 800px) { .grid, .wide-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>Assistant control plane</h1>
      <p>This page summarizes assistant trace events from <code>createVoiceAssistant(...)</code>: variants, outcomes, guardrails, tools, memory, and artifact plans.</p>
      <p><a href="/react">Back to demo</a> · <a href="/reviews">Reviews</a> · <a href="/tasks">Tasks</a> · <a href="/integrations">Integrations</a></p>
    </section>
    <section>
      <h2>${escapeHtml(VOICE_ASSISTANT_CONFIG.id)}</h2>
      <div class="pill-list">
        <span class="pill">recipe: ${escapeHtml(VOICE_ASSISTANT_CONFIG.recipe)}</span>
        ${VOICE_ASSISTANT_CONFIG.tools.map((tool) => `<span class="pill">${escapeHtml(tool)}</span>`).join("")}
      </div>
    </section>
    <section class="grid">
      <article class="stat"><span>Runs</span><strong>${assistant?.runCount ?? 0}</strong></article>
      <article class="stat"><span>Sessions</span><strong>${assistant?.sessions ?? 0}</strong></article>
      <article class="stat"><span>Guardrails</span><strong>${assistant?.guardrailCount ?? 0}</strong></article>
      <article class="stat"><span>Avg latency</span><strong>${assistant?.averageElapsedMs ?? 0}ms</strong></article>
    </section>
    <section class="wide-grid">
      <article><h2>Outcomes</h2>${renderCountMap(assistant?.outcomes ?? {})}</article>
      <article><h2>Variants</h2>${renderCountMap(assistant?.variants ?? {})}</article>
      <article><h2>Tools</h2>${renderCountMap(assistant?.toolCalls ?? {})}</article>
      <article><h2>Memory ops</h2>${renderCountMap(assistant?.memory ?? {})}</article>
      <article><h2>Artifact plans</h2>${renderCountMap(assistant?.artifactPlans ?? {})}</article>
      <article><h2>Stored memory</h2>${
        memories.length
          ? `<div class="metric-list">${memories
              .map(
                (memory) => `
                  <div class="metric-row">
                    <span>${escapeHtml(memory.namespace)} / ${escapeHtml(memory.key)}</span>
                    <strong>${escapeHtml(String(memory.value))}</strong>
                  </div>
                `,
              )
              .join("")}</div>`
          : `<p class="empty">No memory records yet. Complete a call with “my name is ...” to persist one.</p>`
      }</article>
    </section>
  </main>
</body>
</html>`;
};
