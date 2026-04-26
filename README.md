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
- assistant guardrails and experiment variants
- provider-neutral assistant model routing for OpenAI, Anthropic, and Gemini, with deterministic fallback when no LLM key is present

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

Optional LLM routing:

```bash
OPENAI_API_KEY=... OPENAI_VOICE_MODEL=gpt-4.1-mini bun run dev
ANTHROPIC_API_KEY=... ANTHROPIC_VOICE_MODEL=claude-sonnet-4-5 bun run dev
GEMINI_API_KEY=... GEMINI_VOICE_MODEL=gemini-2.5-flash bun run dev
```

Provider selection is automatic in this order: OpenAI, Anthropic, Gemini, then deterministic fallback. You can force one with `VOICE_MODEL_PROVIDER=openai`, `VOICE_MODEL_PROVIDER=anthropic`, `VOICE_MODEL_PROVIDER=gemini`, or `VOICE_MODEL_PROVIDER=deterministic`.

Provider model env vars are optional. If no LLM key is present, the server keeps using the deterministic local intake model so the demo still runs with only the voice/STT key.

Then open:

- `http://localhost:3000/react`
- `http://localhost:3000/vue`
- `http://localhost:3000/svelte`
- `http://localhost:3000/angular`
- `http://localhost:3000/html`
- `http://localhost:3000/htmx`
- `http://localhost:3000/reviews`
- `http://localhost:3000/assistant`
- `http://localhost:3000/tasks`
- `http://localhost:3000/integrations`

## Recommended Pattern

The example now follows the same production pattern recommended in `@absolutejs/voice` itself:

- durable runtime storage via `createVoiceFileRuntimeStorage(...)`
- one assistant surface via `createVoiceAssistant(...)`
- provider-neutral model selection through `createOpenAIVoiceAssistantModel(...)`, `createAnthropicVoiceAssistantModel(...)`, and `createGeminiVoiceAssistantModel(...)`
- recipe-driven ops defaults via the assistant `support-triage` artifact plan
- `voice({ ops: assistant.ops, onTurn: assistant.onTurn })` to record:
  - reviews
  - follow-up tasks
  - integration events
  - assistant run analytics from trace events
- thin app-specific customization through assistant guardrails, experiments, and model logic

The persisted runtime data lives under:

- `.voice-runtime/voice-demo/sessions`
- `.voice-runtime/voice-demo/reviews`
- `.voice-runtime/voice-demo/tasks`
- `.voice-runtime/voice-demo/events`
- `.voice-runtime/voice-demo/traces`

## Provider Routing And Failover

Every framework page includes the same provider selector. The selected provider is sent to the voice route as `?provider=openai`, `?provider=anthropic`, `?provider=gemini`, or `?provider=deterministic`.

The backend routes every assistant turn through `createVoiceProviderRouter(...)` from `@absolutejs/voice`:

- `prefer-selected` keeps the user-selected provider first.
- configured fallback order is OpenAI, Anthropic, Gemini, then deterministic.
- adaptive provider health suppresses providers after provider errors or rate limits.
- rate-limit suppressions cool down for 120 seconds in this demo.
- successful recovery retries clear active suppression while preserving historical error counts.

Provider status is visible in `/assistant` and `/api/provider-status`.

Status meanings:

- `healthy`: the provider has a successful recent run and is eligible.
- `suppressed`: the provider is temporarily skipped by the router; `suppressionRemainingMs` shows the cooldown.
- `recoverable`: a previous suppression expired and the provider can be retried.
- `rate-limited`: a rate-limit error was seen without active cooldown timing.
- `degraded`: the latest provider event is still a failure.
- `idle`: no provider activity yet.

Use `/assistant` to demo failover without burning model quota:

- Click `Simulate openai failure`, `Simulate anthropic failure`, or `Simulate gemini failure`.
- The simulator emits a fake HTTP 429 through the same router health path.
- The selected provider becomes `suppressed`.
- The router falls back to the next eligible provider.
- Click `Retry ... recovery` to retry that provider directly and move it back to `healthy`.

The same flow is available from scripts and HTTP endpoints.

```bash
bun run simulate:provider-failure openai gemini
```

```bash
curl -X POST 'http://localhost:3000/api/provider-simulate/failure?provider=openai'
curl -X POST 'http://localhost:3000/api/provider-simulate/recovery?provider=openai'
curl 'http://localhost:3000/api/provider-status'
```

The simulator uses local fake model adapters. It does not call OpenAI, Anthropic, Gemini, Deepgram, or any other external provider.

## Provider Shootout

Run the same assistant cases against every configured model provider in parallel:

```bash
bun run bench:assistant:providers
```

The runner always includes the deterministic baseline and automatically includes OpenAI, Anthropic, and Gemini when their API keys are present. Use `VOICE_SHOOTOUT_PROVIDERS=openai,anthropic,gemini` to restrict the run. Results are written to `.voice-runtime/shootouts`, or to `VOICE_SHOOTOUT_OUTPUT_DIR` when set.

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
5. Open `/assistant` to inspect assistant variants, outcomes, guardrails, and tools.
6. Open `/tasks` to see the generated follow-up work.
7. Open `/integrations` to inspect the portable outbound event payloads.

The demo uses the support-triage recipe, so completed calls create triage review tasks, escalations route to `support-escalations`, transfers create handoff checks, and voicemail/no-answer outcomes create callback work.

## Notes

- The example now uses published beta versions of `@absolutejs/voice` and `@absolutejs/voice-deepgram`, not local `file:` dependencies.
- API keys stay in local environment files only. `.env`, `.env.*`, runtime data, and build outputs are ignored.
- The route uses the recommended package path for this demo: Deepgram Flux plus phrase hints and deterministic correction.
- The example still keeps its own richer review UI, but runtime review/task/event creation is handled by the core package.
