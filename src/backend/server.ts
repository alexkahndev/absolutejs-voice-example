import { getEnv, networking, prepare } from "@absolutejs/absolute";
import {
  applyPhraseHintCorrections,
  assignVoiceOpsTask,
  completeVoiceOpsTask,
  createAnthropicVoiceAssistantModel,
  createGeminiVoiceAssistantModel,
  createVoiceAssistant,
  createVoiceAgentTool,
  createVoiceExperiment,
  createVoiceFileAssistantMemoryStore,
  createVoiceFileRuntimeStorage,
  createOpenAIVoiceAssistantModel,
  createVoiceProviderRouter,
  createVoiceTaskUpdatedEvent,
  reopenVoiceOpsTask,
  startVoiceOpsTask,
  summarizeVoiceAssistantRuns,
  type StoredVoiceTraceEvent,
  type VoiceCallReviewStore,
  type VoiceAssistantMemoryRecord,
  type VoiceAgentModel,
  type VoiceProviderRouterEvent,
  type VoiceOpsTaskStatus,
  type VoiceOpsTaskStore,
  type VoiceTurnCorrectionHandler,
  type VoiceSessionRecord,
  voice,
} from "@absolutejs/voice";
import { deepgram } from "@absolutejs/voice-deepgram";
import { Elysia } from "elysia";
import { resolve } from "node:path";
import {
  filterVoiceOpsTasks,
  listVoiceOpsTasks,
  renderVoiceOpsPage,
  summarizeVoiceOpsTasks,
  type SavedVoiceOpsTask,
  type VoiceOpsTaskFilterInput,
} from "./opsPage";
import {
  listVoiceIntegrationEvents,
  renderVoiceIntegrationEventsPage,
  type SavedVoiceIntegrationEvent,
} from "./integrationsPage";
import { renderVoiceAssistantPage } from "./assistantPage";
import { createProviderFailureSimulator } from "./providerSimulator";
import { pagesPlugin } from "./plugins/pagesPlugin";
import {
  buildSavedVoiceReview,
  filterVoiceReviews,
  findVoiceReview,
  listVoiceReviews,
  type SavedVoiceReviewArtifact,
  type VoiceReviewFilterInput,
  renderVoiceReviewComparePage,
  renderVoiceReviewIndexPage,
  renderVoiceReviewPage,
} from "./reviewPage";
import {
  buildSavedIntake,
  decideIntakeTurn,
  resolveScenarioFromContext,
  VOICE_DEMO_PHRASE_HINTS,
} from "./voiceFlow";
import {
  isVoiceModelProvider,
  VOICE_ASSISTANT_CONFIG,
  type SavedIntake,
  type VoiceModelProvider,
} from "../shared/demo";

const { absolutejs, manifest } = await prepare();

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatCallDisposition = (value: SavedIntake["callDisposition"]) => {
  switch (value) {
    case "transferred":
      return "Transferred";
    case "escalated":
      return "Escalated";
    case "voicemail":
      return "Voicemail";
    case "no-answer":
      return "No answer";
    case "failed":
      return "Failed";
    case "closed":
      return "Closed";
    case "completed":
      return "Completed";
    default:
      return undefined;
  }
};

const renderPromptAnswers = (promptAnswers: SavedIntake["promptAnswers"]) =>
  promptAnswers
    .map(
      (entry) => `<div class="saved-answer">
  <div class="saved-answer-label">${escapeHtml(entry.prompt)}</div>
  <p class="saved-answer-text">${escapeHtml(entry.response)}</p>
</div>`,
    )
    .join("");

const normalizeReviewFilters = (
  query: Record<string, unknown>,
): VoiceReviewFilterInput => ({
  outcome:
    query.outcome === "completed" ||
    query.outcome === "transferred" ||
    query.outcome === "escalated" ||
    query.outcome === "voicemail" ||
    query.outcome === "no-answer" ||
    query.outcome === "failed" ||
    query.outcome === "closed"
      ? query.outcome
      : "all",
  q: typeof query.q === "string" && query.q.trim() ? query.q.trim() : undefined,
  scenario:
    query.scenario === "guided" || query.scenario === "general"
      ? query.scenario
      : "all",
  status:
    query.status === "healthy" ||
    query.status === "partial" ||
    query.status === "failed"
      ? query.status
      : "all",
});

