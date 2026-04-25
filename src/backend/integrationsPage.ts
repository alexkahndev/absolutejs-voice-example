import type { StoredVoiceIntegrationEvent } from "@absolutejs/voice";

export type SavedVoiceIntegrationEvent = StoredVoiceIntegrationEvent;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const listVoiceIntegrationEvents = (events: SavedVoiceIntegrationEvent[]) =>
  [...events].sort((left, right) => right.createdAt - left.createdAt);

export const renderVoiceIntegrationEventsPage = (
  events: SavedVoiceIntegrationEvent[],
  webhookUrl?: string,
) => {
  const items = listVoiceIntegrationEvents(events)
    .map((event) => `
      <article class="event-item">
        <div class="event-header">
          <strong>${escapeHtml(event.type)}</strong>
          <span>${new Date(event.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
        <div class="event-meta">
          <span class="pill">${escapeHtml(event.id)}</span>
          ${event.deliveredTo ? `<span class="pill">delivered to ${escapeHtml(event.deliveredTo)}</span>` : `<span class="pill">stored only</span>`}
          ${event.deliveryError ? `<span class="pill error">delivery failed</span>` : event.deliveredAt ? `<span class="pill success">delivered</span>` : ""}
        </div>
        ${event.deliveryError ? `<p><strong>Delivery error:</strong> ${escapeHtml(event.deliveryError)}</p>` : ""}
        <pre>${escapeHtml(JSON.stringify(event.payload, null, 2))}</pre>
      </article>
    `)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AbsoluteJS Voice Integrations</title>
  <style>
    :root { color-scheme: dark; }
    body { background: #0b0d10; color: #f4f4f5; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 24px; }
    main { max-width: 1080px; margin: 0 auto; display: grid; gap: 16px; }
    section, article { background: #13161b; border: 1px solid #232833; border-radius: 18px; padding: 20px; }
    .event-list { display: grid; gap: 14px; }
    .event-header, .event-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between; }
    .event-meta { justify-content: flex-start; }
    .pill { background: #0f1217; border: 1px solid #232833; border-radius: 999px; padding: 6px 10px; }
    .success { border-color: #14532d; color: #bbf7d0; }
    .error { border-color: #7f1d1d; color: #fecaca; }
    pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #0f1217; border-radius: 12px; padding: 14px; border: 1px solid #232833; }
    a { color: #f59e0b; }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>Integration events</h1>
      <p>This stream shows the payloads AbsoluteJS Voice can hand to external systems like CRMs, helpdesks, or automation webhooks.</p>
      <p>${webhookUrl ? `Webhook delivery is enabled for ${escapeHtml(webhookUrl)}.` : "Webhook delivery is disabled; events are being stored locally only."}</p>
      <p><a href="/reviews">Back to reviews</a> · <a href="/tasks">Open task queue</a></p>
    </section>
    <section class="event-list">
      ${items || '<p>No integration events yet. Complete a call or change a task state first.</p>'}
    </section>
  </main>
</body>
</html>`;
};
