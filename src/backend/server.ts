import { getEnv, networking, prepare } from "@absolutejs/absolute";
import {
  applyPhraseHintCorrections,
  assignVoiceOpsTask,
  completeVoiceOpsTask,
  createVoiceSQLiteTelephonyWebhookIdempotencyStore,
  createAnthropicVoiceAssistantModel,
  createGeminiVoiceAssistantModel,
  createVoiceAppKitRoutes,
  createVoiceFileEvalBaselineStore,
  createVoiceFileScenarioFixtureStore,
  createVoiceAssistant,
  createVoiceAgentTool,
  createVoiceExperiment,
  createVoiceFileAssistantMemoryStore,
  createVoiceFileRuntimeStorage,
  createOpenAIVoiceAssistantModel,
  createOpenAIVoiceTTS,
  createVoiceHandoffDeliveryWorker,
  createVoiceProviderRouter,
  createVoiceRoutingDecisionSummary,
  createVoiceSTTProviderRouter,
  createVoiceTTSProviderRouter,
  createVoiceTaskUpdatedEvent,
  createVoiceTelephonyCarrierMatrixRoutes,
  createVoiceTelephonyOutcomePolicy,
  createPlivoVoiceRoutes,
  createTelnyxVoiceRoutes,
  createTwilioVoiceRoutes,
  createVoiceToolContractRoutes,
  createVoiceToolRuntimeContractDefaults,
  createVoiceTurnLatencyRoutes,
  createVoiceTurnQualityRoutes,
  createVoiceWorkflowContractHandler,
  createVoiceWorkflowContractPreset,
  createVoiceOpsWebhookReceiverRoutes,
  createVoiceOpsWebhookSink,
  createVoiceOutcomeContractRoutes,
  createVoiceWebhookHandoffAdapter,
  deliverVoiceIntegrationEventToSinks,
  reopenVoiceOpsTask,
  renderVoiceHandoffHealthHTML,
  renderVoiceSessionsHTML,
  resolveVoiceTelephonyOutcome,
  startVoiceOpsTask,
  summarizeVoiceAssistantRuns,
  summarizeVoiceHandoffDeliveries,
  summarizeVoiceHandoffHealth,
  summarizeVoiceProviderHealth,
  summarizeVoiceSessions,
  type STTAdapter,
  type StoredVoiceHandoffDelivery,
  type TTSAdapter,
  type TTSAdapterSession,
  type VoiceCallReviewStore,
  type VoiceAssistantMemoryRecord,
  type VoiceAgentModel,
  type VoiceHandoffDeliveryStore,
  type VoiceIOProviderRouterEvent,
  type VoiceProviderHealthSummary,
  type VoiceProviderRouterEvent,
  type VoiceOpsTaskStatus,
  type VoiceOpsTaskStore,
  type VoiceOutcomeContractDefinition,
  type VoiceTelephonyOutcomeProviderEvent,
  type VoiceTelephonyCarrierMatrixInput,
  type VoiceTelephonyProvider,
  type VoiceTelephonySetupStatus,
  type VoiceTelephonySmokeReport,
  type VoiceToolContractDefinition,
  type VoiceOpsWebhookEnvelope,
  type VoiceTraceEvent,
  type VoiceTurnCorrectionHandler,
  type VoiceTurnRecord,
  type VoiceSessionRecord,
  voice,
  voiceTelephonyOutcomeToRouteResult,
} from "@absolutejs/voice";
import { assemblyai } from "@absolutejs/voice-assemblyai";
import { deepgram } from "@absolutejs/voice-deepgram";
import { Elysia } from "elysia";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
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
import {
  createVoiceIOProviderFailureSimulator,
  createVoiceProviderFailureSimulator,
} from "@absolutejs/voice/testing";
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
  isVoiceRoutingMode,
  VOICE_ASSISTANT_CONFIG,
  type SavedIntake,
  type VoiceModelProvider,
  type VoiceRoutingMode,
} from "../shared/demo";

const { absolutejs, manifest } = await prepare();

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const createJsonHandoffDeliveryStore = <
  TDelivery extends StoredVoiceHandoffDelivery,
>(
  filePath: string,
): VoiceHandoffDeliveryStore<TDelivery> => {
  const read = async () => {
    const file = Bun.file(filePath);
    if (!(await file.exists())) {
      return [];
    }

    const text = await file.text();
    return text.trim() ? (JSON.parse(text) as TDelivery[]) : [];
  };
  const write = async (deliveries: TDelivery[]) => {
    await mkdir(dirname(filePath), { recursive: true });
    await Bun.write(filePath, JSON.stringify(deliveries, null, 2));
  };

  return {
    get: async (id) => (await read()).find((delivery) => delivery.id === id),
    list: async () =>
      (await read()).sort(
        (left, right) =>
          left.createdAt - right.createdAt || left.id.localeCompare(right.id),
      ),
    remove: async (id) => {
      await write((await read()).filter((delivery) => delivery.id !== id));
    },
    set: async (id, delivery) => {
      const deliveries = (await read()).filter((item) => item.id !== id);
      deliveries.push(delivery);
      await write(deliveries);
    },
  };
};

const createDemoLeaseCoordinator = () => {
  const leases = new Map<string, string>();

  return {
    claim: async (input: {
      leaseMs: number;
      taskId: string;
      workerId: string;
    }) => {
      if (leases.has(input.taskId)) {
        return false;
      }

      leases.set(input.taskId, input.workerId);
      return true;
    },
    get: async (taskId: string) => {
      const workerId = leases.get(taskId);
      return workerId
        ? {
            expiresAt: Date.now() + 30_000,
            taskId,
            workerId,
          }
        : null;
    },
    release: async (input: { taskId: string; workerId: string }) => {
      if (leases.get(input.taskId) !== input.workerId) {
        return false;
      }

      leases.delete(input.taskId);
      return true;
    },
    renew: async (input: {
      leaseMs: number;
      taskId: string;
      workerId: string;
    }) => leases.get(input.taskId) === input.workerId,
  };
};

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
const handoffDeliveryStore = createJsonHandoffDeliveryStore<
  StoredVoiceHandoffDelivery<unknown, VoiceSessionRecord, SavedIntake>
>(resolve(runtimeDirectory, "handoff-deliveries.json"));
const memoryStore = createVoiceFileAssistantMemoryStore({
  directory: resolve(runtimeDirectory, "memories"),
});
const deepgramApiKey = getEnv("DEEPGRAM_API_KEY");
const assemblyAIApiKey = process.env.ASSEMBLYAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;
const publicBaseUrl = process.env.VOICE_DEMO_PUBLIC_BASE_URL;
const handoffWebhookUrl = process.env.VOICE_DEMO_HANDOFF_WEBHOOK_URL;
const telephonyWebhookSigningSecret =
  process.env.VOICE_DEMO_TELEPHONY_WEBHOOK_SECRET;