const savedIntakes: SavedIntake[] = [];
const runtimeDirectory = resolve(
  import.meta.dir,
  "..",
  "..",
  ".voice-runtime",
  "voice-demo",
);
const runtimeStorage = createVoiceFileRuntimeStorage<
  VoiceSessionRecord,
  SavedVoiceReviewArtifact,
  SavedVoiceOpsTask,
  SavedVoiceIntegrationEvent
>({
  directory: runtimeDirectory,
});
const memoryStore = createVoiceFileAssistantMemoryStore({
  directory: resolve(runtimeDirectory, "memories"),
});
const deepgramApiKey = getEnv("DEEPGRAM_API_KEY");
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;
const webhookUrl = process.env.VOICE_DEMO_WEBHOOK_URL;
const requestedModelProvider = process.env.VOICE_MODEL_PROVIDER?.toLowerCase();
const configuredModelProviders: VoiceModelProvider[] = [
  "deterministic",
  openAIApiKey ? "openai" : undefined,
  anthropicApiKey ? "anthropic" : undefined,
  geminiApiKey ? "gemini" : undefined,
].filter(Boolean) as VoiceModelProvider[];
const resolveModelProvider = () => {
  if (
    requestedModelProvider === "openai" ||
    requestedModelProvider === "anthropic" ||
    requestedModelProvider === "gemini" ||
    requestedModelProvider === "deterministic"
  ) {
    if (requestedModelProvider === "openai" && !openAIApiKey) {
      throw new Error("VOICE_MODEL_PROVIDER=openai requires OPENAI_API_KEY.");
    }
    if (requestedModelProvider === "anthropic" && !anthropicApiKey) {
      throw new Error(
        "VOICE_MODEL_PROVIDER=anthropic requires ANTHROPIC_API_KEY.",
      );
    }
    if (requestedModelProvider === "gemini" && !geminiApiKey) {
      throw new Error(
        "VOICE_MODEL_PROVIDER=gemini requires GEMINI_API_KEY or GOOGLE_API_KEY.",
      );
    }
    return requestedModelProvider;
  }

  if (openAIApiKey) {
    return "openai";
  }
  if (anthropicApiKey) {
    return "anthropic";
  }
  if (geminiApiKey) {
    return "gemini";
  }
  return "deterministic";
};
const modelProvider = resolveModelProvider();
const assistantConfig = {
  ...VOICE_ASSISTANT_CONFIG,
  availableProviders: configuredModelProviders,
  modelProvider,
};
const isAssistantProviderError = (error: unknown) =>
  error instanceof Error &&
  /\b(OpenAI|Anthropic|Gemini)\b.*\b(HTTP|failed|Unable to connect)/i.test(
    error.message,
  );
const providerFallbackOrder = (provider: VoiceModelProvider) => [
  provider,
  ...(["openai", "anthropic", "gemini", "deterministic"] as const).filter(
    (candidate) =>
      candidate !== provider && configuredModelProviders.includes(candidate),
  ),
];
const intakeModel: VoiceAgentModel<unknown, VoiceSessionRecord, SavedIntake> = {
  generate: ({ context, session, turn, system }) => {
    const result = decideIntakeTurn(session, turn, undefined, context);

    if (system?.includes("direct") && result.assistantText === "Received.") {
      return {
        ...result,
        assistantText: "Captured.",
      };
    }

    return result;
  },
};
const openAIModel = openAIApiKey
  ? createOpenAIVoiceAssistantModel<unknown, VoiceSessionRecord, SavedIntake>({
      apiKey: openAIApiKey,
      model: process.env.OPENAI_VOICE_MODEL ?? "gpt-4.1-mini",
    })
  : undefined;
const anthropicModel = anthropicApiKey
  ? createAnthropicVoiceAssistantModel<
      unknown,
      VoiceSessionRecord,
      SavedIntake
    >({
      apiKey: anthropicApiKey,
      model: process.env.ANTHROPIC_VOICE_MODEL ?? "claude-sonnet-4-5",
    })
  : undefined;
const geminiModel = geminiApiKey
  ? createGeminiVoiceAssistantModel<unknown, VoiceSessionRecord, SavedIntake>({
      apiKey: geminiApiKey,
      model: process.env.GEMINI_VOICE_MODEL ?? "gemini-2.5-flash",
    })
  : undefined;
