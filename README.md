# AbsoluteJS Voice Example

This is a full AbsoluteJS demo app for `@absolutejs/voice`.

It exposes the same voice intake flow across:

- React
- Vue
- Svelte
- Angular
- HTML
- HTMX

The server uses:

- `@absolutejs/voice` for the WebSocket voice route
- `@absolutejs/voice-deepgram` with Deepgram Flux for STT
- route-level `phraseHints`
- route-level `correctTurn` with deterministic phrase correction
- `createVoiceFileRuntimeStorage(...)` for durable runtime storage
- `createVoiceAssistant(...)` as the product-level assistant surface
- assistant `artifactPlan` for built-in review, task, and integration-event recording
- assistant `support-triage` recipe for recipe-driven follow-up work
- assistant guardrails and deterministic experiment variants
- a deterministic intake flow instead of an LLM so the demo works with only vendor voice keys

Each framework page keeps feature parity:

- start and stop microphone capture
- commit the current turn manually
- show live partial transcripts
- show committed turns and assistant replies
- show completed intakes persisted by the server
- show the exact framework-specific client primitive being used
- show the same assistant config panel
- link directly into reviews and ops pages

## Run

```bash
cd ~/alex/absolutejs-voice-example
bun install
DEEPGRAM_API_KEY=... bun run dev
```

Then open:

- `http://localhost:3000/react`
- `http://localhost:3000/vue`
- `http://localhost:3000/svelte`
- `http://localhost:3000/angular`
- `http://localhost:3000/html`
- `http://localhost:3000/htmx`
- `http://localhost:3000/reviews`
- `http://localhost:3000/tasks`
- `http://localhost:3000/integrations`

## Recommended Pattern

The example now follows the same production pattern recommended in `@absolutejs/voice` itself:

- durable runtime storage via `createVoiceFileRuntimeStorage(...)`
- one assistant surface via `createVoiceAssistant(...)`
- recipe-driven ops defaults via the assistant `support-triage` artifact plan
- `voice({ ops: assistant.ops, onTurn: assistant.onTurn })` to record:
  - reviews
  - follow-up tasks
  - integration events
- thin app-specific customization through assistant guardrails, experiments, and model logic

The persisted runtime data lives under:

- `.voice-runtime/voice-demo/sessions`
- `.voice-runtime/voice-demo/reviews`
- `.voice-runtime/voice-demo/tasks`
- `.voice-runtime/voice-demo/events`

## What To Demo

A good end-to-end demo flow is:

1. Open any framework page.
2. Complete a guided or general voice flow.
3. Say one of the lifecycle phrases if you want a non-default outcome:
   - `transfer me to billing`
   - `escalate this`
   - `send it to voicemail`
   - `no answer`
4. Open `/reviews` to inspect the call artifact.
5. Open `/tasks` to see the generated follow-up work.
6. Open `/integrations` to inspect the portable outbound event payloads.

The demo uses the support-triage recipe, so completed calls create triage review tasks, escalations route to `support-escalations`, transfers create handoff checks, and voicemail/no-answer outcomes create callback work.

## Notes

- The example now uses published beta versions of `@absolutejs/voice` and `@absolutejs/voice-deepgram`, not local `file:` dependencies.
- The route uses the recommended package path for this demo: Deepgram Flux plus phrase hints and deterministic correction.
- The example still keeps its own richer review UI, but runtime review/task/event creation is handled by the core package.