const telnyxPublicKey = process.env.TELNYX_PUBLIC_KEY;
const plivoAuthToken = process.env.PLIVO_AUTH_TOKEN;
const webhookSigningSecret = process.env.VOICE_DEMO_WEBHOOK_SECRET;
const webhookUrl = process.env.VOICE_DEMO_WEBHOOK_URL;
const requestedModelProvider = process.env.VOICE_MODEL_PROVIDER?.toLowerCase();
const readPositiveNumberEnv = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};
const providerLatencyBudgets = {
  anthropic: readPositiveNumberEnv("VOICE_ANTHROPIC_TIMEOUT_MS", 6_000),
  deterministic: readPositiveNumberEnv("VOICE_DETERMINISTIC_TIMEOUT_MS", 500),
  gemini: readPositiveNumberEnv("VOICE_GEMINI_TIMEOUT_MS", 6_000),
  openai: readPositiveNumberEnv("VOICE_OPENAI_TIMEOUT_MS", 6_000),
} satisfies Record<VoiceModelProvider, number>;
const sttLatencyBudgets = {
  assemblyai: readPositiveNumberEnv("VOICE_ASSEMBLYAI_STT_TIMEOUT_MS", 6_000),
  deepgram: readPositiveNumberEnv("VOICE_DEEPGRAM_STT_TIMEOUT_MS", 5_000),
};
type VoiceSTTProvider = "deepgram" | "assemblyai";
const sessionRoutingModes = new Map<string, VoiceRoutingMode>();
const configuredModelProviders: VoiceModelProvider[] = [
  "deterministic",
  openAIApiKey ? "openai" : undefined,
  anthropicApiKey ? "anthropic" : undefined,
  geminiApiKey ? "gemini" : undefined,
].filter(Boolean) as VoiceModelProvider[];
const configuredSTTProviders: VoiceSTTProvider[] = [
  "deepgram",
  assemblyAIApiKey ? "assemblyai" : undefined,
].filter(Boolean) as VoiceSTTProvider[];
const selectedSTTProvider: VoiceSTTProvider = "deepgram";
const voiceProviderModels = {
  anthropic: process.env.ANTHROPIC_VOICE_MODEL ?? "claude-sonnet-4-5",
  assemblyai: process.env.ASSEMBLYAI_SPEECH_MODEL ?? "u3-rt-pro",
  deepgram: "flux-general-en",
  deterministic: "local deterministic support model",
  gemini: process.env.GEMINI_VOICE_MODEL ?? "gemini-2.5-flash",
  openai: process.env.OPENAI_VOICE_MODEL ?? "gpt-4.1-mini",
} satisfies Record<VoiceModelProvider | VoiceSTTProvider, string>;
type VoiceTTSProvider = "openai" | "emergency";
const createEmergencyTelephonyTTS = (): TTSAdapter => ({
  kind: "tts",
  open: (): TTSAdapterSession => {
    const listeners = {
      audio: new Set<
        (payload: {
          chunk: Uint8Array;
          format: {
            channels: 1;
            container: "raw";
            encoding: "pcm_s16le";
            sampleRateHz: number;
          };
          receivedAt: number;
          type: "audio";
        }) => void
      >(),
      close: new Set<(payload: { reason?: string; type: "close" }) => void>(),
      error: new Set<
        (payload: { error: Error; recoverable: boolean; type: "error" }) => void
      >(),
    };

    return {
      close: async (reason?: string) => {
        for (const handler of listeners.close) {
          handler({ reason, type: "close" });
        }
      },
      on: (event, handler) => {
        (listeners[event] as Set<typeof handler>).add(handler as never);
        return () => {
          (listeners[event] as Set<typeof handler>).delete(handler as never);
        };
      },
      send: async () => {
        const sampleRateHz = 16_000;
        const durationMs = 500;
        const samples = Math.floor((sampleRateHz * durationMs) / 1_000);
        const chunk = new Uint8Array(samples * 2);
        const view = new DataView(chunk.buffer);
        for (let index = 0; index < samples; index += 1) {
          const envelope = Math.sin((Math.PI * index) / samples);
          const tone = Math.sin((2 * Math.PI * 660 * index) / sampleRateHz);
          view.setInt16(index * 2, Math.round(tone * envelope * 5_000), true);
        }
        for (const handler of listeners.audio) {
          handler({
            chunk,
            format: {
              channels: 1,
              container: "raw",
              encoding: "pcm_s16le",
              sampleRateHz,
            },
            receivedAt: Date.now(),
            type: "audio",
          });
        }
      },
    };
  },
});
const openAITelephonyTTS = openAIApiKey
  ? createOpenAIVoiceTTS({
      apiKey: openAIApiKey,
      instructions:
        "Speak like a concise phone support agent. Keep the tone natural, clear, and calm. Avoid long pauses.",
      model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE ?? "marin",
    })
  : undefined;
const telephonyTTS = createVoiceTTSProviderRouter<VoiceTTSProvider>({
  adapters: {
    ...(openAITelephonyTTS ? { openai: openAITelephonyTTS } : {}),
    emergency: createEmergencyTelephonyTTS(),
  },
  fallback: openAITelephonyTTS ? ["openai", "emergency"] : ["emergency"],
  onProviderEvent: async (event, input) => {
    await runtimeStorage.traces.append({
      at: event.at,
      payload: {
        ...event,
        providerStatus: event.status,
      },
      sessionId: input.sessionId,
      type: "session.error",
    });
  },
  policy: "ordered",
  providerHealth: {
    cooldownMs: 30_000,
    failureThreshold: 1,
  },
  providerProfiles: {
    emergency: {
      cost: 0,
      latencyMs: 5,
      priority: 2,
      quality: 0.2,
      timeoutMs: 500,
    },
    openai: {
      cost: 2,
      latencyMs: 500,
      priority: 1,
      quality: 0.9,
      timeoutMs: readPositiveNumberEnv("VOICE_OPENAI_TTS_TIMEOUT_MS", 6_000),
    },
  },
  selectProvider: () => (openAITelephonyTTS ? "openai" : "emergency"),
});
const voiceProviderFeatures = {
  anthropic: ["tool calling", "JSON result shaping", "fallback routing"],
  assemblyai: ["realtime STT", "turn formatting", "fallback STT"],
  deepgram: ["Flux realtime STT", "VAD events", "smart formatting"],
  deterministic: ["offline demo mode", "zero external dependency"],
  gemini: ["tool calling", "JSON result shaping", "fallback routing"],
  openai: ["tool calling", "JSON result shaping", "fallback routing"],
} satisfies Record<VoiceModelProvider | VoiceSTTProvider, string[]>;
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
    deterministic: {
      cost: 0,
      latencyMs: 5,
      priority: 4,
      timeoutMs: providerLatencyBudgets.deterministic,
    },
    openai: {
      cost: 2,
      latencyMs: 500,
      priority: 1,
      timeoutMs: providerLatencyBudgets.openai,
    },
    anthropic: {
      cost: 3,
      latencyMs: 700,
      priority: 2,
      timeoutMs: providerLatencyBudgets.anthropic,
    },
    gemini: {
      cost: 1,
      latencyMs: 650,
      priority: 3,
      timeoutMs: providerLatencyBudgets.gemini,
    },
  },
  providers: providerModels,
  selectProvider: ({ context }) => resolveRequestedProvider(context),
});
const sttProviderAdapters = {
  deepgram: deepgram({
    apiKey: deepgramApiKey,
    interimResults: true,
    model: "flux-general-en",
    punctuate: true,
    smartFormat: true,
    vadEvents: true,
  }),
  ...(assemblyAIApiKey
    ? {
        assemblyai: assemblyai({
          apiKey: assemblyAIApiKey,
          formatTurns: true,
          speechModel: process.env.ASSEMBLYAI_SPEECH_MODEL ?? "u3-rt-pro",
        }),
      }
    : {}),
} satisfies Partial<Record<VoiceSTTProvider, STTAdapter>>;
const traceSTTProviderEvent = async (
  event: VoiceIOProviderRouterEvent<VoiceSTTProvider>,
  input: { sessionId: string },
) => {
  const routing = sessionRoutingModes.get(input.sessionId) ?? "balanced";
  await runtimeStorage.traces.append({
    at: event.at,
    payload: {
      ...event,
      providerStatus: event.status,
      routing,
    },
    sessionId: input.sessionId,
    type: "session.error",
  });
};
const createDemoSTTRouter = (
  routing: VoiceRoutingMode,
): STTAdapter =>
  createVoiceSTTProviderRouter<VoiceSTTProvider>({
    adapters: sttProviderAdapters,
    fallback: configuredSTTProviders,
    onProviderEvent: traceSTTProviderEvent,
    policy:
      routing === "fastest"
        ? "latency-first"
        : routing === "cheapest"
          ? "cost-first"
          : routing === "quality"
            ? "quality-first"
            : "balanced",
    providerHealth: {
      cooldownMs: 30_000,
      failureThreshold: 1,
    },
    providerProfiles: {
      deepgram: {
        cost: 4,
        latencyMs: 250,
        priority: 1,
        quality: 0.94,
        timeoutMs: sttLatencyBudgets.deepgram,
      },
      assemblyai: {
        cost: 2,
        latencyMs: 450,
        priority: 2,
        quality: 0.88,
        timeoutMs: sttLatencyBudgets.assemblyai,
      },
    },
  });