const resolveRequestedProvider = (context: unknown): VoiceModelProvider => {
  if (
    context &&
    typeof context === "object" &&
    "query" in context &&
    context.query &&
    typeof context.query === "object" &&
    "provider" in context.query &&
    isVoiceModelProvider(context.query.provider) &&
    configuredModelProviders.includes(context.query.provider)
  ) {
    return context.query.provider;
  }

  return modelProvider;
};
const providerModels: Partial<
  Record<
    VoiceModelProvider,
    VoiceAgentModel<unknown, VoiceSessionRecord, SavedIntake>
  >
> = {
  deterministic: intakeModel,
  openai: openAIModel,
  anthropic: anthropicModel,
  gemini: geminiModel,
};
const traceProviderEvent = async (
  event: VoiceProviderRouterEvent<VoiceModelProvider>,
  input: Parameters<
    VoiceAgentModel<unknown, VoiceSessionRecord, SavedIntake>["generate"]
  >[0],
) => {
  await runtimeStorage.traces.append({
    at: event.at,
    payload: {
      ...event,
      providerStatus: event.status,
    },
    scenarioId: input.session.scenarioId,
    sessionId: input.session.id,
    turnId: input.turn.id,
    type: "session.error",
  });
};
const assistantModel = createVoiceProviderRouter<
  unknown,
  VoiceSessionRecord,
  SavedIntake,
  VoiceModelProvider
>({
  allowProviders: () => configuredModelProviders,
  fallback: ({ context }) =>
    providerFallbackOrder(resolveRequestedProvider(context)),
  fallbackMode: "provider-error",
  isProviderError: (error, provider) =>
    provider !== "deterministic" && isAssistantProviderError(error),
  onProviderEvent: traceProviderEvent,
  policy: "prefer-selected",
  providerHealth: {
    cooldownMs: 30_000,
    failureThreshold: 1,
    rateLimitCooldownMs: 120_000,
  },
  providerProfiles: {
    deterministic: { cost: 0, latencyMs: 5, priority: 4 },
    openai: { cost: 2, latencyMs: 500, priority: 1 },
    anthropic: { cost: 3, latencyMs: 700, priority: 2 },
    gemini: { cost: 1, latencyMs: 650, priority: 3 },
  },
  providers: providerModels,
  selectProvider: ({ context }) => resolveRequestedProvider(context),
});
const providerFailureSimulator = createProviderFailureSimulator({
  allowProviders: () => configuredModelProviders,
  fallback: providerFallbackOrder,
  isProviderError: (error, provider) =>
    provider !== "deterministic" && isAssistantProviderError(error),
  onProviderEvent: traceProviderEvent,
});
const intakeClassifierTool = createVoiceAgentTool<
  unknown,
  VoiceSessionRecord,
  Record<string, unknown>,
  unknown,
  SavedIntake
>({
  description:
    "Classify whether the caller is in guided or general intake mode.",
  execute: ({ context }) => ({
    mode: resolveScenarioFromContext(context),
  }),
  name: "intake_classifier",
});
const lifecycleRouterTool = createVoiceAgentTool<
  unknown,
  VoiceSessionRecord,
  Record<string, unknown>,
  unknown,
  SavedIntake
>({
  description:
    "Route transfer, escalation, voicemail, and no-answer phrases into call outcomes.",
  execute: ({ turn }) => ({
    text: turn.text,
  }),
  name: "lifecycle_router",
});
const reviewTaskRecorderTool = createVoiceAgentTool<
  unknown,
  VoiceSessionRecord,
  Record<string, unknown>,
  unknown,
  SavedIntake
>({
  description:
    "Expose the runtime stores that record reviews, tasks, and integration events.",
  execute: () => ({
    events: true,
    reviews: true,
    tasks: true,
  }),
  name: "review_task_recorder",
});
const correctDemoTurn: VoiceTurnCorrectionHandler<
  unknown,
  VoiceSessionRecord,
  SavedIntake
> = async ({ phraseHints, text }) => {
  const result = applyPhraseHintCorrections(text, phraseHints);

  if (!result.changed) {
    return;
  }

  return {
    metadata:
      result.matches.length > 0
        ? {
            matchedAliases: result.matches.map((match) => match.alias),
            matchedHints: result.matches.map((match) => match.hint.text),
          }
        : undefined,
    provider: "absolutejs-voice-example",
    reason: "demo-phrase-hint-correction",
    text: result.text,
  };
};

const listIntakes = (): SavedIntake[] => [...savedIntakes];

