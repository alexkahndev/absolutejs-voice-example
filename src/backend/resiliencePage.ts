import type { StoredVoiceTraceEvent, VoiceProviderHealthSummary } from "@absolutejs/voice";

type RoutingEvent = {
  at: number;
  attempt?: number;
  elapsedMs?: number;
  error?: string;
  fallbackProvider?: string;
  kind: "llm" | "stt" | "tts";
  latencyBudgetMs?: number;
  operation?: string;
  provider?: string;
  selectedProvider?: string;
  sessionId: string;
  status?: string;
  timedOut: boolean;
  turnId?: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const getNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const getBoolean = (value: unknown) => value === true;

export const listVoiceRoutingEvents = (
  events: StoredVoiceTraceEvent[],
): RoutingEvent[] => {
  const routingEvents: RoutingEvent[] = [];

  for (const event of events) {
    if (event.type !== "session.error") {
      continue;
    }

      const kind = getString(event.payload.kind);
      const provider = getString(event.payload.provider);
      const providerStatus = getString(event.payload.providerStatus);
      if (!provider || !providerStatus) {
        continue;
      }

      routingEvents.push({
        at: event.at,
        attempt: getNumber(event.payload.attempt),
        elapsedMs: getNumber(event.payload.elapsedMs),
        error: getString(event.payload.error),
        fallbackProvider: getString(event.payload.fallbackProvider),
        kind: kind === "stt" || kind === "tts" ? kind : "llm",
        latencyBudgetMs: getNumber(event.payload.latencyBudgetMs),
        operation: getString(event.payload.operation),
        provider,
        selectedProvider: getString(event.payload.selectedProvider),
        sessionId: event.sessionId,
        status: providerStatus,
        timedOut: getBoolean(event.payload.timedOut),
        turnId: event.turnId,
      });
  }

  return routingEvents.sort((left, right) => right.at - left.at);
};

const summarizeRoutingEvents = (events: RoutingEvent[]) => {
  const byKind = new Map<string, number>();
  let errors = 0;
  let fallbacks = 0;
  let timeouts = 0;

  for (const event of events) {
    byKind.set(event.kind, (byKind.get(event.kind) ?? 0) + 1);
    if (event.status === "error") {
      errors += 1;
    }
    if (event.status === "fallback") {
      fallbacks += 1;
    }
    if (event.timedOut) {
      timeouts += 1;
    }
  }

  return {
    byKind,
    errors,
    fallbacks,
    timeouts,
    total: events.length,
  };
};

const renderProviderCards = (
  providers: VoiceProviderHealthSummary<string>[],
) => {
  if (providers.length === 0) {
    return `<p class="muted">No LLM provider health yet.</p>`;
  }

  return `<div class="provider-grid">${providers
    .map(
      (provider) => `
        <article class="card provider ${escapeHtml(provider.status)}">
          <div class="card-header">
            <strong>${escapeHtml(provider.provider)}</strong>
            <span>${escapeHtml(provider.status)}${provider.recommended ? " · recommended" : ""}</span>
          </div>
          <dl>
            <div><dt>Runs</dt><dd>${provider.runCount}</dd></div>
            <div><dt>Avg latency</dt><dd>${provider.averageElapsedMs ?? 0}ms</dd></div>
            <div><dt>Errors</dt><dd>${provider.errorCount}</dd></div>
            <div><dt>Timeouts</dt><dd>${provider.timeoutCount}</dd></div>
            <div><dt>Fallbacks</dt><dd>${provider.fallbackCount}</dd></div>
          </dl>
          ${provider.lastError ? `<p class="muted">${escapeHtml(provider.lastError)}</p>` : ""}
        </article>
      `,
    )
    .join("")}</div>`;
};

const renderTimeline = (events: RoutingEvent[]) => {
  if (events.length === 0) {
    return `<p class="muted">No provider routing events yet. Run the demo or simulate provider failover from the assistant page.</p>`;
  }

  return `<div class="timeline">${events
    .slice(0, 40)
    .map(
      (event) => `
        <article class="card event ${escapeHtml(event.status ?? "unknown")}">
          <div class="card-header">
            <strong>${escapeHtml(event.kind.toUpperCase())} ${escapeHtml(event.operation ?? "generate")}</strong>
            <span>${new Date(event.at).toLocaleString()}</span>
          </div>
          <p>
            <span class="pill">${escapeHtml(event.status ?? "unknown")}</span>
            <span class="pill">provider: ${escapeHtml(event.provider ?? "unknown")}</span>
            ${
              event.fallbackProvider
                ? `<span class="pill">fallback: ${escapeHtml(event.fallbackProvider)}</span>`
                : ""
            }
            ${
              event.timedOut
                ? `<span class="pill danger">timed out</span>`
                : ""
            }
          </p>
          <dl>
            <div><dt>Attempt</dt><dd>${event.attempt ?? 0}</dd></div>
            <div><dt>Elapsed</dt><dd>${event.elapsedMs ?? 0}ms</dd></div>
            <div><dt>Budget</dt><dd>${event.latencyBudgetMs ?? 0}ms</dd></div>
            <div><dt>Session</dt><dd>${escapeHtml(event.sessionId)}</dd></div>
          </dl>
          ${event.error ? `<p class="muted">${escapeHtml(event.error)}</p>` : ""}
        </article>
      `,
    )
    .join("")}</div>`;
};

export const renderVoiceResiliencePage = (input: {
  providerHealth: VoiceProviderHealthSummary<string>[];
  routingEvents: RoutingEvent[];
}) => {
  const summary = summarizeRoutingEvents(input.routingEvents);
  const kindCounts = [...summary.byKind.entries()]
    .map(([kind, count]) => `<span class="pill">${escapeHtml(kind)}: ${count}</span>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AbsoluteJS Voice Resilience</title>
  <style>
    :root { color-scheme: dark; }
    body { background: radial-gradient(circle at top left, #172554, #09090b 36%, #050505); color: #f4f4f5; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 24px; }
    main { display: grid; gap: 16px; margin: 0 auto; max-width: 1180px; }
    section, .card { background: rgba(19, 22, 27, 0.92); border: 1px solid #27272a; border-radius: 20px; padding: 20px; }
    .hero { background: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(245, 158, 11, 0.12)); }
    .grid, .provider-grid { display: grid; gap: 14px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .timeline { display: grid; gap: 12px; }
    .card-header { align-items: center; display: flex; gap: 12px; justify-content: space-between; }
    .card-header strong { font-size: 1.05rem; }
    .metric strong { display: block; font-size: 2rem; margin-top: 6px; }
    .muted, dt, span { color: #a1a1aa; }
    dl { display: grid; gap: 8px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    dl div { background: #0f1217; border: 1px solid #27272a; border-radius: 12px; padding: 10px; }
    dd { font-weight: 800; margin: 4px 0 0; }
    .pill { background: #0f1217; border: 1px solid #3f3f46; border-radius: 999px; color: #d4d4d8; display: inline-flex; margin: 3px 4px 3px 0; padding: 5px 9px; }
    .danger { border-color: rgba(239, 68, 68, 0.75); color: #fecaca; }
    .event.error { border-color: rgba(239, 68, 68, 0.7); }
    .event.fallback { border-color: rgba(245, 158, 11, 0.7); }
    .event.success, .provider.healthy { border-color: rgba(34, 197, 94, 0.5); }
    .provider.suppressed, .provider.degraded, .provider.rate-limited { border-color: rgba(239, 68, 68, 0.7); }
    .provider.recoverable { border-color: rgba(59, 130, 246, 0.7); }
    a { color: #f59e0b; }
    @media (max-width: 850px) { .grid, .provider-grid, dl { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <h1>Provider routing and resilience</h1>
      <p>One view for the production reliability story: LLM failover, STT routing, latency budgets, timeouts, and fallback decisions.</p>
      <p><a href="/react">Back to demo</a> · <a href="/assistant">Assistant</a> · <a href="/sessions">Sessions</a> · <a href="/handoffs">Handoffs</a> · <a href="/reviews">Reviews</a> · <a href="/tasks">Tasks</a> · <a href="/integrations">Integrations</a></p>
      <p>${kindCounts || '<span class="pill">No routing events yet</span>'}</p>
    </section>
    <section class="grid">
      <article class="card metric"><span>Total routing events</span><strong>${summary.total}</strong></article>
      <article class="card metric"><span>Fallbacks</span><strong>${summary.fallbacks}</strong></article>
      <article class="card metric"><span>Errors</span><strong>${summary.errors}</strong></article>
      <article class="card metric"><span>Timeouts</span><strong>${summary.timeouts}</strong></article>
    </section>
    <section>
      <h2>LLM provider health</h2>
      ${renderProviderCards(input.providerHealth)}
    </section>
    <section>
      <h2>Routing timeline</h2>
      ${renderTimeline(input.routingEvents)}
    </section>
  </main>
</body>
</html>`;
};
