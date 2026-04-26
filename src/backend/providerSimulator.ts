import {
  createVoiceProviderRouter,
  createVoiceSessionRecord,
  type VoiceAgentModel,
  type VoiceAgentModelInput,
  type VoiceProviderRouterEvent,
  type VoiceSessionRecord,
} from "@absolutejs/voice";
import {
  isVoiceModelProvider,
  type SavedIntake,
  type VoiceModelProvider,
} from "../shared/demo";

type ProviderSimulatorOptions = {
  allowProviders: () => VoiceModelProvider[];
  fallback: (provider: VoiceModelProvider) => VoiceModelProvider[];
  isProviderError: (error: unknown, provider: VoiceModelProvider) => boolean;
  onProviderEvent: (
    event: VoiceProviderRouterEvent<VoiceModelProvider>,
    input: VoiceAgentModelInput<unknown, VoiceSessionRecord>,
  ) => Promise<void> | void;
};

const providerLabel = (provider: VoiceModelProvider) => {
  switch (provider) {
    case "openai":
      return "OpenAI";
    case "anthropic":
      return "Anthropic";
    case "gemini":
      return "Gemini";
    default:
      return "Deterministic";
  }
};

const resolveSimulatedFailureProvider = (
  context: unknown,
): VoiceModelProvider | undefined => {
  if (
    context &&
    typeof context === "object" &&
    "query" in context &&
    context.query &&
    typeof context.query === "object" &&
    "simulateFailureProvider" in context.query &&
    isVoiceModelProvider(context.query.simulateFailureProvider)
  ) {
    return context.query.simulateFailureProvider;
  }

  return undefined;
};

const resolveSimulatedRecoveryProvider = (
  context: unknown,
): VoiceModelProvider | undefined => {
  if (
    context &&
    typeof context === "object" &&
    "query" in context &&
    context.query &&
    typeof context.query === "object" &&
    "recoverProvider" in context.query &&
    isVoiceModelProvider(context.query.recoverProvider)
  ) {
    return context.query.recoverProvider;
  }

  return undefined;
};

export const createProviderFailureSimulator = (
  options: ProviderSimulatorOptions,
) => {
  const models = Object.fromEntries(
    (["deterministic", "openai", "anthropic", "gemini"] as const).map(
      (provider) => [
        provider,
        {
          generate: async ({ context }) => {
            if (provider === resolveSimulatedFailureProvider(context)) {
              throw new Error(
                `${providerLabel(provider)} voice assistant model failed: HTTP 429`,
              );
            }

            return {
              assistantText: `Simulated ${provider} provider recovered.`,
            };
          },
        } satisfies VoiceAgentModel<unknown, VoiceSessionRecord, SavedIntake>,
      ],
    ),
  ) as Record<
    VoiceModelProvider,
    VoiceAgentModel<unknown, VoiceSessionRecord, SavedIntake>
  >;
  const router = createVoiceProviderRouter<
    unknown,
    VoiceSessionRecord,
    SavedIntake,
    VoiceModelProvider
  >({
    allowProviders: ({ context }) => {
      const recoverProvider = resolveSimulatedRecoveryProvider(context);
      return recoverProvider ? [recoverProvider] : options.allowProviders();
    },
    fallback: ({ context }) =>
      options.fallback(
        resolveRequestedProvider(context, options.allowProviders()),
      ),
    fallbackMode: "provider-error",
    isProviderError: options.isProviderError,
    onProviderEvent: options.onProviderEvent,
    policy: "prefer-selected",
    providerHealth: {
      cooldownMs: 30_000,
      failureThreshold: 1,
      rateLimitCooldownMs: 120_000,
    },
    providers: models,
    selectProvider: ({ context }) =>
      resolveRequestedProvider(context, options.allowProviders()),
  });

  const run = async (
    provider: VoiceModelProvider,
    mode: "failure" | "recovery",
  ) => {
    const session = createVoiceSessionRecord(
      `provider-sim-${Date.now()}`,
      "provider-simulation",
    );
    const turn = {
      committedAt: Date.now(),
      id: `provider-sim-turn-${Date.now()}`,
      text:
        mode === "failure"
          ? `Simulate ${provider} provider failure.`
          : `Simulate ${provider} provider recovery.`,
      transcripts: [],
    };
    const result = await router.generate({
      agentId: "support",
      context: {
        query: {
          provider,
          ...(mode === "recovery"
            ? {
                recoverProvider: provider,
              }
            : {}),
          ...(mode === "failure"
            ? {
                simulateFailureProvider: provider,
              }
            : {}),
        },
      },
      messages: [
        {
          content: turn.text,
          role: "user",
        },
      ],
      session,
      system: "Simulate provider routing without calling external APIs.",
      tools: [],
      turn,
    });

    return {
      mode,
      provider,
      result,
      status: "simulated",
    };
  };

  return {
    run,
  };
};

const resolveRequestedProvider = (
  context: unknown,
  configuredProviders: VoiceModelProvider[],
): VoiceModelProvider => {
  if (
    context &&
    typeof context === "object" &&
    "query" in context &&
    context.query &&
    typeof context.query === "object" &&
    "provider" in context.query &&
    isVoiceModelProvider(context.query.provider) &&
    configuredProviders.includes(context.query.provider)
  ) {
    return context.query.provider;
  }

  return configuredProviders[0] ?? "deterministic";
};