const persistIntake = (intake: SavedIntake) => {
  const existingIndex = savedIntakes.findIndex(
    (savedIntake) => savedIntake.id === intake.id,
  );

  if (existingIndex >= 0) {
    savedIntakes.splice(existingIndex, 1, intake);
    return;
  }

  savedIntakes.unshift(intake);
  savedIntakes.splice(12);
};

const normalizeTaskFilters = (
  query: Record<string, unknown>,
): VoiceOpsTaskFilterInput => ({
  kind:
    query.kind === "callback" ||
    query.kind === "escalation" ||
    query.kind === "appointment-booking" ||
    query.kind === "lead-qualification" ||
    query.kind === "support-triage" ||
    query.kind === "transfer-check" ||
    query.kind === "retry-review"
      ? query.kind
      : "all",
  outcome:
    query.outcome === "completed" ||
    query.outcome === "transferred" ||
    query.outcome === "escalated" ||
    query.outcome === "voicemail" ||
    query.outcome === "no-answer" ||
    query.outcome === "failed" ||
    query.outcome === "closed"
      ? query.outcome
      : "all",
  status:
    query.status === "open" ||
    query.status === "in-progress" ||
    query.status === "done"
      ? query.status
      : "all",
});

const listReviews = async (): Promise<SavedVoiceReviewArtifact[]> =>
  listVoiceReviews(await runtimeStorage.reviews.list());

const deliverIntegrationEvent = async (
  event: SavedVoiceIntegrationEvent,
): Promise<SavedVoiceIntegrationEvent> => {
  const storedEvent: SavedVoiceIntegrationEvent = { ...event };

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        body: JSON.stringify(storedEvent),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        storedEvent.deliveryError = `HTTP ${response.status}`;
      } else {
        storedEvent.deliveredAt = Date.now();
        storedEvent.deliveredTo = webhookUrl;
        storedEvent.deliveryError = undefined;
      }
    } catch (error) {
      storedEvent.deliveryError =
        error instanceof Error ? error.message : String(error);
    }
  }

  await runtimeStorage.events.set(storedEvent.id, storedEvent);
  return storedEvent;
};

const listIntegrationEvents = async (): Promise<SavedVoiceIntegrationEvent[]> =>
  listVoiceIntegrationEvents(await runtimeStorage.events.list());

const listTasks = async (): Promise<SavedVoiceOpsTask[]> =>
  listVoiceOpsTasks(await runtimeStorage.tasks.list());

const summarizeAssistantRuns = async () =>
  summarizeVoiceAssistantRuns({ store: runtimeStorage.traces });

type VoiceProviderHealth = {
  averageElapsedMs?: number;
  errorCount: number;
  fallbackCount: number;
  lastError?: string;
  lastErrorAt?: number;
  lastSuccessAt?: number;
  provider: VoiceModelProvider;
  rateLimited: boolean;
  recommended: boolean;
  runCount: number;
  status:
    | "healthy"
    | "idle"
    | "rate-limited"
    | "degraded"
    | "recoverable"
    | "suppressed";
  suppressionRemainingMs?: number;
  suppressedUntil?: number;
};