const sttRouters: Record<VoiceRoutingMode, STTAdapter> = {
  balanced: createDemoSTTRouter("balanced"),
  cheapest: createDemoSTTRouter("cheapest"),
  fastest: createDemoSTTRouter("fastest"),
  quality: createDemoSTTRouter("quality"),
};
const sttAdapter: STTAdapter = {
  kind: "stt",
  open: (input) => {
    const routing = sessionRoutingModes.get(input.sessionId) ?? "balanced";
    return sttRouters[routing].open(input);
  },
};
const rememberSessionRoutingMode = (input: {
  context: unknown;
  sessionId: string;
}) => {
  const query =
    input.context &&
    typeof input.context === "object" &&
    "query" in input.context &&
    input.context.query &&
    typeof input.context.query === "object"
      ? input.context.query
      : undefined;
  const routing =
    query &&
    "routing" in query &&
    isVoiceRoutingMode(query.routing)
      ? query.routing
      : "balanced";

  sessionRoutingModes.set(input.sessionId, routing);
  return routing;
};
const providerFailureSimulator = createVoiceProviderFailureSimulator({
  allowProviders: () => configuredModelProviders,
  fallback: providerFallbackOrder,
  isProviderError: (error, provider) =>
    provider !== "deterministic" && isAssistantProviderError(error),
  onProviderEvent: traceProviderEvent,
  providerLabel: (provider) =>
    provider === "openai"
      ? "OpenAI"
      : provider === "anthropic"
        ? "Anthropic"
        : provider === "gemini"
          ? "Gemini"
          : "Deterministic",
  providers: configuredModelProviders,
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
const createContractTurn = (
  id: string,
  text: string,
): VoiceTurnRecord<SavedIntake> => ({
  committedAt: Date.now(),
  id,
  text,
  transcripts: [],
});
const demoToolContracts = [
  {
    cases: [
      {
        args: {},
        context: { query: { scenarioId: "general" } },
        expect: {
          expectedResult: { mode: "general" },
          expectIdempotent: true,
          expectStatus: "ok",
          expectTimedOut: false,
        },
        id: "general-mode",
        label: "Classifies general intake context",
      },
      {
        args: {},
        context: { query: { scenarioId: "guided" } },
        expect: {
          expectedResult: { mode: "guided" },
          expectIdempotent: true,
          expectStatus: "ok",
          expectTimedOut: false,
        },
        id: "guided-mode",
        label: "Classifies guided intake context",
      },
    ],
    defaultRuntime: createVoiceToolRuntimeContractDefaults(),
    description:
      "Keeps the assistant intake classifier deterministic across route contexts.",
    id: "intake-classifier",
    label: "Intake classifier",
    tool: intakeClassifierTool,
  },
  {
    cases: [
      {
        args: {},
        expect: {
          expectedResult: {
            text: "Please transfer me to support escalation.",
          },
          expectIdempotent: true,
          expectStatus: "ok",
          expectTimedOut: false,
        },
        id: "transfer-utterance",
        label: "Preserves lifecycle routing utterance",
        turn: createContractTurn(
          "tool-contract-lifecycle-transfer",
          "Please transfer me to support escalation.",
        ),
      },
    ],
    defaultRuntime: createVoiceToolRuntimeContractDefaults(),
    description:
      "Proves lifecycle routing tools receive the exact committed caller text.",
    id: "lifecycle-router",
    label: "Lifecycle router",
    tool: lifecycleRouterTool,
  },
  {
    cases: [
      {
        args: {},
        expect: {
          expectedResult: {
            events: true,
            reviews: true,
            tasks: true,
          },
          expectIdempotent: true,
          expectStatus: "ok",
          expectTimedOut: false,
        },
        id: "store-capabilities",
        label: "Reports review/task/event store capabilities",
      },
    ],
    defaultRuntime: createVoiceToolRuntimeContractDefaults(),
    description:
      "Documents the ops stores the assistant can use for post-call artifacts.",
    id: "review-task-recorder",
    label: "Review/task recorder",
    tool: reviewTaskRecorderTool,
  },
] satisfies Array<
  VoiceToolContractDefinition<
    unknown,
    VoiceSessionRecord,
    Record<string, unknown>,
    unknown,
    SavedIntake
  >
>;
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

const guidedWorkflowContract = createVoiceWorkflowContractPreset<SavedIntake>(
  "support-triage",
  {
    description:
      "The guided demo should collect the expected test answers and complete without provider errors.",
    fields: [
      { aliases: ["issue.summary"], path: "transcript" },
      { aliases: ["resolution.nextStep"], path: "assistantSummary" },
      { match: "non-empty", path: "promptAnswers" },
      { match: "number", path: "turnCount" },
    ],
    id: "guided-demo-completes",
    label: "Guided demo completes",
    maxProviderErrors: 0,
    minSessions: 1,
    minTurns: 3,
    outcome: "complete",
    requiredDisposition: "completed",
    requiredTranscriptIncludes: ["name", "integration", "follow up"],
    scenarioId: "guided",
  },
);

const generalWorkflowContract = createVoiceWorkflowContractPreset<SavedIntake>(
  "support-triage",
  {
    description:
      "General recording should save at least one freeform turn and end cleanly.",
    fields: [
      { aliases: ["issue.summary"], path: "transcript" },
      { aliases: ["resolution.nextStep"], path: "assistantSummary" },
      { match: "number", path: "turnCount" },
    ],
    id: "general-recording-completes",
    label: "General recording completes",
    maxProviderErrors: 0,
    minSessions: 1,
    minTurns: 1,
    outcome: "complete",
    requiredDisposition: "completed",
    scenarioId: "general",
  },
);

const transferWorkflowContract = createVoiceWorkflowContractPreset<SavedIntake>(
  "transfer-handoff",
  {
    description:
      "Any transfer outcome must create a handoff delivery path for downstream ops.",
    fields: [
      { aliases: ["transfer.summary"], path: "transcript" },
      { aliases: ["transfer.reason"], path: "assistantSummary" },
      { aliases: ["transfer.target"], path: "callTarget", required: false },
    ],
    id: "transfer-handoff-delivered",
    label: "Transfer handoff delivered",
    minSessions: 0,
    outcome: "transfer",
    requiredDisposition: "transferred",
    requiredHandoffActions: ["transfer"],
    scenarioId: "transfer",
  },
);

const workflowScenarios = [
  guidedWorkflowContract.toScenarioEval(),
  generalWorkflowContract.toScenarioEval(),
  transferWorkflowContract.toScenarioEval(),
];

const demoOutcomeContracts = [
  {
    description:
      "Completed calls must persist the session review and emit call/review integration events.",
    expectedDisposition: "completed",
    id: "completed-call-artifacts",
    label: "Completed call artifacts",
    requireIntegrationEvents: ["call.completed", "review.saved"],
    requireReview: true,
  },
  {
    description:
      "Transfers must leave review evidence, a follow-up task, a transfer handoff, and integration events.",
    expectedDisposition: "transferred",
    id: "transfer-call-artifacts",
    label: "Transfer call artifacts",
    requireHandoffActions: ["transfer"],
    requireIntegrationEvents: ["call.completed", "review.saved", "task.created"],
    requireReview: true,
    requireTask: true,
  },
  {
    description:
      "Escalations must create a review, follow-up task, and task integration event.",
    expectedDisposition: "escalated",
    id: "escalation-call-artifacts",
    label: "Escalation call artifacts",
    requireIntegrationEvents: ["call.completed", "review.saved", "task.created"],
    requireReview: true,
    requireTask: true,
  },
  {
    description:
      "Voicemail outcomes must create review evidence and callback work.",
    expectedDisposition: "voicemail",
    id: "voicemail-call-artifacts",
    label: "Voicemail call artifacts",
    requireIntegrationEvents: ["call.completed", "review.saved", "task.created"],
    requireReview: true,
    requireTask: true,
  },
  {
    description:
      "No-answer outcomes must create review evidence and retry/callback work.",
    expectedDisposition: "no-answer",
    id: "no-answer-call-artifacts",
    label: "No-answer call artifacts",
    requireIntegrationEvents: ["call.completed", "review.saved", "task.created"],
    requireReview: true,
    requireTask: true,
  },
] satisfies VoiceOutcomeContractDefinition[];

const telephonyOutcomePolicy = createVoiceTelephonyOutcomePolicy({
  metadata: {
    app: "absolutejs-voice-example",
  },
  minAnsweredDurationMs: 1_000,
  transferTarget: ({ metadata }) =>
    typeof metadata?.queue === "string" ? metadata.queue : undefined,
});
const telephonyWebhookIdempotencyStore =
  createVoiceSQLiteTelephonyWebhookIdempotencyStore<SavedIntake>({
    path: resolve(runtimeDirectory, "telephony-webhook-idempotency.sqlite"),
  });

const telephonyOutcomeSamples = [
  {
    label: "Carrier no-answer",
    event: {
      provider: "twilio",
      sipCode: 486,
      status: "busy",
    },
  },
  {
    label: "Machine detection voicemail",
    event: {
      answeredBy: "machine_start",
      provider: "twilio",
      status: "completed",
    },
  },
  {
    label: "Warm transfer bridge",
    event: {
      metadata: {
        queue: "billing",
      },
      provider: "twilio",
      reason: "warm-transfer",
      status: "bridged",
    },
  },
] satisfies Array<{
  event: VoiceTelephonyOutcomeProviderEvent;
  label: string;
}>;

const listTelephonyOutcomePreviews = () =>
  telephonyOutcomeSamples.map((sample) => {
    const decision = resolveVoiceTelephonyOutcome(
      sample.event,
      telephonyOutcomePolicy,
    );

    return {
      decision,
      event: sample.event,
      label: sample.label,
      routeResult: voiceTelephonyOutcomeToRouteResult(decision),
    };
  });

const renderTelephonyOutcomePreviewHTML = () => {
  const rows = listTelephonyOutcomePreviews()
    .map(
      (preview) => `<tr>
        <td>${escapeHtml(preview.label)}</td>
        <td><code>${escapeHtml(JSON.stringify(preview.event))}</code></td>
        <td><strong>${escapeHtml(preview.decision.action)}</strong><br /><span class="muted">${escapeHtml(preview.decision.source)} / ${escapeHtml(preview.decision.confidence)}</span></td>
        <td><code>${escapeHtml(JSON.stringify(preview.routeResult))}</code></td>
      </tr>`,
    )
    .join("");

  const webhookExample = escapeHtml(
    "curl -X POST http://localhost:3000/api/telephony-webhook -H 'content-type: application/x-www-form-urlencoded' --data 'CallSid=demo-call&CallStatus=busy&SipResponseCode=486'",
  );

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Telephony Outcome Preview</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,sans-serif;background:#111827;color:#f8fafc;margin:0}
        main{max-width:1120px;margin:auto;padding:32px}
        a{color:#93c5fd}
        .muted{color:#9ca3af}
        table{width:100%;border-collapse:collapse;background:#1f2937;border-radius:18px;overflow:hidden}
        th,td{border-bottom:1px solid #374151;padding:14px;text-align:left;vertical-align:top}
        code{white-space:normal;word-break:break-word;color:#bfdbfe}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/app-kit">Back to App Kit</a></p>
        <p class="muted">Telephony primitive preview</p>
        <h1>Carrier events become AbsoluteJS lifecycle outcomes</h1>
        <p class="muted">Use <code>resolveVoiceTelephonyOutcome</code>, <code>voiceTelephonyOutcomeToRouteResult</code>, or <code>applyVoiceTelephonyOutcome</code> in carrier webhooks to keep transfer, voicemail, and no-answer behavior deterministic.</p>
        <p class="muted">This demo also mounts <code>createVoiceTelephonyWebhookRoutes</code> at <code>/api/telephony-webhook</code>.</p>
        <p><code>${webhookExample}</code></p>
        <table>
          <thead><tr><th>Case</th><th>Provider Event</th><th>Decision</th><th>Route Result</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </main>
    </body>
  </html>`;
};

const appKitLinks = [
  { href: "/react", label: "Back to demo" },
  {
    description: "Integrated voice operations console.",
    href: "/ops-console",
    label: "Ops Console",
  },
  {
    description: "Acceptance gates for production readiness.",
    href: "/quality",
    label: "Quality",
    statusHref: "/quality/status",
  },
  {
    description:
      "Replay stored sessions against quality gates and trend regressions.",
    href: "/evals",
    label: "Evals",
    statusHref: "/evals/status",
  },
  {
    description: "Compare current evals against a saved known-good baseline.",
    href: "/evals/baseline",
    label: "Eval Baseline",
    statusHref: "/evals/baseline/status",
  },
  {
    description:
      "Business-workflow evals for guided recordings, general captures, and transfer handoffs.",
    href: "/evals/scenarios",
    label: "Scenario Evals",
    statusHref: "/evals/scenarios/status",
  },
  {
    description:
      "Seeded certification fixtures that prove workflows pass before live traffic.",
    href: "/evals/fixtures",
    label: "Fixture Evals",
    statusHref: "/evals/fixtures/status",
  },
  {
    description: "Provider failover, degradation, and simulator controls.",
    href: "/resilience",
    label: "Resilience",
  },
  {
    description:
      "Single pass/warn/fail report for quality, providers, routing evidence, handoffs, sessions, and carriers.",
    href: "/production-readiness",
    label: "Production Readiness",
    statusHref: "/api/production-readiness",
  },
  {
    description:
      "Configured, selected, and healthy LLM/STT providers for this deployment.",
    href: "/provider-capabilities",
    label: "Provider Capabilities",
    statusHref: "/api/provider-capabilities",
  },
  {
    description:
      "Primitive-mounted assistant tool contracts for deterministic tool behavior.",
    href: "/tool-contracts",
    label: "Tool Contracts",
    statusHref: "/api/tool-contracts",
  },
  {
    description:
      "Per-turn responsiveness from transcript timing to committed assistant response.",
    href: "/turn-latency",
    label: "Turn Latency",
    statusHref: "/api/turn-latency",
  },
  {
    description:
      "Per-turn STT confidence, fallback, correction, and transcript diagnostics.",
    href: "/turn-quality",
    label: "Turn Quality",
    statusHref: "/api/turn-quality",
  },
  {
    description:
      "Business outcome contracts for sessions, reviews, tasks, handoffs, and integration events.",
    href: "/outcome-contracts",
    label: "Outcome Contracts",
    statusHref: "/api/outcome-contracts",
  },
  {
    description:
      "Normalize carrier events into transfer, voicemail, no-answer, and route-result primitives.",
    href: "/telephony-outcomes",
    label: "Telephony Outcomes",
    statusHref: "/api/telephony-outcomes",
  },
  {
    description:
      "Twilio, Telnyx, and Plivo setup, signing, stream URL, and contract readiness side-by-side.",
    href: "/carriers",
    label: "Carrier Matrix",
    statusHref: "/api/carriers",
  },
  {
    description: "Redacted trace exports for debugging and support.",
    href: "/diagnostics",
    label: "Diagnostics",
  },
  {
    description:
      "Per-call timelines with provider latency, fallback, timeout, handoff, and error context.",
    href: "/traces",
    label: "Trace Timelines",
    statusHref: "/api/voice-traces",
  },
  {
    description:
      "Interruption latency proof for barge-in, playback stop, and resumed capture.",
    href: "/barge-in",
    label: "Barge-In",
    statusHref: "/api/voice-barge-in",
  },
  {
    description: "Recent calls with replay links.",
    href: "/sessions",
    label: "Sessions",
  },
  {
    description: "Transfer and webhook delivery health.",
    href: "/handoffs",
    label: "Handoffs",
  },
  {
    description: "Follow-up tasks created from call outcomes.",
    href: "/tasks",
    label: "Tasks",
  },
  {
    description: "CRM/helpdesk sync and integration events.",
    href: "/integrations",
    label: "Integrations",
  },
];

const resolveRequestOrigin = (request: Request) => {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? request.headers.get("host") ?? url.host;
  const protocol = forwardedProto ?? url.protocol.replace(":", "");

  return `${protocol}://${host}`;
};

const joinUrlPath = (origin: string, path: string) =>
  `${origin.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

const resolveCarrierOrigin = (request: Request) =>
  publicBaseUrl?.replace(/\/$/, "") ?? resolveRequestOrigin(request);

const resolveCarrierStreamUrl = (request: Request, path: string) => {
  const origin = resolveCarrierOrigin(request);
  const wsOrigin = origin.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  return joinUrlPath(wsOrigin, path);
};

const createCarrierSmoke = <TProvider extends VoiceTelephonyProvider>(
  setup: VoiceTelephonySetupStatus<TProvider>,
): VoiceTelephonySmokeReport<TProvider> => {
  const checks: VoiceTelephonySmokeReport<TProvider>["checks"] = [
    {
      message: setup.urls.stream
        ? "Carrier stream URL is configured."
        : "Carrier stream URL is missing.",
      name: "stream-url",
      status: setup.urls.stream ? "pass" : "fail",
    },
    {
      message: setup.urls.stream.startsWith("wss://")
        ? "Carrier stream URL uses wss://."
        : "Carrier stream URL should use wss:// for production.",
      name: "wss-stream",
      status: setup.urls.stream.startsWith("wss://") ? "pass" : "fail",
    },
    {
      message: setup.urls.webhook
        ? "Carrier webhook URL is configured."
        : "Carrier webhook URL is missing.",
      name: "webhook-url",
      status: setup.urls.webhook ? "pass" : "fail",
    },
    {
      message: setup.signing.configured
        ? `Webhook signing is configured with ${setup.signing.mode}.`
        : "Webhook signing is not configured.",
      name: "signed-webhook",
      status: setup.signing.configured ? "pass" : "fail",
    },
  ];

  for (const missing of setup.missing) {
    checks.push({
      message: `${missing} is missing.`,
      name: "missing-env",
      status: "fail",
    });
  }

  for (const warning of setup.warnings) {
    checks.push({
      message: warning,
      name: "setup-warning",
      status: "warn",
    });
  }

  return {
    checks,
    generatedAt: Date.now(),
    pass: checks.every((check) => check.status !== "fail"),
    provider: setup.provider,
    setup,
    twiml: {
      status: setup.ready ? 200 : 428,
      streamUrl: setup.urls.stream,
    },
    webhook: {
      status: setup.signing.configured ? 200 : 428,
    },
  };
};

const createCarrierSetup = <TProvider extends VoiceTelephonyProvider>(input: {
  answerPath?: string;
  missing: string[];
  provider: TProvider;
  request: Request;
  signingConfigured: boolean;
  signingMode: VoiceTelephonySetupStatus<TProvider>["signing"]["mode"];
  streamPath: string;
  webhookPath: string;
}): VoiceTelephonySetupStatus<TProvider> => {
  const origin = resolveCarrierOrigin(input.request);
  const stream = resolveCarrierStreamUrl(input.request, input.streamPath);
  const webhook = joinUrlPath(origin, input.webhookPath);
  const warnings = [
    ...(stream.startsWith("wss://")
      ? []
      : ["Carrier streams should use wss:// in production."]),
    ...(input.signingConfigured
      ? []
      : ["Webhook signature verification is not configured."]),
  ];

  return {
    generatedAt: Date.now(),
    missing: input.missing,
    provider: input.provider,
    ready:
      input.missing.length === 0 &&
      input.signingConfigured &&
      warnings.length === 0,
    signing: {
      configured: input.signingConfigured,
      mode: input.signingConfigured ? input.signingMode : "none",
      verificationUrl: webhook,
    },
    urls: {
      stream,
      twiml: input.answerPath ? joinUrlPath(origin, input.answerPath) : undefined,
      webhook,
    },
    warnings,
  };
};

const loadCarrierMatrixInputs = ({
  request,
}: {
  query: Record<string, unknown>;
  request: Request;
}): VoiceTelephonyCarrierMatrixInput[] => {
  const twilio = createCarrierSetup({
    answerPath: "/api/twilio/voice",
    missing: [
      publicBaseUrl ? undefined : "VOICE_DEMO_PUBLIC_BASE_URL",
      telephonyWebhookSigningSecret
        ? undefined
        : "VOICE_DEMO_TELEPHONY_WEBHOOK_SECRET",
    ].filter(Boolean) as string[],
    provider: "twilio",
    request,
    signingConfigured: Boolean(telephonyWebhookSigningSecret),
    signingMode: "twilio-signature",
    streamPath: "/api/twilio/stream",
    webhookPath: "/api/telephony-webhook",
  });
  const telnyx = createCarrierSetup({
    answerPath: "/api/telnyx/voice",
    missing: [
      publicBaseUrl ? undefined : "VOICE_DEMO_PUBLIC_BASE_URL",
      telnyxPublicKey ? undefined : "TELNYX_PUBLIC_KEY",
    ].filter(Boolean) as string[],
    provider: "telnyx",
    request,
    signingConfigured: Boolean(telnyxPublicKey),
    signingMode: "provider-signature",
    streamPath: "/api/telnyx/stream",
    webhookPath: "/api/telnyx/webhook",
  });
  const plivo = createCarrierSetup({
    answerPath: "/api/plivo/voice",
    missing: [
      publicBaseUrl ? undefined : "VOICE_DEMO_PUBLIC_BASE_URL",
      plivoAuthToken ? undefined : "PLIVO_AUTH_TOKEN",
    ].filter(Boolean) as string[],
    provider: "plivo",
    request,
    signingConfigured: Boolean(plivoAuthToken),
    signingMode: "provider-signature",
    streamPath: "/api/plivo/stream",
    webhookPath: "/api/plivo/webhook",
  });

  return [twilio, telnyx, plivo].map((setup) => ({
    setup,
    smoke: createCarrierSmoke(setup),
  }));
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

const receivedWebhookEnvelopes: VoiceOpsWebhookEnvelope[] = [];
const handoffAdapters = handoffWebhookUrl
  ? [
      createVoiceWebhookHandoffAdapter({
        actions: ["transfer", "escalate", "voicemail", "no-answer"],
        id: "voice-demo-handoff-webhook",
        signingSecret: webhookSigningSecret,
        url: handoffWebhookUrl,
      }) as ReturnType<
        typeof createVoiceWebhookHandoffAdapter<
          unknown,
          VoiceSessionRecord,
          SavedIntake
        >
      >,
    ]
  : [];
const retryVoiceHandoffDeliveries = async () => {
  if (handoffAdapters.length === 0) {
    return {
      error: "VOICE_DEMO_HANDOFF_WEBHOOK_URL is not configured.",
    };
  }

  const worker = createVoiceHandoffDeliveryWorker({
    adapters: handoffAdapters,
    api: {} as never,
    deliveries: handoffDeliveryStore,
    leases: createDemoLeaseCoordinator(),
    maxFailures: 3,
    workerId: "voice-demo-handoff-retry",
  });

  return worker.drain();
};
const webhookSink = webhookUrl
  ? createVoiceOpsWebhookSink({
      baseUrl: publicBaseUrl,
      id: "voice-demo-ops-webhook",
      signingSecret: webhookSigningSecret,
      url: webhookUrl,
    })
  : undefined;

const deliverIntegrationEvent = async (
  event: SavedVoiceIntegrationEvent,
): Promise<SavedVoiceIntegrationEvent> => {
  const storedEvent: SavedVoiceIntegrationEvent = webhookSink
    ? ((await deliverVoiceIntegrationEventToSinks({
        event,
        sinks: [webhookSink],
      })) as SavedVoiceIntegrationEvent)
    : { ...event };

  await runtimeStorage.events.set(storedEvent.id, storedEvent);
  return storedEvent;
};

const listIntegrationEvents = async (): Promise<SavedVoiceIntegrationEvent[]> =>
  listVoiceIntegrationEvents(await runtimeStorage.events.list());

const listTasks = async (): Promise<SavedVoiceOpsTask[]> =>
  listVoiceOpsTasks(await runtimeStorage.tasks.list());

const seedTurnLatencyProof = async () => {
  const sessionId = `latency-proof-${crypto.randomUUID()}`;
  const turnId = `turn-${crypto.randomUUID()}`;
  const startedAt = Date.now() - 820;
  const timestamps = {
    speechDetected: startedAt,
    finalTranscript: startedAt + 220,
    committed: startedAt + 360,
    assistantTextStarted: startedAt + 430,
    ttsSendStarted: startedAt + 480,
    ttsSendCompleted: startedAt + 535,
    assistantAudioReceived: startedAt + 690,
  };
  const transcript = {
    confidence: 0.96,
    endedAtMs: timestamps.finalTranscript,
    id: `transcript-${crypto.randomUUID()}`,
    isFinal: true,
    startedAtMs: timestamps.speechDetected,
    text: "Show me the latency proof.",
    vendor: "absolutejs-proof",
  };
  const session: VoiceSessionRecord = {
    id: sessionId,
    createdAt: startedAt - 120,
    lastActivityAt: timestamps.assistantAudioReceived,
    status: "completed",
    transcripts: [transcript],
    currentTurn: {
      finalText: "",
      partialText: "",
      transcripts: [],
    },
    turns: [
      {
        assistantText: "Latency proof captured.",
        committedAt: timestamps.committed,
        id: turnId,
        text: "Show me the latency proof.",
        transcripts: [{ ...transcript, id: `turn-${transcript.id}` }],
      },
    ],
    committedTurnIds: [turnId],
    reconnect: {
      attempts: 0,
    },
    lastCommittedTurn: {
      committedAt: timestamps.committed,
      signature: "show me the latency proof.",
      text: "Show me the latency proof.",
      transcriptIds: [transcript.id],
    },
  };
  await runtimeStorage.session.set(sessionId, session);
  const stageEntries = [
    ["speech_detected", timestamps.speechDetected],
    ["final_transcript", timestamps.finalTranscript],
    ["turn_committed", timestamps.committed],
    ["assistant_text_started", timestamps.assistantTextStarted],
    ["tts_send_started", timestamps.ttsSendStarted],
    ["tts_send_completed", timestamps.ttsSendCompleted],
    ["assistant_audio_received", timestamps.assistantAudioReceived],
  ] as const;
  for (const [stage, at] of stageEntries) {
    await runtimeStorage.traces.append({
      at,
      metadata: { proof: "turn-latency" },
      payload: { stage },
      sessionId,
      turnId,
      type: "turn_latency.stage",
    });
  }

  return { ok: true, sessionId, turnId };
};

const toNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const toStringValue = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

const storeLiveTurnLatencyTrace = async (body: unknown) => {
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const id = toStringValue(input.id) ?? `live-turn-${crypto.randomUUID()}`;
  const sessionId = toStringValue(input.sessionId) ?? `live-latency-${crypto.randomUUID()}`;
  const latencyMs = toNumber(input.latencyMs);
  const startedAt = toNumber(input.startedAt) ?? Date.now();
  const completedAt = toNumber(input.completedAt) ?? Date.now();
  const status = toStringValue(input.status) ?? "unknown";
  const event: VoiceTraceEvent = {
    at: completedAt,
    metadata: {
      source: "browser",
      surface: "live-latency-proof",
    },
    payload: {
      assistantAudioAt: toNumber(input.assistantAudioAt),
      assistantTextAt: toNumber(input.assistantTextAt),
      completedAt,
      elapsedMs: latencyMs,
      latencyMs,
      startedAt,
      status,
      thresholdMs: toNumber(input.thresholdMs),
    },
    sessionId,
    traceId: id,
    type: "client.live_latency",
  };
  await runtimeStorage.traces.append(event);

  return { ok: true, sessionId, traceId: id };
};

const summarizeAssistantRuns = async () =>
  summarizeVoiceAssistantRuns({ store: runtimeStorage.traces });

const summarizeProviderHealth = async (): Promise<
  VoiceProviderHealthSummary<VoiceModelProvider>[]
> =>
  summarizeVoiceProviderHealth({
    providers: configuredModelProviders,
    store: runtimeStorage.traces,
  });

const getLatestRoutingDecision = () =>
  createVoiceRoutingDecisionSummary({
    kind: "stt",
    store: runtimeStorage.traces,
  });

const sttProviderSimulationStatus = () =>
  (["deepgram", "assemblyai"] as const).map((provider) => ({
    configured: configuredSTTProviders.includes(provider),
    provider,
  }));

const sttProviderFailureSimulator =
  createVoiceIOProviderFailureSimulator<VoiceSTTProvider>({
    failureElapsedMs: 12,
    failureMessage: ({ provider }) =>
      `Simulated ${provider} websocket open failure.`,
    fallback: (provider) =>
      configuredSTTProviders.filter((candidate) => candidate !== provider),
    kind: "stt",
    latencyBudgets: sttLatencyBudgets,
    onProviderEvent: async (event, input) => {
      await runtimeStorage.traces.append({
        at: event.at,
        payload: {
          ...event,
          providerStatus: event.status,
        },
        sessionId: input.sessionId,
        type: "session.error",
      });
    },
    providers: configuredSTTProviders,
    recoveryElapsedMs: {
      assemblyai: 28,
      deepgram: 18,
    },
    sessionId: ({ now }) => `stt-sim-${now}`,
  });

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
const contractAwareOnTurn = createVoiceWorkflowContractHandler({
  handler: assistant.onTurn,
  resolveContract: ({ result, session }) => {
    if (result.transfer) {
      return transferWorkflowContract;
    }

    if (!result.complete) {
      return undefined;
    }

    return session.scenarioId === "general"
      ? generalWorkflowContract
      : guidedWorkflowContract;
  },
  store: runtimeStorage.traces,
});

const createTelephonyBridgeConfig = () => ({
  context: {},
  correctTurn: correctDemoTurn,
  handoff:
    handoffAdapters.length > 0
      ? {
          adapters: handoffAdapters,
          deliveryQueue: handoffDeliveryStore,
        }
      : undefined,
  onComplete: async ({ session }: { session: VoiceSessionRecord }) => {
    const result = session.turns
      .toReversed()
      .find((turn) => turn.result !== undefined)?.result as
      | SavedIntake
      | undefined;
    const savedIntake = result ?? buildSavedIntake(session);
    persistIntake(savedIntake);
  },
  onTurn: contractAwareOnTurn,
  ops: assistant.ops,
  phraseHints: (input: { context: unknown; sessionId: string }) => {
    rememberSessionRoutingMode(input);
    return VOICE_DEMO_PHRASE_HINTS;
  },
  preset: "reliability" as const,
  session: runtimeStorage.session,
  stt: sttAdapter,
  tts: telephonyTTS,
});

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
      handoff:
        handoffAdapters.length > 0
          ? {
              adapters: handoffAdapters,
              deliveryQueue: handoffDeliveryStore,
            }
          : undefined,
      ops: assistant.ops,
      correctTurn: correctDemoTurn,
      phraseHints: (input) => {
        rememberSessionRoutingMode(input);
        return VOICE_DEMO_PHRASE_HINTS;
      },
      onTurn: contractAwareOnTurn,
      path: "/voice/intake",
      preset: "reliability",
      session: runtimeStorage.session,
      stt: sttAdapter,
    }),
  )
  .use(
    createVoiceAppKitRoutes({
      appStatus: {
        include: {
          quality: false,
          sessions: false,
        },
        preferFixtureWorkflows: true,
      },
      assistantHealth: {},
      diagnostics: {
        title: "AbsoluteJS Voice Demo Diagnostics",
      },
      evals: {
        baselineStore: createVoiceFileEvalBaselineStore(
          resolve(runtimeDirectory, "eval-baseline.json"),
        ),
        fixtureStore: createVoiceFileScenarioFixtureStore(
          resolve(import.meta.dir, "fixtures", "voice-scenario-fixtures.json"),
        ),
        scenarios: workflowScenarios,
        title: "AbsoluteJS Voice Demo Evals",
      },
      handoffs: {},
      links: appKitLinks,
      llmProviders: configuredModelProviders,
      providerCapabilities: {
        features: voiceProviderFeatures,
        models: voiceProviderModels,
        selected: {
          llm: modelProvider,
          stt: selectedSTTProvider,
        },
      },
      providerHealth: {},
      productionReadiness: {
        carriers: loadCarrierMatrixInputs,
        links: {
          carriers: "/carriers",
          handoffs: "/handoffs",
          quality: "/quality",
          resilience: "/resilience",
          sessions: "/sessions",
        },
      },
      resilience: {
        sttSimulation: {
          failureMessage:
            "Simulate Deepgram failure to prove the realtime route falls back to AssemblyAI without changing provider credentials.",
          failureProviders: ["deepgram"],
          fallbackRequiredMessage:
            "Add ASSEMBLYAI_API_KEY to enable the real fallback provider.",
          fallbackRequiredProvider: "assemblyai",
          providers: sttProviderSimulationStatus(),
          run: (provider, mode) =>
            sttProviderFailureSimulator.run(provider as VoiceSTTProvider, mode),
        },
      },
      sessions: {
        htmlPath: false,
      },
      store: runtimeStorage.traces,
      sttProviders: configuredSTTProviders,
      title: "AbsoluteJS Voice Demo Ops Console",
    }).routes,
  )
  .use(
    createVoiceToolContractRoutes({
      contracts: demoToolContracts,
      htmlPath: "/tool-contracts",
      path: "/api/tool-contracts",
      title: "AbsoluteJS Voice Demo Tool Contracts",
    }),
  )
  .post("/api/turn-latency/proof", () => seedTurnLatencyProof())
  .post("/api/live-turn-latency", ({ body }) => storeLiveTurnLatencyTrace(body))
  .use(
    createVoiceTurnLatencyRoutes({
      htmlPath: "/turn-latency",
      path: "/api/turn-latency",
      store: runtimeStorage.session,
      title: "AbsoluteJS Voice Demo Turn Latency",
      traceStore: runtimeStorage.traces,
    }),
  )
  .use(
    createVoiceTurnQualityRoutes({
      htmlPath: "/turn-quality",
      path: "/api/turn-quality",
      store: runtimeStorage.session,
      title: "AbsoluteJS Voice Demo Turn Quality",
    }),
  )
  .use(
    createVoiceOutcomeContractRoutes({
      contracts: demoOutcomeContracts,
      events: runtimeStorage.events,
      handoffs: handoffDeliveryStore as unknown as VoiceHandoffDeliveryStore,
      htmlPath: "/outcome-contracts",
      path: "/api/outcome-contracts",
      reviews: runtimeStorage.reviews,
      sessions: runtimeStorage.session,
      tasks: runtimeStorage.tasks,
      title: "AbsoluteJS Voice Demo Outcome Contracts",
    }),
  )
  .use(
    createVoiceTelephonyCarrierMatrixRoutes({
      load: loadCarrierMatrixInputs,
      path: "/api/carriers",
      title: "AbsoluteJS Voice Demo Carrier Matrix",
    }),
  )
  .use(
    createTelnyxVoiceRoutes<unknown, VoiceSessionRecord, SavedIntake>({
      bridge: createTelephonyBridgeConfig(),
      context: {},
      outcomePolicy: telephonyOutcomePolicy,
      setup: {
        path: "/api/telnyx/setup",
        requiredEnv: {
          TELNYX_PUBLIC_KEY: telnyxPublicKey,
          VOICE_DEMO_PUBLIC_BASE_URL: publicBaseUrl,
        },
        title: "AbsoluteJS Voice Demo Telnyx Setup",
      },
      smoke: {
        path: "/api/telnyx/smoke",
        title: "AbsoluteJS Voice Demo Telnyx Smoke Test",
      },
      streamPath: "/api/telnyx/stream",
      texml: {
        path: "/api/telnyx/voice",
        response: {
          codec: "PCMU",
          streamName: "absolutejs-voice-demo",
          track: "inbound_track",
        },
      },
      webhook: {
        idempotency: {
          store: telephonyWebhookIdempotencyStore,
        },
        onDecision: ({ decision }) => {
          console.info("telnyx telephony outcome webhook", {
            action: decision.action,
            disposition: decision.disposition,
            source: decision.source,
          });
        },
        path: "/api/telnyx/webhook",
        publicKey: telnyxPublicKey,
      },
    }),
  )
  .use(
    createPlivoVoiceRoutes<unknown, VoiceSessionRecord, SavedIntake>({
      bridge: createTelephonyBridgeConfig(),
      context: {},
      outcomePolicy: telephonyOutcomePolicy,
      setup: {
        path: "/api/plivo/setup",
        requiredEnv: {
          PLIVO_AUTH_TOKEN: plivoAuthToken,
          VOICE_DEMO_PUBLIC_BASE_URL: publicBaseUrl,
        },
        title: "AbsoluteJS Voice Demo Plivo Setup",
      },
      smoke: {
        path: "/api/plivo/smoke",
        title: "AbsoluteJS Voice Demo Plivo Smoke Test",
      },
      streamPath: "/api/plivo/stream",
      answer: {
        path: "/api/plivo/voice",
        response: {
          audioTrack: "inbound",
          bidirectional: true,
          contentType: "audio/x-mulaw;rate=8000",
          keepCallAlive: true,
        },
      },
      webhook: {
        authToken: plivoAuthToken,
        idempotency: {
          store: telephonyWebhookIdempotencyStore,
        },
        onDecision: ({ decision }) => {
          console.info("plivo telephony outcome webhook", {
            action: decision.action,
            disposition: decision.disposition,
            source: decision.source,
          });
        },
        path: "/api/plivo/webhook",
        verificationUrl: publicBaseUrl
          ? `${publicBaseUrl.replace(/\/$/, "")}/api/plivo/webhook`
          : undefined,
      },
    }),
  )
  .use(
    createTwilioVoiceRoutes<unknown, VoiceSessionRecord, SavedIntake>({
      ...createTelephonyBridgeConfig(),
      ops: assistant.ops,
      outcomePolicy: telephonyOutcomePolicy,
      setup: {
        path: "/api/twilio/setup",
        requiredEnv: {
          VOICE_DEMO_PUBLIC_BASE_URL: publicBaseUrl,
          VOICE_DEMO_TELEPHONY_WEBHOOK_SECRET:
            telephonyWebhookSigningSecret,
        },
        title: "AbsoluteJS Voice Demo Twilio Setup",
      },
      smoke: {
        path: "/api/twilio/smoke",
        title: "AbsoluteJS Voice Demo Twilio Smoke Test",
      },
      streamPath: "/api/twilio/stream",
      twiml: {
        parameters: ({ query }) => ({
          scenarioId:
            typeof query.scenarioId === "string" ? query.scenarioId : "guided",
          sessionId:
            typeof query.sessionId === "string" ? query.sessionId : undefined,
        }),
        path: "/api/twilio/voice",
        streamName: "absolutejs-voice-demo",
      },
      webhook: {
        idempotency: {
          store: telephonyWebhookIdempotencyStore,
        },
        onDecision: ({ decision }) => {
          console.info("telephony outcome webhook", {
            action: decision.action,
            disposition: decision.disposition,
            source: decision.source,
          });
        },
        path: "/api/telephony-webhook",
        signingSecret: telephonyWebhookSigningSecret,
        verificationUrl: publicBaseUrl
          ? `${publicBaseUrl.replace(/\/$/, "")}/api/telephony-webhook`
          : undefined,
      },
    }),
  )
  .use(
    createVoiceOpsWebhookReceiverRoutes({
      onEnvelope: ({ envelope }) => {
        receivedWebhookEnvelopes.unshift(envelope);
        receivedWebhookEnvelopes.splice(12);
      },
      signingSecret: webhookSigningSecret,
    }),
  )
  .get("/api/intakes", () => listIntakes())
  .get("/api/routing/latest", async () => await getLatestRoutingDecision())
  .get("/api/assistant-config", () => assistantConfig)
  .get("/api/assistant-summary", async () => summarizeAssistantRuns())
  .get("/api/telephony-outcomes", () => ({
    generatedAt: Date.now(),
    policy: telephonyOutcomePolicy,
    previews: listTelephonyOutcomePreviews(),
  }))
  .get("/carriers", ({ redirect }) => redirect("/api/carriers?format=html"))
  .get(
    "/telephony-outcomes",
    () =>
      new Response(renderTelephonyOutcomePreviewHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .post("/api/voice-handoffs/retry", async () => retryVoiceHandoffDeliveries())
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
        renderVoiceIntegrationEventsPage(await listIntegrationEvents(), {
          receivedWebhookCount: receivedWebhookEnvelopes.length,
          receiverPath: "/api/voice-ops/webhook",
          signingEnabled: Boolean(webhookSigningSecret),
          webhookUrl,
        }),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get("/handoffs", async () => {
    const handoffDeliveries = await Promise.resolve(
      handoffDeliveryStore.list(),
    );
    const [handoffHealth, handoffQueue] = await Promise.all([
      summarizeVoiceHandoffHealth({ store: runtimeStorage.traces }),
      Promise.resolve(summarizeVoiceHandoffDeliveries(handoffDeliveries)),
    ]);

    return new Response(
      `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AbsoluteJS Voice Handoffs</title>
  <style>
    :root { color-scheme: dark; }
    body { background: #0b0d10; color: #f4f4f5; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 24px; }
    main { max-width: 1080px; margin: 0 auto; display: grid; gap: 16px; }
    section, article { background: #13161b; border: 1px solid #232833; border-radius: 18px; padding: 20px; }
    .voice-handoff-health-grid, .voice-handoff-health-columns { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .voice-handoff-health-grid article, .voice-handoff-health-columns article, .voice-handoff-health-events article { background: #0f1217; border: 1px solid #232833; border-radius: 16px; padding: 16px; }
    .voice-handoff-health-events { display: grid; gap: 14px; }
    .voice-handoff-health-events article.failed { border-color: rgba(239, 68, 68, 0.7); }
    .voice-handoff-health-events article.delivered { border-color: rgba(34, 197, 94, 0.5); }
    .voice-handoff-health-event-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .handoff-queue-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .handoff-queue-grid article { background: #0f1217; }
    .handoff-metric { font-size: 2rem; font-weight: 800; margin: 0; }
    .handoff-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
    button { background: #f59e0b; border: 0; border-radius: 999px; color: #111827; cursor: pointer; font-weight: 800; padding: 10px 16px; }
    button:disabled { cursor: wait; opacity: 0.55; }
    #handoff-retry-result { color: #d4d4d8; }
    span, small { color: #a1a1aa; }
    a { color: #f59e0b; }
  </style>
  <script>
    async function retryHandoffs(button) {
      button.disabled = true;
      const result = document.getElementById("handoff-retry-result");
      result.textContent = "Retrying queued handoffs...";
      try {
        const response = await fetch("/api/voice-handoffs/retry", { method: "POST" });
        const payload = await response.json();
        if (payload.error) {
          result.textContent = payload.error;
          button.disabled = false;
          return;
        }
        result.textContent = "Retried " + payload.attempted + " queued handoff(s). Reloading...";
        window.location.reload();
      } catch (error) {
        result.textContent = error instanceof Error ? error.message : String(error);
        button.disabled = false;
      }
    }
  </script>
</head>
<body>
  <main>
    <section>
      <h1>Voice handoffs</h1>
      <p>Trace-backed transfer and escalation delivery health with replay links and a durable retry queue.</p>
      <p><a href="/assistant">Assistant control plane</a> · <a href="/resilience">Resilience</a> · <a href="/sessions">Sessions</a> · <a href="/tasks">Tasks</a> · <a href="/integrations">Integrations</a></p>
    </section>
    <section>
      <h2>Delivery queue</h2>
      <div class="handoff-queue-grid">
        <article><span>Total</span><p class="handoff-metric">${handoffQueue.total}</p></article>
        <article><span>Pending</span><p class="handoff-metric">${handoffQueue.pending}</p></article>
        <article><span>Retry eligible</span><p class="handoff-metric">${handoffQueue.retryEligible}</p></article>
        <article><span>Failed</span><p class="handoff-metric">${handoffQueue.failed}</p></article>
        <article><span>Delivered</span><p class="handoff-metric">${handoffQueue.delivered}</p></article>
      </div>
      <div class="handoff-actions">
        <button type="button" onclick="retryHandoffs(this)">Retry queued handoffs</button>
        <span id="handoff-retry-result">${handoffAdapters.length > 0 ? "Ready to drain pending and failed deliveries." : "Set VOICE_DEMO_HANDOFF_WEBHOOK_URL to enable delivery retries."}</span>
      </div>
      <p><small>Queue file: ${escapeHtml(resolve(runtimeDirectory, "handoff-deliveries.json"))}</small></p>
    </section>
    <section>
      ${renderVoiceHandoffHealthHTML(handoffHealth)}
    </section>
  </main>
</body>
</html>`,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  })
  .get(
    "/sessions",
    async () =>
      new Response(
        `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AbsoluteJS Voice Sessions</title>
  <style>
    :root { color-scheme: dark; }
    body { background: #0b0d10; color: #f4f4f5; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 24px; }
    main { max-width: 1080px; margin: 0 auto; display: grid; gap: 16px; }
    section, article { background: #13161b; border: 1px solid #232833; border-radius: 18px; padding: 20px; }
    .voice-sessions-list { display: grid; gap: 14px; }
    .voice-session-card { background: #0f1217; border: 1px solid #232833; border-radius: 16px; padding: 16px; }
    .voice-session-card.failed { border-color: rgba(239, 68, 68, 0.7); }
    .voice-session-card.healthy { border-color: rgba(34, 197, 94, 0.5); }
    .voice-session-card-header { align-items: center; display: flex; gap: 8px; justify-content: space-between; margin-bottom: 12px; }
    dl { display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); margin: 0; }
    dl div { background: #13161b; border: 1px solid #232833; border-radius: 12px; padding: 10px; }
    dt { color: #a1a1aa; }
    dd { margin: 4px 0 0; font-weight: 700; }
    a { color: #f59e0b; }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>Voice sessions</h1>
      <p>Searchable trace-backed sessions with direct replay links.</p>
      <p><a href="/assistant">Assistant control plane</a> · <a href="/resilience">Resilience</a> · <a href="/reviews">Reviews</a> · <a href="/tasks">Tasks</a> · <a href="/handoffs">Handoffs</a></p>
    </section>
    <section>
      ${renderVoiceSessionsHTML(await summarizeVoiceSessions({ store: runtimeStorage.traces }))}
    </section>
  </main>
</body>
</html>`,
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