const summarizeProviderHealth = async (): Promise<VoiceProviderHealth[]> => {
  const events =
    (await runtimeStorage.traces.list()) as StoredVoiceTraceEvent[];
  const hasProviderRouterEvents = events.some(
    (event) =>
      event.type === "session.error" &&
      isVoiceModelProvider(event.payload.provider) &&
      (event.payload.providerStatus === "success" ||
        event.payload.providerStatus === "fallback" ||
        event.payload.providerStatus === "error"),
  );
  const entries = new Map<
    VoiceModelProvider,
    VoiceProviderHealth & {
      elapsedCount: number;
      elapsedTotal: number;
    }
  >();
  const getEntry = (provider: VoiceModelProvider) => {
    const existing = entries.get(provider);
    if (existing) {
      return existing;
    }
    const entry: VoiceProviderHealth & {
      elapsedCount: number;
      elapsedTotal: number;
    } = {
      elapsedCount: 0,
      elapsedTotal: 0,
      errorCount: 0,
      fallbackCount: 0,
      provider,
      rateLimited: false,
      recommended: false,
      runCount: 0,
      status: "idle",
    };
    entries.set(provider, entry);
    return entry;
  };

  for (const provider of configuredModelProviders) {
    getEntry(provider);
  }

  for (const event of events) {
    if (event.type === "assistant.run") {
      if (hasProviderRouterEvents) {
        continue;
      }
      const provider = event.payload.variantId;
      if (isVoiceModelProvider(provider)) {
        const entry = getEntry(provider);
        entry.runCount += 1;
        if (typeof event.payload.elapsedMs === "number") {
          entry.elapsedCount += 1;
          entry.elapsedTotal += event.payload.elapsedMs;
        }
      }
      continue;
    }

    if (event.type !== "session.error") {
      continue;
    }

    const provider = event.payload.provider;
    if (!isVoiceModelProvider(provider)) {
      continue;
    }
    const providerStatus =
      event.payload.providerStatus === "success" ||
      event.payload.providerStatus === "fallback" ||
      event.payload.providerStatus === "error"
        ? event.payload.providerStatus
        : undefined;
    const applyProviderHealth = () => {
      const entry = getEntry(provider);
      const providerHealth = event.payload.providerHealth;
      if (providerHealth && typeof providerHealth === "object") {
        const suppressedUntil = (providerHealth as Record<string, unknown>)
          .suppressedUntil;
        if (typeof suppressedUntil === "number") {
          entry.suppressedUntil = suppressedUntil;
        }
      }
      if (typeof event.payload.suppressedUntil === "number") {
        entry.suppressedUntil = event.payload.suppressedUntil;
      }
      if (typeof event.payload.suppressionRemainingMs === "number") {
        entry.suppressionRemainingMs = event.payload.suppressionRemainingMs;
      }
      return entry;
    };

    if (providerStatus === "success" || providerStatus === "fallback") {
      const entry = applyProviderHealth();
      entry.runCount += 1;
      entry.lastSuccessAt = event.at;
      if (providerStatus === "success") {
        entry.lastError = undefined;
        entry.rateLimited = false;
        entry.suppressedUntil = undefined;
        entry.suppressionRemainingMs = undefined;
      }
      if (typeof event.payload.elapsedMs === "number") {
        entry.elapsedCount += 1;
        entry.elapsedTotal += event.payload.elapsedMs;
      }
      const selectedProvider = event.payload.selectedProvider;
      if (
        providerStatus === "fallback" &&
        isVoiceModelProvider(selectedProvider) &&
        selectedProvider !== provider
      ) {
        getEntry(selectedProvider).fallbackCount += 1;
      }
      continue;
    }

    const entry = applyProviderHealth();
    entry.errorCount += 1;
    entry.lastError =
      typeof event.payload.error === "string" ? event.payload.error : undefined;
    entry.lastErrorAt = event.at;
    entry.rateLimited ||= event.payload.rateLimited === true;
    if (event.payload.fallbackProvider) {
      entry.fallbackCount += 1;
    }
  }

  const summaries = [...entries.values()].map((entry) => {
    const hadSuppression =
      typeof entry.suppressedUntil === "number" ||
      typeof entry.suppressionRemainingMs === "number";
    const suppressionRemainingMs =
      typeof entry.suppressedUntil === "number"
        ? Math.max(0, entry.suppressedUntil - Date.now())
        : entry.suppressionRemainingMs;
    const activeSuppression =
      typeof suppressionRemainingMs === "number" && suppressionRemainingMs > 0;
    const recoverable = hadSuppression && !activeSuppression;
    const averageElapsedMs =
      entry.elapsedCount > 0
        ? Math.round(entry.elapsedTotal / entry.elapsedCount)
        : undefined;
    const status: VoiceProviderHealth["status"] = activeSuppression
      ? "suppressed"
      : recoverable
        ? "recoverable"
        : entry.rateLimited
          ? "rate-limited"
          : entry.errorCount > 0 &&
              (!entry.lastSuccessAt ||
                !entry.lastErrorAt ||
                entry.lastErrorAt > entry.lastSuccessAt)
            ? "degraded"
            : entry.runCount > 0
              ? "healthy"
              : "idle";

    return {
      averageElapsedMs,
      errorCount: entry.errorCount,
      fallbackCount: entry.fallbackCount,
      lastError: entry.lastError,
      lastErrorAt: entry.lastErrorAt,
      lastSuccessAt: entry.lastSuccessAt,
      provider: entry.provider,
      rateLimited: entry.rateLimited,
      recommended: false,
      runCount: entry.runCount,
      status,
      suppressionRemainingMs: activeSuppression
        ? suppressionRemainingMs
        : undefined,
      suppressedUntil: entry.suppressedUntil,
    };
  });
  const recommended = summaries
    .filter((entry) => entry.status === "healthy")
    .sort(
      (left, right) =>
        (left.averageElapsedMs ?? Number.MAX_SAFE_INTEGER) -
        (right.averageElapsedMs ?? Number.MAX_SAFE_INTEGER),
    )[0];

  if (recommended) {
    recommended.recommended = true;
  }

  return summaries;
};

const listAssistantMemory = async (): Promise<VoiceAssistantMemoryRecord[]> =>
  memoryStore.list({
    assistantId: VOICE_ASSISTANT_CONFIG.id,
  });

const getTask = async (taskId: string): Promise<SavedVoiceOpsTask | null> =>
  (await runtimeStorage.tasks.get(taskId)) ?? null;

const emitTaskUpdatedEvent = async (task: SavedVoiceOpsTask) => {
  await deliverIntegrationEvent(
    createVoiceTaskUpdatedEvent(task) as SavedVoiceIntegrationEvent,
  );
};

const updateTaskStatus = async (
  taskId: string,
  input: {
    actor: string;
    detail?: string;
    status: VoiceOpsTaskStatus;
  },
) => {
  const task = await getTask(taskId);

  if (!task) {
    return null;
  }

  const updatedTask = (
    input.status === "in-progress"
      ? startVoiceOpsTask(task, {
          actor: input.actor,
          detail: input.detail,
        })
      : input.status === "done"
        ? completeVoiceOpsTask(task, {
            actor: input.actor,
            detail: input.detail,
          })
        : reopenVoiceOpsTask(task, {
            actor: input.actor,
            detail: input.detail,
          })
  ) as SavedVoiceOpsTask;

  await runtimeStorage.tasks.set(updatedTask.id, updatedTask);
  await emitTaskUpdatedEvent(updatedTask);
  return updatedTask;
};

const assignTask = async (taskId: string, owner: string) => {
  const task = await getTask(taskId);

  if (!task) {
    return null;
  }

  const updatedTask = assignVoiceOpsTask(task, owner) as SavedVoiceOpsTask;
  await runtimeStorage.tasks.set(updatedTask.id, updatedTask);
  await emitTaskUpdatedEvent(updatedTask);
  return updatedTask;
};

const redirectToTasks = () =>
  new Response(null, {
    headers: {
      Location: "/tasks",
    },
    status: 302,
  });

const createDemoAssistant = (
  provider: VoiceModelProvider,
  model: VoiceAgentModel<unknown, VoiceSessionRecord, SavedIntake>,
) =>
  createVoiceAssistant<unknown, VoiceSessionRecord, SavedIntake>({
    artifactPlan: {
      ops: {
        buildReview: ({ result, session }) =>
          buildSavedVoiceReview({
            phraseHints: VOICE_DEMO_PHRASE_HINTS,
            result: result ?? buildSavedIntake(session),
            session,
          }),
        events: runtimeStorage.events,
        onEvent: async ({ event }) => {
          await deliverIntegrationEvent(event as SavedVoiceIntegrationEvent);
        },
        reviews: runtimeStorage.reviews as unknown as VoiceCallReviewStore,
        tasks: runtimeStorage.tasks as unknown as VoiceOpsTaskStore,
      },
      preset: {
        name: "support-triage",
        options: {
          assignee: "support-oncall",
          escalationAssignee: "support-lead",
          escalationQueue: "support-escalations",
          queue: "support-triage",
        },
      },
    },
    experiment: createVoiceExperiment({
      id: "support-copy",
      variants: [
        {
          id: provider,
          weight: 1,
        },
        {
          id: "direct",
          system:
            "Use direct support copy. If the caller is in general recording mode, capture one freeform turn and return complete true. If the caller asks for transfer, escalation, voicemail, or no answer, route that exact lifecycle outcome.",
          weight: 1,
        },
      ],
    }),
    guardrails: {
      beforeTurn: ({ context, session, turn }) =>
        /\b(human|agent|supervisor|manager)\b/i.test(turn.text) &&
        /\b(please|need|want|get|talk|speak)\b/i.test(turn.text)
          ? {
              assistantText: "Escalating this call for human follow-up.",
              escalate: {
                reason: "caller-requested-human",
              },
              result: buildSavedIntake(
                session,
                resolveScenarioFromContext(context),
              ),
            }
          : undefined,
    },
    id: "support",
    memory: {
      namespace: ({ session }) => session.id,
      store: memoryStore,
    },
    memoryLifecycle: {
      afterTurn: async ({ memory, result, session }) => {
        const savedIntake = result.result ?? buildSavedIntake(session);

        if (savedIntake.detectedName) {
          await memory.set("caller.name", savedIntake.detectedName);
        }

        if (savedIntake.callDisposition) {
          await memory.set("lastOutcome", savedIntake.callDisposition);
        }
      },
      beforeTurn: async ({ memory }) => {
        await memory.get("caller.name");
        await memory.get("lastOutcome");
      },
    },
    model,
    system:
      "Use baseline guide copy. If the caller is in general recording mode, capture one freeform turn and return complete true. If the caller is in guided mode, ask the next concise guided question until the guided prompts are complete. If the caller asks for transfer, escalation, voicemail, or no answer, route that exact lifecycle outcome.",
    tools: [intakeClassifierTool, lifecycleRouterTool, reviewTaskRecorderTool],
    trace: runtimeStorage.traces,
  });

const assistant = createDemoAssistant(modelProvider, assistantModel);

const server = new Elysia()
  .use(absolutejs)
  .use(pagesPlugin(manifest))
  .use(
    voice<unknown, VoiceSessionRecord, SavedIntake>({
      htmx: ({ result }) => {
        if (!result) {
          return `<p class="empty-copy">No saved captures yet.</p>`;
        }

        return `<article class="saved-item">
  <div class="saved-item-header">
    <strong>${escapeHtml(result.title)}</strong>
    <span>${new Date(result.completedAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })}</span>
  </div>
  <p>${escapeHtml(result.transcript)}</p>
  <div class="saved-item-meta">
    <span class="pill">${escapeHtml(result.scenarioId === "guided" ? "Guided test" : "General recording")}</span>
    <span class="pill">${result.turnCount} turn${result.turnCount === 1 ? "" : "s"}</span>
    ${result.callDisposition ? `<span class="pill">${escapeHtml(formatCallDisposition(result.callDisposition) ?? result.callDisposition)}</span>` : ""}
    ${result.callTarget ? `<span class="pill">${escapeHtml(result.callTarget)}</span>` : ""}
    ${result.detectedName ? `<span class="pill">${escapeHtml(result.detectedName)}</span>` : ""}
  </div>
  <div class="saved-answer-list">
    ${renderPromptAnswers(result.promptAnswers)}
  </div>
  <div class="voice-assistant-label">Full transcript</div>
  <p>${escapeHtml(result.transcript)}</p>
  <p class="saved-summary">${escapeHtml(result.assistantSummary)}</p>
</article>`;
      },
      onComplete: async ({ session }) => {
        const result = session.turns
          .toReversed()
          .find((turn) => turn.result !== undefined)?.result as
          | SavedIntake
          | undefined;
        const savedIntake = result ?? buildSavedIntake(session);
        persistIntake(savedIntake);
      },
      ops: assistant.ops,
      correctTurn: correctDemoTurn,
      phraseHints: VOICE_DEMO_PHRASE_HINTS,
      onTurn: assistant.onTurn,
      path: "/voice/intake",
      preset: "reliability",
      session: runtimeStorage.session,
      stt: deepgram({
        apiKey: deepgramApiKey,
        interimResults: true,
        model: "flux-general-en",
        punctuate: true,
        smartFormat: true,
        vadEvents: true,
      }),
    }),
  )
  .get("/api/intakes", () => listIntakes())
  .get("/api/assistant-config", () => assistantConfig)
  .get("/api/assistant-summary", async () => summarizeAssistantRuns())
  .get("/api/provider-status", async () => summarizeProviderHealth())
  .post("/api/provider-simulate/failure", async ({ query }) => {
    const provider =
      typeof query.provider === "string" && isVoiceModelProvider(query.provider)
        ? query.provider
        : undefined;

    if (!provider || provider === "deterministic") {
      return {
        error:
          "Set ?provider=openai, ?provider=anthropic, or ?provider=gemini.",
      };
    }
    if (!configuredModelProviders.includes(provider)) {
      return {
        error: `${provider} is not configured in this environment.`,
      };
    }

    return providerFailureSimulator.run(provider, "failure");
  })
  .post("/api/provider-simulate/recovery", async ({ query }) => {
    const provider =
      typeof query.provider === "string" && isVoiceModelProvider(query.provider)
        ? query.provider
        : undefined;

    if (!provider || provider === "deterministic") {
      return {
        error:
          "Set ?provider=openai, ?provider=anthropic, or ?provider=gemini.",
      };
    }
    if (!configuredModelProviders.includes(provider)) {
      return {
        error: `${provider} is not configured in this environment.`,
      };
    }

    return providerFailureSimulator.run(provider, "recovery");
  })
  .get("/api/assistant-memory", async () => listAssistantMemory())
  .get("/api/reviews", async ({ query }) => {
    const reviews = await listReviews();
    return filterVoiceReviews(reviews, normalizeReviewFilters(query));
  })
  .get(
    "/api/reviews/latest",
    async () =>
      (await listReviews())[0] ?? { error: "No review artifact found" },
  )
  .get("/api/reviews/:reviewId", async ({ params }) => {
    const review = await runtimeStorage.reviews.get(params.reviewId);
    return review ?? { error: "Review not found" };
  })
  .get("/api/tasks", async ({ query }) =>
    filterVoiceOpsTasks(await listTasks(), normalizeTaskFilters(query)),
  )
  .get("/api/tasks/summary", async () =>
    summarizeVoiceOpsTasks(await listTasks()),
  )
  .get(
    "/api/tasks/:taskId",
    async ({ params }) =>
      (await getTask(params.taskId)) ?? { error: "Task not found" },
  )
  .get("/api/integrations/events", async () => await listIntegrationEvents())
  .get(
    "/reviews",
    async ({ query }) =>
      new Response(
        renderVoiceReviewIndexPage(
          await listReviews(),
          normalizeReviewFilters(query),
        ),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get(
    "/reviews/latest",
    async () =>
      new Response(renderVoiceReviewPage((await listReviews())[0] ?? null), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }),
  )
  .get(
    "/tasks",
    async ({ query }) =>
      new Response(
        renderVoiceOpsPage(await listTasks(), normalizeTaskFilters(query)),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get(
    "/integrations",
    async () =>
      new Response(
        renderVoiceIntegrationEventsPage(
          await listIntegrationEvents(),
          webhookUrl,
        ),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get(
    "/assistant",
    async () =>
      new Response(
        renderVoiceAssistantPage(
          await summarizeAssistantRuns(),
          await listAssistantMemory(),
          assistantConfig,
          await summarizeProviderHealth(),
        ),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get("/tasks/:taskId/assign", async ({ params, query }) => {
    const owner =
      typeof query.owner === "string" && query.owner.trim()
        ? query.owner.trim()
        : "ops-demo";
    await assignTask(params.taskId, owner);
    return redirectToTasks();
  })
  .get("/tasks/:taskId/start", async ({ params }) => {
    const task = await getTask(params.taskId);
    if (task) {
      await updateTaskStatus(params.taskId, {
        actor: task.assignee ?? "ops-demo",
        detail: "Work started",
        status: "in-progress",
      });
    }
    return redirectToTasks();
  })
  .get("/tasks/:taskId/complete", async ({ params }) => {
    const task = await getTask(params.taskId);
    if (task) {
      await updateTaskStatus(params.taskId, {
        actor: task.assignee ?? "ops-demo",
        detail: "Marked done",
        status: "done",
      });
    }
    return redirectToTasks();
  })
  .get("/tasks/:taskId/reopen", async ({ params }) => {
    const task = await getTask(params.taskId);
    if (task) {
      await updateTaskStatus(params.taskId, {
        actor: task.assignee ?? "ops-demo",
        detail: "Task reopened",
        status: "open",
      });
    }
    return redirectToTasks();
  })
  .get("/reviews/compare", async ({ query }) => {
    const reviews = await listReviews();
    const leftId =
      typeof query.left === "string" && query.left.trim()
        ? query.left
        : undefined;
    const rightId =
      typeof query.right === "string" && query.right.trim()
        ? query.right
        : reviews[0]?.id;
    const left = leftId
      ? findVoiceReview(reviews, leftId)
      : (reviews[0] ?? null);
    const right = rightId
      ? findVoiceReview(reviews, rightId)
      : (reviews[1] ?? null);

    return new Response(renderVoiceReviewComparePage(left, right), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  })
  .get(
    "/reviews/:reviewId",
    async ({ params }) =>
      new Response(
        renderVoiceReviewPage(
          findVoiceReview(await listReviews(), params.reviewId),
        ),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .use(networking)
  .on("error", (error) => {
    const { request } = error;
    console.error(
      `Voice example error on ${request.method} ${request.url}: ${error.message}`,
    );
  });

export type Server = typeof server;
export default server;
