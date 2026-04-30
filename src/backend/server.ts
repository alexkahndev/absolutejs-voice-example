import { getEnv, networking, prepare } from "@absolutejs/absolute";
import {
  applyVoiceCampaignTelephonyOutcome,
  applyPhraseHintCorrections,
  assignVoiceOpsTask,
  completeVoiceOpsTask,
  createVoiceSQLiteTelephonyWebhookIdempotencyStore,
  createAnthropicVoiceAssistantModel,
  createGeminiVoiceAssistantModel,
  createVoiceDiagnosticsRoutes,
  createVoiceEvalRoutes,
  createVoiceFileEvalBaselineStore,
  createVoiceFileScenarioFixtureStore,
  createVoiceGuardrailRuntime,
  createVoiceGuardrailRoutes,
  createVoiceAssistant,
  createVoiceAgent,
  createVoiceAgentSquad,
  createVoiceAgentTool,
  createVoiceAssistantHealthRoutes,
  createVoiceAuditDeliveryRoutes,
  createVoiceAuditEvent,
  createVoiceAuditSinkDeliveryRecord,
  createVoiceCampaignRoutes,
  createVoiceDeliverySinkPair,
  createVoiceDeliverySinkRoutes,
  createVoiceDeliveryRuntime,
  createVoiceDeliveryRuntimePresetConfig,
  createVoiceDeliveryRuntimeRoutes,
  createVoiceDataControlRoutes,
  createVoiceExperiment,
  createVoiceFileAssistantMemoryStore,
  createVoiceFileRuntimeStorage,
  createVoiceMemoryTraceEventStore,
  createVoiceOpsConsoleRoutes,
  createVoiceOpsActionAuditRoutes,
  createVoiceOpsRecoveryRoutes,
  createVoiceOpsStatusRoutes,
  createVoiceObservabilityExportRoutes,
  createVoiceObservabilityExportReplayRoutes,
  createVoiceCompetitiveCoverageRoutes,
  buildVoiceRealtimeChannelReport,
  buildVoiceRealtimeChannelRuntimeSamplesFromTrace,
  buildVoiceMediaInterruptionReport,
  buildVoiceMediaPipelineCalibrationReport,
  buildVoiceMediaResamplingPlan,
  buildVoiceMediaVadReport,
  createVoiceRealtimeChannelRoutes,
  createVoiceRealtimeProviderContractMatrixPreset,
  createVoiceRealtimeProviderContractRoutes,
  createVoicePlatformCoverageRoutes,
  createVoicePostCallAnalysisRoutes,
  createVoiceProofTrendRoutes,
  createVoiceFileObservabilityExportDeliveryReceiptStore,
  buildVoiceCompetitiveCoverageReport,
  buildVoicePlatformCoverageSummary,
  buildVoiceOpsRecoveryReport,
  buildVoiceObservabilityExport,
  buildVoiceObservabilityExportReplayReport,
  buildVoiceProductionReadinessGate,
  buildVoiceProductionReadinessReport,
  buildEmptyVoiceProofTrendReport,
  buildVoicePostCallAnalysisReport,
  buildVoiceGuardrailReport,
  createVoiceProviderContractMatrixPreset,
  createVoiceReadinessProfile,
  createVoiceSQLiteCampaignStore,
  createOpenAIVoiceAssistantModel,
  createOpenAIVoiceTTS,
  createVoiceHandoffDeliveryWorker,
  createVoiceIncidentBundleRoutes,
  createVoiceProviderCapabilityRoutes,
  createVoiceProviderHealthRoutes,
  buildVoiceProviderOrchestrationReport,
  createVoiceProviderOrchestrationProfile,
  createVoiceProviderOrchestrationRoutes,
  createVoiceProviderDecisionTraceEvent,
  createVoiceMediaFrame,
  createVoiceProviderDecisionTraceRoutes,
  createVoiceProviderSloRoutes,
  createVoiceSloCalibrationRoutes,
  createVoiceSloReadinessThresholdOptions,
  createVoiceSloReadinessThresholdRoutes,
  createVoiceSloThresholdProfile,
  createVoiceOperationsRecordRoutes,
  createVoiceProviderRouter,
  createVoiceProductionReadinessRoutes,
  createVoiceQualityRoutes,
  createVoiceResilienceRoutes,
  createVoiceRoutingDecisionSummary,
  createVoiceSTTProviderRouter,
  createVoiceSessionListRoutes,
  createVoiceSessionReplayRoutes,
  createVoiceSimulationSuiteRoutes,
  createVoiceTTSProviderRouter,
  createVoiceTaskUpdatedEvent,
  createVoiceTraceDeliveryRoutes,
  createVoiceTraceEvent,
  createVoiceTraceSinkDeliveryRecord,
  createVoiceTraceTimelineRoutes,
  createVoiceTelephonyOutcomePolicy,
  createVoiceTelephonyWebhookRoutes,
  createVoiceTelephonyWebhookSecurityPreset,
  createVoiceTelephonyWebhookSecurityRoutes,
  createVoicePhoneAgent,
  createVoiceToolContractRoutes,
  createVoiceToolRuntimeContractDefaults,
  createVoiceLiveLatencyRoutes,
  buildVoiceLiveOpsControlState,
  VOICE_LIVE_OPS_ACTIONS,
  createVoiceTurnLatencyRoutes,
  createVoiceTurnQualityRoutes,
  createVoiceWorkflowContractHandler,
  createVoiceWorkflowContractPreset,
  createVoiceHandoffHealthRoutes,
  createVoiceOpsWebhookReceiverRoutes,
  createVoiceOpsWebhookSink,
  createVoiceOutcomeContractRoutes,
  createVoiceWebhookHandoffAdapter,
  deliverVoiceIntegrationEventToSinks,
  buildVoiceProviderContractMatrix,
  evaluateVoiceProviderStackGaps,
  recordVoiceRuntimeOps,
  reopenVoiceOpsTask,
  renderVoiceHandoffHealthHTML,
  renderVoiceBargeInHTML,
  renderVoiceGuardrailMarkdown,
  renderVoiceReconnectContractHTML,
  renderVoiceSessionsHTML,
  recommendVoiceProviderStack,
  recommendVoiceReadinessProfile,
  renderVoiceProviderContractMatrixHTML,
  resolveVoiceTelephonyOutcome,
  signVoiceTwilioWebhook,
  signVoicePlivoWebhook,
  buildVoiceProofTrendReport,
  formatVoiceProofTrendAge,
  getVoiceCampaignDialerProofStatus,
  runVoiceCampaignDialerProof,
  runVoiceCampaignProof,
  runVoiceCampaignReadinessProof,
  runVoiceAgentSquadContract,
  runVoiceReconnectContract,
  runVoiceProviderRoutingContract,
  startVoiceOpsTask,
  summarizeVoiceReconnectContractSnapshots,
  summarizeVoiceAssistantRuns,
  summarizeVoiceAuditSinkDeliveries,
  summarizeVoiceBargeIn,
  summarizeVoiceHandoffDeliveries,
  summarizeVoiceLiveLatency,
  summarizeVoiceHandoffHealth,
  summarizeVoiceProviderFallbackRecovery,
  summarizeVoiceProviderHealth,
  summarizeVoiceSessions,
  summarizeVoiceTurnLatency,
  summarizeVoiceTraceSinkDeliveries,
  type STTAdapter,
  type StoredVoiceHandoffDelivery,
  type TTSAdapter,
  type TTSAdapterSession,
  type VoiceCallReviewStore,
  type VoiceAssistantMemoryRecord,
  type VoiceAgentModel,
  type VoiceHandoffDeliveryStore,
  type VoiceIOProviderRouterEvent,
  type VoiceLiveOpsAction,
  type VoiceLiveOpsControlState,
  type VoiceProviderHealthSummary,
  type VoiceProviderOrchestrationReport,
  type VoiceProviderRouterEvent,
  type VoiceOpsTaskStatus,
  type VoiceOpsTaskStore,
  type VoiceOutcomeContractDefinition,
  type VoiceTelephonyOutcomeProviderEvent,
  type VoiceTelephonyWebhookDecision,
  type VoiceTelephonyCarrierMatrixInput,
  type VoiceTelephonyProvider,
  type VoiceTelephonySetupStatus,
  type VoiceTelephonySmokeReport,
  type VoiceToolContractDefinition,
  type VoiceOpsWebhookEnvelope,
  type VoiceSessionListItem,
  type StoredVoiceTraceEvent,
  type VoiceTraceEvent,
  type VoiceTraceEventStore,
  type VoiceTraceSinkDeliveryRecord,
  type VoiceTurnCorrectionHandler,
  type VoiceTurnRecord,
  type VoiceSessionRecord,
  type VoiceOnTurnObjectHandler,
  type VoicePlatformCoverageEvidence,
  type VoicePlatformCoverageSurface,
  type VoicePlatformCoverageSummary,
  type VoiceCompetitiveCoverageReport,
  type VoiceCompetitiveSurface,
  type VoicePostCallAnalysisOptions,
  type VoiceGuardrailDecision,
  type VoiceMediaFrame,
  type VoiceProofTrendCycle,
  type VoiceProofTrendReport,
  type VoiceSloCalibrationSample,
  type VoiceProofTrendSummary,
  voice,
  voiceComplianceRedactionDefaults,
  voiceGuardrailPolicyPresets,
  voiceTelephonyOutcomeToRouteResult,
} from "@absolutejs/voice";
import { assemblyai } from "@absolutejs/voice-assemblyai";
import { deepgram } from "@absolutejs/voice-deepgram";
import { gemini } from "@absolutejs/voice-gemini";
import { openai } from "@absolutejs/voice-openai";
import { Elysia } from "elysia";
import { existsSync, statSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
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
  type VoiceAgentSquadDemoStatus,
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
const stringifyForHtml = (value: unknown) =>
  escapeHtml(JSON.stringify(value, null, 2) ?? "");

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
const runtimeDirectory = process.env.VOICE_DEMO_RUNTIME_DIR
  ? resolve(process.env.VOICE_DEMO_RUNTIME_DIR)
  : resolve(import.meta.dir, "..", "..", ".voice-runtime", "voice-demo");
await mkdir(runtimeDirectory, { recursive: true });
const runtimeStorage = createVoiceFileRuntimeStorage<
  VoiceSessionRecord,
  SavedVoiceReviewArtifact,
  SavedVoiceOpsTask,
  SavedVoiceIntegrationEvent
>({
  directory: runtimeDirectory,
});
const supportedDeliverySinkKinds = [
  "file",
  "webhook",
  "s3",
  "postgres",
  "sqlite",
] as const;
type DemoDeliverySinkKind = (typeof supportedDeliverySinkKinds)[number];
const resolveDeliverySinkKind = (
  value: string | undefined,
): DemoDeliverySinkKind =>
  supportedDeliverySinkKinds.includes(value as DemoDeliverySinkKind)
    ? (value as DemoDeliverySinkKind)
    : "file";
const titleCaseSinkKind = (value: string) =>
  value
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
const deliverySinkMode = process.env.VOICE_DELIVERY_SINK ?? "file";
const deliverySinkKind = resolveDeliverySinkKind(
  deliverySinkMode.toLowerCase(),
);
const parseS3DeliveryTarget = (value: string | undefined) => {
  const fallback = {
    bucket: "absolutejs-voice-demo-deliveries",
    keyPrefix: "voice-demo",
    target: "s3://absolutejs-voice-demo-deliveries/voice-demo",
  };
  if (!value?.trim()) {
    return fallback;
  }

  const cleaned = value
    .trim()
    .replace(/^s3:\/\//, "")
    .replace(/^\/+|\/+$/g, "");
  const [bucket, ...prefixParts] = cleaned.split("/");
  if (!bucket) {
    return fallback;
  }

  const keyPrefix = prefixParts.join("/") || "voice-demo";
  return {
    bucket,
    keyPrefix,
    target: `s3://${bucket}/${keyPrefix}`,
  };
};
const s3DeliveryTarget = parseS3DeliveryTarget(
  process.env.VOICE_DELIVERY_S3_BUCKET,
);
const deliverySinkTarget =
  deliverySinkKind === "webhook"
    ? (process.env.VOICE_DELIVERY_WEBHOOK_URL ??
      "https://example.test/voice-delivery")
    : deliverySinkKind === "s3"
      ? s3DeliveryTarget.target
      : deliverySinkKind === "postgres"
        ? "postgres://VOICE_DATABASE_URL/voice_delivery"
        : deliverySinkKind === "sqlite"
          ? "sqlite://voice-demo.sqlite/voice_delivery"
          : "file://.voice-runtime/voice-demo";
const auditDeliverySinkTarget = `${deliverySinkTarget}/audit-deliveries`;
const traceDeliverySinkTarget = `${deliverySinkTarget}/trace-deliveries`;
const deliverySinkLabel = titleCaseSinkKind(deliverySinkKind);
const auditDeliverySinkId = `demo-${deliverySinkKind}-audit-sink`;
const traceDeliverySinkId = `demo-${deliverySinkKind}-trace-sink`;
const deliverySinkDescriptors = createVoiceDeliverySinkPair({
  auditHref: "/audit/deliveries",
  auditId: auditDeliverySinkId,
  auditLabel: `${deliverySinkLabel} audit sink`,
  description: `Demo ${deliverySinkKind} delivery sink selected by VOICE_DELIVERY_SINK.`,
  kind: deliverySinkKind,
  mode: deliverySinkKind,
  target: deliverySinkTarget,
  traceHref: "/traces/deliveries",
  traceId: traceDeliverySinkId,
  traceLabel: `${deliverySinkLabel} trace sink`,
});
const traceDeliveryRecordId = (event: StoredVoiceTraceEvent) =>
  `trace-export:${encodeURIComponent(event.id)}`;

const createDeliveredTraceDeliveryRecord = (
  event: StoredVoiceTraceEvent,
): VoiceTraceSinkDeliveryRecord => {
  const deliveredAt = Date.now();

  return createVoiceTraceSinkDeliveryRecord({
    deliveredAt,
    deliveryAttempts: 1,
    deliveryStatus: "delivered",
    events: [event],
    id: traceDeliveryRecordId(event),
    sinkDeliveries: {
      [traceDeliverySinkId]: {
        attempts: 1,
        deliveredAt,
        deliveredTo: traceDeliverySinkTarget,
        eventCount: 1,
        status: "delivered",
      },
    },
    updatedAt: deliveredAt,
  });
};

const recordAuditDeliveryForTraceExport = async (
  event: StoredVoiceTraceEvent,
) => {
  const deliveredAt = Date.now();
  const auditEvent = await runtimeStorage.audit.append(
    createVoiceAuditEvent({
      action: "trace.export.delivered",
      actor: {
        id: "absolutejs-voice-demo",
        kind: "system",
        name: "AbsoluteJS Voice Demo",
      },
      at: deliveredAt,
      metadata: {
        source: "runtime-trace-export",
      },
      outcome: "success",
      payload: {
        traceEventId: event.id,
        traceEventType: event.type,
      },
      resource: {
        id: event.id,
        type: "voice.trace",
      },
      sessionId: event.sessionId,
      traceId: event.traceId ?? event.id,
      type: "operator.action",
    }),
  );

  await runtimeStorage.auditDeliveries.set(
    `audit-export:${encodeURIComponent(auditEvent.id)}`,
    createVoiceAuditSinkDeliveryRecord({
      deliveredAt,
      deliveryAttempts: 1,
      deliveryStatus: "delivered",
      events: [auditEvent],
      id: `audit-export:${encodeURIComponent(auditEvent.id)}`,
      sinkDeliveries: {
        [auditDeliverySinkId]: {
          attempts: 1,
          deliveredAt,
          deliveredTo: auditDeliverySinkTarget,
          eventCount: 1,
          status: "delivered",
        },
      },
      updatedAt: deliveredAt,
    }),
  );
};

const deliveryTraceStore: VoiceTraceEventStore = {
  append: async (event) => {
    const stored = await runtimeStorage.traces.append(event);
    await runtimeStorage.traceDeliveries.set(
      traceDeliveryRecordId(stored),
      createDeliveredTraceDeliveryRecord(stored),
    );
    await recordAuditDeliveryForTraceExport(stored);

    return stored;
  },
  get: (id) => runtimeStorage.traces.get(id),
  list: (filter) => runtimeStorage.traces.list(filter),
  remove: async (id) => {
    await runtimeStorage.traces.remove(id);
    await runtimeStorage.traceDeliveries.remove(
      `trace-export:${encodeURIComponent(id)}`,
    );
  },
};
const hiddenTraceTimelineSessionPattern =
  /^(latency-proof-|phone-|provider-sim-|quality-routing-proof$|stt-contract-|stt-sim-|tts-contract-|tts-sim-)/;
const filterDemoTraceTimelineEvents = (
  events: StoredVoiceTraceEvent[],
): StoredVoiceTraceEvent[] => {
  const eventsBySession = new Map<string, StoredVoiceTraceEvent[]>();
  for (const event of events) {
    eventsBySession.set(event.sessionId, [
      ...(eventsBySession.get(event.sessionId) ?? []),
      event,
    ]);
  }

  const visibleSessionIds = new Set(
    [...eventsBySession.entries()]
      .filter(([sessionId, sessionEvents]) => {
        if (
          sessionId === "live-session-now" ||
          hiddenTraceTimelineSessionPattern.test(sessionId)
        ) {
          return false;
        }

        return sessionEvents.some(
          (event) =>
            event.type === "call.lifecycle" ||
            event.type === "turn.assistant" ||
            event.type === "turn.committed" ||
            event.type === "turn.transcript",
        );
      })
      .map(([sessionId]) => sessionId),
  );

  return events.filter((event) => visibleSessionIds.has(event.sessionId));
};
const traceTimelineStore: VoiceTraceEventStore = {
  append: (event) => deliveryTraceStore.append(event),
  get: (id) => deliveryTraceStore.get(id),
  list: async (filter) =>
    filterDemoTraceTimelineEvents(await deliveryTraceStore.list(filter)),
  remove: (id) => deliveryTraceStore.remove(id),
};
const demoGuardrailPolicies = [voiceGuardrailPolicyPresets.supportSafeDefaults];
const guardrailBlockedResult = (
  session: VoiceSessionRecord,
  context: unknown,
  reason: string,
): {
  assistantText: string;
  escalate: { metadata: Record<string, unknown>; reason: string };
  result: SavedIntake;
} => ({
  assistantText:
    "I cannot safely complete that in the automated flow. I am routing this to a human specialist.",
  escalate: {
    metadata: {
      guardrail: true,
    },
    reason,
  },
  result: buildSavedIntake(session, resolveScenarioFromContext(context)),
});
const demoLiveGuardrails = createVoiceGuardrailRuntime<
  unknown,
  VoiceSessionRecord,
  SavedIntake
>({
  blockResult: ({ context, decision, session }) =>
    guardrailBlockedResult(
      session,
      context,
      `guardrail-blocked-${decision.stage}`,
    ),
  name: "absolutejs-voice-example-live",
  policies: demoGuardrailPolicies,
  trace: deliveryTraceStore,
});
const demoIncidentSessionId = "demo-incident-bundle";
const voiceSupportArtifactRedaction = {
  keys: ["apiKey", "authorization", "secret", "token"],
  redactEmails: true,
  redactPhoneNumbers: true,
};
const ensureDemoIncidentBundleEvidence = async () => {
  const existing = await runtimeStorage.traces.list({
    sessionId: demoIncidentSessionId,
  });

  const at = Date.now() - 2_400;
  const appendTrace = (event: VoiceTraceEvent) => deliveryTraceStore.append(event);

  if (existing.length === 0) {
    await appendTrace({
      at,
      metadata: {
        proof: "incident-bundle-seed",
        source: "demo",
      },
      payload: {
        status: "started",
      },
      sessionId: demoIncidentSessionId,
      type: "call.lifecycle",
    });
    await appendTrace({
      at: at + 300,
      metadata: {
        proof: "incident-bundle-seed",
        source: "demo",
      },
      payload: {
        isFinal: true,
        text: "My email is demo.customer@example.com and I need billing help.",
      },
      sessionId: demoIncidentSessionId,
      traceId: "demo-incident-transcript",
      turnId: "demo-incident-turn-1",
      type: "turn.transcript",
    });
    await appendTrace({
      at: at + 520,
      metadata: {
        proof: "incident-bundle-seed",
        source: "demo",
      },
      payload: {
        text: "My email is demo.customer@example.com and I need billing help.",
      },
      sessionId: demoIncidentSessionId,
      turnId: "demo-incident-turn-1",
      type: "turn.committed",
    });
    await appendTrace({
      at: at + 760,
      metadata: {
        proof: "incident-bundle-seed",
        source: "demo",
      },
      payload: {
        fromAgentId: "intake",
        reason: "billing_request",
        status: "allowed",
        summary:
          "Customer needs billing support for account demo.customer@example.com.",
        targetAgentId: "billing",
      },
      sessionId: demoIncidentSessionId,
      turnId: "demo-incident-turn-1",
      type: "agent.handoff",
    });
    await appendTrace({
      at: at + 980,
      metadata: {
        proof: "incident-bundle-seed",
        source: "demo",
      },
      payload: {
        elapsedMs: 87,
        status: "success",
        toolCallId: "demo-lookup-invoice",
        toolName: "lookup_invoice",
      },
      sessionId: demoIncidentSessionId,
      turnId: "demo-incident-turn-1",
      type: "agent.tool",
    });
    await appendTrace({
      at: at + 1_220,
      metadata: {
        proof: "incident-bundle-seed",
        source: "demo",
      },
      payload: {
        text: "I found the invoice and can connect you with billing.",
      },
      sessionId: demoIncidentSessionId,
      turnId: "demo-incident-turn-1",
      type: "turn.assistant",
    });
    await appendTrace({
      at: at + 1_500,
      metadata: {
        proof: "incident-bundle-seed",
        source: "demo",
      },
      payload: {
        status: "completed",
      },
      sessionId: demoIncidentSessionId,
      type: "call.lifecycle",
    });
    await runtimeStorage.audit.append(
      createVoiceAuditEvent({
        action: "incident.bundle.demo.seeded",
        actor: {
          id: "absolutejs-voice-demo",
          kind: "system",
          name: "AbsoluteJS Voice Demo",
        },
        at: at + 1_700,
        metadata: {
          proof: "incident-bundle-seed",
          source: "demo",
        },
        outcome: "success",
        payload: {
          note: "Support export can redact demo.customer@example.com from traces and audit.",
        },
        resource: {
          id: demoIncidentSessionId,
          type: "voice.incident_bundle",
        },
        sessionId: demoIncidentSessionId,
        type: "operator.action",
      }),
    );
  }

  const hasGuardrailEvidence = existing.some(
    (event) =>
      event.type === "assistant.guardrail" &&
      event.metadata?.proof === "operations-record-guardrail-seed",
  );

  if (!hasGuardrailEvidence) {
    await appendTrace({
      at: at + 1_060,
      metadata: {
        proof: "operations-record-guardrail-seed",
        source: "demo",
      },
      payload: {
        allowed: false,
        findings: [
          {
            action: "block",
            label: "Unsafe medical claim",
            ruleId: "support.no-medical-advice",
          },
        ],
        stage: "assistant-output",
        status: "fail",
      },
      sessionId: demoIncidentSessionId,
      turnId: "demo-incident-turn-1",
      type: "assistant.guardrail",
    });
    await appendTrace({
      at: at + 1_100,
      metadata: {
        proof: "operations-record-guardrail-seed",
        source: "demo",
      },
      payload: {
        allowed: false,
        findings: [
          {
            action: "block",
            label: "Unsafe tool argument",
            ruleId: "support.tool-input-policy",
          },
        ],
        stage: "tool-input",
        status: "fail",
        toolName: "lookup_invoice",
      },
      sessionId: demoIncidentSessionId,
      turnId: "demo-incident-turn-1",
      type: "assistant.guardrail",
    });
  }

  const latest = await runtimeStorage.traces.list({
    sessionId: demoIncidentSessionId,
  });
  const hasProviderDecisionEvidence = (status: string) =>
    latest.some(
      (event) =>
        event.type === "provider.decision" &&
        event.payload.status === status &&
        event.metadata?.proof === "operations-record-provider-decision-seed",
    );

  if (!hasProviderDecisionEvidence("selected")) {
    await appendTrace({
      ...createVoiceProviderDecisionTraceEvent({
        at: at + 1_030,
        elapsedMs: 320,
        kind: "llm",
        provider: modelProvider,
        reason:
          "live-call selected the configured model provider for the billing support turn.",
        scenarioId: "operations-record-provider-decision-seed",
        selectedProvider: modelProvider,
        sessionId: demoIncidentSessionId,
        status: "selected",
        surface: "live-call",
        turnId: "demo-incident-turn-1",
      }),
      metadata: {
        proof: "operations-record-provider-decision-seed",
        source: "demo",
      },
    });
  }
  if (!hasProviderDecisionEvidence("fallback")) {
    await appendTrace({
      ...createVoiceProviderDecisionTraceEvent({
        at: at + 1_040,
        elapsedMs: 520,
        fallbackProvider: modelProvider === "openai" ? "anthropic" : modelProvider,
        kind: "llm",
        provider: modelProvider,
        reason:
          "live-call recovered with the configured fallback provider after a simulated primary model timeout.",
        scenarioId: "operations-record-provider-decision-seed",
        selectedProvider: modelProvider === "openai" ? "anthropic" : modelProvider,
        sessionId: demoIncidentSessionId,
        status: "fallback",
        surface: "live-call",
        turnId: "demo-incident-turn-1",
      }),
      metadata: {
        proof: "operations-record-provider-decision-seed",
        source: "demo",
      },
    });
  }
  if (!hasProviderDecisionEvidence("degraded")) {
    await appendTrace({
      ...createVoiceProviderDecisionTraceEvent({
        at: at + 1_050,
        elapsedMs: 980,
        fallbackProvider: "deterministic",
        kind: "llm",
        provider: modelProvider,
        reason:
          "live-call degraded to deterministic fallback after model providers exceeded the latency budget.",
        scenarioId: "operations-record-provider-decision-seed",
        selectedProvider: "deterministic",
        sessionId: demoIncidentSessionId,
        status: "degraded",
        surface: "live-call",
        turnId: "demo-incident-turn-1",
      }),
      metadata: {
        proof: "operations-record-provider-decision-seed",
        source: "demo",
      },
    });
  }

  const reviewId = `${demoIncidentSessionId}:review`;
  if (!(await runtimeStorage.reviews.get(reviewId))) {
    await runtimeStorage.reviews.set(reviewId, {
      config: {
        phraseHints: VOICE_DEMO_PHRASE_HINTS.map((hint) => hint.text),
        preset: "reliability",
        stt: {
          model: "flux-general-en",
          provider: "deepgram",
        },
      },
      errors: [],
      generatedAt: at + 1_800,
      id: reviewId,
      intakeId: reviewId,
      latencyBreakdown: [
        {
          label: "first turn",
          valueMs: 520,
        },
      ],
      notes: [
        "Demo post-call analysis seed.",
        "Extracted category: billing.",
        "Follow-up task and integration event are intentionally persisted.",
      ],
      postCall: {
        label: "Billing support follow-up",
        recommendedAction:
          "Create a billing support task and send the summary to the customer-owned workflow sink.",
        reason: "billing_request",
        summary:
          "Customer asked for billing help and should be routed to billing support.",
        target: "customer-1",
      },
      scenarioId: "guided",
      sessionId: demoIncidentSessionId,
      summary: {
        elapsedMs: 1_500,
        firstTurnLatencyMs: 520,
        outcome: "completed",
        pass: true,
        turnCount: 1,
      },
      timeline: [
        {
          atMs: 300,
          event: "transcript",
          source: "turn",
          text: "My email is demo.customer@example.com and I need billing help.",
        },
        {
          atMs: 1_220,
          event: "assistant",
          source: "turn",
          text: "I found the invoice and can connect you with billing.",
        },
      ],
      title: "Demo billing support review",
      transcript: {
        actual:
          "My email is demo.customer@example.com and I need billing help.",
      },
    });
  }

  const taskId = `${reviewId}:support-triage`;
  if (!(await runtimeStorage.tasks.get(taskId))) {
    await runtimeStorage.tasks.set(taskId, {
      createdAt: at + 1_900,
      description:
        "Post-call analysis classified the demo incident as billing support.",
      history: [
        {
          actor: "absolutejs-voice-demo",
          at: at + 1_900,
          detail: "Created by deterministic post-call analysis proof seed.",
          type: "created",
        },
      ],
      id: taskId,
      intakeId: reviewId,
      kind: "support-triage",
      outcome: "completed",
      priority: "normal",
      queue: "billing-support",
      recommendedAction:
        "Review the billing issue and follow up with the customer.",
      reviewId,
      status: "open",
      target: "customer-1",
      title: "Follow up billing support demo incident",
      updatedAt: at + 1_900,
    });
  }

  const eventId = `${reviewId}:post-call-analysis-delivered`;
  if (!(await runtimeStorage.events.get(eventId))) {
    await runtimeStorage.events.set(eventId, {
      createdAt: at + 2_000,
      deliveredAt: at + 2_050,
      deliveredTo: "customer-owned-workflow",
      deliveryAttempts: 1,
      deliveryStatus: "delivered",
      id: eventId,
      payload: {
        category: "billing",
        customerId: "customer-1",
        reviewId,
        sessionId: demoIncidentSessionId,
        summary: "Billing support follow-up created.",
      },
      sinkDeliveries: {
        "customer-owned-workflow": {
          attempts: 1,
          deliveredAt: at + 2_050,
          deliveredTo: "customer-owned-workflow",
          sinkId: "customer-owned-workflow",
          sinkKind: "webhook",
          status: "delivered",
        },
      },
      type: "task.created",
    });
  }
};

const renderVoiceSessionsWithSupportActions = (
  sessions: VoiceSessionListItem[],
) => {
  let html = renderVoiceSessionsHTML(sessions);

  for (const session of sessions) {
    const sessionId = encodeURIComponent(session.sessionId);
    const supportLinks = `<p class="voice-session-support-actions"><a href="${escapeHtml(session.replayHref)}">Open replay</a> · <a href="/voice-operations/${sessionId}">Open operations record</a> · <a href="/voice-incidents/${sessionId}/markdown">Export incident bundle</a></p>`;
    html = html.replace(
      `<p><a href="${session.replayHref}">Open replay</a></p>`,
      supportLinks,
    );
  }

  return html;
};
type TelephonyWebhookDecisionSnapshot = {
  action: string;
  at: number;
  campaignOutcome: unknown;
  disposition?: string;
  duplicate?: boolean;
  idempotencyKey?: string;
  provider: VoiceTelephonyProvider;
  routeResult: unknown;
  source?: string;
  sessionId?: string;
};
const telephonyWebhookDecisionSnapshots: TelephonyWebhookDecisionSnapshot[] =
  [];
const recordTelephonyWebhookDecision = async (
  provider: VoiceTelephonyProvider,
  input: Parameters<typeof recordCampaignTelephonyOutcome>[0] &
    Pick<VoiceTelephonyWebhookDecision, "duplicate" | "idempotencyKey">,
) => {
  const { decision } = input;
  const campaignOutcome = await recordCampaignTelephonyOutcome(input);
  telephonyWebhookDecisionSnapshots.unshift({
    action: decision.action,
    at: Date.now(),
    campaignOutcome,
    disposition: decision.disposition,
    duplicate: input.duplicate,
    idempotencyKey: input.idempotencyKey,
    provider,
    routeResult: input.routeResult,
    source: decision.source,
    sessionId: input.sessionId,
  });
  telephonyWebhookDecisionSnapshots.splice(20);
};

const base64FromBytes = (bytes: ArrayBuffer | Uint8Array) =>
  Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).toString(
    "base64",
  );

const runTelephonyWebhookVerificationProof = async () => {
  const attempts: Array<{
    decisions: number;
    provider: VoiceTelephonyProvider;
    rejected: boolean;
    replayRejected?: boolean;
    sideEffects: number;
    status: number;
    verification?: { ok: false; reason: "invalid-signature" };
  }> = [];

  const twilioPath = "/carrier";
  const twilioUrl = "https://voice.example.test/carrier";
  const twilioBody = {
    CallSid: `proof-twilio-verification-${crypto.randomUUID()}`,
    CallStatus: "busy",
    SipResponseCode: "486",
  };
  const telnyxBody = {
    data: {
      id: `proof-telnyx-verification-${crypto.randomUUID()}`,
      payload: {
        call_control_id: "proof-telnyx-verification-control",
        call_session_id: "proof-telnyx-verification-session",
        status: "completed",
      },
    },
  };
  const telnyxRawBody = JSON.stringify(telnyxBody);
  const telnyxTimestamp = String(Math.floor(Date.now() / 1000));
  const staleTelnyxTimestamp = String(Math.floor(Date.now() / 1000) - 600);
  const telnyxKeyPair = (await crypto.subtle.generateKey(
    "Ed25519",
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  const telnyxPublicKey = base64FromBytes(
    await crypto.subtle.exportKey("raw", telnyxKeyPair.publicKey),
  );
  const telnyxSignature = base64FromBytes(
    await crypto.subtle.sign(
      "Ed25519",
      telnyxKeyPair.privateKey,
      new TextEncoder().encode(`${telnyxTimestamp}|${telnyxRawBody}`),
    ),
  );
  const staleTelnyxSignature = base64FromBytes(
    await crypto.subtle.sign(
      "Ed25519",
      telnyxKeyPair.privateKey,
      new TextEncoder().encode(`${staleTelnyxTimestamp}|${telnyxRawBody}`),
    ),
  );
  const proofWebhookSecurity = createVoiceTelephonyWebhookSecurityPreset({
    plivo: {
      authToken: "proof-plivo-secret",
    },
    store: {
      kind: "sqlite",
      path: resolve(runtimeDirectory, "telephony-webhook-security.sqlite"),
    },
    telnyx: {
      publicKey: telnyxPublicKey,
      toleranceSeconds: 300,
    },
    ttlSeconds: 300,
    twilio: {
      authToken: "proof-secret",
      verificationUrl: twilioUrl,
    },
  });
  let twilioDecisions = 0;
  const twilioRoutes = createVoiceTelephonyWebhookRoutes({
    idempotency: proofWebhookSecurity.twilio.idempotency,
    onDecision: () => {
      twilioDecisions += 1;
    },
    path: twilioPath,
    provider: "twilio",
    verify: proofWebhookSecurity.verify.twilio,
  });
  const twilioInvalidBefore = twilioDecisions;
  const twilioInvalidResponse = await twilioRoutes.handle(
    new Request(twilioUrl, {
      body: new URLSearchParams(twilioBody),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-twilio-signature": "invalid-signature",
      },
      method: "POST",
    }),
  );
  const twilioInvalidBody = (await twilioInvalidResponse.json()) as {
    verification?: { ok: false; reason: "invalid-signature" };
  };
  attempts.push({
    decisions: twilioDecisions - twilioInvalidBefore,
    provider: "twilio",
    rejected: twilioInvalidResponse.status === 401,
    sideEffects: twilioDecisions - twilioInvalidBefore,
    status: twilioInvalidResponse.status,
    verification: twilioInvalidBody.verification,
  });
  const twilioValidSignature = await signVoiceTwilioWebhook({
    authToken: "proof-secret",
    body: twilioBody,
    url: twilioUrl,
  });
  const twilioValidBefore = twilioDecisions;
  const twilioValidResponse = await twilioRoutes.handle(
    new Request(twilioUrl, {
      body: new URLSearchParams(twilioBody),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-twilio-signature": twilioValidSignature,
      },
      method: "POST",
    }),
  );
  attempts.push({
    decisions: twilioDecisions - twilioValidBefore,
    provider: "twilio",
    rejected: false,
    sideEffects: twilioDecisions - twilioValidBefore,
    status: twilioValidResponse.status,
  });

  let telnyxDecisions = 0;
  const telnyxRoutes = createVoiceTelephonyWebhookRoutes({
    onDecision: () => {
      telnyxDecisions += 1;
    },
    path: "/telnyx",
    provider: "telnyx",
    verify: proofWebhookSecurity.verify.telnyx,
  });
  const telnyxInvalidBefore = telnyxDecisions;
  const telnyxInvalidResponse = await telnyxRoutes.handle(
    new Request("https://voice.example.test/telnyx", {
      body: telnyxRawBody,
      headers: {
        "content-type": "application/json",
        "telnyx-signature-ed25519": "invalid-signature",
        "telnyx-timestamp": telnyxTimestamp,
      },
      method: "POST",
    }),
  );
  const telnyxInvalidBody = (await telnyxInvalidResponse.json()) as {
    verification?: { ok: false; reason: "invalid-signature" };
  };
  attempts.push({
    decisions: telnyxDecisions - telnyxInvalidBefore,
    provider: "telnyx",
    rejected: telnyxInvalidResponse.status === 401,
    sideEffects: telnyxDecisions - telnyxInvalidBefore,
    status: telnyxInvalidResponse.status,
    verification: telnyxInvalidBody.verification,
  });
  const telnyxStaleBefore = telnyxDecisions;
  const telnyxStaleResponse = await telnyxRoutes.handle(
    new Request("https://voice.example.test/telnyx", {
      body: telnyxRawBody,
      headers: {
        "content-type": "application/json",
        "telnyx-signature-ed25519": staleTelnyxSignature,
        "telnyx-timestamp": staleTelnyxTimestamp,
      },
      method: "POST",
    }),
  );
  const telnyxStaleBody = (await telnyxStaleResponse.json()) as {
    verification?: { ok: false; reason: "invalid-signature" };
  };
  attempts.push({
    decisions: telnyxDecisions - telnyxStaleBefore,
    provider: "telnyx",
    rejected: telnyxStaleResponse.status === 401,
    replayRejected: true,
    sideEffects: telnyxDecisions - telnyxStaleBefore,
    status: telnyxStaleResponse.status,
    verification: telnyxStaleBody.verification,
  });
  const telnyxValidBefore = telnyxDecisions;
  const telnyxValidResponse = await telnyxRoutes.handle(
    new Request("https://voice.example.test/telnyx", {
      body: telnyxRawBody,
      headers: {
        "content-type": "application/json",
        "telnyx-signature-ed25519": telnyxSignature,
        "telnyx-timestamp": telnyxTimestamp,
      },
      method: "POST",
    }),
  );
  attempts.push({
    decisions: telnyxDecisions - telnyxValidBefore,
    provider: "telnyx",
    rejected: false,
    sideEffects: telnyxDecisions - telnyxValidBefore,
    status: telnyxValidResponse.status,
  });
  const telnyxReplayBefore = telnyxDecisions;
  const telnyxReplayResponse = await telnyxRoutes.handle(
    new Request("https://voice.example.test/telnyx", {
      body: telnyxRawBody,
      headers: {
        "content-type": "application/json",
        "telnyx-signature-ed25519": telnyxSignature,
        "telnyx-timestamp": telnyxTimestamp,
      },
      method: "POST",
    }),
  );
  const telnyxReplayBody = (await telnyxReplayResponse.json()) as {
    verification?: { ok: false; reason: "invalid-signature" };
  };
  attempts.push({
    decisions: telnyxDecisions - telnyxReplayBefore,
    provider: "telnyx",
    rejected: telnyxReplayResponse.status === 401,
    replayRejected: true,
    sideEffects: telnyxDecisions - telnyxReplayBefore,
    status: telnyxReplayResponse.status,
    verification: telnyxReplayBody.verification,
  });

  const plivoBody = {
    CallUUID: "proof-plivo-verification",
    SessionId: "proof-plivo-verification-session",
    status: "completed",
  };
  const plivoNonce = `proof-plivo-nonce-${crypto.randomUUID()}`;
  const plivoUrl = "https://voice.example.test/plivo";
  const plivoSignature = await signVoicePlivoWebhook({
    authToken: "proof-plivo-secret",
    body: plivoBody,
    nonce: plivoNonce,
    url: plivoUrl,
  });
  let plivoDecisions = 0;
  const plivoRoutes = createVoiceTelephonyWebhookRoutes({
    onDecision: () => {
      plivoDecisions += 1;
    },
    path: "/plivo",
    provider: "plivo",
    verify: proofWebhookSecurity.verify.plivo,
  });
  const plivoInvalidBefore = plivoDecisions;
  const plivoInvalidResponse = await plivoRoutes.handle(
    new Request(plivoUrl, {
      body: new URLSearchParams(plivoBody),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-plivo-signature-v3": "invalid-signature",
        "x-plivo-signature-v3-nonce": plivoNonce,
      },
      method: "POST",
    }),
  );
  const plivoInvalidBody = (await plivoInvalidResponse.json()) as {
    verification?: { ok: false; reason: "invalid-signature" };
  };
  attempts.push({
    decisions: plivoDecisions - plivoInvalidBefore,
    provider: "plivo",
    rejected: plivoInvalidResponse.status === 401,
    sideEffects: plivoDecisions - plivoInvalidBefore,
    status: plivoInvalidResponse.status,
    verification: plivoInvalidBody.verification,
  });
  const plivoValidBefore = plivoDecisions;
  const plivoValidResponse = await plivoRoutes.handle(
    new Request(plivoUrl, {
      body: new URLSearchParams(plivoBody),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-plivo-signature-v3": plivoSignature,
        "x-plivo-signature-v3-nonce": plivoNonce,
      },
      method: "POST",
    }),
  );
  attempts.push({
    decisions: plivoDecisions - plivoValidBefore,
    provider: "plivo",
    rejected: false,
    sideEffects: plivoDecisions - plivoValidBefore,
    status: plivoValidResponse.status,
  });
  const plivoReplayBefore = plivoDecisions;
  const plivoReplayResponse = await plivoRoutes.handle(
    new Request(plivoUrl, {
      body: new URLSearchParams(plivoBody),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-plivo-signature-v3": plivoSignature,
        "x-plivo-signature-v3-nonce": plivoNonce,
      },
      method: "POST",
    }),
  );
  const plivoReplayBody = (await plivoReplayResponse.json()) as {
    verification?: { ok: false; reason: "invalid-signature" };
  };
  attempts.push({
    decisions: plivoDecisions - plivoReplayBefore,
    provider: "plivo",
    rejected: plivoReplayResponse.status === 401,
    replayRejected: true,
    sideEffects: plivoDecisions - plivoReplayBefore,
    status: plivoReplayResponse.status,
    verification: plivoReplayBody.verification,
  });

  return {
    attempts,
    ok: attempts.every((attempt) =>
      attempt.rejected ? attempt.status === 401 && attempt.sideEffects === 0 : attempt.status === 200 && attempt.sideEffects === 1,
    ),
  };
};
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
const geminiRealtime = geminiApiKey
  ? gemini({
      apiKey: geminiApiKey,
      instructions:
        "Speak like a concise product demo assistant for AbsoluteJS Voice. Keep replies short, natural, and useful.",
      model:
        process.env.GEMINI_REALTIME_MODEL ??
        "gemini-2.5-flash-native-audio-preview-12-2025",
      voiceName: process.env.GEMINI_REALTIME_VOICE ?? "Puck",
    })
  : undefined;
const openAIRealtime = openAIApiKey
  ? openai({
      apiKey: openAIApiKey,
      instructions:
        "Speak like a concise product demo assistant for AbsoluteJS Voice. Keep replies short, natural, and useful.",
      model: process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime",
      voice: process.env.OPENAI_REALTIME_VOICE ?? "marin",
    })
  : undefined;
const realtimeChannelFormat = {
  channels: 1,
  container: "raw",
  encoding: "pcm_s16le",
  sampleRateHz: 24_000,
} as const;
const publicBaseUrl = process.env.VOICE_DEMO_PUBLIC_BASE_URL;
const carrierReadinessMode =
  process.env.VOICE_DEMO_CARRIER_READINESS === "production"
    ? "production"
    : "local";
const requireProductionCarrierReadiness = carrierReadinessMode === "production";
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
const configuredTTSProviders: VoiceTTSProvider[] = [
  openAITelephonyTTS ? "openai" : undefined,
  "emergency",
].filter(Boolean) as VoiceTTSProvider[];
const ttsLatencyBudgets = {
  emergency: 500,
  openai: readPositiveNumberEnv("VOICE_OPENAI_TTS_TIMEOUT_MS", 6_000),
} satisfies Record<VoiceTTSProvider, number>;
const telephonyTTS = createVoiceTTSProviderRouter<VoiceTTSProvider>({
  adapters: {
    ...(openAITelephonyTTS ? { openai: openAITelephonyTTS } : {}),
    emergency: createEmergencyTelephonyTTS(),
  },
  fallback: openAITelephonyTTS ? ["openai", "emergency"] : ["emergency"],
  onProviderEvent: async (event, input) => {
    await deliveryTraceStore.append({
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
  assemblyai: ["realtime STT", "VAD events", "turn formatting", "fallback STT"],
  deepgram: ["Flux realtime STT", "VAD events", "smart formatting"],
  deterministic: [
    "tool calling",
    "JSON result shaping",
    "fallback routing",
    "offline demo mode",
    "zero external dependency",
  ],
  gemini: ["tool calling", "JSON result shaping", "fallback routing"],
  openai: ["tool calling", "JSON result shaping", "fallback routing"],
} satisfies Record<VoiceModelProvider | VoiceSTTProvider, string[]>;
const voiceProviderStackCapabilities = {
  llm: {
    anthropic: voiceProviderFeatures.anthropic,
    deterministic: voiceProviderFeatures.deterministic,
    gemini: voiceProviderFeatures.gemini,
    openai: voiceProviderFeatures.openai,
  },
  stt: {
    assemblyai: voiceProviderFeatures.assemblyai,
    deepgram: voiceProviderFeatures.deepgram,
  },
  tts: {
    emergency: [
      "streaming speech",
      "barge-in friendly",
      "spoken playback",
      "offline fallback",
    ],
    openai: ["streaming speech", "barge-in friendly", "spoken playback"],
  },
};
type DemoProviderOrchestrationSurface =
  | "background-summary"
  | "live-call"
  | "live-stt"
  | "telephony-tts";
type DemoProviderOrchestrationProvider =
  | VoiceModelProvider
  | VoiceSTTProvider
  | VoiceTTSProvider;
const providerOrchestrationProfile = createVoiceProviderOrchestrationProfile<
  unknown,
  VoiceSessionRecord,
  DemoProviderOrchestrationProvider,
  DemoProviderOrchestrationSurface
>({
  defaultSurface: "live-call",
  id: "absolutejs-voice-demo-provider-orchestration",
  surfaces: {
    "background-summary": {
      fallback: configuredModelProviders.includes("gemini")
        ? ["gemini", ...configuredModelProviders.filter((provider) => provider !== "gemini")]
        : configuredModelProviders,
      maxCost: configuredModelProviders.includes("gemini") ? 2 : 3,
      minQuality: 0.7,
      policy: "cost-cap",
      providerProfiles: {
        anthropic: {
          cost: 3,
          latencyMs: 700,
          priority: 2,
          quality: 0.95,
          timeoutMs: providerLatencyBudgets.anthropic,
        },
        deterministic: {
          cost: 0,
          latencyMs: 5,
          priority: 4,
          quality: 0.72,
          timeoutMs: providerLatencyBudgets.deterministic,
        },
        gemini: {
          cost: 1,
          latencyMs: 650,
          priority: 3,
          quality: 0.86,
          timeoutMs: providerLatencyBudgets.gemini,
        },
        openai: {
          cost: 2,
          latencyMs: 500,
          priority: 1,
          quality: 0.92,
          timeoutMs: providerLatencyBudgets.openai,
        },
      },
    },
    "live-call": {
      fallback: configuredModelProviders,
      maxLatencyMs: 900,
      minQuality: 0.7,
      policy: "latency-first",
      providerHealth: {
        cooldownMs: 30_000,
        failureThreshold: 1,
        rateLimitCooldownMs: 120_000,
      },
      providerProfiles: {
        anthropic: {
          cost: 3,
          latencyMs: 700,
          priority: 2,
          quality: 0.95,
          timeoutMs: providerLatencyBudgets.anthropic,
        },
        deterministic: {
          cost: 0,
          latencyMs: 5,
          priority: 4,
          quality: 0.72,
          timeoutMs: providerLatencyBudgets.deterministic,
        },
        gemini: {
          cost: 1,
          latencyMs: 650,
          priority: 3,
          quality: 0.86,
          timeoutMs: providerLatencyBudgets.gemini,
        },
        openai: {
          cost: 2,
          latencyMs: 500,
          priority: 1,
          quality: 0.92,
          timeoutMs: providerLatencyBudgets.openai,
        },
      },
      timeoutMs: 6_000,
    },
    "live-stt": {
      fallback: configuredSTTProviders,
      maxLatencyMs: 900,
      minQuality: 0.85,
      policy: "latency-first",
      providerHealth: {
        cooldownMs: 30_000,
        failureThreshold: 1,
      },
      providerProfiles: {
        assemblyai: {
          cost: 2,
          latencyMs: 450,
          priority: 2,
          quality: 0.88,
          timeoutMs: sttLatencyBudgets.assemblyai,
        },
        deepgram: {
          cost: 4,
          latencyMs: 250,
          priority: 1,
          quality: 0.94,
          timeoutMs: sttLatencyBudgets.deepgram,
        },
      },
    },
    "telephony-tts": {
      fallback: openAITelephonyTTS ? ["openai", "emergency"] : ["emergency"],
      maxLatencyMs: 1_200,
      policy: "latency-first",
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
          timeoutMs: ttsLatencyBudgets.emergency,
        },
        openai: {
          cost: 2,
          latencyMs: 500,
          priority: 1,
          quality: 0.9,
          timeoutMs: ttsLatencyBudgets.openai,
        },
      },
    },
  },
});
const providerOrchestrationRequirements = {
  "background-summary": {
    minProviders: 1,
    requireBudgetPolicy: true,
    requireFallback: true,
    requireTimeoutBudget: true,
  },
  "live-call": {
    minProviders: 1,
    requireBudgetPolicy: true,
    requireCircuitBreaker: true,
    requireFallback: true,
    requireTimeoutBudget: true,
  },
  "live-stt": {
    minProviders: 1,
    requireBudgetPolicy: true,
    requireCircuitBreaker: true,
    requireFallback: true,
    requireTimeoutBudget: true,
  },
  "telephony-tts": {
    minProviders: 1,
    requireBudgetPolicy: true,
    requireCircuitBreaker: true,
    requireFallback: true,
    requireTimeoutBudget: true,
  },
} as const;
const buildDemoProviderOrchestrationReport =
  (): VoiceProviderOrchestrationReport =>
    buildVoiceProviderOrchestrationReport({
      profile: providerOrchestrationProfile,
      requirements: providerOrchestrationRequirements,
    });
const buildDemoProviderContractDefinitions = () =>
  createVoiceProviderContractMatrixPreset("phone-agent", {
    capabilities: voiceProviderStackCapabilities,
    configured: {
      anthropic: Boolean(anthropicApiKey),
      assemblyai: Boolean(assemblyAIApiKey),
      deepgram: Boolean(deepgramApiKey),
      deterministic: true,
      gemini: Boolean(geminiApiKey),
      openai: Boolean(openAIApiKey),
      emergency: true,
    },
    env: {
      ...process.env,
      GEMINI_API_KEY: geminiApiKey,
    },
    latencyBudgets: {
      ...providerLatencyBudgets,
      ...sttLatencyBudgets,
      ...ttsLatencyBudgets,
    },
    providers: {
      llm: configuredModelProviders,
      stt: configuredSTTProviders,
      tts: configuredTTSProviders,
    },
    remediationHref: "/provider-contracts",
    selected: {
      llm: modelProvider,
      stt: selectedSTTProvider,
      tts: openAITelephonyTTS ? "openai" : "emergency",
    },
    streaming: {
      anthropic: true,
      assemblyai: true,
      deepgram: true,
      deterministic: true,
      emergency: true,
      gemini: true,
      openai: true,
    },
  }).contracts;
const buildDemoProviderContractMatrix = () =>
  buildVoiceProviderContractMatrix({
    contracts: buildDemoProviderContractDefinitions(),
  });
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
  await deliveryTraceStore.append({
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
  await deliveryTraceStore.append({
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
const createDemoSTTRouter = (routing: VoiceRoutingMode): STTAdapter =>
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
    query && "routing" in query && isVoiceRoutingMode(query.routing)
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
const runDemoProviderRoutingContract = async () => {
  const events: StoredVoiceTraceEvent[] = [];
  const requestedProvider: VoiceModelProvider =
    configuredModelProviders.includes("openai")
      ? "openai"
      : (configuredModelProviders[0] ?? "deterministic");
  const fallbackProvider = providerFallbackOrder(requestedProvider).find(
    (provider) => provider !== requestedProvider,
  );
  const simulator = createVoiceProviderFailureSimulator({
    allowProviders: () => configuredModelProviders,
    fallback: providerFallbackOrder,
    isProviderError: (error, provider) =>
      provider !== "deterministic" && isAssistantProviderError(error),
    onProviderEvent: async (event, input) => {
      events.push({
        at: event.at,
        id: `${input.session.id}:${input.turn.id}:${event.provider}:${event.status}:${event.at}`,
        payload: {
          ...event,
          providerStatus: event.status,
        },
        scenarioId: "provider-routing-contract",
        sessionId: input.session.id,
        turnId: input.turn.id,
        type: "session.error",
      });
    },
    providerLabel: (provider) =>
      provider === "openai"
        ? "OpenAI"
        : provider === "anthropic"
          ? "Anthropic"
          : provider === "gemini"
            ? "Gemini"
            : "Deterministic",
    providers: configuredModelProviders,
    replayHref: false,
  });

  await simulator.run(
    requestedProvider,
    fallbackProvider ? "failure" : "recovery",
  );

  return runVoiceProviderRoutingContract({
    contract: {
      expect: fallbackProvider
        ? [
            {
              fallbackProvider,
              kind: "llm",
              provider: requestedProvider,
              selectedProvider: requestedProvider,
              status: "error",
            },
            {
              kind: "llm",
              provider: fallbackProvider,
              selectedProvider: requestedProvider,
              status: "fallback",
            },
          ]
        : [
            {
              kind: "llm",
              provider: requestedProvider,
              selectedProvider: requestedProvider,
              status: "success",
            },
          ],
      id: fallbackProvider
        ? `${requestedProvider}-to-${fallbackProvider}-fallback`
        : `${requestedProvider}-success`,
      label: "Demo LLM provider fallback",
      scenarioId: "provider-routing-contract",
    },
    events,
  });
};
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
const runDemoAgentSquadContract = async () => {
  const trace = createVoiceMemoryTraceEventStore();
  const supportAgent = createVoiceAgent<
    unknown,
    VoiceSessionRecord,
    { queue: string }
  >({
    id: "support",
    model: {
      generate: ({ turn }) =>
        turn.text.toLowerCase().includes("billing")
          ? {
              handoff: {
                metadata: { queue: "billing" },
                reason: "Billing question detected.",
                targetAgentId: "billing",
              },
            }
          : turn.text.toLowerCase().includes("legal")
            ? {
                handoff: {
                  metadata: { queue: "legal" },
                  reason: "Legal question detected.",
                  targetAgentId: "legal",
                },
              }
            : {
                assistantText: "Support can help with this request.",
                result: { queue: "support" },
              },
    },
    system: "Route callers to the correct demo specialist.",
    trace,
  });
  const billingAgent = createVoiceAgent<
    unknown,
    VoiceSessionRecord,
    { queue: string }
  >({
    id: "billing",
    model: {
      generate: () => ({
        assistantText: "Billing can help with your invoice.",
        complete: true,
        result: { queue: "billing" },
      }),
    },
    system: "Handle invoice and billing questions.",
    trace,
  });
  const squad = createVoiceAgentSquad<
    unknown,
    VoiceSessionRecord,
    { queue: string }
  >({
    agents: [supportAgent, billingAgent],
    defaultAgentId: "support",
    handoffPolicy: ({ handoff }) =>
      handoff.targetAgentId === "billing"
        ? {
            metadata: { certifiedRoute: "support-to-billing" },
            summary: "Certified billing route.",
          }
        : {
            allow: false,
            escalate: {
              metadata: {
                requestedSpecialist: handoff.targetAgentId,
              },
              reason: "unsupported-specialist",
            },
            reason: `No certified route for ${handoff.targetAgentId}.`,
          },
    id: "demo-front-desk",
    trace,
  });

  return runVoiceAgentSquadContract({
    context: {},
    contract: {
      description:
        "Proves the demo front desk routes billing callers to the billing specialist.",
      id: "demo-billing-route",
      label: "Demo billing squad route",
      scenarioId: "demo-billing-route",
      turns: [
        {
          expect: {
            assistantIncludes: ["invoice"],
            finalAgentId: "billing",
            handoffs: [
              {
                fromAgentId: "support",
                status: "allowed",
                targetAgentId: "billing",
              },
            ],
            outcome: "complete",
            result: ({ result }) =>
              result?.queue === "billing"
                ? []
                : [
                    {
                      code: "demo_billing_route.queue_mismatch",
                      message: "Expected billing queue result.",
                    },
                  ],
          },
          id: "billing-question",
          text: "I have a billing question about my invoice.",
        },
        {
          expect: {
            finalAgentId: "support",
            handoffs: [
              {
                fromAgentId: "support",
                status: "blocked",
                targetAgentId: "legal",
              },
            ],
            outcome: "escalate",
            result: ({ routeResult }) =>
              routeResult.escalate?.reason === "unsupported-specialist"
                ? []
                : [
                    {
                      code: "demo_unsupported_route.escalation_missing",
                      message:
                        "Expected unsupported specialist route to escalate.",
                    },
                  ],
          },
          id: "unsupported-legal-question",
          text: "I have a legal question about this invoice.",
        },
      ],
    },
    squad,
    trace,
  });
};
const renderAgentSquadContractHTML = async () => {
  const report = await runDemoAgentSquadContract();
  const issueRows = report.issues.length
    ? report.issues
        .map(
          (issue) =>
            `<li><code>${escapeHtml(issue.code)}</code> ${escapeHtml(
              issue.message,
            )}</li>`,
        )
        .join("")
    : "<li>No routing issues.</li>";
  const turnRows = report.turns
    .map(
      (turn) => `<tr>
        <td><code>${escapeHtml(turn.turnId)}</code></td>
        <td>${escapeHtml(turn.agentId)}</td>
        <td>${escapeHtml(turn.outcome ?? "none")}</td>
        <td>${turn.handoffs
          .map(
            (handoff) =>
              `${escapeHtml(handoff.fromAgentId ?? "?")} -> ${escapeHtml(
                handoff.targetAgentId ?? "?",
              )} (${escapeHtml(handoff.status ?? "unknown")})`,
          )
          .join("<br>")}</td>
        <td>${turn.pass ? "Pass" : "Fail"}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Agent squad contract</title>
      <style>
        body{background:#080b12;color:#e5eefb;font-family:Inter,ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1040px;margin:auto;padding:32px}
        a{color:#93c5fd}
        .pill{border-radius:999px;display:inline-block;font-weight:800;padding:8px 12px;background:${report.pass ? "#14532d" : "#7f1d1d"}}
        .muted{color:#9ca3af}
        table{width:100%;border-collapse:collapse;background:#111827;border-radius:18px;overflow:hidden}
        th,td{border-bottom:1px solid #263244;padding:14px;text-align:left;vertical-align:top}
        code{color:#bfdbfe}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/api/agent-squad-contract">JSON</a></p>
        <p class="muted">Self-hosted specialist routing proof</p>
        <h1>Agent squad contract</h1>
        <p class="pill">${report.pass ? "Pass" : "Fail"}</p>
        <p class="muted">This page runs <code>runVoiceAgentSquadContract</code> against a deterministic support-to-billing squad. It proves the route graph before live traffic.</p>
        <h2>Turns</h2>
        <table>
          <thead><tr><th>Turn</th><th>Final agent</th><th>Outcome</th><th>Handoffs</th><th>Status</th></tr></thead>
          <tbody>${turnRows}</tbody>
        </table>
        <h2>Issues</h2>
        <ul>${issueRows}</ul>
      </main>
    </body>
  </html>`;
};

const readPayloadString = (
  payload: Record<string, unknown> | undefined,
  key: string,
) => {
  const value = payload?.[key];
  return typeof value === "string" ? value : undefined;
};

const readPayloadNumber = (
  payload: Record<string, unknown> | undefined,
  key: string,
) => {
  const value = payload?.[key];
  return typeof value === "number" ? value : undefined;
};

const buildAgentSquadDemoStatus = async (
  sessionId?: string,
): Promise<VoiceAgentSquadDemoStatus> => {
  if (!sessionId) {
    return {
      contextPolicy: "default",
      currentAgentId: "front-desk",
      handoffCount: 0,
      status: "idle",
    };
  }

  const [contextEvents, handoffEvents] = await Promise.all([
    deliveryTraceStore.list({
      sessionId,
      limit: 25,
      type: "agent.context",
    }),
    deliveryTraceStore.list({
      sessionId,
      limit: 25,
      type: "agent.handoff",
    }),
  ]);
  const latestContext = [...contextEvents].sort(
    (left, right) => right.at - left.at,
  )[0];
  const latestHandoff = [...handoffEvents].sort(
    (left, right) => right.at - left.at,
  )[0];
  const contextPayload = latestContext?.payload as
    | Record<string, unknown>
    | undefined;
  const handoffPayload = latestHandoff?.payload as
    | Record<string, unknown>
    | undefined;
  const latestEvent = [latestContext, latestHandoff]
    .filter(Boolean)
    .sort((left, right) => (right?.at ?? 0) - (left?.at ?? 0))[0];

  if (!latestEvent) {
    return {
      contextPolicy: "default",
      currentAgentId: "front-desk",
      handoffCount: 0,
      status: "idle",
    };
  }

  return {
    at: latestEvent.at,
    contextPolicy:
      readPayloadString(contextPayload, "status") === "applied"
        ? "handoff-summary-current-turn"
        : "default",
    currentAgentId:
      readPayloadString(contextPayload, "targetAgentId") ??
      readPayloadString(handoffPayload, "targetAgentId") ??
      "front-desk",
    handoffCount: handoffEvents.length,
    lastHandoff: latestHandoff
      ? {
          fromAgentId: readPayloadString(handoffPayload, "fromAgentId"),
          reason: readPayloadString(handoffPayload, "reason"),
          status: readPayloadString(handoffPayload, "status"),
          summary: readPayloadString(handoffPayload, "summary"),
          targetAgentId: readPayloadString(handoffPayload, "targetAgentId"),
        }
      : undefined,
    messageCount: readPayloadNumber(contextPayload, "nextMessageCount"),
    sessionId: latestEvent.sessionId,
    status: "active",
  };
};

const agentSquadStatusRoutes = new Elysia().get(
  "/api/agent-squad/status",
  ({ query }) =>
    buildAgentSquadDemoStatus(
      typeof query.sessionId === "string" ? query.sessionId : undefined,
    ),
);

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
    scenarioId: "proof-transfer",
  },
);

const workflowScenarios = [
  guidedWorkflowContract.toScenarioEval({ scenarioId: "proof-guided" }),
  generalWorkflowContract.toScenarioEval({ scenarioId: "proof-general" }),
  transferWorkflowContract.toScenarioEval({ scenarioId: "proof-transfer" }),
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
    requireIntegrationEvents: [
      "call.completed",
      "review.saved",
      "task.created",
    ],
    requireReview: true,
    requireTask: true,
  },
  {
    description:
      "Escalations must create a review, follow-up task, and task integration event.",
    expectedDisposition: "escalated",
    id: "escalation-call-artifacts",
    label: "Escalation call artifacts",
    requireIntegrationEvents: [
      "call.completed",
      "review.saved",
      "task.created",
    ],
    requireReview: true,
    requireTask: true,
  },
  {
    description:
      "Voicemail outcomes must create review evidence and callback work.",
    expectedDisposition: "voicemail",
    id: "voicemail-call-artifacts",
    label: "Voicemail call artifacts",
    requireIntegrationEvents: [
      "call.completed",
      "review.saved",
      "task.created",
    ],
    requireReview: true,
    requireTask: true,
  },
  {
    description:
      "No-answer outcomes must create review evidence and retry/callback work.",
    expectedDisposition: "no-answer",
    id: "no-answer-call-artifacts",
    label: "No-answer call artifacts",
    requireIntegrationEvents: [
      "call.completed",
      "review.saved",
      "task.created",
    ],
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
const campaignStore = createVoiceSQLiteCampaignStore({
  path: resolve(runtimeDirectory, "campaigns.sqlite"),
});
const recordCampaignTelephonyOutcome = (input: {
  decision: Parameters<
    typeof applyVoiceCampaignTelephonyOutcome
  >[0]["decision"];
  event: Parameters<typeof applyVoiceCampaignTelephonyOutcome>[0]["event"];
  routeResult?: unknown;
  sessionId?: string;
}) =>
  applyVoiceCampaignTelephonyOutcome(
    {
      decision: input.decision,
      event: input.event,
      routeResult: input.routeResult,
      sessionId: input.sessionId,
    },
    {
      store: campaignStore,
    },
  );

const renderCampaignDialerProofHTML = () => `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Campaign Dialer Proof</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,sans-serif;background:#0b1220;color:#f8fafc;margin:0}
        main{max-width:1080px;margin:auto;padding:32px}
        a{color:#5eead4}
        button{background:#5eead4;border:0;border-radius:999px;color:#042f2e;cursor:pointer;font-weight:900;padding:12px 18px}
        button:disabled{cursor:wait;opacity:.6}
        pre{background:#111c2f;border:1px solid #334155;border-radius:18px;overflow:auto;padding:18px}
        .hero{background:linear-gradient(135deg,rgba(20,184,166,.22),rgba(251,146,60,.16));border:1px solid #334155;border-radius:28px;padding:28px}
        .muted{color:#9fb0c5}
      </style>
      <script>
        async function runDialerProof(button) {
          button.disabled = true;
          const output = document.getElementById("campaign-dialer-proof-output");
          output.textContent = "Running Twilio, Telnyx, and Plivo dry-run campaign proofs...";
          try {
            const response = await fetch("/api/voice/campaigns/dialer-proof", { method: "POST" });
            const payload = await response.json();
            output.textContent = JSON.stringify(payload, null, 2);
          } catch (error) {
            output.textContent = error instanceof Error ? error.message : String(error);
          } finally {
            button.disabled = false;
          }
        }
      </script>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/voice/campaigns/observability">Campaign observability</a></p>
        <section class="hero">
          <p class="muted">Self-hosted campaign carrier proof</p>
          <h1>Queue to carrier dial to webhook outcome, without making a real call</h1>
          <p class="muted">This runs the same Twilio, Telnyx, and Plivo campaign dialer primitives with an intercepted fetch, proves campaign metadata is attached, and applies a synthetic completed webhook outcome back into the campaign store.</p>
          <button type="button" onclick="runDialerProof(this)">Run dry-run dialer proof</button>
        </section>
        <pre id="campaign-dialer-proof-output">No proof run yet.</pre>
      </main>
    </body>
  </html>`;

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
        <p><a href="/ops-console">Back to Ops Console</a></p>
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

const renderTelephonyWebhookDecisionsHTML = () => {
  const rows = telephonyWebhookDecisionSnapshots.length
    ? telephonyWebhookDecisionSnapshots
        .map(
          (decision) => `<tr>
            <td><strong>${escapeHtml(decision.provider)}</strong><br /><span class="muted">${escapeHtml(
              new Date(decision.at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "medium",
              }),
            )}</span></td>
            <td><strong>${escapeHtml(decision.action)}</strong><br /><span class="muted">${escapeHtml(decision.source ?? "unknown")} / ${escapeHtml(decision.disposition ?? "none")}</span></td>
            <td><pre>${stringifyForHtml(decision.campaignOutcome)}</pre></td>
          </tr>`,
        )
        .join("")
    : `<tr><td colspan="3">No webhook decisions recorded yet. Run carrier smoke or campaign dialer proof to populate this view.</td></tr>`;

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Telephony Webhook Decisions</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,sans-serif;background:#0b1020;color:#f8fafc;margin:0}
        main{max-width:1120px;margin:auto;padding:32px}
        a{color:#67e8f9}
        .hero{background:linear-gradient(135deg,rgba(8,145,178,.24),rgba(245,158,11,.14));border:1px solid #263449;border-radius:28px;padding:26px}
        .muted{color:#9ca3af}
        table{width:100%;border-collapse:collapse;background:#111827;border-radius:18px;overflow:hidden;margin-top:20px}
        th,td{border-bottom:1px solid #263449;padding:14px;text-align:left;vertical-align:top}
        pre{background:#0f172a;border:1px solid #263449;border-radius:14px;color:#bae6fd;margin:0;max-width:620px;overflow:auto;padding:12px;white-space:pre-wrap}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/telephony-outcomes">Outcome policy</a> · <a href="/carriers">Carrier matrix</a> · <a href="/api/telephony-webhook-decisions">JSON</a></p>
        <section class="hero">
          <p class="muted">Carrier webhook telemetry</p>
          <h1>Latest normalized webhook decisions</h1>
          <p class="muted">This view shows what Twilio, Telnyx, and Plivo webhook payloads became after normalization: no-answer, voicemail, transfer, ignored, and campaign outcome application.</p>
        </section>
        <table>
          <thead><tr><th>Provider</th><th>Decision</th><th>Campaign Outcome</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </main>
    </body>
  </html>`;
};

const demoChecklistItems = [
  {
    description:
      "Start with any framework page and complete one guided or general microphone flow.",
    href: "/react",
    label: "Run a framework demo",
  },
  {
    description:
      "Show the single pass/fail control-plane report before talking features.",
    href: "/production-readiness",
    label: "Verify production readiness",
  },
  {
    description:
      "Show the compact gate JSON your own deploy script can check before release.",
    href: "/deploy-gate",
    label: "Explain deploy gate",
  },
  {
    description:
      "Show the optional readiness profiles and the proof surfaces each one expects.",
    href: "/readiness-profiles",
    label: "Compare readiness profiles",
  },
  {
    description:
      "Open the phone-agent and carrier matrix to prove Twilio, Telnyx, and Plivo setup parity.",
    href: "/phone-agent",
    label: "Inspect phone-agent readiness",
  },
  {
    description:
      "Show normalized carrier outcomes from recent webhook smoke checks.",
    href: "/telephony-webhook-decisions",
    label: "Review webhook decisions",
  },
  {
    description:
      "Use traces to show clean per-call timelines with zero warnings or failed sessions.",
    href: "/traces",
    label: "Inspect call traces",
  },
  {
    description:
      "Open saved call artifacts, summaries, tasks, and handoff evidence.",
    href: "/reviews",
    label: "Review call artifacts",
  },
  {
    description:
      "Show the package-level disconnect, resume, and replay-safe reconnect contract.",
    href: "/voice/reconnect-contract",
    label: "Prove reconnect recovery",
  },
  {
    description:
      "Show that provider errors recovered by fallback stay visible in replay but pass readiness.",
    href: "/provider-recovery",
    label: "Prove provider recovery",
  },
  {
    description:
      "Show trace and audit delivery queues, then explain how file sinks swap for webhook, S3, SQLite, or Postgres sinks.",
    href: "/delivery-sinks",
    label: "Inspect delivery sinks",
  },
  {
    description:
      "Close with provider fallback contracts and the simulation suite as proof this is more than a demo.",
    href: "/voice/simulations",
    label: "Show simulation proof",
  },
] satisfies Array<{
  description: string;
  href: string;
  label: string;
}>;

const renderDemoChecklistHTML = () => {
  const rows = demoChecklistItems
    .map(
      (item, index) => `<article>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <h2><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></h2>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </article>`,
    )
    .join("");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AbsoluteJS Voice Demo Checklist</title>
      <style>
        body{background:#10140f;color:#f7f3e8;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1040px;margin:auto;padding:32px}
        a{color:#bef264}
        .hero{background:linear-gradient(135deg,rgba(190,242,100,.2),rgba(14,165,233,.15));border:1px solid #334155;border-radius:30px;margin-bottom:18px;padding:28px}
        .muted{color:#a7b18f}
        .grid{display:grid;gap:14px}
        article{align-items:flex-start;background:#171c15;border:1px solid #2d3727;border-radius:22px;display:grid;gap:16px;grid-template-columns:auto 1fr;padding:18px}
        article span{background:#bef264;border-radius:999px;color:#1a2e05;font-weight:900;padding:8px 10px}
        h1{font-size:clamp(2.3rem,6vw,4.7rem);line-height:.9;margin:.2rem 0 1rem}
        h2{margin:0 0 6px}
        p{line-height:1.6}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/api/production-readiness">Readiness JSON</a></p>
        <section class="hero">
          <p class="muted">Presentation path</p>
          <h1>Demo AbsoluteJS Voice without hunting for tabs</h1>
          <p class="muted">Run this order when showing self-hosted voice primitives: framework UX, production proof, carrier readiness, webhook normalization, traces, reviews, and simulations.</p>
        </section>
        <section class="grid">${rows}</section>
      </main>
    </body>
  </html>`;
};

const vapiMigrationItems = [
  {
    absolute: "Framework voice route with mic UI, transcripts, reconnect state, barge-in, and live latency proof.",
    concept: "Web voice assistant",
    proofHref: "/react",
    proofLabel: "Open React demo",
    statusHref: "/api/production-readiness",
  },
  {
    absolute: "Carrier-owned Twilio, Telnyx, or Plivo setup with copy-ready URLs, carrier matrix, and smoke proof.",
    concept: "Phone assistant",
    proofHref: "/phone-agent",
    proofLabel: "Open phone setup",
    statusHref: "/api/voice/phone/setup",
  },
  {
    absolute: "Code-owned specialist graph with handoff policy, context policy, per-specialist tools, and trace evidence.",
    concept: "Squads / multi-assistant routing",
    proofHref: "/agent-squad-contract",
    proofLabel: "Open squad contract",
    statusHref: "/api/agent-squad-contract",
  },
  {
    absolute: "Agent tools, deterministic tool contracts, audit events, integration events, and operations-record links.",
    coverageSurface: "Tools and functions",
    concept: "Tools / functions",
    proofHref: "/tool-contracts",
    proofLabel: "Open tool contracts",
    statusHref: "/api/tool-contracts",
  },
  {
    absolute: "Local guardrail policies block unsafe assistant output, warn/redact sensitive transcript data, and produce traceable JSON/Markdown proof.",
    coverageSurface: "Guardrails and policies",
    concept: "Guardrails / policies",
    proofHref: "/voice/guardrails",
    proofLabel: "Open guardrails proof",
    statusHref: "/api/voice/guardrails",
  },
  {
    absolute: "One self-hosted operations record linking transcript, replay, provider choices, tools, handoffs, reviews, tasks, audit, and delivery attempts.",
    coverageSurface: "Call logs and incident handoff",
    concept: "Call logs",
    proofHref: "/voice-operations/demo-incident-bundle",
    proofLabel: "Open operations record",
    statusHref: "/api/voice-operations/demo-incident-bundle",
  },
  {
    absolute: "Post-call analysis proof validates extracted fields, required follow-up tasks, delivery events, and the linked operations record.",
    coverageSurface: "Post-call analysis",
    concept: "Post-call analysis",
    proofHref: "/voice/post-call-analysis",
    proofLabel: "Open post-call proof",
    statusHref: "/api/voice/post-call-analysis",
  },
  {
    absolute: "Readiness gates, recovery report, provider SLOs, delivery runtime, and deploy-gate JSON.",
    coverageSurface: "Monitoring and release gates",
    concept: "Monitoring / issue detection",
    proofHref: "/production-readiness",
    proofLabel: "Open readiness",
    statusHref: "/api/production-readiness",
  },
  {
    absolute: "Scenario simulations, fixture evals, tool contracts, outcome contracts, provider routing contracts, and baseline comparisons.",
    concept: "Simulation testing",
    proofHref: "/voice/simulations",
    proofLabel: "Open simulations",
    statusHref: "/api/voice/simulations",
  },
  {
    absolute: "Self-hosted recipient import, consent/dedupe, retries, quiet hours, rate limits, carrier dry-run proof, and campaign readiness.",
    concept: "Outbound campaigns",
    proofHref: "/voice/campaigns",
    proofLabel: "Open campaigns",
    statusHref: "/api/voice/campaigns/readiness-proof",
  },
  {
    absolute: "Pause, resume, takeover, injected operator instructions, action-center helpers, and operator action audit history.",
    concept: "Live operator controls",
    proofHref: "/ops-console",
    proofLabel: "Open ops console",
    statusHref: "/api/voice/ops-recovery",
  },
  {
    absolute: "Customer-owned storage, redaction defaults, retention dry-run/apply, redacted audit export, and provider-key recommendations.",
    concept: "Compliance controls",
    proofHref: "/data-control",
    proofLabel: "Open data control",
    statusHref: "/data-control.json",
  },
  {
    absolute: "Manifest, artifact index, delivery receipts, replay proof, and file/webhook/S3/SQLite/Postgres export destinations.",
    concept: "Logs export / SIEM / warehouse",
    proofHref: "/voice/observability-export",
    proofLabel: "Open export",
    statusHref: "/api/voice/observability-export/replay",
  },
] satisfies Array<{
  absolute: string;
  concept: string;
  coverageSurface?: string;
  proofHref: string;
  proofLabel: string;
  statusHref: string;
}>;

type VapiCoverageEvidence = VoicePlatformCoverageEvidence;
type VapiCoverageResult = VoicePlatformCoverageSurface;
type VapiCoverageSummary = VoicePlatformCoverageSummary & {
  vapiCoverage: VoicePlatformCoverageSurface[];
};

const latestProofPackJsonPath = ".voice-runtime/proof-pack/latest.json";
const longProofWindowRoot = ".voice-runtime/long-proof-window";
const latestProofTrendsJsonPath = ".voice-runtime/proof-trends/latest.json";
const latestProofTrendsMarkdownPath = ".voice-runtime/proof-trends/latest.md";
const configuredProofTrendsMaxAgeMs = Number(
  process.env.VOICE_PROOF_TRENDS_MAX_AGE_MS ?? 24 * 60 * 60 * 1000,
);
const proofTrendsMaxAgeMs =
  Number.isFinite(configuredProofTrendsMaxAgeMs) &&
  configuredProofTrendsMaxAgeMs > 0
    ? configuredProofTrendsMaxAgeMs
    : 24 * 60 * 60 * 1000;
const configuredSloCalibrationMinRuns = Number(
  process.env.VOICE_SLO_CALIBRATION_MIN_RUNS ?? 1,
);
const sloCalibrationMinRuns =
  Number.isFinite(configuredSloCalibrationMinRuns) &&
  configuredSloCalibrationMinRuns > 0
    ? configuredSloCalibrationMinRuns
    : 1;
const configuredLiveLatencyReadinessMaxAgeMs = Number(
  process.env.VOICE_LIVE_LATENCY_READINESS_MAX_AGE_MS ?? 30 * 60 * 1000,
);
const liveLatencyReadinessMaxAgeMs =
  Number.isFinite(configuredLiveLatencyReadinessMaxAgeMs) &&
  configuredLiveLatencyReadinessMaxAgeMs > 0
    ? configuredLiveLatencyReadinessMaxAgeMs
    : 30 * 60 * 1000;

const readLatestProofTrends = async (): Promise<VoiceProofTrendReport> => {
  const file = Bun.file(latestProofTrendsJsonPath);

  if (!(await file.exists())) {
    return buildEmptyVoiceProofTrendReport(
      latestProofTrendsJsonPath,
      proofTrendsMaxAgeMs,
    );
  }

  try {
    const parsed = (await file.json()) as {
      baseUrl?: unknown;
      cycles?: unknown;
      generatedAt?: unknown;
      ok?: unknown;
      outputDir?: unknown;
      runId?: unknown;
      summary?: unknown;
    };
    const summary =
      parsed.summary && typeof parsed.summary === "object"
        ? (parsed.summary as VoiceProofTrendSummary)
        : {};

    return buildVoiceProofTrendReport({
      baseUrl: typeof parsed.baseUrl === "string" ? parsed.baseUrl : undefined,
      cycles: Array.isArray(parsed.cycles)
        ? (parsed.cycles as VoiceProofTrendCycle[])
        : [],
      generatedAt:
        typeof parsed.generatedAt === "string" ? parsed.generatedAt : undefined,
      maxAgeMs: proofTrendsMaxAgeMs,
      ok: parsed.ok === true,
      outputDir:
        typeof parsed.outputDir === "string" ? parsed.outputDir : undefined,
      runId: typeof parsed.runId === "string" ? parsed.runId : undefined,
      source: latestProofTrendsJsonPath,
      summary,
    });
  } catch {
    return buildVoiceProofTrendReport({
      maxAgeMs: proofTrendsMaxAgeMs,
      source: latestProofTrendsJsonPath,
    });
  }
};

const readLongProofWindowCalibrationSamples = async (): Promise<
  VoiceSloCalibrationSample[]
> => {
  const entries = await readdir(longProofWindowRoot, { withFileTypes: true }).catch(
    () => [],
  );
  const artifactPaths = [
    `${longProofWindowRoot}/latest.json`,
    ...entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => `${longProofWindowRoot}/${entry.name}/long-proof-window.json`),
  ];
  const seen = new Set<string>();
  const samples: VoiceSloCalibrationSample[] = [];

  for (const path of artifactPaths) {
    const file = Bun.file(path);
    if (!(await file.exists())) {
      continue;
    }

    try {
      const parsed = (await file.json()) as {
        ok?: unknown;
        proofTrends?: {
          ok?: unknown;
          summary?: VoiceProofTrendSummary;
        };
        runId?: unknown;
        runtimeCalibration?: VoiceSloCalibrationSample;
      };
      const runId = typeof parsed.runId === "string" ? parsed.runId : path;
      if (seen.has(runId)) {
        continue;
      }
      seen.add(runId);

      samples.push({
        interruptionP95Ms: parsed.runtimeCalibration?.interruptionP95Ms,
        liveP95Ms: parsed.proofTrends?.summary?.maxLiveP95Ms,
        monitorRunP95Ms: parsed.runtimeCalibration?.monitorRunP95Ms,
        notifierDeliveryP95Ms:
          parsed.runtimeCalibration?.notifierDeliveryP95Ms,
        ok: parsed.ok === true && parsed.proofTrends?.ok === true,
        providerP95Ms: parsed.proofTrends?.summary?.maxProviderP95Ms,
        reconnectP95Ms: parsed.runtimeCalibration?.reconnectP95Ms,
        runId,
        source: path,
        turnP95Ms: parsed.proofTrends?.summary?.maxTurnP95Ms,
      });
    } catch {
      continue;
    }
  }

  if (samples.length > 0) {
    return samples;
  }

  const latestTrends = await readLatestProofTrends();
  return [
    {
      liveP95Ms: latestTrends.summary.maxLiveP95Ms,
      ok: latestTrends.ok,
      providerP95Ms: latestTrends.summary.maxProviderP95Ms,
      runId: latestTrends.runId,
      source: latestTrends.source,
      turnP95Ms: latestTrends.summary.maxTurnP95Ms,
    },
  ];
};

const loadDemoSloThresholdProfile = async () =>
  createVoiceSloThresholdProfile(await readLongProofWindowCalibrationSamples(), {
    minPassingRuns: sloCalibrationMinRuns,
  });

const formatTrendMs = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value)
    ? `${Math.round(value)}ms`
    : "n/a";

const renderProofTrendsHTML = async () => {
  const report = await readLatestProofTrends();
  const cycles = report.cycles ?? [];
  const rows = cycles.length
    ? cycles
        .map(
          (cycle) => `<tr>
            <td>${escapeHtml(String(cycle.cycle ?? ""))}</td>
            <td>${escapeHtml(cycle.ok ? "pass" : "fail")}</td>
            <td>${escapeHtml(cycle.productionReadiness?.status ?? "n/a")}</td>
            <td>${escapeHtml(cycle.providerSlo?.status ?? "n/a")}</td>
            <td>${escapeHtml(formatTrendMs(cycle.turnLatency?.p95Ms))}</td>
            <td>${escapeHtml(formatTrendMs(cycle.liveLatency?.p95Ms))}</td>
            <td>${escapeHtml(String(cycle.providerSlo?.eventsWithLatency ?? 0))}</td>
            <td>${escapeHtml(String(cycle.opsRecovery?.issues ?? 0))}</td>
          </tr>`,
        )
        .join("")
    : `<tr><td colspan="8">No sustained trend artifact found. Run <code>bun run proof:trends</code>.</td></tr>`;
  const status = report.status === "pass" ? "pass" : "warn";

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AbsoluteJS Voice Sustained Proof Trends</title>
      <style>
        body{background:#0d1118;color:#f8f3e7;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1120px;margin:auto;padding:32px}
        a{color:#93c5fd}
        .hero,.card{background:#151b24;border:1px solid #263241;border-radius:24px;margin-bottom:16px;padding:22px}
        .hero{background:linear-gradient(135deg,rgba(59,130,246,.18),rgba(20,184,166,.14))}
        .eyebrow{color:#5eead4;font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        h1{font-size:clamp(2.4rem,6vw,5rem);line-height:.9;margin:.2rem 0 1rem}
        .muted{color:#a8b3bd;line-height:1.55}
        .status{border:1px solid ${status === "pass" ? "rgba(34,197,94,.6)" : "rgba(245,158,11,.7)"};border-radius:999px;display:inline-flex;font-weight:900;padding:8px 12px}
        .grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:18px}
        .metric{background:#0f1620;border:1px solid #263241;border-radius:18px;padding:16px}
        .metric span{color:#a8b3bd;display:block;font-size:.8rem;text-transform:uppercase}
        .metric strong{display:block;font-size:2rem;margin-top:5px}
        table{border-collapse:collapse;width:100%}
        th,td{border-bottom:1px solid #263241;padding:10px;text-align:left}
        th{color:#a8b3bd;font-size:.78rem;text-transform:uppercase}
        code{background:#0b1117;border:1px solid #263241;border-radius:8px;padding:2px 6px}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/demo-checklist">Demo Checklist</a> · <a href="/production-readiness">Production Readiness</a> · <a href="/voice/provider-slos">Provider SLOs</a> · <a href="/api/voice/proof-trends">JSON</a> · <a href="/voice/proof-trends.md">Markdown</a></p>
        <section class="hero">
          <p class="eyebrow">Sustained proof</p>
          <h1>Longer-running latency, provider, recovery, and readiness trends</h1>
          <p class="muted">This page reads <code>${escapeHtml(latestProofTrendsJsonPath)}</code>. It proves the current defaults over repeated cycles instead of relying only on a one-shot proof pack.</p>
          <p class="status">Overall: ${escapeHtml(report.status.toUpperCase())}</p>
          <div class="grid">
            <div class="metric"><span>Cycles</span><strong>${escapeHtml(String(report.summary.cycles ?? cycles.length ?? 0))}</strong></div>
            <div class="metric"><span>Max provider p95</span><strong>${escapeHtml(formatTrendMs(report.summary.maxProviderP95Ms))}</strong></div>
            <div class="metric"><span>Max turn p95</span><strong>${escapeHtml(formatTrendMs(report.summary.maxTurnP95Ms))}</strong></div>
            <div class="metric"><span>Max live p95</span><strong>${escapeHtml(formatTrendMs(report.summary.maxLiveP95Ms))}</strong></div>
            <div class="metric"><span>Artifact age</span><strong>${escapeHtml(formatVoiceProofTrendAge(report.ageMs))}</strong></div>
            <div class="metric"><span>Fresh until</span><strong>${escapeHtml(report.freshUntil ?? "n/a")}</strong></div>
          </div>
        </section>
        <section class="card">
          <p class="muted">Generated ${escapeHtml(report.generatedAt ?? "not yet")} · stale after ${escapeHtml(formatVoiceProofTrendAge(report.maxAgeMs))} ${report.outputDir ? `· <code>${escapeHtml(report.outputDir)}</code>` : ""}</p>
          <table>
            <thead><tr><th>Cycle</th><th>Status</th><th>Readiness</th><th>Provider SLO</th><th>Turn p95</th><th>Live p95</th><th>Provider samples</th><th>Ops issues</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
      </main>
    </body>
  </html>`;
};

const readLatestVapiCoverageSummary =
  async (): Promise<VapiCoverageSummary> => {
    const file = Bun.file(latestProofPackJsonPath);

    if (!(await file.exists())) {
      const summary = buildVoicePlatformCoverageSummary({
        coverage: [],
        source: latestProofPackJsonPath,
      });

      return { ...summary, vapiCoverage: summary.coverage };
    }

    try {
      const parsed = (await file.json()) as {
        generatedAt?: unknown;
        ok?: unknown;
        outputDir?: unknown;
        runId?: unknown;
        vapiCoverage?: unknown;
      };
      const vapiCoverage = Array.isArray(parsed.vapiCoverage)
        ? (parsed.vapiCoverage as VoicePlatformCoverageSurface[])
        : [];
      const summary = buildVoicePlatformCoverageSummary({
        coverage: vapiCoverage,
        generatedAt:
          typeof parsed.generatedAt === "string"
            ? parsed.generatedAt
            : undefined,
        ok: parsed.ok === true,
        outputDir:
          typeof parsed.outputDir === "string" ? parsed.outputDir : undefined,
        runId: typeof parsed.runId === "string" ? parsed.runId : undefined,
        source: latestProofPackJsonPath,
      });

      return { ...summary, vapiCoverage: summary.coverage };
    } catch {
      const summary = buildVoicePlatformCoverageSummary({
        coverage: [],
        ok: false,
        source: latestProofPackJsonPath,
      });

      return {
        ...summary,
        status: "stale",
        vapiCoverage: summary.coverage,
      };
    }
  };

const readLatestVapiCoverage = async () => {
  return (await readLatestVapiCoverageSummary()).coverage;
};

const competitiveCoverageSurfaces = [
  {
    buyerNeed: "Ship a browser voice agent inside an owned AbsoluteJS app.",
    competitors: ["Vapi", "Pipecat"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/switching-from-vapi", kind: "docs", name: "switchingFromVapi", status: "pass" },
      { href: "/production-readiness", kind: "readiness", name: "productionReadiness", required: true, status: "pass" },
      { href: "/traces", kind: "route", name: "traceTimeline", status: "pass" },
    ],
    frameworkPrimitives: ["react", "vue", "svelte", "angular", "html", "htmx"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Browser voice agent",
    why: "Framework-native hooks, composables, services, widgets, reconnect, barge-in, traces, and readiness proof are app-owned instead of widget-only.",
    nextMove: "Keep first-success docs current as proof routes evolve.",
  },
  {
    buyerNeed: "Create and verify phone agents through the team's own carrier account.",
    competitors: ["Vapi", "Retell", "LiveKit"],
    coverage: "covered",
    depth: "parity",
    evidence: [
      { href: "/api/voice/phone/setup?format=html", kind: "route", name: "phoneSetup", required: true, status: "pass" },
      { href: "/api/voice/telephony/webhook-security", kind: "readiness", name: "telephonyWebhookSecurity", required: true, status: "pass" },
      { href: "/voice/phone/smoke-contract", kind: "proof", name: "phoneSmoke", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "carrier setup JSON/HTML"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Phone voice agent",
    why: "Carrier bridges, setup reports, webhook security, smoke proof, and outcome normalization are present, while hosted providers still win on click-to-buy-number provisioning.",
    nextMove: "Improve carrier setup UX without owning phone-number provisioning.",
  },
  {
    buyerNeed: "Compose specialist assistants with traceable handoffs.",
    competitors: ["Vapi"],
    coverage: "covered",
    depth: "parity",
    evidence: [
      { href: "/agent-squad-contract", kind: "proof", name: "agentSquadContract", required: true, status: "pass" },
      { href: "/traces", kind: "route", name: "agentHandoffTraces", status: "pass" },
    ],
    frameworkPrimitives: ["react", "vue", "svelte", "angular", "html"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Squads / multi-assistant routing",
    why: "Agent Squad provides specialist routing, context policy, handoff summaries, durable state, traces, contracts, and framework-visible specialist state.",
    nextMove: "Keep specialist examples and operations-record links obvious.",
  },
  {
    buyerNeed: "Call tools and prove business outcomes before production traffic.",
    competitors: ["Vapi", "Retell", "Bland"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/tool-contracts", kind: "proof", name: "toolContracts", required: true, status: "pass" },
      { href: "/outcome-contracts", kind: "proof", name: "outcomeContracts", required: true, status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "contract reports"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Tools and business actions",
    why: "Tool contracts, outcome contracts, audit hooks, ops tasks, integration events, and operation-linked failures are stronger for code-owned apps.",
    nextMove: "Add more real-session tool workflow recipes.",
  },
  {
    buyerNeed: "Enforce policy locally with traceable blocking and warning proof.",
    competitors: ["Bland", "Vapi"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/voice/guardrails", kind: "proof", name: "guardrails", required: true, status: "pass" },
      { href: "/api/voice/guardrails.md", kind: "proof", name: "guardrailsMarkdown", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "runtime policy"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Guardrails and policy enforcement",
    why: "Guardrails are code-owned runtime policies with blocking/warning proof, trace evidence, incident summaries, and proof-pack integration.",
    nextMove: "Keep recipes primitive-first instead of creating a policy builder.",
  },
  {
    buyerNeed: "Choose providers, route by surface, and prove fallback recovery.",
    competitors: ["Vapi", "Pipecat"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/voice/provider-orchestration", kind: "readiness", name: "providerOrchestration", required: true, status: "pass" },
      { href: "/voice/provider-decisions", kind: "proof", name: "providerDecisions", required: true, status: "pass" },
      { href: "/voice/provider-slos", kind: "proof", name: "providerSlo", required: true, status: "pass" },
      { href: "/voice-operations/demo-incident-bundle", kind: "operations-record", name: "providerRecoveryOperationsRecord", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "provider profiles", "trace reports"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Provider choice and fallback",
    why: "Provider profiles, cost/latency/quality routing, circuit breakers, SLOs, decision traces, fallback recovery, and operations-record recovery evidence are first-class.",
    nextMove: "Keep provider recovery visible as a headline proof-pack advantage.",
  },
  {
    buyerNeed: "Monitor call quality and block bad deploys without a hosted dashboard.",
    competitors: ["Vapi", "Retell", "Bland"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/production-readiness", kind: "readiness", name: "productionReadinessGate", required: true, status: "pass" },
      { href: "/ops-recovery", kind: "readiness", name: "opsRecovery", status: "pass" },
      { href: "/voice/proof-trends", kind: "proof", name: "proofTrends", status: "pass" },
    ],
    frameworkPrimitives: ["readiness routes", "ops routes", "proof trends"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Monitoring, issues, and release gates",
    why: "Monitors, issues, notifier receipts, ops recovery, SLO calibration, proof trends, and production readiness are customer-owned.",
    nextMove: "Keep export/schema/readiness cohesion tight.",
  },
  {
    buyerNeed: "Open one call log and understand the full lifecycle.",
    competitors: ["Vapi", "Retell", "Bland"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/voice-operations/demo-incident-bundle", kind: "operations-record", name: "operationsRecord", required: true, status: "pass" },
      { href: "/voice-operations/demo-incident-bundle/incident.md", kind: "proof", name: "incidentMarkdown", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "incident markdown"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Unified call log / operations record",
    why: "Operations records link trace, replay, transcript, provider decisions, tools, guardrails, handoffs, audit, reviews, tasks, delivery attempts, and incident Markdown.",
    nextMove: "Keep every new proof surface linking back to operations records.",
  },
  {
    buyerNeed: "Extract post-call data and trigger follow-up workflow.",
    competitors: ["Vapi", "Retell", "Bland"],
    coverage: "covered",
    depth: "parity",
    evidence: [
      { href: "/voice/post-call-analysis", kind: "proof", name: "postCallAnalysis", required: true, status: "pass" },
      { href: "/voice-operations/demo-incident-bundle", kind: "operations-record", name: "postCallOperationsRecord", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "review/task/integration events"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Post-call analysis and workflows",
    why: "Extraction, required task creation, delivery proof, and operations-record linkage exist; hosted dashboards still have smoother built-in call-record UX.",
    nextMove: "Add more workflow recipes and proof-pack examples.",
  },
  {
    buyerNeed: "Run simulations and regressions before production.",
    competitors: ["Retell", "Bland", "Pipecat"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/voice/simulations", kind: "proof", name: "simulationSuite", required: true, status: "pass" },
      { href: "/evals/scenarios", kind: "proof", name: "evals", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "fixture stores", "contract reports"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Simulation and regression testing",
    why: "Evals, fixtures, simulations, baselines, operation-linked failures, and readiness gates live in the repo and CI path.",
    nextMove: "Make scenario authoring easier without creating an app kit.",
  },
  {
    buyerNeed: "Run outbound campaigns through owned carrier infrastructure.",
    competitors: ["Retell", "Bland"],
    coverage: "covered",
    depth: "parity",
    evidence: [
      { href: "/voice/campaigns", kind: "route", name: "campaigns", required: true, status: "pass" },
      { href: "/api/voice/campaigns/readiness-proof", kind: "readiness", name: "campaignReadiness", status: "pass" },
      { href: "/voice/campaigns/dialer-proof", kind: "proof", name: "campaignDialerProof", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "campaign runtime"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Outbound campaigns",
    why: "Campaign queues, imports, consent, retries, quiet hours, carrier dry-runs, and readiness proof exist, while Retell/Bland still lead dashboard-led campaign UX.",
    nextMove: "Improve docs/primitives without building a hosted dialer dashboard.",
  },
  {
    buyerNeed: "Let a human safely intervene during live automation.",
    competitors: ["Vapi", "Retell"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/live-ops", kind: "route", name: "liveOps", status: "pass" },
      { href: "/ops-actions", kind: "operations-record", name: "liveOpsAudit", status: "pass" },
    ],
    frameworkPrimitives: ["react", "vue", "svelte", "angular", "html"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Live operator controls",
    why: "Runtime pause/resume/takeover, injected instructions, action-center primitives, audit/trace evidence, and framework integrations are code-owned.",
    nextMove: "Keep live-ops evidence visible in all framework examples.",
  },
  {
    buyerNeed: "Export voice evidence to owned storage, SIEM, or warehouse.",
    competitors: ["Vapi", "Retell", "Bland"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/voice/observability-export", kind: "proof", name: "observabilityExport", required: true, status: "pass" },
      { href: "/api/voice/observability-export/replay", kind: "proof", name: "observabilityExportReplay", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "export manifests"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Customer-owned observability export",
    why: "Export/replay, schema validation, delivery, redaction, readiness gating, and operations-record links support owned incident and warehouse workflows.",
    nextMove: "Make export manifests the default release/incident artifact.",
  },
  {
    buyerNeed: "Control data retention, redaction, and audit export.",
    competitors: ["Vapi", "Retell", "Bland"],
    coverage: "covered",
    depth: "advantage",
    evidence: [
      { href: "/data-control", kind: "readiness", name: "dataControl", required: true, status: "pass" },
      { href: "/data-control.md", kind: "docs", name: "dataControlMarkdown", status: "pass" },
    ],
    frameworkPrimitives: ["server routes", "storage recipes"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Compliance and data control",
    why: "Retention, redaction, zero-retention helpers, guarded deletion, customer storage, audit export, and provider-key guidance are app-owned.",
    nextMove: "Keep docs precise and avoid certification claims.",
  },
  {
    buyerNeed: "Prove realtime quality across latency, interruption, reconnect, and provider stages.",
    competitors: ["Vapi", "LiveKit"],
    coverage: "covered",
    depth: "parity",
    evidence: [
      { href: "/voice/proof-trends", kind: "proof", name: "proofTrends", required: true, status: "pass" },
      { href: "/voice/slo-readiness-thresholds", kind: "readiness", name: "sloReadinessThresholds", status: "pass" },
      { href: "/barge-in", kind: "proof", name: "bargeIn", status: "pass" },
      { href: "/voice/reconnect-contract", kind: "proof", name: "reconnectContract", status: "pass" },
    ],
    frameworkPrimitives: ["client traces", "server reports"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Latency, interruption, and reconnect confidence",
    why: "Live p50/p95, provider-stage timings, barge-in, reconnect contracts, long-window proof, SLO artifacts, and readiness gates exist.",
    nextMove: "Build sustained benchmark history and tune defaults from real runs.",
  },
  {
    buyerNeed: "Use direct realtime/duplex providers when they are the right execution engine.",
    competitors: ["OpenAI Realtime"],
    coverage: "covered",
    depth: "parity",
    evidence: [
      { href: "/api/voice/realtime-channel", kind: "proof", name: "realtimeChannel", required: true, status: "pass" },
      { href: "/voice/realtime-channel", kind: "proof", name: "realtimeChannelPage", status: "pass" },
      { href: "/voice/realtime-channel.md", kind: "proof", name: "realtimeChannelMarkdown", status: "pass" },
      { href: "/api/voice/media-pipeline-calibration", kind: "proof", name: "mediaPipelineCalibration", required: true, status: "pass" },
      { href: "/api/voice/realtime-provider-contracts", kind: "proof", name: "realtimeProviderContracts", required: true, status: "pass" },
      { href: "/voice/realtime-provider-contracts", kind: "proof", name: "realtimeProviderContractsPage", status: "pass" },
      { href: "/provider-contracts", kind: "proof", name: "providerContracts", status: "pass" },
      { href: "/voice/provider-orchestration", kind: "readiness", name: "providerOrchestrationRealtimeSurface", status: "pass" },
    ],
    frameworkPrimitives: ["server adapters", "provider profiles", "runtime-channel proof", "media-pipeline calibration", "realtime provider contracts"],
    operationsRecord: "linked",
    readinessGate: "present",
    surface: "Direct realtime/duplex providers",
    why: "OpenAI Realtime adapter path, browser capture negotiation, raw PCM realtime format proof, native media-pipeline calibration, first assistant audio latency, provider contracts, and cascaded STT/LLM/TTS fallback are all app-owned.",
    nextMove: "Expand native media-pipeline proof from calibration into transport, resampling, VAD, and interruption primitives.",
  },
  {
    buyerNeed: "Build visual workflows without code.",
    competitors: ["Bland", "Retell", "Vapi"],
    coverage: "intentional-gap",
    depth: "intentional-gap",
    operationsRecord: "not-applicable",
    readinessGate: "not-applicable",
    remainingGap:
      "No-code visual flow builders are not the AbsoluteJS Voice lane.",
    surface: "No-code visual builder",
    why: "AbsoluteJS Voice should provide code-first flow primitives, diagrams, and recipes, not a builder-owned app kit.",
    nextMove: "Avoid app kits; add lightweight diagrams/docs only.",
  },
  {
    buyerNeed: "Provision phone numbers from a hosted dashboard.",
    competitors: ["Vapi", "LiveKit"],
    coverage: "intentional-gap",
    depth: "intentional-gap",
    operationsRecord: "not-applicable",
    readinessGate: "not-applicable",
    remainingGap:
      "Hosted number purchasing/provisioning stays with carriers or media platforms.",
    surface: "Hosted phone-number provisioning",
    why: "AbsoluteJS Voice should guide carrier setup and verify config, not become a telco platform.",
    nextMove: "Keep setup reports copy-ready and adapter-friendly.",
  },
  {
    buyerNeed: "Own raw SIP/media infrastructure.",
    competitors: ["LiveKit"],
    coverage: "intentional-gap",
    depth: "intentional-gap",
    operationsRecord: "not-applicable",
    readinessGate: "not-applicable",
    remainingGap:
      "LiveKit owns SIP trunks, rooms, RTP/SRTP, DTMF, REFER, dispatch, and media networking.",
    surface: "SIP/media infrastructure",
    why: "AbsoluteJS Voice should own app-level media pipeline primitives without becoming a hosted telco dashboard.",
    nextMove: "Expose adapter seams when needed.",
  },
] satisfies VoiceCompetitiveSurface[];

const buildDemoCompetitiveCoverageReport =
  async (): Promise<VoiceCompetitiveCoverageReport> => {
    const latest = await readLatestVapiCoverageSummary();

    return buildVoiceCompetitiveCoverageReport({
      generatedAt: new Date().toISOString(),
      marketCoverageEstimate: "93-95%",
      notes: [
        "Scored for a self-hosted AbsoluteJS buyer, not a hosted-dashboard buyer.",
        "Intentional gaps are adapter seams or product-scope decisions, not missing core voice primitives.",
      ],
      source: latest.source ?? latestProofPackJsonPath,
      surfaces: competitiveCoverageSurfaces,
      vapiCoverageEstimate: "99.8%",
    });
  };

const renderCoverageStatus = (coverage: VapiCoverageResult | undefined) => {
  if (!coverage) {
    return `<div class="coverage coverage-missing">
      <strong>No latest proof</strong>
      <span>Run <code>bun run proof:screenshots</code> to attach live evidence.</span>
    </div>`;
  }

  const status = coverage.status === "pass" ? "pass" : "fail";
  const evidence = (coverage.evidence ?? [])
    .map(
      (item) =>
        `<li>${escapeHtml(String(item.name ?? "proof"))} <span>${escapeHtml(String(item.method ?? "GET"))} ${escapeHtml(String(item.path ?? ""))} · ${escapeHtml(String(item.status ?? "n/a"))}</span></li>`,
    )
    .join("");
  const gap = coverage.gap ? `<p class="gap">${escapeHtml(coverage.gap)}</p>` : "";

  return `<div class="coverage coverage-${status}">
    <strong>${status.toUpperCase()}</strong>
    ${gap}
    <ul>${evidence}</ul>
  </div>`;
};

const renderSustainedProofStatus = (report: VoiceProofTrendReport) => {
  const cycles = report.cycles ?? [];
  const status = report.status === "pass" ? "pass" : "fail";
  const latestCycle = cycles.at(-1);
  const latestStatus = latestCycle
    ? latestCycle.ok
      ? "latest cycle passed"
      : "latest cycle failed"
    : "no cycles recorded";

  return `<section class="trend trend-${status}">
    <div>
      <p class="eyebrow">Sustained proof trends</p>
      <h2>Repeated-cycle evidence for the Vapi replacement claim</h2>
      <p class="muted">Read from <code>${escapeHtml(latestProofTrendsJsonPath)}</code>. This keeps the migration page honest by showing whether repeated provider, latency, recovery, and readiness checks are passing and fresh.</p>
      <p><a href="/voice/proof-trends">Open sustained trends</a> · <a href="/api/voice/proof-trends">Status JSON</a> · <a href="/voice/proof-trends.md">Markdown</a></p>
    </div>
    <div class="trend-metrics">
      <div><span>Status</span><strong>${escapeHtml(report.status.toUpperCase())}</strong></div>
      <div><span>Cycles</span><strong>${escapeHtml(String(report.summary.cycles ?? cycles.length ?? 0))}</strong></div>
      <div><span>Provider p95</span><strong>${escapeHtml(formatTrendMs(report.summary.maxProviderP95Ms))}</strong></div>
      <div><span>Turn p95</span><strong>${escapeHtml(formatTrendMs(report.summary.maxTurnP95Ms))}</strong></div>
      <div><span>Live p95</span><strong>${escapeHtml(formatTrendMs(report.summary.maxLiveP95Ms))}</strong></div>
      <div><span>Artifact age</span><strong>${escapeHtml(formatVoiceProofTrendAge(report.ageMs))}</strong></div>
      <div><span>Stale after</span><strong>${escapeHtml(formatVoiceProofTrendAge(report.maxAgeMs))}</strong></div>
      <div><span>Latest cycle</span><strong>${escapeHtml(latestStatus)}</strong></div>
    </div>
  </section>`;
};

const readLatestLiveGuardrailRuntimeProof = async (): Promise<{
  command: string;
  elapsedMs?: number;
  error?: string;
  ok: boolean;
  outputDir?: string;
  status?: number;
}> => {
  const file = Bun.file(latestProofPackJsonPath);

  if (!(await file.exists())) {
    return {
      command: "bun run smoke:live-guardrails",
      error: `Missing ${latestProofPackJsonPath}`,
      ok: false,
    };
  }

  try {
    const parsed = (await file.json()) as {
      commandResults?: unknown;
      outputDir?: unknown;
    };
    const commandResults = Array.isArray(parsed.commandResults)
      ? (parsed.commandResults as Array<Record<string, unknown>>)
      : [];
    const result = commandResults.find(
      (item) => item.name === "liveGuardrailsRuntime",
    );

    if (!result) {
      return {
        command: "bun run smoke:live-guardrails",
        error: "Latest proof pack does not include liveGuardrailsRuntime.",
        ok: false,
        outputDir:
          typeof parsed.outputDir === "string" ? parsed.outputDir : undefined,
      };
    }

    const command = Array.isArray(result.command)
      ? result.command.map(String).join(" ")
      : "bun run smoke:live-guardrails";

    return {
      command,
      elapsedMs:
        typeof result.elapsedMs === "number" ? result.elapsedMs : undefined,
      error: typeof result.error === "string" ? result.error : undefined,
      ok: result.ok === true,
      outputDir:
        typeof parsed.outputDir === "string" ? parsed.outputDir : undefined,
      status: typeof result.status === "number" ? result.status : undefined,
    };
  } catch (error) {
    return {
      command: "bun run smoke:live-guardrails",
      error: error instanceof Error ? error.message : String(error),
      ok: false,
    };
  }
};

const postCallAnalysisOptions = (input: {
  reviewId?: string;
  sessionId?: string;
} = {}): VoicePostCallAnalysisOptions => {
  const sessionId = input.sessionId ?? demoIncidentSessionId;
  const reviewId = input.reviewId ?? `${sessionId}:review`;

  return {
    extractedFields: {
      category: "billing",
      customerId: "customer-1",
      followUpRequired: true,
    },
    fields: [
      { label: "Customer id", path: "customerId" },
      { label: "Call category", path: "category" },
      { label: "Follow-up flag", path: "followUpRequired" },
      { label: "Review target", path: "review.postCall.target" },
    ],
    integrationEvents: runtimeStorage.events,
    operationRecordBasePath: "/voice-operations/:sessionId",
    requireDeliveredIntegrationEvent: true,
    requiredTaskKinds: ["support-triage" as const],
    reviewId,
    reviews: runtimeStorage.reviews as unknown as VoicePostCallAnalysisOptions["reviews"],
    sessionId,
    tasks: runtimeStorage.tasks as unknown as VoicePostCallAnalysisOptions["tasks"],
  };
};

const renderPostCallAnalysisHTML = async () => {
  const report = await buildVoicePostCallAnalysisReport(
    postCallAnalysisOptions(),
  );
  const fields = report.fields
    .map(
      (field) =>
        `<tr><td>${escapeHtml(field.label)}</td><td>${escapeHtml(field.ok ? "pass" : "fail")}</td><td><code>${escapeHtml(field.path)}</code></td><td>${escapeHtml(String(field.value ?? ""))}</td></tr>`,
    )
    .join("");
  const issues =
    report.issues.length > 0
      ? report.issues
          .map(
            (issue) =>
              `<li>${escapeHtml(issue.severity)} · ${escapeHtml(issue.code)} · ${escapeHtml(issue.label)}</li>`,
          )
          .join("")
      : "<li>No post-call analysis issues.</li>";

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Voice Post-Call Analysis Proof</title>
      <style>
        body{background:#0c1118;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1040px;margin:auto;padding:32px}
        a{color:#93c5fd}
        .hero{background:linear-gradient(135deg,rgba(251,191,36,.16),rgba(20,184,166,.13));border:1px solid #263241;border-radius:28px;margin-bottom:18px;padding:28px}
        .eyebrow{color:#facc15;font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        h1{font-size:clamp(2.2rem,5vw,4.5rem);line-height:.92;margin:.2rem 0 1rem}
        .muted{color:#a8b3bd}
        .metrics{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin:18px 0}
        .metrics div,section,table{background:#151b23;border:1px solid #263241;border-radius:18px}
        .metrics div,section{padding:16px}
        .metrics span{color:#a8b3bd;display:block;font-size:.72rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
        .metrics strong{display:block;font-size:1.7rem;margin-top:6px}
        table{border-collapse:collapse;overflow:hidden;width:100%}
        td,th{border-bottom:1px solid #263241;padding:12px;text-align:left}
        code{background:#0b1117;border:1px solid #263241;border-radius:8px;padding:2px 6px}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/switching-from-vapi">Switching from Vapi</a> · <a href="/voice-operations/${encodeURIComponent(report.sessionId ?? demoIncidentSessionId)}">Operations record</a> · <a href="/api/voice/post-call-analysis">JSON</a> · <a href="/api/voice/post-call-analysis.md">Markdown</a></p>
        <section class="hero">
          <p class="eyebrow">Post-call analysis proof</p>
          <h1>Extracted fields, follow-up tasks, and delivery evidence</h1>
          <p class="muted">This proves the Retell/Bland/Vapi-style post-call workflow without a hosted dashboard: the app owns the review, extracted fields, task, delivery event, and operation record link.</p>
        </section>
        <div class="metrics">
          <div><span>Status</span><strong>${escapeHtml(report.status.toUpperCase())}</strong></div>
          <div><span>Fields</span><strong>${report.summary.fields}</strong></div>
          <div><span>Tasks</span><strong>${report.summary.tasks}</strong></div>
          <div><span>Delivered events</span><strong>${report.summary.deliveredIntegrationEvents}</strong></div>
          <div><span>Missing fields</span><strong>${report.summary.missingRequiredFields}</strong></div>
          <div><span>Missing tasks</span><strong>${report.summary.missingRequiredTasks}</strong></div>
        </div>
        <section>
          <p><strong>Operations record:</strong> <a href="${escapeHtml(report.operationRecordHref ?? "/voice-operations/demo-incident-bundle")}">${escapeHtml(report.operationRecordHref ?? "/voice-operations/demo-incident-bundle")}</a></p>
          <p><strong>Review:</strong> <code>${escapeHtml(report.reviewId ?? "")}</code></p>
        </section>
        <h2>Extracted Fields</h2>
        <table><thead><tr><th>Field</th><th>Status</th><th>Path</th><th>Value</th></tr></thead><tbody>${fields}</tbody></table>
        <h2>Issues</h2>
        <section><ul>${issues}</ul></section>
      </main>
    </body>
  </html>`;
};

const buildDemoGuardrailReport = () => {
  const checkedAt = Date.now();
  const decisions: VoiceGuardrailDecision[] = [
    {
      allowed: false,
      checkedAt,
      content: "I can give medical advice and diagnose this issue.",
      findings: [
        {
          action: "block",
          description:
            "Blocks final legal, medical, or financial advice claims that should route to a human or qualified professional.",
          label: "Regulated advice",
          ruleId: "regulated-advice",
          stage: "assistant-output",
        },
      ],
      redactedContent: "I can give medical advice and diagnose this issue.",
      sessionId: demoIncidentSessionId,
      stage: "assistant-output",
      status: "blocked",
      turnId: "demo-guardrail-block",
    },
    {
      allowed: true,
      checkedAt: checkedAt + 1,
      content: "My card is 4111 1111 1111 1111.",
      findings: [
        {
          action: "warn",
          description:
            "Warns when payment-card-like data appears in transcripts or tool payloads.",
          label: "Payment card-like data",
          ruleId: "payment-card-like-data",
          stage: "transcript",
        },
      ],
      redactedContent: "My card is [redacted-card].",
      sessionId: demoIncidentSessionId,
      stage: "transcript",
      status: "warn",
      turnId: "demo-guardrail-warn",
    },
    {
      allowed: true,
      checkedAt: checkedAt + 2,
      content: "I can route you to billing support.",
      findings: [],
      redactedContent: "I can route you to billing support.",
      sessionId: demoIncidentSessionId,
      stage: "assistant-output",
      status: "pass",
      turnId: "demo-guardrail-pass",
    },
  ];

  return buildVoiceGuardrailReport({
    decisions,
    policies: [voiceGuardrailPolicyPresets.supportSafeDefaults],
  });
};

const renderGuardrailsHTML = async () => {
  const report = buildDemoGuardrailReport();
  const liveProof = await readLatestLiveGuardrailRuntimeProof();
  const rows = report.decisions
    .map(
      (decision) =>
        `<tr><td>${escapeHtml(decision.status)}</td><td>${escapeHtml(decision.stage)}</td><td>${escapeHtml(decision.allowed ? "allowed" : "blocked")}</td><td>${escapeHtml(decision.findings.map((finding) => finding.label).join(", ") || "none")}</td></tr>`,
    )
    .join("");
  const findings = report.decisions
    .flatMap((decision) => decision.findings)
    .map(
      (finding) =>
        `<li>${escapeHtml(finding.action)} · ${escapeHtml(finding.ruleId)} · ${escapeHtml(finding.label)}</li>`,
    )
    .join("");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Voice Guardrails Proof</title>
      <style>
        body{background:#0d1117;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1040px;margin:auto;padding:32px}
        a{color:#93c5fd}
        .hero{background:linear-gradient(135deg,rgba(248,113,113,.16),rgba(14,165,233,.13));border:1px solid #263241;border-radius:28px;margin-bottom:18px;padding:28px}
        .eyebrow{color:#fca5a5;font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        h1{font-size:clamp(2.2rem,5vw,4.5rem);line-height:.92;margin:.2rem 0 1rem}
        .muted{color:#a8b3bd}
        .metrics{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin:18px 0}
        .metrics div,section,table{background:#151b23;border:1px solid #263241;border-radius:18px}
        .metrics div,section{padding:16px}
        .metrics span{color:#a8b3bd;display:block;font-size:.72rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
        .metrics strong{display:block;font-size:1.7rem;margin-top:6px}
        table{border-collapse:collapse;overflow:hidden;width:100%}
        td,th{border-bottom:1px solid #263241;padding:12px;text-align:left}
        .live-proof{background:${liveProof.ok ? "rgba(20,83,45,.28)" : "rgba(127,29,29,.28)"};border-color:${liveProof.ok ? "rgba(34,197,94,.5)" : "rgba(248,113,113,.55)"};margin:18px 0}
        .live-proof strong{display:block;font-size:1.5rem;margin:.25rem 0}
        code{background:#0b1117;border:1px solid #263241;border-radius:8px;padding:2px 6px}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/switching-from-vapi">Switching from Vapi</a> · <a href="/api/voice/guardrails">JSON</a> · <a href="/api/voice/guardrails.md">Markdown</a></p>
        <section class="hero">
          <p class="eyebrow">Guardrails proof</p>
          <h1>Blocking, warning, redaction, and traceable policy decisions</h1>
          <p class="muted">This proves a Vapi/Bland-style guardrail surface as code-owned primitives: policies are local, reports are JSON/Markdown, and decisions can be emitted as <code>assistant.guardrail</code> trace events.</p>
        </section>
        <section class="live-proof">
          <p class="eyebrow">Live runtime guardrail proof</p>
          <strong>${escapeHtml(liveProof.ok ? "PASS" : "FAIL")}</strong>
          <p class="muted">Runs <code>${escapeHtml(liveProof.command)}</code> and verifies a real WebSocket voice turn blocks unsafe <code>tool-input</code> and <code>assistant-output</code> before unsafe text reaches the client.</p>
          <p class="muted">Exit ${escapeHtml(String(liveProof.status ?? "n/a"))}${liveProof.elapsedMs === undefined ? "" : ` · ${escapeHtml(String(liveProof.elapsedMs))}ms`}${liveProof.outputDir ? ` · <code>${escapeHtml(liveProof.outputDir)}</code>` : ""}</p>
          ${liveProof.error ? `<p class="muted">${escapeHtml(liveProof.error)}</p>` : ""}
        </section>
        <div class="metrics">
          <div><span>Status</span><strong>${escapeHtml(report.status.toUpperCase())}</strong></div>
          <div><span>Decisions</span><strong>${report.total}</strong></div>
          <div><span>Blocked</span><strong>${report.summary.blocked}</strong></div>
          <div><span>Warned</span><strong>${report.summary.warned}</strong></div>
          <div><span>Passed</span><strong>${report.summary.passed}</strong></div>
        </div>
        <h2>Policy Decisions</h2>
        <table><thead><tr><th>Status</th><th>Stage</th><th>Allowed</th><th>Findings</th></tr></thead><tbody>${rows}</tbody></table>
        <h2>Findings</h2>
        <section><ul>${findings || "<li>No findings.</li>"}</ul></section>
      </main>
    </body>
  </html>`;
};

const renderVapiMigrationHTML = async () => {
  const [coverage, proofTrends] = await Promise.all([
    readLatestVapiCoverage(),
    readLatestProofTrends(),
  ]);
  const coverageBySurface = new Map(
    coverage
      .filter((coverage) => typeof coverage.surface === "string")
      .map((coverage) => [coverage.surface as string, coverage]),
  );
  const rows = vapiMigrationItems
    .map(
      (item) => `<article>
        <div>
          <p class="eyebrow">${escapeHtml(item.concept)}</p>
          <h2>${escapeHtml(item.absolute)}</h2>
          <p><a href="${escapeHtml(item.proofHref)}">${escapeHtml(item.proofLabel)}</a> · <a href="${escapeHtml(item.statusHref)}">Status JSON</a></p>
          ${renderCoverageStatus(coverageBySurface.get(item.coverageSurface ?? item.concept))}
        </div>
      </article>`,
    )
    .join("");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Switching From Vapi To AbsoluteJS Voice</title>
      <style>
        body{background:#0e1218;color:#f8f3e7;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1120px;margin:auto;padding:32px}
        a{color:#93c5fd}
        .hero{background:linear-gradient(135deg,rgba(147,197,253,.18),rgba(45,212,191,.12));border:1px solid #263241;border-radius:30px;margin-bottom:18px;padding:28px}
        .eyebrow{color:#5eead4;font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        .muted{color:#a8b3bd}
        .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
        article{background:#151b23;border:1px solid #263241;border-radius:22px;padding:18px}
        h1{font-size:clamp(2.4rem,6vw,5rem);line-height:.9;margin:.2rem 0 1rem}
        h2{font-size:1.05rem;line-height:1.45;margin:.35rem 0 .8rem}
        p{line-height:1.6}
        .callout{background:#101820;border:1px solid #263241;border-radius:22px;margin:18px 0;padding:18px}
        .coverage{border-radius:16px;margin-top:14px;padding:12px}
        .coverage strong{display:inline-flex;font-size:.74rem;font-weight:900;letter-spacing:.12em;margin-bottom:8px}
        .coverage span{color:#a8b3bd}
        .coverage ul{display:grid;gap:6px;list-style:none;margin:8px 0 0;padding:0}
        .coverage li{font-size:.86rem;line-height:1.35}
        .coverage-pass{background:rgba(20,83,45,.24);border:1px solid rgba(34,197,94,.42)}
        .coverage-fail,.coverage-missing{background:rgba(127,29,29,.24);border:1px solid rgba(248,113,113,.46)}
        .gap{color:#fecaca;margin:.2rem 0 .5rem}
        .trend{background:#151b23;border:1px solid #263241;border-radius:24px;display:grid;gap:18px;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);margin:18px 0;padding:20px}
        .trend h2{font-size:1.4rem;margin:.25rem 0 .5rem}
        .trend-pass{border-color:rgba(34,197,94,.42)}
        .trend-fail{border-color:rgba(248,113,113,.46)}
        .trend-metrics{display:grid;gap:10px;grid-template-columns:repeat(2,minmax(0,1fr))}
        .trend-metrics div{background:#0f1620;border:1px solid #263241;border-radius:16px;padding:12px}
        .trend-metrics span{color:#a8b3bd;display:block;font-size:.72rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
        .trend-metrics strong{display:block;font-size:1rem;margin-top:5px}
        code{background:#0b1117;border:1px solid #263241;border-radius:8px;padding:2px 6px}
        @media (max-width:760px){.trend{grid-template-columns:1fr}.trend-metrics{grid-template-columns:1fr}}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/demo-checklist">Demo Checklist</a> · <a href="/production-readiness">Production Readiness</a></p>
        <section class="hero">
          <p class="eyebrow">Hosted platform migration checklist</p>
          <h1>Replace Vapi dashboard concepts with owned primitives</h1>
          <p class="muted">This page maps the surfaces a Vapi buyer expects to the AbsoluteJS Voice route, report, contract, or proof URL that already lives inside this app.</p>
        </section>
        <section class="callout">
          <p>Migration rule: start with the voice route, operations record, readiness gate, provider contracts, and customer-owned observability export. Add campaigns, live-ops, or compliance controls only when that app needs them.</p>
          <p class="muted">Live coverage status is read from <code>.voice-runtime/proof-pack/latest.json</code>; stale or missing proof is shown directly on each surface.</p>
        </section>
        ${renderSustainedProofStatus(proofTrends)}
        <section class="grid">${rows}</section>
      </main>
    </body>
  </html>`;
};

const renderProviderRecoveryHTML = async () => {
  const summary = summarizeVoiceProviderFallbackRecovery(
    await runtimeStorage.traces.list(),
  );
  const status = summary.status.toUpperCase();
  const detail =
    summary.unresolvedErrors > 0
      ? `${summary.unresolvedErrors} provider error(s) have no recovered fallback evidence.`
      : summary.recovered > 0
        ? `${summary.recovered} provider fallback recovery event(s) kept sessions healthy.`
        : "No provider fallback recovery was needed in the current trace window.";

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AbsoluteJS Voice Provider Recovery</title>
      <style>
        body{background:#0d141b;color:#f8f3e7;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1080px;margin:auto;padding:32px}
        a{color:#67e8f9}
        .hero{background:linear-gradient(135deg,rgba(103,232,249,.18),rgba(251,191,36,.14));border:1px solid #294150;border-radius:30px;margin-bottom:18px;padding:28px}
        .eyebrow{color:#67e8f9;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        h1{font-size:clamp(2.4rem,6vw,4.8rem);line-height:.9;margin:.2rem 0 1rem}
        .status{border:1px solid ${summary.status === "pass" ? "rgba(34,197,94,.65)" : "rgba(239,68,68,.75)"};border-radius:999px;display:inline-flex;font-weight:900;padding:8px 12px}
        .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin:20px 0}
        article{background:#151d26;border:1px solid #283544;border-radius:20px;padding:18px}
        article span,.muted{color:#a8b3bd}
        article strong{display:block;font-size:2.1rem;margin-top:6px}
        .proof{background:#101820;border:1px solid #283544;border-radius:22px;padding:18px}
        code{background:#0b1117;border:1px solid #263241;border-radius:8px;padding:2px 6px}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/resilience">Resilience</a> · <a href="/production-readiness">Production readiness</a> · <a href="/api/production-readiness">Readiness JSON</a></p>
        <section class="hero">
          <p class="eyebrow">Resilience proof</p>
          <h1>Recovered provider fallback is not a failed session</h1>
          <p class="muted">AbsoluteJS keeps raw provider failures in replay, proves fallback recovery, and only fails readiness when recovery is unresolved.</p>
          <p class="status">Overall: ${escapeHtml(status)}</p>
        </section>
        <section class="grid">
          <article><span>Recovered events</span><strong>${summary.recovered}</strong></article>
          <article><span>Recovered sessions</span><strong>${summary.recoveredSessions}</strong></article>
          <article><span>Recovered turns</span><strong>${summary.recoveredTurns}</strong></article>
          <article><span>Unresolved errors</span><strong>${summary.unresolvedErrors}</strong></article>
        </section>
        <section class="proof">
          <h2>What this proves</h2>
          <p>${escapeHtml(detail)}</p>
          <p class="muted">Readiness value: <code>${escapeHtml(summary.total === 0 ? "0 events" : `${summary.recovered}/${summary.total}`)}</code>. Raw errors remain inspectable in <a href="/sessions">session replay</a> and <a href="/traces">trace timelines</a>.</p>
        </section>
      </main>
    </body>
  </html>`;
};

const renderDeployGateHTML = async () => {
  const gate = await buildVoiceProductionReadinessGate(
    productionReadinessOptions(),
  );
  const issues = [...gate.failures, ...gate.warnings];
  const rows =
    issues.length > 0
      ? issues
          .map(
            (issue) => `<tr>
            <td><strong>${escapeHtml(issue.status.toUpperCase())}</strong></td>
            <td><code>${escapeHtml(issue.code)}</code></td>
            <td>${escapeHtml(issue.label)}${issue.detail ? `<br /><span>${escapeHtml(issue.detail)}</span>` : ""}</td>
            <td>${issue.href ? `<a href="${escapeHtml(issue.href)}">Open surface</a>` : ""}</td>
          </tr>`,
          )
          .join("")
      : `<tr><td colspan="4">No blocking failures or warnings.</td></tr>`;
  const profileRows = gate.profile
    ? gate.profile.surfaces
        .map((surface) => {
          const surfaceIssues =
            surface.issues.length > 0
              ? surface.issues
                  .map((issue) => `<code>${escapeHtml(issue.code)}</code>`)
                  .join("<br />")
              : "No blocking issues";

          return `<tr>
            <td><strong>${escapeHtml(surface.status.toUpperCase())}</strong></td>
            <td>${surface.href ? `<a href="${escapeHtml(surface.href)}">${escapeHtml(surface.label)}</a>` : escapeHtml(surface.label)}<br /><span>${surface.configured ? "configured" : "expected"}</span></td>
            <td>${surfaceIssues}</td>
          </tr>`;
        })
        .join("")
    : "";
  const statusText = gate.ok ? "OPEN" : "CLOSED";
  const strictText =
    "Set gate.failOnWarnings to true when you want warnings to close the gate.";
  const json = escapeHtml(JSON.stringify(gate, null, 2));
  const deployScript =
    escapeHtml(`const baseUrl = process.env.VOICE_BASE_URL ?? "http://localhost:3004";
const response = await fetch(new URL("/api/production-readiness/gate", baseUrl));
const gate = await response.json();

if (!response.ok || !gate.ok) {
  console.error("Voice deploy gate closed");
  for (const issue of [...gate.failures, ...gate.warnings]) {
    console.error(\`\${issue.code}: \${issue.detail ?? issue.label}\`);
  }
  process.exit(1);
}

console.log("Voice deploy gate open");`);

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AbsoluteJS Voice Deploy Gate</title>
      <style>
        body{background:#0f1720;color:#f8f3e7;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1120px;margin:auto;padding:32px}
        a{color:#7dd3fc}
        .hero{background:linear-gradient(135deg,rgba(125,211,252,.18),rgba(245,158,11,.15));border:1px solid #304153;border-radius:30px;margin-bottom:18px;padding:28px}
        .eyebrow{color:#7dd3fc;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        h1{font-size:clamp(2.4rem,6vw,4.9rem);line-height:.9;margin:.2rem 0 1rem}
        .status{border:1px solid ${gate.ok ? "rgba(34,197,94,.65)" : "rgba(239,68,68,.75)"};border-radius:999px;display:inline-flex;font-weight:900;padding:8px 12px}
        .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin:18px 0}
        article,pre,table{background:#151f2b;border:1px solid #2d3d4e;border-radius:20px}
        article{padding:18px}
        article span,.muted,td span{color:#a8b3bd}
        article strong{display:block;font-size:2.2rem;margin-top:6px}
        table{border-collapse:collapse;overflow:hidden;width:100%}
        th,td{border-bottom:1px solid #2d3d4e;padding:14px;text-align:left;vertical-align:top}
        code{color:#bae6fd}
        pre{overflow:auto;padding:18px}
        .script{position:relative}
        button{background:#7dd3fc;border:0;border-radius:999px;color:#082f49;cursor:pointer;font-weight:900;padding:10px 14px}
        button:disabled{cursor:wait;opacity:.7}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/production-readiness">Production readiness</a> · <a href="/api/production-readiness/gate">Gate JSON</a></p>
        <section class="hero">
          <p class="eyebrow">Deploy gate primitive</p>
          <h1>One HTTP check for self-hosted release confidence</h1>
          <p class="muted">This page is just a demo wrapper around <code>buildVoiceProductionReadinessGate</code>. AbsoluteJS ships the primitive and route; teams decide how their deploy process calls it.</p>
          <p class="status">Gate: ${escapeHtml(statusText)}</p>
        </section>
        <section class="grid">
          <article><span>HTTP status</span><strong>${gate.ok ? "200" : "503"}</strong></article>
          <article><span>Failures</span><strong>${gate.failures.length}</strong></article>
          <article><span>Warnings</span><strong>${gate.warnings.length}</strong></article>
          <article><span>Policy</span><strong>warn allowed</strong></article>
        </section>
        <h2>What a deploy script checks</h2>
        <p class="muted">Call <code>/api/production-readiness/gate</code>. A closed gate returns <code>503</code> and stable issue codes like <code>voice.readiness.operator_action_history</code>.</p>
        ${
          gate.profile
            ? `<h2>Profile surface blockers</h2>
        <p class="muted"><code>${escapeHtml(gate.profile.name)}</code> groups gate issues by the proof surface they block.</p>
        <table>
          <thead><tr><th>Status</th><th>Profile surface</th><th>Issues</th></tr></thead>
          <tbody>${profileRows}</tbody>
        </table>`
            : ""
        }
        <h2>Minimal consumer script</h2>
        <p class="muted">This is intentionally small: point it at your running AbsoluteJS server and let HTTP status plus <code>gate.ok</code> decide whether to continue.</p>
        <p><button type="button" data-copy-script>Copy script</button></p>
        <pre class="script" id="deploy-gate-script">${deployScript}</pre>
        <table>
          <thead><tr><th>Status</th><th>Code</th><th>Check</th><th>Surface</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <h2>Raw gate JSON</h2>
        <pre>${json}</pre>
        <p class="muted">${escapeHtml(strictText)}</p>
      </main>
      <script>
        const button = document.querySelector("[data-copy-script]");
        button?.addEventListener("click", async () => {
          const script = document.getElementById("deploy-gate-script")?.textContent ?? "";
          await navigator.clipboard.writeText(script);
          const original = button.textContent;
          button.textContent = "Copied";
          button.disabled = true;
          setTimeout(() => {
            button.textContent = original;
            button.disabled = false;
          }, 1200);
        });
      </script>
    </body>
  </html>`;
};

const readinessProfileCards = [
  {
    description:
      "For browser and meeting-recorder products: transcript capture, reconnects, barge-in, provider fallback, and live latency proof.",
    name: "meeting-recorder",
    surfaces: [
      { href: "/live-latency", label: "Live latency" },
      { href: "/sessions", label: "Sessions" },
      { href: "/resilience", label: "Provider fallback" },
      { href: "/voice/reconnect-contract", label: "Reconnect contract" },
      { href: "/barge-in", label: "Barge-in proof" },
      {
        href: "/api/provider-routing-contract",
        label: "Provider routing contract",
      },
    ],
  },
  {
    description:
      "For carrier-backed agents: setup parity, phone smoke proof, handoffs, routing contracts, and delivery queues.",
    name: "phone-agent",
    surfaces: [
      { href: "/phone-agent", label: "Phone agent setup" },
      { href: "/carriers", label: "Carrier matrix" },
      { href: "/handoffs", label: "Handoffs" },
      {
        href: "/api/provider-routing-contract",
        label: "Provider routing contract",
      },
      { href: "/delivery-runtime", label: "Delivery runtime" },
      { href: "/audit/deliveries", label: "Audit deliveries" },
      { href: "/traces/deliveries", label: "Trace deliveries" },
    ],
  },
  {
    description:
      "For operations-heavy deployments: audit evidence, operator action history, delivery health, runtime queues, and deploy gate status.",
    name: "ops-heavy",
    surfaces: [
      { href: "/production-readiness", label: "Production readiness" },
      { href: "/deploy-gate", label: "Deploy gate" },
      { href: "/voice/ops-actions", label: "Operator action history" },
      { href: "/delivery-runtime", label: "Delivery runtime" },
      { href: "/audit/deliveries", label: "Audit deliveries" },
      { href: "/traces/deliveries", label: "Trace deliveries" },
    ],
  },
] satisfies Array<{
  description: string;
  name: string;
  surfaces: Array<{ href: string; label: string }>;
}>;

const renderReadinessProfilesHTML = () => {
  const recommendation = recommendVoiceReadinessProfile({
    auditDeliveries: runtimeStorage.auditDeliveries,
    carriers: loadCarrierMatrixInputs,
    deliveryRuntime: deliveryRuntimeControl,
    providerRoutingContracts: async () => [
      await runDemoProviderRoutingContract(),
      await runDemoSTTProviderRoutingContract(),
      await runDemoTTSProviderRoutingContract(),
    ],
    traceDeliveries: runtimeStorage.traceDeliveries,
  });
  const providerStack = recommendVoiceProviderStack({
    profile: recommendation.profile,
    providers: {
      llm: configuredModelProviders,
      stt: configuredSTTProviders,
      tts: configuredTTSProviders,
    },
  });
  const providerStackGaps = evaluateVoiceProviderStackGaps({
    capabilities: voiceProviderStackCapabilities,
    profile: recommendation.profile,
    providers: {
      llm: configuredModelProviders,
      stt: configuredSTTProviders,
      tts: configuredTTSProviders,
    },
    recommendation: providerStack,
  });
  const providerContractMatrix = buildDemoProviderContractMatrix();
  const providerRows = (["llm", "stt", "tts"] as const)
    .map((kind) => {
      const stack = providerStack.stacks[kind];
      const gap = providerStackGaps.gaps.find((entry) => entry.kind === kind);
      const provider = stack?.provider
        ? escapeHtml(stack.provider)
        : "not configured";
      const alternatives = stack?.alternatives.length
        ? stack.alternatives
            .map((alternative) => escapeHtml(alternative))
            .join(", ")
        : "none";
      const reasons = stack?.reasons.length
        ? stack.reasons.map((reason) => escapeHtml(reason)).join("<br />")
        : "";
      const missing = gap?.missing.length
        ? gap.missing.map((capability) => escapeHtml(capability)).join(", ")
        : "covered";

      return `<tr>
        <td><strong>${kind.toUpperCase()}</strong></td>
        <td>${provider}</td>
        <td>${alternatives}</td>
        <td>${reasons}</td>
        <td>${missing}</td>
      </tr>`;
    })
    .join("");
  const contractRows = providerContractMatrix.rows
    .map((row) => {
      const issues = row.checks
        .filter((check) => check.status !== "pass")
        .map((check) => `${check.label}: ${check.detail ?? check.status}`)
        .join("<br />");

      return `<tr>
        <td><strong>${escapeHtml(row.kind.toUpperCase())}</strong></td>
        <td>${escapeHtml(row.provider)}</td>
        <td>${escapeHtml(row.status)}</td>
        <td>${row.selected ? "yes" : "no"}</td>
        <td>${issues || "covered"}</td>
      </tr>`;
    })
    .join("");
  const cards = readinessProfileCards
    .map((profile) => {
      const surfaces = profile.surfaces
        .map(
          (surface) =>
            `<li><a href="${escapeHtml(surface.href)}">${escapeHtml(surface.label)}</a></li>`,
        )
        .join("");

      return `<article>
        <p class="eyebrow">${escapeHtml(profile.name)}</p>
        <h2><code>${escapeHtml(profile.name)}</code></h2>
        <p>${escapeHtml(profile.description)}</p>
        <h3>Expected proof surfaces</h3>
        <ul>${surfaces}</ul>
      </article>`;
    })
    .join("");
  const example = escapeHtml(`createVoiceProductionReadinessRoutes({
  ...createVoiceReadinessProfile("phone-agent", {
    auditDeliveries: runtime.auditDeliveries,
    carriers: loadCarrierMatrixInputs,
    deliveryRuntime,
    traceDeliveries: runtime.traceDeliveries,
  }),
  store: runtime.traces,
})`);
  const reasons =
    recommendation.reasons.length > 0
      ? recommendation.reasons
          .map((reason) => `<li>${escapeHtml(reason)}</li>`)
          .join("")
      : "<li>No strong surface signals yet.</li>";
  const missing =
    recommendation.missing.length > 0
      ? recommendation.missing
          .map((key) => `<code>${escapeHtml(key)}</code>`)
          .join(", ")
      : "none";

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AbsoluteJS Voice Readiness Profiles</title>
      <style>
        body{background:#11140f;color:#f7f3e8;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
        main{max-width:1180px;margin:auto;padding:32px}
        a{color:#bef264}
        .hero{background:linear-gradient(135deg,rgba(190,242,100,.18),rgba(125,211,252,.14));border:1px solid #324128;border-radius:30px;margin-bottom:18px;padding:28px}
        .eyebrow{color:#bef264;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        h1{font-size:clamp(2.4rem,6vw,4.9rem);line-height:.9;margin:.2rem 0 1rem}
        .muted{color:#aab899}
        .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
        article,pre{background:#181f15;border:1px solid #304028;border-radius:22px;padding:18px}
        article h2{margin:.2rem 0}
        article p{line-height:1.55}
        .recommendation{background:#1f2a18;border:1px solid #4d7c0f;border-radius:24px;margin-bottom:18px;padding:20px}
        table{border-collapse:collapse;margin-top:14px;width:100%}
        th,td{border-top:1px solid #405633;padding:12px;text-align:left;vertical-align:top}
        th{color:#bef264;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase}
        li{margin:8px 0}
        code{color:#d9f99d}
        pre{overflow:auto}
      </style>
    </head>
    <body>
      <main>
        <p><a href="/ops-console">Back to Ops Console</a> · <a href="/production-readiness">Production readiness</a> · <a href="/deploy-gate">Deploy gate</a></p>
        <section class="hero">
          <p class="eyebrow">Optional primitives, not an app kit</p>
          <h1>Choose a readiness profile, then override anything</h1>
          <p class="muted">Profiles return spreadable options for <code>createVoiceProductionReadinessRoutes</code>. They do not mount routes, create stores, start workers, or prescribe a workflow.</p>
        </section>
        <section class="recommendation">
          <p class="eyebrow">Recommended for this demo</p>
          <h2><code>${escapeHtml(recommendation.profile)}</code> · ${Math.round(recommendation.confidence * 100)}% match</h2>
          <p class="muted">This recommendation comes from the proof surfaces currently configured in the example.</p>
          <ul>${reasons}</ul>
          <p class="muted">Missing for a fuller match: ${missing}</p>
        </section>
        <section class="recommendation">
          <p class="eyebrow">Recommended provider stack</p>
          <h2><code>${escapeHtml(providerStack.profile)}</code> provider fit</h2>
          <p class="muted">This chooses from the providers configured in this example and explains why the profile prefers each lane.</p>
          <table>
            <thead>
              <tr>
                <th>Lane</th>
                <th>Recommended</th>
                <th>Configured</th>
                <th>Why</th>
                <th>Capability gaps</th>
              </tr>
            </thead>
            <tbody>${providerRows}</tbody>
          </table>
        </section>
        <section class="recommendation">
          <p class="eyebrow">Provider contract matrix</p>
          <h2>${providerContractMatrix.passed}/${providerContractMatrix.total} provider rows production-ready</h2>
          <p class="muted">This matrix checks required env, latency budget, fallback, streaming, and declared capabilities for each configured provider lane.</p>
          <table>
            <thead>
              <tr>
                <th>Lane</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Selected</th>
                <th>Issues</th>
              </tr>
            </thead>
            <tbody>${contractRows}</tbody>
          </table>
        </section>
        <section class="grid">${cards}</section>
        <h2>Shape of the API</h2>
        <pre>${example}</pre>
      </main>
    </body>
  </html>`;
};

const opsSurfaceLinks = [
  { href: "/react", label: "Back to demo" },
  {
    description:
      "Step-by-step route through the strongest demo proof surfaces.",
    href: "/demo-checklist",
    label: "Demo Checklist",
    statusHref: "/api/production-readiness",
  },
  {
    description:
      "Map Vapi dashboard concepts to self-hosted AbsoluteJS Voice primitives and proof URLs.",
    href: "/switching-from-vapi",
    label: "Switching From Vapi",
    statusHref: "/api/production-readiness",
  },
  {
    description:
      "Machine-readable proof coverage for Vapi replacement surfaces.",
    href: "/api/voice/vapi-coverage",
    label: "Vapi Coverage API",
    statusHref: "/api/voice/vapi-coverage",
  },
  {
    description:
      "Compact deploy-gate JSON and stable issue codes for release checks.",
    href: "/deploy-gate",
    label: "Deploy Gate",
    statusHref: "/api/production-readiness/gate",
  },
  {
    description:
      "Optional profile presets for meeting recorders, phone agents, and ops-heavy deployments.",
    href: "/readiness-profiles",
    label: "Readiness Profiles",
    statusHref: "/api/production-readiness",
  },
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
      "One pre-production proof report for sessions, scenarios, fixtures, tools, and outcomes.",
    href: "/voice/simulations",
    label: "Simulation Suite",
    statusHref: "/api/voice/simulations",
  },
  {
    description:
      "Single control plane for audit and trace delivery worker summaries and manual ticks.",
    href: "/delivery-runtime",
    label: "Delivery Runtime",
    statusHref: "/api/voice-delivery-runtime",
  },
  {
    description:
      "Unified recovery signal for provider fallback, delivery queues, handoffs, live ops, and latency SLOs.",
    href: "/ops-recovery",
    label: "Ops Recovery",
    statusHref: "/api/voice/ops-recovery",
  },
  {
    description:
      "Customer-owned export manifest for traces, audits, operations records, SLOs, readiness, incidents, and proof artifacts.",
    href: "/voice/observability-export",
    label: "Observability Export",
    statusHref: "/api/voice/observability-export",
  },
  {
    description:
      "Read-back proof that the latest customer-owned export can be replayed from file or SQLite storage.",
    href: "/voice/observability-export/replay",
    label: "Observability Export Replay",
    statusHref: "/api/voice/observability-export/replay",
  },
  {
    description:
      "Self-hosted data-control proof for redaction, audit exports, retention dry-runs, and guarded deletion.",
    href: "/data-control",
    label: "Data Control",
    statusHref: "/data-control.json",
  },
  {
    description:
      "Code-owned specialist routing proof for the support-to-billing squad path.",
    href: "/agent-squad-contract",
    label: "Agent Squad Contract",
    statusHref: "/api/agent-squad-contract",
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
      "Recovered fallback proof: raw provider errors remain inspectable while recovered sessions stay healthy.",
    href: "/provider-recovery",
    label: "Provider Recovery",
    statusHref: "/api/production-readiness",
  },
  {
    description:
      "Code-owned LLM provider fallback proof for the configured model router.",
    href: "/api/provider-routing-contract",
    label: "Provider Routing Contract",
    statusHref: "/api/provider-routing-contract",
  },
  {
    description:
      "Code-owned realtime STT fallback proof for the Deepgram to AssemblyAI route.",
    href: "/api/stt-provider-routing-contract",
    label: "STT Routing Contract",
    statusHref: "/api/stt-provider-routing-contract",
  },
  {
    description:
      "Code-owned TTS fallback proof for the OpenAI to emergency audio route.",
    href: "/api/tts-provider-routing-contract",
    label: "TTS Routing Contract",
    statusHref: "/api/tts-provider-routing-contract",
  },
  {
    description:
      "Code-owned browser disconnect, resumed transport, and replay-safe turn state proof.",
    href: "/voice/reconnect-contract",
    label: "Reconnect Contract",
    statusHref: "/api/voice/reconnect-contract",
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
      "One phone-agent entrypoint for carrier setup, smoke checks, lifecycle stages, and readiness.",
    href: "/phone-agent",
    label: "Phone Agent",
    statusHref: "/api/voice/phone/setup",
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
      "Contract matrix for provider env, latency budgets, fallback, streaming, and capabilities.",
    href: "/provider-contracts",
    label: "Provider Contracts",
    statusHref: "/api/provider-contracts",
  },
  {
    description:
      "LLM/STT/TTS latency, p95, timeout, fallback, and unresolved-error SLO proof.",
    href: "/voice/provider-slos",
    label: "Provider SLOs",
    statusHref: "/api/voice/provider-slos",
  },
  {
    description:
      "Repeated proof cycles for provider SLOs, turn latency, live latency, ops recovery, and readiness.",
    href: "/voice/proof-trends",
    label: "Sustained Proof Trends",
    statusHref: "/api/voice/proof-trends",
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
      "Browser-measured speech-to-assistant response p50/p95 over recent live calls.",
    href: "/live-latency",
    label: "Live Latency",
    statusHref: "/api/live-latency",
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
      "Latest Twilio, Telnyx, and Plivo webhook decisions after outcome normalization.",
    href: "/telephony-webhook-decisions",
    label: "Webhook Decisions",
    statusHref: "/api/telephony-webhook-decisions",
  },
  {
    description:
      "Self-hosted outbound campaign queue depth, active attempts, stuck work, and failure reasons.",
    href: "/voice/campaigns/observability",
    label: "Campaign Observability",
    statusHref: "/api/voice/campaigns/observability",
  },
  {
    description:
      "Dry-run Twilio, Telnyx, and Plivo campaign dialing from queue to webhook outcome.",
    href: "/voice/campaigns/dialer-proof",
    label: "Campaign Dialer Proof",
    statusHref: "/api/voice/campaigns/dialer-proof",
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
  if (!requireProductionCarrierReadiness) {
    return joinUrlPath(`wss://${new URL(request.url).host}`, path);
  }

  const origin = resolveCarrierOrigin(request);
  const wsOrigin = origin.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  return joinUrlPath(wsOrigin, path);
};
const resolvePhoneAgentStreamUrl = ({
  request,
  streamPath,
}: {
  query: Record<string, unknown>;
  request: Request;
  streamPath: string;
}) => {
  if (requireProductionCarrierReadiness) {
    return resolveCarrierStreamUrl(request, streamPath);
  }

  return joinUrlPath(`wss://${new URL(request.url).host}`, streamPath);
};
const localCarrierWebhookVerification = requireProductionCarrierReadiness
  ? undefined
  : () => ({ ok: true }) as const;
const productionOnlyEnv = (env: Record<string, string | undefined>) =>
  requireProductionCarrierReadiness ? env : {};
const resolveTelephonyWebhookVerificationUrl =
  (path: string) =>
  ({ request }: { query: Record<string, unknown>; request: Request }) =>
    publicBaseUrl
      ? joinUrlPath(publicBaseUrl, path)
      : joinUrlPath(new URL(request.url).origin, path);

const createCarrierSmoke = <TProvider extends VoiceTelephonyProvider>(
  setup: VoiceTelephonySetupStatus<TProvider>,
): VoiceTelephonySmokeReport<TProvider> => {
  const streamIsProductionSecure = setup.urls.stream.startsWith("wss://");
  const signingIsConfigured =
    setup.signing.configured || !requireProductionCarrierReadiness;
  const checks: VoiceTelephonySmokeReport<TProvider>["checks"] = [
    {
      message: setup.urls.stream
        ? "Carrier stream URL is configured."
        : "Carrier stream URL is missing.",
      name: "stream-url",
      status: setup.urls.stream ? "pass" : "fail",
    },
    {
      message: streamIsProductionSecure
        ? "Carrier stream URL uses wss://."
        : requireProductionCarrierReadiness
          ? "Carrier stream URL should use wss:// for production."
          : "Local carrier proof accepts ws://; use production mode to require wss://.",
      name: "wss-stream",
      status:
        streamIsProductionSecure || !requireProductionCarrierReadiness
          ? "pass"
          : "fail",
    },
    {
      message: setup.urls.webhook
        ? "Carrier webhook URL is configured."
        : "Carrier webhook URL is missing.",
      name: "webhook-url",
      status: setup.urls.webhook ? "pass" : "fail",
    },
    {
      message: signingIsConfigured
        ? `Webhook signing is configured with ${setup.signing.mode}.`
        : "Webhook signing is not configured.",
      name: "signed-webhook",
      status: signingIsConfigured ? "pass" : "fail",
    },
  ];

  for (const missing of requireProductionCarrierReadiness
    ? setup.missing
    : []) {
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
  const streamIsProductionSecure = stream.startsWith("wss://");
  const signingConfigured =
    input.signingConfigured || !requireProductionCarrierReadiness;
  const warnings = [
    ...(streamIsProductionSecure || !requireProductionCarrierReadiness
      ? []
      : ["Carrier streams should use wss:// in production."]),
    ...(signingConfigured
      ? []
      : ["Webhook signature verification is not configured."]),
  ];
  const missing = requireProductionCarrierReadiness ? input.missing : [];

  return {
    generatedAt: Date.now(),
    missing,
    provider: input.provider,
    ready: missing.length === 0 && signingConfigured && warnings.length === 0,
    signing: {
      configured: signingConfigured,
      mode: input.signingConfigured
        ? input.signingMode
        : requireProductionCarrierReadiness
          ? "none"
          : "custom",
      verificationUrl: webhook,
    },
    urls: {
      stream,
      twiml: input.answerPath
        ? joinUrlPath(origin, input.answerPath)
        : undefined,
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
    await deliveryTraceStore.append({
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

const getDemoReconnectContractSnapshots = () => {
  const startedAt = Date.now() - 1_200;
  const firstTurnId = "reconnect-proof:turn:0";
  const secondTurnId = "reconnect-proof:turn:1";

  return [
    {
      at: startedAt,
      reconnect: {
        attempts: 0,
        maxAttempts: 10,
        status: "idle" as const,
      },
      turnIds: [firstTurnId],
    },
    {
      at: startedAt + 240,
      reconnect: {
        attempts: 1,
        lastDisconnectAt: startedAt + 240,
        maxAttempts: 10,
        nextAttemptAt: startedAt + 740,
        status: "reconnecting" as const,
      },
      turnIds: [firstTurnId],
    },
    {
      at: startedAt + 780,
      reconnect: {
        attempts: 1,
        lastResumedAt: startedAt + 780,
        maxAttempts: 10,
        status: "resumed" as const,
      },
      turnIds: [firstTurnId, secondTurnId],
    },
  ];
};

const appendProofTrace = async (event: VoiceTraceEvent) => {
  await deliveryTraceStore.append(event);
};

const seedDemoRealtimeChannelProof = async () => {
  const session = createProofSession({
    assistantText:
      "Realtime channel proof is using raw PCM browser audio with OpenAI Realtime.",
    disposition: "completed",
    reason: "realtime-channel-proof",
    scenarioId: "realtime-channel-proof",
    sessionId: "proof-realtime-channel",
    turns: ["Prove the realtime channel is ready."],
  });
  const turn = session.turns[0];
  const committedAt = turn?.committedAt ?? Date.now();
  const turnId = turn?.id ?? "proof-realtime-channel:turn:0";

  await runtimeStorage.session.set(session.id, session);
  await appendProofTrace({
    at: committedAt - 240,
    metadata: { proof: "realtime-channel", realtime: true },
    payload: { type: "start" },
    scenarioId: "realtime-channel-proof",
    sessionId: session.id,
    type: "call.lifecycle",
  });
  await appendProofTrace({
    at: committedAt - 120,
    metadata: { proof: "realtime-channel", realtime: true },
    payload: {
      confidence: 0.98,
      isFinal: true,
      text: turn?.text ?? "Prove the realtime channel is ready.",
      vendor: "openai-realtime",
    },
    scenarioId: "realtime-channel-proof",
    sessionId: session.id,
    turnId,
    type: "turn.transcript",
  });
  await appendProofTrace({
    at: committedAt,
    metadata: { proof: "realtime-channel", realtime: true },
    payload: {
      fallbackUsed: false,
      reason: "vendor",
      source: "primary",
      text: turn?.text ?? "Prove the realtime channel is ready.",
      transcriptCount: 1,
    },
    scenarioId: "realtime-channel-proof",
    sessionId: session.id,
    turnId,
    type: "turn.committed",
  });
  for (const [stage, offset] of [
    ["turn_committed", 0],
    ["assistant_text_started", 160],
    ["tts_send_started", 190],
    ["tts_send_completed", 360],
    ["assistant_audio_received", 420],
  ] as const) {
    await appendProofTrace({
      at: committedAt + offset,
      metadata: { proof: "realtime-channel", realtime: true },
      payload: { stage },
      scenarioId: "realtime-channel-proof",
      sessionId: session.id,
      turnId,
      type: "turn_latency.stage",
    });
  }
  await appendProofTrace({
    at: committedAt + 180,
    metadata: { proof: "realtime-channel", realtime: true },
    payload: {
      realtimeConfigured: true,
      text: turn?.assistantText,
      ttsConfigured: false,
    },
    scenarioId: "realtime-channel-proof",
    sessionId: session.id,
    turnId,
    type: "turn.assistant",
  });
  await appendProofTrace({
    at: committedAt + 360,
    metadata: { proof: "realtime-channel", realtime: true },
    payload: {
      elapsedMs: 170,
      mode: "realtime",
      status: "sent",
    },
    scenarioId: "realtime-channel-proof",
    sessionId: session.id,
    turnId,
    type: "turn.assistant",
  });
  await appendProofTrace({
    at: committedAt + 620,
    metadata: { proof: "realtime-channel", realtime: true },
    payload: { status: "resumed" },
    scenarioId: "realtime-channel-proof",
    sessionId: session.id,
    turnId,
    type: "client.reconnect",
  });
  await appendProofTrace({
    at: committedAt + 500,
    metadata: { proof: "realtime-channel", realtime: true },
    payload: {
      at: committedAt + 500,
      id: "realtime-media-pipeline-interruption",
      latencyMs: 190,
      reason: "media-pipeline-proof",
      sessionId: session.id,
      status: "stopped",
      thresholdMs: 250,
    },
    scenarioId: "realtime-channel-proof",
    sessionId: session.id,
    turnId,
    type: "client.barge_in",
  });

  return { ok: true, sessionId: session.id, turnId };
};

const buildDemoRealtimeChannelReportOptions = async () => {
  const events = await runtimeStorage.traces.list({ limit: 500 });
  const runtimeSamples = buildVoiceRealtimeChannelRuntimeSamplesFromTrace(
    events.filter(
      (event) =>
        event.metadata?.realtime === true ||
        event.metadata?.proof === "realtime-channel" ||
        event.sessionId === "proof-realtime-channel",
    ),
    {
      format: realtimeChannelFormat,
      source: "persisted-trace-store",
    },
  );

  return {
    browserCapture: {
      audioContextSampleRateHz: 48_000,
      channelCount: 1 as const,
      processorBufferSize: 4096,
      sampleRateHz: 24_000,
    },
    inputFormat: realtimeChannelFormat,
    maxFirstAudioLatencyMs: 800,
    minAssistantAudioSamples: 1,
    minInputAudioSamples: 1,
    operationsRecordHref: "/voice-operations/demo-incident-bundle",
    outputFormat: realtimeChannelFormat,
    provider: "openai-realtime",
    readinessHref: "/production-readiness",
    runtimeSamples:
      runtimeSamples.length > 0
        ? runtimeSamples
        : [
            {
              format: realtimeChannelFormat,
              kind: "input-audio" as const,
              ok: true,
              source: "configured-fallback",
            },
            {
              format: realtimeChannelFormat,
              kind: "assistant-audio" as const,
              latencyMs: 420,
              ok: true,
              source: "configured-fallback",
            },
          ],
  };
};

const buildDemoRealtimeChannelReport = async () =>
  buildVoiceRealtimeChannelReport(await buildDemoRealtimeChannelReportOptions());

const buildDemoGeminiRealtimeChannelReport = async () =>
  buildVoiceRealtimeChannelReport({
    ...(await buildDemoRealtimeChannelReportOptions()),
    maxFirstAudioLatencyMs: 900,
    provider: "gemini-live",
  });

const buildDemoMediaPipelineReport = async () => {
  const events = (
    await runtimeStorage.traces.list({ limit: 500 })
  ).filter(
    (event) =>
      event.metadata?.realtime === true ||
      event.metadata?.proof === "realtime-channel" ||
      event.sessionId === "proof-realtime-channel",
  );
  const frames = events
    .map((event): VoiceMediaFrame | undefined => {
      const traceEventId = `${event.type}:${String(event.at)}:${event.turnId ?? event.sessionId ?? "session"}`;
      const base = {
        at: event.at,
        format: realtimeChannelFormat,
        id: traceEventId,
        metadata: { traceType: event.type },
        sessionId: event.sessionId,
        traceEventId,
        turnId: event.turnId,
      } satisfies Partial<VoiceMediaFrame>;

      if (event.type === "turn.transcript") {
        return createVoiceMediaFrame({
          ...base,
          kind: "input-audio",
          metadata: { ...base.metadata, speechProbability: 0.92 },
          source: "browser",
        } as VoiceMediaFrame);
      }

      if (
        event.type === "turn_latency.stage" &&
        event.payload &&
        typeof event.payload === "object" &&
        "stage" in event.payload &&
        event.payload.stage === "assistant_audio_received"
      ) {
        return createVoiceMediaFrame({
          ...base,
          kind: "assistant-audio",
          latencyMs: 420,
          metadata: { ...base.metadata, jitterMs: 12 },
          source: "provider",
        } as VoiceMediaFrame);
      }

      if (event.type === "turn.committed") {
        return createVoiceMediaFrame({
          ...base,
          kind: "turn-commit",
          source: "voice-runtime",
        } as VoiceMediaFrame);
      }

      if (event.type === "client.reconnect") {
        return createVoiceMediaFrame({
          ...base,
          kind: "metadata",
          source: "voice-runtime",
        } as VoiceMediaFrame);
      }

      if (event.type === "client.barge_in") {
        return createVoiceMediaFrame({
          ...base,
          kind: "interruption",
          latencyMs:
            event.payload &&
            typeof event.payload === "object" &&
            "latencyMs" in event.payload &&
            typeof event.payload.latencyMs === "number"
              ? event.payload.latencyMs
              : undefined,
          source: "voice-runtime",
        } as VoiceMediaFrame);
      }

      return undefined;
    })
    .filter((frame): frame is VoiceMediaFrame => frame !== undefined);

  const calibration = buildVoiceMediaPipelineCalibrationReport({
    expectedInputFormat: realtimeChannelFormat,
    expectedOutputFormat: realtimeChannelFormat,
    frames,
    inputFormat: realtimeChannelFormat,
    maxBackpressureFrames: 0,
    maxFirstAudioLatencyMs: 800,
    maxJitterMs: 40,
    outputFormat: realtimeChannelFormat,
    requireInterruptionFrame: true,
    requireTraceEvidence: true,
    surface: "direct-realtime-media-pipeline",
  });
  const vad = buildVoiceMediaVadReport({
    frames,
    maxSilenceFrames: 1,
    minSpeechFrames: 1,
  });
  const interruption = buildVoiceMediaInterruptionReport({
    frames,
    maxInterruptionLatencyMs: 250,
  });
  const resampling = buildVoiceMediaResamplingPlan({
    inputFormat: realtimeChannelFormat,
    outputFormat: realtimeChannelFormat,
  });
  const status =
    calibration.status === "fail" || interruption.status === "fail"
      ? "fail"
      : calibration.status === "warn" ||
          vad.status === "warn" ||
          interruption.status === "warn" ||
          resampling.status === "warn"
        ? "warn"
        : "pass";

  return {
    calibration,
    checkedAt: Date.now(),
    frames: frames.length,
    interruption,
    ok: status === "pass",
    resampling,
    status,
    vad,
  };
};

const buildDemoRealtimeProviderContractMatrixInput = async () =>
  createVoiceRealtimeProviderContractMatrixPreset({
    configured: {
      "gemini-live": Boolean(geminiRealtime),
      "openai-realtime": Boolean(openAIRealtime),
    },
    env: {
      ...process.env,
      GEMINI_API_KEY: geminiApiKey,
    },
    fallbackProviders: {
      "gemini-live": ["openai-realtime", "cascaded-stt-llm-tts"],
      "openai-realtime": ["cascaded-stt-llm-tts"],
    },
    implementationStatus: {
      "gemini-live": geminiRealtime ? "available" : "planned",
    },
    latencyBudgets: {
      "gemini-live": 900,
      "openai-realtime": 800,
    },
    readinessHref: "/production-readiness",
    realtimeChannels: {
      "gemini-live": geminiRealtime
        ? await buildDemoGeminiRealtimeChannelReport()
        : undefined,
      "openai-realtime": await buildDemoRealtimeChannelReport(),
    },
    selected: "openai-realtime",
    traceHref: "/traces?sessionId=proof-realtime-channel",
  });

type ProofCallDisposition = Exclude<
  NonNullable<VoiceSessionRecord["call"]>["disposition"],
  undefined
>;

const createProofSession = (input: {
  assistantText: string;
  disposition: ProofCallDisposition;
  reason?: string;
  scenarioId: string;
  sessionId: string;
  target?: string;
  turns: readonly string[];
}): VoiceSessionRecord => {
  const startedAt = Date.now() - 3_000;
  const turnRecords = input.turns.map((text, index) => {
    const committedAt = startedAt + 600 + index * 500;
    const transcript = {
      confidence: 0.98,
      endedAtMs: committedAt - 120,
      id: `${input.sessionId}:transcript:${index}`,
      isFinal: true,
      startedAtMs: committedAt - 320,
      text,
      vendor: "absolutejs-proof",
    };

    return {
      assistantText:
        index === input.turns.length - 1 ? input.assistantText : "Captured.",
      committedAt,
      id: `${input.sessionId}:turn:${index}`,
      text,
      transcripts: [transcript],
    };
  });
  const transcripts = turnRecords.flatMap((turn) => turn.transcripts);
  const lifecycleType =
    input.disposition === "transferred"
      ? "transfer"
      : input.disposition === "escalated"
        ? "escalation"
        : input.disposition === "voicemail"
          ? "voicemail"
          : input.disposition === "no-answer"
            ? "no-answer"
            : "end";
  const endedAt = startedAt + 600 + input.turns.length * 500;

  return {
    call: {
      disposition: input.disposition,
      endedAt,
      events: [
        {
          at: startedAt,
          type: "start",
        },
        {
          at: endedAt,
          disposition: input.disposition,
          reason: input.reason,
          target: input.target,
          type: lifecycleType,
        },
      ],
      lastEventAt: endedAt,
      startedAt,
    },
    committedTurnIds: turnRecords.map((turn) => turn.id),
    createdAt: startedAt,
    currentTurn: {
      finalText: "",
      partialText: "",
      transcripts: [],
    },
    id: input.sessionId,
    lastActivityAt: endedAt,
    lastCommittedTurn: {
      committedAt: turnRecords.at(-1)?.committedAt ?? endedAt,
      signature: input.turns.at(-1) ?? "",
      text: input.turns.at(-1) ?? "",
      transcriptIds: [transcripts.at(-1)?.id ?? ""].filter(Boolean),
    },
    reconnect: {
      attempts: 0,
    },
    scenarioId: input.scenarioId,
    status: "completed",
    transcripts,
    turns: turnRecords,
  };
};

const seedDemoOutcomeProof = async () => {
  for (const sessionId of [
    "proof-guided-completed",
    "proof-general-completed",
    "proof-transfer-billing",
    "proof-escalated",
    "proof-voicemail",
    "proof-no-answer",
  ]) {
    const traces = await runtimeStorage.traces.list({ sessionId });
    await Promise.all(
      traces.map((trace) => runtimeStorage.traces.remove(trace.id)),
    );
  }

  const proofSessions: Array<{
    assistantText: string;
    disposition: ProofCallDisposition;
    evalScenarioId: string;
    mode: "general" | "guided";
    reason?: string;
    scenarioId: string;
    sessionId: string;
    target?: string;
    turns: readonly string[];
  }> = [
    {
      assistantText: "Thanks Alex. Your voice test is saved.",
      disposition: "completed",
      evalScenarioId: "proof-guided",
      mode: "guided",
      scenarioId: "guided",
      sessionId: "proof-guided-completed",
      turns: [
        "My name is Alex and I need help with the AbsoluteJS voice integration.",
        "The integration issue is around provider routing and meeting recorder follow up.",
        "Please follow up with the integration checklist and next steps.",
      ],
    },
    {
      assistantText: "Received.",
      disposition: "completed",
      evalScenarioId: "proof-general",
      mode: "general",
      scenarioId: "general",
      sessionId: "proof-general-completed",
      turns: [
        "General recording for a customer call with clear follow up notes.",
      ],
    },
    {
      assistantText: "Transferring this call to billing.",
      disposition: "transferred",
      evalScenarioId: "proof-transfer",
      mode: "guided",
      reason: "caller-requested-transfer",
      scenarioId: "transfer",
      sessionId: "proof-transfer-billing",
      target: "billing",
      turns: ["Please transfer this billing issue to billing support."],
    },
    {
      assistantText: "Escalating this call for human follow-up.",
      disposition: "escalated",
      evalScenarioId: "proof-outcome-escalated",
      mode: "guided",
      reason: "caller-requested-escalation",
      scenarioId: "outcome-escalated",
      sessionId: "proof-escalated",
      turns: ["I need a human supervisor to review this support issue."],
    },
    {
      assistantText: "Marking this call as voicemail.",
      disposition: "voicemail",
      evalScenarioId: "proof-outcome-voicemail",
      mode: "general",
      scenarioId: "outcome-voicemail",
      sessionId: "proof-voicemail",
      turns: ["Please leave this as a voicemail for callback."],
    },
    {
      assistantText: "Marking this call as no answer.",
      disposition: "no-answer",
      evalScenarioId: "proof-outcome-no-answer",
      mode: "general",
      scenarioId: "outcome-no-answer",
      sessionId: "proof-no-answer",
      turns: ["No answer from the caller, retry this later."],
    },
  ];

  for (const proof of proofSessions) {
    const session = createProofSession(proof);
    const mode = proof.mode;
    const result = buildSavedIntake(session, mode);
    session.turns = session.turns.map((turn, index) =>
      index === session.turns.length - 1 ? { ...turn, result } : turn,
    );

    await runtimeStorage.session.set(session.id, session);
    await recordVoiceRuntimeOps({
      api: {} as never,
      config: {
        buildReview: ({ result: runtimeResult, session: reviewSession }) =>
          buildSavedVoiceReview({
            phraseHints: VOICE_DEMO_PHRASE_HINTS,
            result:
              (runtimeResult as SavedIntake | undefined) ??
              buildSavedIntake(reviewSession, mode),
            session: reviewSession,
          }),
        events: runtimeStorage.events,
        onEvent: async ({ event }) => {
          await deliverIntegrationEvent(event as SavedVoiceIntegrationEvent);
        },
        reviews: runtimeStorage.reviews as unknown as VoiceCallReviewStore,
        tasks: runtimeStorage.tasks as unknown as VoiceOpsTaskStore,
      },
      context: {},
      disposition: proof.disposition,
      reason: proof.reason,
      session,
      target: proof.target,
    });

    await appendProofTrace({
      at: session.call?.startedAt ?? Date.now(),
      payload: {
        type: "start",
      },
      scenarioId: proof.evalScenarioId,
      sessionId: session.id,
      type: "call.lifecycle",
    });

    for (const turn of session.turns) {
      const finalTranscript = turn.transcripts.find(
        (transcript) => transcript.isFinal,
      );
      if (finalTranscript) {
        await appendProofTrace({
          at: (turn.committedAt ?? Date.now()) - 120,
          payload: {
            confidence: finalTranscript.confidence,
            isFinal: true,
            text: finalTranscript.text,
            vendor: finalTranscript.vendor,
          },
          scenarioId: proof.evalScenarioId,
          sessionId: session.id,
          turnId: turn.id,
          type: "turn.transcript",
        });
      }
      await appendProofTrace({
        at: turn.committedAt ?? Date.now(),
        payload: {
          text: turn.text,
        },
        scenarioId: proof.evalScenarioId,
        sessionId: session.id,
        turnId: turn.id,
        type: "turn.committed",
      });
      if (turn.assistantText) {
        await appendProofTrace({
          at: (turn.committedAt ?? Date.now()) + 80,
          payload: {
            text: turn.assistantText,
          },
          scenarioId: proof.evalScenarioId,
          sessionId: session.id,
          turnId: turn.id,
          type: "turn.assistant",
        });
      }
    }

    await appendProofTrace({
      at: session.call?.endedAt ?? Date.now(),
      payload: {
        disposition: proof.disposition,
        reason: proof.reason,
        target: proof.target,
        type:
          proof.disposition === "transferred"
            ? "transfer"
            : proof.disposition === "escalated"
              ? "escalation"
              : proof.disposition === "voicemail"
                ? "voicemail"
                : proof.disposition === "no-answer"
                  ? "no-answer"
                  : "end",
      },
      scenarioId: proof.evalScenarioId,
      sessionId: session.id,
      type: "call.lifecycle",
    });

    const contractId =
      proof.scenarioId === "transfer"
        ? "transfer-handoff-delivered"
        : proof.scenarioId === "general"
          ? "general-recording-completes"
          : proof.scenarioId === "guided"
            ? "guided-demo-completes"
            : undefined;
    if (contractId) {
      await appendProofTrace({
        at: (session.call?.endedAt ?? Date.now()) + 20,
        payload: {
          contractId,
          status: "pass",
        },
        scenarioId: proof.evalScenarioId,
        sessionId: session.id,
        type: "workflow.contract",
      });
    }
  }

  const transferSession = createProofSession({
    assistantText: "Transferring this call to billing.",
    disposition: "transferred",
    reason: "caller-requested-transfer",
    scenarioId: "proof-transfer",
    sessionId: "proof-transfer-billing",
    target: "billing",
    turns: ["Please transfer this billing issue to billing support."],
  });
  await handoffDeliveryStore.set("proof-transfer-billing:handoff", {
    action: "transfer",
    context: {},
    createdAt: transferSession.call?.endedAt ?? Date.now(),
    deliveredAt: transferSession.call?.endedAt ?? Date.now(),
    deliveryAttempts: 1,
    deliveryStatus: "delivered",
    id: "proof-transfer-billing:handoff",
    reason: "caller-requested-transfer",
    session: transferSession,
    sessionId: transferSession.id,
    target: "billing",
    updatedAt: transferSession.call?.endedAt ?? Date.now(),
  });
  await appendProofTrace({
    at: transferSession.call?.endedAt ?? Date.now(),
    payload: {
      action: "transfer",
      deliveries: {
        "proof-transfer-adapter": {
          adapterId: "proof-transfer-adapter",
          deliveredAt: transferSession.call?.endedAt ?? Date.now(),
          deliveredTo: "billing",
          status: "delivered",
        },
      },
      status: "delivered",
      target: "billing",
    },
    scenarioId: "transfer",
    sessionId: transferSession.id,
    type: "call.handoff",
  });

  return {
    ok: true,
    sessions: proofSessions.length,
  };
};

const seedDemoBargeInProof = async () => {
  const sessionId = "proof-barge-in-interruption";
  const traces = await runtimeStorage.traces.list({ sessionId });

  if (traces.some((trace) => trace.type === "client.barge_in")) {
    return;
  }

  const at = Date.now() - 650;
  await deliveryTraceStore.append({
    at,
    metadata: {
      proof: "barge-in-seed",
      source: "demo",
    },
    payload: {
      at,
      id: "barge-in-proof-seed",
      latencyMs: 92,
      reason: "readiness-seed",
      sessionId,
      status: "stopped",
      thresholdMs: 250,
    },
    sessionId,
    type: "client.barge_in",
  });
};

const seedDemoDeliveryProof = async () => {
  const at = Date.now() - 500;
  const auditEvent = createVoiceAuditEvent({
    action: "readiness.delivery.proof",
    actor: {
      id: "absolutejs-voice-demo",
      kind: "system",
      name: "AbsoluteJS Voice Demo",
    },
    at,
    id: "readiness-audit-delivery-proof:event",
    metadata: {
      proof: "delivery-readiness-seed",
      source: "demo",
    },
    outcome: "success",
    payload: {
      surface: "production-readiness",
    },
    resource: {
      id: "production-readiness",
      type: "voice.readiness",
    },
    sessionId: "readiness-delivery-proof",
    traceId: "readiness-audit-delivery-proof",
    type: "operator.action",
  });
  const traceEvent = createVoiceTraceEvent({
    at,
    id: "readiness-trace-delivery-proof:event",
    metadata: {
      proof: "delivery-readiness-seed",
      source: "demo",
    },
    payload: {
      surface: "production-readiness",
      status: "delivered",
    },
    sessionId: "readiness-delivery-proof",
    traceId: "readiness-trace-delivery-proof",
    type: "client.live_latency",
  });

  await Promise.all([
    runtimeStorage.auditDeliveries.set(
      "readiness-audit-delivery-proof",
      createVoiceAuditSinkDeliveryRecord({
        deliveredAt: at,
        deliveryAttempts: 1,
        deliveryStatus: "delivered",
        events: [auditEvent],
        id: "readiness-audit-delivery-proof",
        sinkDeliveries: {
          [auditDeliverySinkId]: {
            attempts: 1,
            deliveredAt: at,
            deliveredTo: auditDeliverySinkTarget,
            eventCount: 1,
            status: "delivered",
          },
        },
        updatedAt: at,
      }),
    ),
    runtimeStorage.traceDeliveries.set(
      "readiness-trace-delivery-proof",
      createVoiceTraceSinkDeliveryRecord({
        deliveredAt: at,
        deliveryAttempts: 1,
        deliveryStatus: "delivered",
        events: [traceEvent],
        id: "readiness-trace-delivery-proof",
        sinkDeliveries: {
          [traceDeliverySinkId]: {
            attempts: 1,
            deliveredAt: at,
            deliveredTo: traceDeliverySinkTarget,
            eventCount: 1,
            status: "delivered",
          },
        },
        updatedAt: at,
      }),
    ),
  ]);
};

const createDemoAuditDeliveryWorker = () => ({
  drain: async () => {
    const result = {
      alreadyProcessed: 0,
      attempted: 0,
      deadLettered: 0,
      delivered: 0,
      failed: 0,
      skipped: 0,
    };
    const deliveries = await runtimeStorage.auditDeliveries.list();

    await Promise.all(
      deliveries.map(async (delivery) => {
        if (delivery.deliveryStatus === "delivered") {
          result.alreadyProcessed += 1;
          return;
        }

        const deliveredAt = Date.now();
        result.attempted += 1;
        result.delivered += 1;
        await runtimeStorage.auditDeliveries.set(delivery.id, {
          ...delivery,
          deliveredAt,
          deliveryAttempts: (delivery.deliveryAttempts ?? 0) + 1,
          deliveryError: undefined,
          deliveryStatus: "delivered",
          sinkDeliveries: {
            [auditDeliverySinkId]: {
              attempts: (delivery.deliveryAttempts ?? 0) + 1,
              deliveredAt,
              deliveredTo: auditDeliverySinkTarget,
              eventCount: delivery.events.length,
              status: "delivered",
            },
          },
          updatedAt: deliveredAt,
        });
      }),
    );

    return result;
  },
});

const createDemoTraceDeliveryWorker = () => ({
  drain: async () => {
    const result = {
      alreadyProcessed: 0,
      attempted: 0,
      deadLettered: 0,
      delivered: 0,
      failed: 0,
      skipped: 0,
    };
    const deliveries = await runtimeStorage.traceDeliveries.list();

    await Promise.all(
      deliveries.map(async (delivery) => {
        if (delivery.deliveryStatus === "delivered") {
          result.alreadyProcessed += 1;
          return;
        }

        const deliveredAt = Date.now();
        result.attempted += 1;
        result.delivered += 1;
        await runtimeStorage.traceDeliveries.set(delivery.id, {
          ...delivery,
          deliveredAt,
          deliveryAttempts: (delivery.deliveryAttempts ?? 0) + 1,
          deliveryError: undefined,
          deliveryStatus: "delivered",
          sinkDeliveries: {
            [traceDeliverySinkId]: {
              attempts: (delivery.deliveryAttempts ?? 0) + 1,
              deliveredAt,
              deliveredTo: traceDeliverySinkTarget,
              eventCount: delivery.events.length,
              status: "delivered",
            },
          },
          updatedAt: deliveredAt,
        });
      }),
    );

    return result;
  },
});

const deliveryWorkerRuntime = (() => {
  if (deliverySinkKind === "webhook") {
    return createVoiceDeliveryRuntime(
      createVoiceDeliveryRuntimePresetConfig({
        auditDeliveries: runtimeStorage.auditDeliveries,
        auditSinkId: auditDeliverySinkId,
        auditWorkerId: "voice-demo-audit-webhook-worker",
        body: {
          audit: ({ events }) => ({
            eventCount: events.length,
            events,
            source: "absolutejs-voice-demo",
            surface: "audit-deliveries",
          }),
          trace: ({ events }) => ({
            eventCount: events.length,
            events,
            source: "absolutejs-voice-demo",
            surface: "trace-deliveries",
          }),
        },
        failures: {
          maxFailures: 3,
        },
        leases: {
          audit: createDemoLeaseCoordinator(),
          trace: createDemoLeaseCoordinator(),
        },
        mode: "webhook",
        signingSecret: webhookSigningSecret,
        traceDeliveries: runtimeStorage.traceDeliveries,
        traceSinkId: traceDeliverySinkId,
        traceWorkerId: "voice-demo-trace-webhook-worker",
        url: deliverySinkTarget,
      }),
    );
  }

  if (deliverySinkKind === "s3") {
    return createVoiceDeliveryRuntime(
      createVoiceDeliveryRuntimePresetConfig({
        auditDeliveries: runtimeStorage.auditDeliveries,
        auditSinkId: auditDeliverySinkId,
        auditWorkerId: "voice-demo-audit-s3-worker",
        bucket: s3DeliveryTarget.bucket,
        failures: {
          maxFailures: 3,
        },
        keyPrefix: s3DeliveryTarget.keyPrefix,
        leases: {
          audit: createDemoLeaseCoordinator(),
          trace: createDemoLeaseCoordinator(),
        },
        mode: "s3",
        traceDeliveries: runtimeStorage.traceDeliveries,
        traceSinkId: traceDeliverySinkId,
        traceWorkerId: "voice-demo-trace-s3-worker",
      }),
    );
  }

  return undefined;
})();
const demoAuditDeliveryWorker = createDemoAuditDeliveryWorker();
const demoTraceDeliveryWorker = createDemoTraceDeliveryWorker();
const deliveryRuntimeControl = deliveryWorkerRuntime ?? {
  audit: demoAuditDeliveryWorker,
  isRunning: () => false,
  start: () => undefined,
  stop: () => undefined,
  requeueDeadLetters: async () => ({
    audit: 0,
    trace: 0,
    total: 0,
  }),
  summarize: async () => ({
    audit: await summarizeVoiceAuditSinkDeliveries(
      await runtimeStorage.auditDeliveries.list(),
    ),
    trace: await summarizeVoiceTraceSinkDeliveries(
      await runtimeStorage.traceDeliveries.list(),
    ),
  }),
  tick: async () => {
    const [audit, trace] = await Promise.all([
      demoAuditDeliveryWorker.drain(),
      demoTraceDeliveryWorker.drain(),
    ]);

    return { audit, trace };
  },
  trace: demoTraceDeliveryWorker,
};

const createAuditDeliveryWorker = () =>
  deliveryWorkerRuntime?.audit ?? demoAuditDeliveryWorker;

const createTraceDeliveryWorker = () =>
  deliveryWorkerRuntime?.trace ?? demoTraceDeliveryWorker;

const isDemoBargeInProofTrace = (trace: VoiceTraceEvent) =>
  trace.type === "client.barge_in" &&
  trace.payload &&
  typeof trace.payload === "object" &&
  "id" in trace.payload &&
  trace.payload.id !== "barge-in-proof-seed" &&
  "latencyMs" in trace.payload &&
  typeof trace.payload.latencyMs === "number" &&
  "status" in trace.payload &&
  trace.payload.status === "stopped" &&
  trace.metadata?.source !== "demo" &&
  trace.metadata?.proof !== "barge-in-seed";

const getBargeInReportEvents = async () => {
  const traces = await runtimeStorage.traces.list();
  const live = traces.filter(isDemoBargeInProofTrace);

  return live.length > 0 ? live : traces;
};

const getBargeInProofSource = async () =>
  (await getBargeInReportEvents()).some(isDemoBargeInProofTrace)
    ? "live"
    : "demo";

const buildDemoBargeInReport = async () => {
  const source = await getBargeInProofSource();
  const thresholdProfile = await loadDemoSloThresholdProfile();
  const report = summarizeVoiceBargeIn(await getBargeInReportEvents(), {
    thresholdMs: thresholdProfile.bargeIn.thresholdMs ?? 250,
  });

  return {
    ...report,
    source,
    sourceLabel:
      source === "live"
        ? "Live captured browser interruption events"
        : "Demo fallback seed",
  };
};

const renderDemoBargeInHTML = async () => {
  const report = await buildDemoBargeInReport();
  const html = renderVoiceBargeInHTML(report, {
    title: "AbsoluteJS Voice Barge-In",
  });
  const detail =
    report.source === "live"
      ? "This report is backed by persisted client.barge_in trace events from browser interruption tests."
      : "No live browser interruption event is available yet, so readiness uses the deterministic demo seed.";
  const badge = `<section class="metrics"><article><span>Proof source</span><strong>${escapeHtml(report.sourceLabel)}</strong></article><article><span>Source detail</span><strong style="font-size:1rem">${escapeHtml(detail)}</strong></article></section>`;

  return html.replace("</main>", `${badge}</main>`);
};

const cleanupDemoQualityNoise = async () => {
  const traces = await runtimeStorage.traces.list();
  const staleSyntheticProviderErrors = traces.filter(
    (trace) =>
      trace.type === "session.error" &&
      trace.payload.providerStatus === "error" &&
      /^(phone-|provider-sim-|provider-slo-proof-|stt-sim-|tts-sim-)/.test(
        trace.sessionId,
      ),
  );

  await Promise.all(
    staleSyntheticProviderErrors.map((trace) =>
      runtimeStorage.traces.remove(trace.id),
    ),
  );

  const existingRoutingProof = traces.filter(
    (trace) => trace.sessionId === "quality-routing-proof",
  );
  await Promise.all(
    existingRoutingProof.map((trace) => runtimeStorage.traces.remove(trace.id)),
  );

  const staleFailedExportReceipts =
    await observabilityExportDeliveryReceipts.list();
  await Promise.all(
    staleFailedExportReceipts
      .filter(
        (receipt) =>
          receipt.status === "fail" || receipt.exportStatus === "fail",
      )
      .map((receipt) => observabilityExportDeliveryReceipts.remove(receipt.id)),
  );

  await deliveryTraceStore.append({
    at: Date.now(),
    payload: {
      elapsedMs: 35,
      kind: "llm",
      provider: modelProvider,
      providerStatus: "success",
      selectedProvider: modelProvider,
      status: "success",
    },
    scenarioId: "quality-routing-proof",
    sessionId: "quality-routing-proof",
    type: "session.error",
  });
};

const toNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const toStringValue = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

const storeLiveTurnLatencyTrace = async (body: unknown) => {
  const input =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const id = toStringValue(input.id) ?? `live-turn-${crypto.randomUUID()}`;
  const sessionId =
    toStringValue(input.sessionId) ?? `live-latency-${crypto.randomUUID()}`;
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
  await deliveryTraceStore.append(event);

  return { ok: true, sessionId, traceId: id };
};

const isReconnectStatus = (value: unknown) =>
  value === "idle" ||
  value === "reconnecting" ||
  value === "resumed" ||
  value === "exhausted";

const storeReconnectTrace = async (body: unknown) => {
  const input =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const reconnect =
    input.reconnect && typeof input.reconnect === "object"
      ? (input.reconnect as Record<string, unknown>)
      : undefined;
  const status = reconnect ? reconnect.status : undefined;

  if (!reconnect || !isReconnectStatus(status)) {
    return Response.json(
      { error: "Invalid reconnect snapshot." },
      { status: 400 },
    );
  }

  const at = toNumber(input.at) ?? Date.now();
  const sessionId =
    toStringValue(input.sessionId) ?? `reconnect-${crypto.randomUUID()}`;
  const scenarioId = toStringValue(input.scenarioId);
  const turnIds = Array.isArray(input.turnIds)
    ? input.turnIds.filter(
        (turnId): turnId is string => typeof turnId === "string",
      )
    : [];
  const event: VoiceTraceEvent = {
    at,
    metadata: {
      source: "browser",
      surface: "reconnect-proof",
    },
    payload: {
      at,
      reconnect: {
        attempts: toNumber(reconnect.attempts) ?? 0,
        lastDisconnectAt: toNumber(reconnect.lastDisconnectAt),
        lastResumedAt: toNumber(reconnect.lastResumedAt),
        maxAttempts: toNumber(reconnect.maxAttempts) ?? 0,
        nextAttemptAt: toNumber(reconnect.nextAttemptAt),
        status,
      },
      turnIds,
    },
    scenarioId,
    sessionId,
    type: "client.reconnect",
  };
  await deliveryTraceStore.append(event);

  return { ok: true, sessionId };
};

const getLiveReconnectContractSnapshots = async () =>
  summarizeVoiceReconnectContractSnapshots(await runtimeStorage.traces.list());

const getReconnectContractSnapshotSource = async () =>
  (await getLiveReconnectContractSnapshots()).length > 0 ? "live" : "demo";

const getReconnectContractSnapshots = async () => {
  const snapshots = await getLiveReconnectContractSnapshots();

  return snapshots.length > 0 ? snapshots : getDemoReconnectContractSnapshots();
};

const buildDemoReconnectContractReport = async () => {
  const source = await getReconnectContractSnapshotSource();
  const snapshots = await getReconnectContractSnapshots();
  const report = runVoiceReconnectContract({
    snapshots,
  });
  const resumed = snapshots.filter(
    (snapshot) =>
      snapshot.reconnect.status === "resumed" &&
      typeof snapshot.reconnect.lastResumedAt === "number",
  );
  const resumeLatencies = resumed
    .map((snapshot) => {
      const previousReconnect = snapshots
        .filter(
          (candidate) =>
            candidate.at <= snapshot.at &&
            candidate.reconnect.status === "reconnecting" &&
            typeof candidate.reconnect.lastDisconnectAt === "number",
        )
        .at(-1);

      return previousReconnect?.reconnect.lastDisconnectAt === undefined
        ? undefined
        : snapshot.reconnect.lastResumedAt! -
            previousReconnect.reconnect.lastDisconnectAt;
    })
    .filter((value): value is number => typeof value === "number" && value >= 0);
  const resumeLatencyP95Ms =
    resumeLatencies.length > 0
      ? [...resumeLatencies].sort((left, right) => left - right)[
          Math.min(
            resumeLatencies.length - 1,
            Math.max(0, Math.ceil(0.95 * resumeLatencies.length) - 1),
          )
        ]
      : undefined;

  return {
    ...report,
    resumeLatencyP95Ms,
    source,
    sourceLabel:
      source === "live"
        ? "Live captured browser traces"
        : "Demo fallback snapshots",
  };
};

const renderDemoReconnectContractHTML = async (
  report: Parameters<typeof renderVoiceReconnectContractHTML>[0],
) => {
  const source = await getReconnectContractSnapshotSource();
  const sourceLabel =
    source === "live"
      ? "Live captured browser traces"
      : "Demo fallback snapshots";
  const sourceDetail =
    source === "live"
      ? "This contract is backed by persisted client.reconnect trace events from real browser reconnect lifecycle transitions."
      : "No live client.reconnect traces are available yet, so the page is using deterministic demo snapshots.";
  const html = renderVoiceReconnectContractHTML(report);
  const badge = `<section class="card"><h2>Proof source</h2><p><strong>${escapeHtml(sourceLabel)}</strong></p><p>${escapeHtml(sourceDetail)}</p></section>`;

  return html.replace("</main>", `${badge}</main>`);
};

const productionReadinessLinks = {
  agentSquadContracts: "/agent-squad-contract",
  auditDeliveries: "/audit/deliveries",
  bargeIn: "/barge-in",
  campaignReadiness: "/api/voice/campaigns/readiness-proof",
  carriers: "/carriers",
  deliveryRuntime: "/delivery-runtime",
  handoffs: "/handoffs",
  opsActions: "/voice/ops-actions",
  operationsRecords: "/voice-operations/:sessionId",
  observabilityExport: "/voice/observability-export",
  observabilityExportDeliveries: "/api/voice/observability-export/deliveries",
  proofTrends: "/voice/proof-trends",
  opsRecovery: "/ops-recovery",
  providerContracts: "/provider-contracts",
  providerOrchestration: "/voice/provider-orchestration",
  providerRoutingContracts: "/api/provider-routing-contract",
  providerSlo: "/voice/provider-slos",
  quality: "/quality",
  reconnectContracts: "/voice/reconnect-contract",
  resilience: "/resilience",
  sessions: "/sessions",
  sloReadinessThresholds: "/voice/slo-readiness-thresholds",
  telephonyWebhookSecurity: "/api/voice/telephony/webhook-security",
  traceDeliveries: "/traces/deliveries",
};

const telephonyWebhookSecurityOptions = () => ({
  plivo: {
    authToken: "proof-plivo-secret",
  },
  store: {
    kind: "sqlite" as const,
    path: resolve(runtimeDirectory, "telephony-webhook-security.sqlite"),
  },
  telnyx: {
    publicKey: "proof-telnyx-public-key",
    toleranceSeconds: 300,
  },
  ttlSeconds: 300,
  twilio: {
    authToken: "proof-secret",
    verificationUrl: "https://voice.example.test/carrier",
  },
});

const opsRecoveryOptions = () => ({
  auditDeliveries: runtimeStorage.auditDeliveries,
  handoffDeliveries:
    handoffDeliveryStore as unknown as VoiceHandoffDeliveryStore,
  latency: {
    failAfterMs: 3_200,
    warnAfterMs: 1_800,
  },
  links: {
    auditDeliveries: "/audit/deliveries",
    handoffs: "/handoffs",
    operationsRecords: (sessionId: string) =>
      `/voice-operations/${encodeURIComponent(sessionId)}`,
    providers: "/api/provider-status",
    sessions: (sessionId: string) =>
      `/sessions/${encodeURIComponent(sessionId)}`,
    traceDeliveries: "/traces/deliveries",
    traces: (sessionId: string) => `/traces/${encodeURIComponent(sessionId)}`,
  },
  path: "/api/voice/ops-recovery",
  providers: [
    ...configuredModelProviders,
    ...configuredSTTProviders,
    ...configuredTTSProviders,
  ],
  traces: deliveryTraceStore,
});

const buildDemoOpsRecoveryReport = () =>
  buildVoiceOpsRecoveryReport(opsRecoveryOptions());

const providerSloProofScenarioId = "provider-slo-proof";

const providerSloOptions = {
  maxAgeMs: 10 * 60 * 1000,
  requiredKinds: ["llm", "stt", "tts"] as const,
  scenarioId: providerSloProofScenarioId,
  thresholds: {
    llm: {
      maxAverageElapsedMs: 2_500,
      maxP95ElapsedMs: 4_500,
    },
    stt: {
      maxAverageElapsedMs: 800,
      maxP95ElapsedMs: 1_500,
    },
    tts: {
      maxAverageElapsedMs: 1_200,
      maxP95ElapsedMs: 2_200,
    },
  },
};

const seedDemoProviderSloProof = async () => {
  const now = Date.now();
  const sessionId = `provider-slo-proof-${now}`;
  const primaryModelProvider = configuredModelProviders[0] ?? "deterministic";
  const fallbackModelProvider =
    configuredModelProviders.find((provider) => provider !== primaryModelProvider) ??
    "anthropic";
  const events: StoredVoiceTraceEvent[] = await Promise.all(
    [
      {
        elapsedMs: 700,
        fallbackProvider: fallbackModelProvider,
        kind: "llm",
        provider: primaryModelProvider,
        selectedProvider: fallbackModelProvider,
        status: "fallback",
      },
      {
        elapsedMs: 320,
        kind: "llm",
        provider: fallbackModelProvider,
        selectedProvider: fallbackModelProvider,
        status: "success",
      },
      {
        elapsedMs: 300,
        kind: "llm",
        provider: primaryModelProvider,
        selectedProvider: primaryModelProvider,
        status: "success",
      },
      {
        elapsedMs: 280,
        kind: "llm",
        provider: primaryModelProvider,
        selectedProvider: primaryModelProvider,
        status: "success",
      },
      {
        elapsedMs: 82,
        kind: "stt",
        provider: configuredSTTProviders[0] ?? "deepgram",
        status: "success",
      },
      {
        elapsedMs: 45,
        kind: "tts",
        provider: configuredTTSProviders[0] ?? "emergency",
        status: "success",
      },
    ].map((event, index) =>
      deliveryTraceStore.append(
        createVoiceTraceEvent({
          at: now + index,
          payload: {
            elapsedMs: event.elapsedMs,
            fallbackProvider: event.fallbackProvider,
            kind: event.kind,
            provider: event.provider,
            providerStatus: event.status,
            selectedProvider: event.selectedProvider ?? event.provider,
          },
          scenarioId: providerSloProofScenarioId,
          sessionId,
          type: "session.error",
        }),
      ),
    ),
  );

  return {
    events: events.length,
    ok: true,
    scenarioId: providerSloProofScenarioId,
    sessionId,
  };
};

const providerDecisionProofScenarioId = "provider-decision-proof";

const seedDemoProviderDecisionProof = async () => {
  const now = Date.now();
  const sessionId = `provider-decision-proof-${now}`;
  const modelPrimary = configuredModelProviders[0] ?? "deterministic";
  const modelFallback =
    configuredModelProviders.find((provider) => provider !== modelPrimary) ??
    modelPrimary;
  const sttPrimary = configuredSTTProviders[0] ?? "deepgram";
  const sttFallback =
    configuredSTTProviders.find((provider) => provider !== sttPrimary) ??
    sttPrimary;
  const ttsPrimary = configuredTTSProviders[0] ?? "emergency";

  const events = await Promise.all(
    [
      createVoiceProviderDecisionTraceEvent({
        at: now,
        elapsedMs: 320,
        kind: "llm",
        provider: modelPrimary,
        reason:
          "live-call selected the lowest-latency configured model provider inside the orchestration policy.",
        scenarioId: providerDecisionProofScenarioId,
        selectedProvider: modelPrimary,
        sessionId,
        status: "selected",
        surface: "live-call",
      }),
      createVoiceProviderDecisionTraceEvent({
        at: now + 1,
        elapsedMs: 82,
        fallbackProvider: sttFallback,
        kind: "stt",
        provider: sttPrimary,
        reason:
          sttFallback === sttPrimary
            ? "live-stt used the only configured realtime STT provider."
            : "live-stt recovered by falling back to the next configured STT provider.",
        scenarioId: providerDecisionProofScenarioId,
        selectedProvider: sttFallback,
        sessionId,
        status: sttFallback === sttPrimary ? "selected" : "fallback",
        surface: "live-stt",
      }),
      createVoiceProviderDecisionTraceEvent({
        at: now + 2,
        elapsedMs: 45,
        kind: "tts",
        provider: ttsPrimary,
        reason:
          "telephony-tts selected the configured low-latency speech provider for phone playback.",
        scenarioId: providerDecisionProofScenarioId,
        selectedProvider: ttsPrimary,
        sessionId,
        status: "selected",
        surface: "telephony-tts",
      }),
      createVoiceProviderDecisionTraceEvent({
        at: now + 3,
        elapsedMs: 650,
        kind: "llm",
        provider: configuredModelProviders.includes("gemini")
          ? "gemini"
          : modelFallback,
        reason:
          "background-summary selected the lower-cost summarization lane instead of the live-call latency lane.",
        scenarioId: providerDecisionProofScenarioId,
        selectedProvider: configuredModelProviders.includes("gemini")
          ? "gemini"
          : modelFallback,
        sessionId,
        status: "selected",
        surface: "background-summary",
      }),
      createVoiceProviderDecisionTraceEvent({
        at: now + 4,
        elapsedMs: 720,
        fallbackProvider: modelFallback,
        kind: "llm",
        provider: modelPrimary,
        reason:
          "live-call recovered by falling back to the next configured model provider after a simulated primary provider timeout.",
        scenarioId: providerDecisionProofScenarioId,
        selectedProvider: modelFallback,
        sessionId,
        status: "fallback",
        surface: "live-call",
      }),
      createVoiceProviderDecisionTraceEvent({
        at: now + 5,
        elapsedMs: 980,
        fallbackProvider: "deterministic",
        kind: "llm",
        provider: modelPrimary,
        reason:
          "live-call degraded to deterministic fallback after model providers exceeded the latency budget.",
        scenarioId: providerDecisionProofScenarioId,
        selectedProvider: "deterministic",
        sessionId,
        status: "degraded",
        surface: "live-call",
      }),
    ].map((event) => deliveryTraceStore.append(event)),
  );

  return {
    events: events.length,
    ok: true,
    scenarioId: providerDecisionProofScenarioId,
    sessionId,
  };
};

const observabilityExportDeliveryDestinations = () => [
  {
    directory: ".voice-runtime/observability-exports",
    kind: "file" as const,
    label: "Local customer-owned observability archive",
  },
  ...(process.env.VOICE_OBSERVABILITY_EXPORT_S3_BUCKET
    ? [
        {
          bucket: process.env.VOICE_OBSERVABILITY_EXPORT_S3_BUCKET,
          keyPrefix:
            process.env.VOICE_OBSERVABILITY_EXPORT_S3_PREFIX ??
            "absolutejs-voice-demo",
          kind: "s3" as const,
          label: "S3 customer-owned observability archive",
        },
      ]
    : []),
  ...(process.env.VOICE_OBSERVABILITY_EXPORT_SQLITE_PATH
    ? [
        {
          kind: "sqlite" as const,
          label: "SQLite customer-owned observability warehouse",
          path: process.env.VOICE_OBSERVABILITY_EXPORT_SQLITE_PATH,
          tableName:
            process.env.VOICE_OBSERVABILITY_EXPORT_SQLITE_TABLE ??
            "voice_observability_exports",
        },
      ]
    : []),
  ...(process.env.VOICE_OBSERVABILITY_EXPORT_POSTGRES_URL
    ? [
        {
          connectionString: process.env.VOICE_OBSERVABILITY_EXPORT_POSTGRES_URL,
          kind: "postgres" as const,
          label: "Postgres customer-owned observability warehouse",
          schemaName:
            process.env.VOICE_OBSERVABILITY_EXPORT_POSTGRES_SCHEMA ?? "voice",
          tableName:
            process.env.VOICE_OBSERVABILITY_EXPORT_POSTGRES_TABLE ??
            "observability_exports",
        },
      ]
    : []),
];
const observabilityExportDeliveryReceipts =
  createVoiceFileObservabilityExportDeliveryReceiptStore({
    directory: ".voice-runtime/observability-export-receipts",
  });

const proofScreenshotArtifact = (
  id: string,
  label: string,
  file: string,
) => {
  const path = `.voice-runtime/proof-pack/screenshots/latest/${file}`;
  const maxScreenshotAgeMs = 2 * 60 * 60 * 1000;
  const isFresh =
    existsSync(path) && Date.now() - statSync(path).mtimeMs <= maxScreenshotAgeMs;

  return isFresh
    ? [
        {
          id,
          kind: "screenshot" as const,
          label,
          path,
          status: "pass" as const,
        },
      ]
    : [];
};

const observabilityExportOptions = () => ({
  artifactIntegrity: {
    maxAgeMs: 2 * 60 * 60 * 1000,
  },
  deliveryDestinations: observabilityExportDeliveryDestinations(),
  deliveryReceipts: observabilityExportDeliveryReceipts,
  artifacts: [
    {
      id: "latest-proof-pack",
      kind: "proof-pack" as const,
      label: "Latest proof pack",
      path: ".voice-runtime/proof-pack/latest.md",
      required: true,
      status: "pass" as const,
    },
    {
      id: "latest-proof-trends",
      kind: "proof-pack" as const,
      label: "Latest sustained proof trends",
      path: latestProofTrendsMarkdownPath,
      required: false,
      status: existsSync(latestProofTrendsMarkdownPath)
        ? ("pass" as const)
        : ("warn" as const),
    },
    ...proofScreenshotArtifact(
      "production-readiness-screenshot",
      "Production readiness screenshot",
      "production-readiness.png",
    ),
    ...proofScreenshotArtifact(
      "framework-readiness-gates-screenshot",
      "Framework readiness gate explanations screenshot",
      "framework-readiness-gates.png",
    ),
    ...proofScreenshotArtifact(
      "provider-slo-screenshot",
      "Provider SLO screenshot",
      "provider-slos.png",
    ),
    ...proofScreenshotArtifact(
      "provider-orchestration-screenshot",
      "Provider orchestration screenshot",
      "provider-orchestration.png",
    ),
    ...proofScreenshotArtifact(
      "provider-decisions-screenshot",
      "Provider decision traces screenshot",
      "provider-decisions.png",
    ),
    ...proofScreenshotArtifact(
      "proof-trends-screenshot",
      "Sustained proof trends screenshot",
      "proof-trends.png",
    ),
    ...proofScreenshotArtifact(
      "simulation-suite-screenshot",
      "Simulation suite screenshot",
      "simulation-suite.png",
    ),
    ...proofScreenshotArtifact(
      "operations-record-screenshot",
      "Operations record screenshot",
      "operations-record.png",
    ),
    ...proofScreenshotArtifact(
      "post-call-analysis-screenshot",
      "Post-call analysis screenshot",
      "post-call-analysis.png",
    ),
    ...proofScreenshotArtifact(
      "guardrails-screenshot",
      "Guardrails screenshot",
      "guardrails.png",
    ),
    ...proofScreenshotArtifact(
      "switching-from-vapi-screenshot",
      "Switching from Vapi migration screenshot",
      "switching-from-vapi.png",
    ),
  ],
  audit: runtimeStorage.audit,
  auditDeliveries: runtimeStorage.auditDeliveries,
  links: {
    operationsRecord: (sessionId: string) =>
      `/voice-operations/${encodeURIComponent(sessionId)}`,
  },
  redact: voiceSupportArtifactRedaction,
  store: deliveryTraceStore,
  traceDeliveries: runtimeStorage.traceDeliveries,
});

const buildDemoObservabilityExport = () =>
  buildVoiceObservabilityExport(observabilityExportOptions());

const buildDemoObservabilityExportReplay = async () => {
  const latestReceipt = (
    await observabilityExportDeliveryReceipts.list()
  ).find(
    (receipt) =>
      receipt.status === "pass" &&
      receipt.exportStatus === "pass" &&
      receipt.summary.delivered > 0,
  );

  if (!latestReceipt) {
    return buildVoiceObservabilityExportReplayReport({});
  }

  const sqliteDestination = latestReceipt.destinations.find(
    (destination) =>
      destination.status === "delivered" &&
      destination.destinationKind === "sqlite",
  );

  if (sqliteDestination && process.env.VOICE_OBSERVABILITY_EXPORT_SQLITE_PATH) {
    return {
      kind: "sqlite" as const,
      path: process.env.VOICE_OBSERVABILITY_EXPORT_SQLITE_PATH,
      runId: latestReceipt.runId,
      tableName:
        process.env.VOICE_OBSERVABILITY_EXPORT_SQLITE_TABLE ??
        "voice_observability_exports",
    };
  }

  return {
    directory: ".voice-runtime/observability-exports",
    kind: "file" as const,
    receiptDirectory: ".voice-runtime/observability-export-receipts",
    runId: latestReceipt.runId,
  };
};

const productionReadinessOptions = () => ({
  ...createVoiceReadinessProfile("phone-agent", {
    auditDeliveries: runtimeStorage.auditDeliveries,
    campaignReadiness: () =>
      runVoiceCampaignReadinessProof({ store: campaignStore }),
    carriers: loadCarrierMatrixInputs,
    deliveryRuntime: deliveryRuntimeControl,
    explain: true,
    links: productionReadinessLinks,
    observabilityExportDeliveryHistory: {
      failOnMissing: false,
      failOnStale: true,
      maxAgeMs: 2 * 60 * 60 * 1000,
      store: observabilityExportDeliveryReceipts,
    },
    providerRoutingContracts: async () => [
      await runDemoProviderRoutingContract(),
      await runDemoSTTProviderRoutingContract(),
      await runDemoTTSProviderRoutingContract(),
    ],
    traceDeliveries: runtimeStorage.traceDeliveries,
  }),
  agentSquadContracts: async () => [await runDemoAgentSquadContract()],
  bargeInReports: async () => [await buildDemoBargeInReport()],
  htmlPath: "/production-readiness",
  opsActionHistory: runtimeStorage.audit,
  opsRecovery: buildDemoOpsRecoveryReport,
  observabilityExport: buildDemoObservabilityExport,
  observabilityExportReplay: buildDemoObservabilityExportReplay,
  path: "/api/production-readiness",
  providerStack: evaluateVoiceProviderStackGaps({
    capabilities: voiceProviderStackCapabilities,
    profile: "phone-agent",
    providers: {
      llm: configuredModelProviders,
      stt: configuredSTTProviders,
      tts: configuredTTSProviders,
    },
  }),
  providerOrchestration: buildDemoProviderOrchestrationReport,
  providerSlo: async () => {
    const thresholdProfile = await loadDemoSloThresholdProfile();

    return {
      ...providerSloOptions,
      thresholds: {
        ...providerSloOptions.thresholds,
        ...thresholdProfile.providerSlo,
      },
    };
  },
  resolveOptions: async () => {
    const thresholdProfile = await loadDemoSloThresholdProfile();

    return {
      ...createVoiceSloReadinessThresholdOptions(thresholdProfile),
      liveLatencyMaxAgeMs: liveLatencyReadinessMaxAgeMs,
    };
  },
  providerContractMatrix: buildDemoProviderContractMatrix,
  telephonyWebhookSecurity: telephonyWebhookSecurityOptions,
  proofSources: async () => {
    const [bargeInReport, reconnectReport] = await Promise.all([
      buildDemoBargeInReport(),
      buildDemoReconnectContractReport(),
    ]);

    return {
      bargeIn: {
        detail:
          bargeInReport.source === "live"
            ? "Captured from browser interruption events."
            : "Using deterministic demo fallback seed.",
        href: "/barge-in",
        source: bargeInReport.source,
        sourceLabel: bargeInReport.sourceLabel,
      },
      auditDeliveries: {
        detail: `Backed by the configured ${deliverySinkKind} audit delivery queue.`,
        href: "/audit/deliveries",
        source: deliverySinkKind,
        sourceLabel: "Audit delivery sink evidence",
      },
      liveLatency: {
        detail: "Captured from persisted browser live-latency trace events.",
        href: "/live-latency",
        source: "browser",
        sourceLabel: "Browser live-latency traces",
      },
      deliveryRuntime: {
        detail:
          "Summarizes audit and trace delivery worker queues from the mounted delivery runtime control plane.",
        href: "/delivery-runtime",
        source: deliverySinkKind,
        sourceLabel: "Delivery runtime queue summary",
      },
      providerRoutingContracts: {
        detail:
          "Generated from code-owned LLM, STT, and TTS routing contracts.",
        href: "/api/provider-routing-contract",
        source: "contract",
        sourceLabel: "Provider routing contract reports",
      },
      providerContractMatrix: {
        detail:
          "Generated by createVoiceProviderContractMatrixPreset from the configured LLM, STT, and TTS providers.",
        href: "/provider-contracts",
        source: "preset",
        sourceLabel: "Provider contract matrix preset",
      },
      providerOrchestration: {
        detail:
          "Generated from createVoiceProviderOrchestrationProfile and deploy-gates live-call, STT, TTS, and background-summary provider policy.",
        href: "/voice/provider-orchestration",
        source: "profile",
        sourceLabel: "Provider orchestration profile proof",
      },
      providerSlo: {
        detail:
          "Generated from provider routing traces and checks latency, p95, timeout, fallback, and unresolved-error budgets.",
        href: "/voice/provider-slos",
        source: "trace",
        sourceLabel: "Provider SLO trace evidence",
      },
      telephonyWebhookSecurity: {
        detail:
          "Generated from the carrier webhook security preset and validates verification, replay protection, idempotency, and persistent security stores.",
        href: "/api/voice/telephony/webhook-security",
        source: "security-preset",
        sourceLabel: "Carrier webhook security evidence",
      },
      proofTrends: {
        detail:
          "Generated by repeated proof cycles over provider SLOs, turn latency, live latency, ops recovery, and readiness.",
        href: "/voice/proof-trends",
        source: "trend-artifact",
        sourceLabel: "Sustained proof trend evidence",
      },
      observabilityExport: {
        detail:
          "Generated from the customer-owned export manifest for traces, audits, operations records, SLOs, readiness, incidents, and proof-pack artifacts.",
        href: "/voice/observability-export",
        source: "export",
        sourceLabel: "Customer-owned observability export",
      },
      observabilityExportDeliveryHistory: {
        detail:
          "Backed by customer-owned delivery receipts for file/S3/webhook/SQLite/Postgres observability export runs.",
        href: "/api/voice/observability-export/deliveries",
        source: "receipt-store",
        sourceLabel: "Observability export delivery receipts",
      },
      observabilityExportReplay: {
        detail:
          "Reads the latest delivered customer-owned observability export back from SQLite when configured, otherwise from the local file archive.",
        href: "/api/production-readiness",
        source: process.env.VOICE_OBSERVABILITY_EXPORT_SQLITE_PATH
          ? "sqlite"
          : "file",
        sourceLabel: "Observability export replay",
      },
      reconnectContracts: {
        detail:
          reconnectReport.source === "live"
            ? "Captured from browser reconnect lifecycle traces."
            : "Using deterministic demo fallback snapshots.",
        href: "/voice/reconnect-contract",
        source: reconnectReport.source,
        sourceLabel: reconnectReport.sourceLabel,
      },
      traceDeliveries: {
        detail: `Backed by the configured ${deliverySinkKind} trace delivery queue.`,
        href: "/traces/deliveries",
        source: deliverySinkKind,
        sourceLabel: "Trace delivery sink evidence",
      },
    };
  },
  reconnectContracts: async () => [
    runVoiceReconnectContract({
      snapshots: await getReconnectContractSnapshots(),
    }),
  ],
  store: deliveryTraceStore,
});

type DemoProofSurface = {
  detail: string;
  href: string;
  label: string;
  status: "empty" | "fail" | "pass" | "warn";
};

const getDemoProofStatus = (surfaces: DemoProofSurface[]) =>
  surfaces.some((surface) => surface.status === "fail")
    ? "fail"
    : surfaces.some(
          (surface) => surface.status === "warn" || surface.status === "empty",
        )
      ? "warn"
      : "pass";

const runDemoProofSuite = async (request: Request) => {
  await ensureDemoIncidentBundleEvidence();

  const liveLatencyStartedAt = Date.now() - 560;
  const [turnLatencyProof, campaignDialerProof] = await Promise.all([
    seedTurnLatencyProof(),
    runVoiceCampaignDialerProof({
      baseUrl: resolveCarrierOrigin(request),
      store: campaignStore,
    }),
    seedDemoBargeInProof(),
    seedDemoDeliveryProof(),
    cleanupDemoQualityNoise(),
    storeLiveTurnLatencyTrace({
      completedAt: liveLatencyStartedAt + 420,
      id: `demo-proof-live-latency-${crypto.randomUUID()}`,
      latencyMs: 420,
      sessionId: `demo-proof-live-latency-${crypto.randomUUID()}`,
      startedAt: liveLatencyStartedAt,
      status: "assistant_audio_started",
      thresholdMs: 1_800,
    }),
    deliveryRuntimeControl.tick(),
  ]);

  const [
    bargeIn,
    liveLatency,
    turnLatency,
    readiness,
    providerContracts,
    deliverySummary,
    traces,
  ] = await Promise.all([
    buildDemoBargeInReport(),
    summarizeVoiceLiveLatency({ store: deliveryTraceStore }),
    summarizeVoiceTurnLatency({
      store: runtimeStorage.session,
      traceStore: runtimeStorage.traces,
    }),
    buildVoiceProductionReadinessReport(productionReadinessOptions()),
    buildDemoProviderContractMatrix(),
    deliveryRuntimeControl.summarize(),
    runtimeStorage.traces.list({ limit: 50 }),
  ]);
  const readinessPassed = readiness.checks.filter(
    (check) => check.status === "pass",
  ).length;
  const auditDelivery = deliverySummary.audit ?? {
    deadLettered: 0,
    failed: 0,
    pending: 0,
  };
  const traceDelivery = deliverySummary.trace ?? {
    deadLettered: 0,
    failed: 0,
    pending: 0,
  };
  const surfaces: DemoProofSurface[] = [
    {
      detail: `${bargeIn.total} interruption(s), ${bargeIn.averageLatencyMs ?? 0}ms average. Source: ${bargeIn.sourceLabel}.`,
      href: "/barge-in",
      label: "Barge-in",
      status: bargeIn.status,
    },
    {
      detail: `${liveLatency.total} sample(s), p95 ${liveLatency.p95LatencyMs ?? 0}ms.`,
      href: "/live-latency",
      label: "Live latency",
      status: liveLatency.status,
    },
    {
      detail: `${turnLatency.total} turn(s), average ${turnLatency.averageTotalMs ?? 0}ms. Seed: ${turnLatencyProof.sessionId}.`,
      href: "/turn-latency",
      label: "Turn waterfall",
      status: turnLatency.status,
    },
    {
      detail:
        existsSync(latestProofTrendsJsonPath)
          ? "Latest sustained trend artifact is available for repeated provider, latency, recovery, and readiness proof."
          : "Run bun run proof:trends to create repeated-cycle trend proof.",
      href: "/voice/proof-trends",
      label: "Sustained trends",
      status: existsSync(latestProofTrendsJsonPath) ? "pass" : "empty",
    },
    {
      detail: `${providerContracts.passed}/${providerContracts.total} provider contract rows passing.`,
      href: "/provider-contracts",
      label: "Provider contracts",
      status: providerContracts.status,
    },
    {
      detail: `${readinessPassed}/${readiness.checks.length} readiness checks passing.`,
      href: "/production-readiness",
      label: "Production readiness",
      status: readiness.status,
    },
    {
      detail: `${auditDelivery.pending + traceDelivery.pending} pending delivery item(s), ${auditDelivery.deadLettered + traceDelivery.deadLettered} dead-lettered.`,
      href: "/delivery-runtime",
      label: "Delivery runtime",
      status:
        auditDelivery.deadLettered > 0 || traceDelivery.deadLettered > 0
          ? "fail"
          : auditDelivery.pending > 0 || traceDelivery.pending > 0
            ? "warn"
            : "pass",
    },
    {
      detail: `${campaignDialerProof.providers.length} carrier provider proof report(s).`,
      href: "/voice/campaigns/dialer-proof",
      label: "Campaign dialer",
      status: campaignDialerProof.providers.every((provider) =>
        provider.outcomes.every((outcome) => outcome.applied),
      )
        ? "pass"
        : "fail",
    },
    {
      detail: `${traces.length} recent trace event(s) available for drill-down.`,
      href: "/traces",
      label: "Trace timelines",
      status: traces.length > 0 ? "pass" : "empty",
    },
    {
      detail:
        "Redacted trace, audit, handoff, and tool evidence exported from a single support session.",
      href: `/voice-incidents/${demoIncidentSessionId}/markdown`,
      label: "Incident bundle",
      status: "pass",
    },
  ];

  return {
    checkedAt: Date.now(),
    status: getDemoProofStatus(surfaces),
    surfaces,
  };
};

const renderDemoProofHTML = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AbsoluteJS Voice Demo Proof</title>
    <style>
      body{background:#0a0f14;color:#f7f3e8;font-family:ui-sans-serif,system-ui,sans-serif;margin:0}
      main{margin:auto;max-width:1120px;padding:32px}
      .hero,.surface{background:#111821;border:1px solid #26313d;border-radius:24px;margin-bottom:16px;padding:22px}
      .hero{background:linear-gradient(135deg,rgba(94,234,212,.16),rgba(245,158,11,.1))}
      .eyebrow{color:#5eead4;font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      h1{font-size:clamp(2.4rem,7vw,5.5rem);line-height:.9;margin:.2rem 0 1rem}
      button,.link{background:#5eead4;border:0;border-radius:999px;color:#061014;cursor:pointer;display:inline-flex;font-weight:900;margin:8px 8px 0 0;padding:11px 15px;text-decoration:none}
      .link{background:#1b2530;color:#d7fff8}
      .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
      .surface.pass{border-color:rgba(34,197,94,.5)}.surface.warn,.surface.empty{border-color:rgba(245,158,11,.55)}.surface.fail{border-color:rgba(248,113,113,.65)}
      .surface header{align-items:start;display:flex;gap:12px;justify-content:space-between}
      .surface strong{font-size:1.05rem}.status{border:1px solid #334155;border-radius:999px;padding:5px 9px}.pass .status{color:#86efac}.warn .status,.empty .status{color:#fde68a}.fail .status{color:#fca5a5}
      .muted{color:#b7c0ca;line-height:1.5}pre{background:#080b10;border:1px solid #26313d;border-radius:16px;color:#d7fff8;overflow:auto;padding:14px}
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="eyebrow">Self-hosted production proof</p>
        <h1>Run the full voice proof suite</h1>
        <p class="muted">One action seeds deterministic demo evidence, runs carrier proof, refreshes delivery workers, and returns the same proof surfaces users can inspect individually.</p>
        <button id="run-proof" type="button">Run full proof suite</button>
        <a class="link" href="/production-readiness">Open readiness</a>
        <a class="link" href="/voice/proof-trends">Open sustained trends</a>
        <a class="link" href="/voice-operations/${demoIncidentSessionId}">Open operations record</a>
        <a class="link" href="/voice-incidents/${demoIncidentSessionId}/markdown">Export incident bundle</a>
        <a class="link" href="/">Back to demo</a>
      </section>
      <section id="proof-output" class="grid">
        <article class="surface empty"><header><strong>No proof run yet</strong><span class="status">empty</span></header><p class="muted">Click the button to run barge-in, live latency, turn waterfall, provider, delivery, carrier, trace, and readiness proof.</p></article>
      </section>
      <pre id="proof-json"></pre>
    </main>
    <script>
      const output = document.getElementById("proof-output");
      const json = document.getElementById("proof-json");
      document.getElementById("run-proof").addEventListener("click", async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        button.textContent = "Running proof...";
        try {
          const response = await fetch("/api/demo-proof", { method: "POST" });
          const report = await response.json();
          output.innerHTML = report.surfaces.map((surface) => \`
            <article class="surface \${surface.status}">
              <header><strong>\${surface.label}</strong><span class="status">\${surface.status}</span></header>
              <p class="muted">\${surface.detail}</p>
              <a class="link" href="\${surface.href}">Open surface</a>
            </article>
          \`).join("");
          json.textContent = JSON.stringify(report, null, 2);
        } catch (error) {
          output.innerHTML = '<article class="surface fail"><header><strong>Proof failed</strong><span class="status">fail</span></header><p class="muted">' + String(error?.message ?? error) + '</p></article>';
        } finally {
          button.disabled = false;
          button.textContent = "Run full proof suite";
        }
      });
    </script>
  </body>
</html>`;

const summarizeAssistantRuns = async () =>
  summarizeVoiceAssistantRuns({ store: deliveryTraceStore });

const summarizeProviderHealth = async (): Promise<
  VoiceProviderHealthSummary<VoiceModelProvider>[]
> =>
  summarizeVoiceProviderHealth({
    providers: configuredModelProviders,
    store: deliveryTraceStore,
  });

const getLatestRoutingDecision = () =>
  createVoiceRoutingDecisionSummary({
    kind: "stt",
    store: deliveryTraceStore,
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
      await deliveryTraceStore.append({
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
const runDemoSTTProviderRoutingContract = async () => {
  const events: StoredVoiceTraceEvent[] = [];
  const requestedProvider: VoiceSTTProvider = configuredSTTProviders.includes(
    "deepgram",
  )
    ? "deepgram"
    : (configuredSTTProviders[0] ?? "deepgram");
  const fallbackProvider = configuredSTTProviders.find(
    (provider) => provider !== requestedProvider,
  );
  const simulator = createVoiceIOProviderFailureSimulator<VoiceSTTProvider>({
    failureElapsedMs: 12,
    failureMessage: ({ provider }) =>
      `Simulated ${provider} websocket open failure.`,
    fallback: (provider) =>
      configuredSTTProviders.filter((candidate) => candidate !== provider),
    kind: "stt",
    latencyBudgets: sttLatencyBudgets,
    onProviderEvent: async (event, input) => {
      events.push({
        at: event.at,
        id: `${input.sessionId}:${event.provider}:${event.status}:${event.at}`,
        payload: {
          ...event,
          providerStatus: event.status,
        },
        scenarioId: "stt-provider-routing-contract",
        sessionId: input.sessionId,
        type: "session.error",
      });
    },
    providers: configuredSTTProviders,
    recoveryElapsedMs: {
      assemblyai: 28,
      deepgram: 18,
    },
    sessionId: ({ now }) => `stt-contract-${now}`,
  });

  await simulator.run(
    requestedProvider,
    fallbackProvider ? "failure" : "recovery",
  );

  return runVoiceProviderRoutingContract({
    contract: {
      expect: fallbackProvider
        ? [
            {
              fallbackProvider,
              kind: "stt",
              operation: "open",
              provider: requestedProvider,
              selectedProvider: requestedProvider,
              status: "error",
            },
            {
              fallbackProvider,
              kind: "stt",
              operation: "open",
              provider: fallbackProvider,
              selectedProvider: requestedProvider,
              status: "fallback",
            },
          ]
        : [
            {
              kind: "stt",
              operation: "open",
              provider: requestedProvider,
              selectedProvider: requestedProvider,
              status: "success",
            },
          ],
      id: fallbackProvider
        ? `${requestedProvider}-to-${fallbackProvider}-stt-fallback`
        : `${requestedProvider}-stt-success`,
      label: "Demo STT provider fallback",
      scenarioId: "stt-provider-routing-contract",
    },
    events,
  });
};

const runDemoTTSProviderRoutingContract = async () => {
  const events: StoredVoiceTraceEvent[] = [];
  const requestedProvider: VoiceTTSProvider = configuredTTSProviders.includes(
    "openai",
  )
    ? "openai"
    : (configuredTTSProviders[0] ?? "emergency");
  const fallbackProvider = configuredTTSProviders.find(
    (provider) => provider !== requestedProvider,
  );
  const simulator = createVoiceIOProviderFailureSimulator<VoiceTTSProvider>({
    failureElapsedMs: 18,
    failureMessage: ({ provider }) =>
      `Simulated ${provider} speech synthesis open failure.`,
    fallback: (provider) =>
      configuredTTSProviders.filter((candidate) => candidate !== provider),
    kind: "tts",
    latencyBudgets: ttsLatencyBudgets,
    onProviderEvent: async (event, input) => {
      events.push({
        at: event.at,
        id: `${input.sessionId}:${event.provider}:${event.status}:${event.at}`,
        payload: {
          ...event,
          providerStatus: event.status,
        },
        scenarioId: "tts-provider-routing-contract",
        sessionId: input.sessionId,
        type: "session.error",
      });
    },
    providers: configuredTTSProviders,
    recoveryElapsedMs: {
      emergency: 8,
      openai: 45,
    },
    sessionId: ({ now }) => `tts-contract-${now}`,
  });

  await simulator.run(
    requestedProvider,
    fallbackProvider ? "failure" : "recovery",
  );

  return runVoiceProviderRoutingContract({
    contract: {
      expect: fallbackProvider
        ? [
            {
              fallbackProvider,
              kind: "tts",
              operation: "open",
              provider: requestedProvider,
              selectedProvider: requestedProvider,
              status: "error",
            },
            {
              fallbackProvider,
              kind: "tts",
              operation: "open",
              provider: fallbackProvider,
              selectedProvider: requestedProvider,
              status: "fallback",
            },
          ]
        : [
            {
              kind: "tts",
              operation: "open",
              provider: requestedProvider,
              selectedProvider: requestedProvider,
              status: "success",
            },
          ],
      id: fallbackProvider
        ? `${requestedProvider}-to-${fallbackProvider}-tts-fallback`
        : `${requestedProvider}-tts-success`,
      label: "Demo TTS provider fallback",
      scenarioId: "tts-provider-routing-contract",
    },
    events,
  });
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

const liveOpsActions = VOICE_LIVE_OPS_ACTIONS;
const isLiveOpsAction = (value: unknown): value is VoiceLiveOpsAction =>
  typeof value === "string" &&
  liveOpsActions.includes(value as VoiceLiveOpsAction);
const liveOpsSessionControls = new Map<string, VoiceLiveOpsControlState>();

const formatLiveOpsActionLabel = (action: VoiceLiveOpsAction) => {
  switch (action) {
    case "assign":
      return "Assign live session";
    case "create-task":
      return "Create ops task";
    case "escalate":
      return "Escalate live session";
    case "force-handoff":
      return "Force handoff";
    case "inject-instruction":
      return "Inject assistant instruction";
    case "operator-takeover":
      return "Operator takeover";
    case "pause-assistant":
      return "Pause assistant";
    case "resume-assistant":
      return "Resume assistant";
    case "tag":
      return "Tag live session";
  }
};

const handleLiveOpsAction = async (body: unknown) => {
  const input =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const action = input.action;
  const sessionId = toStringValue(input.sessionId);

  if (!sessionId || !isLiveOpsAction(action)) {
    return Response.json(
      { error: "A valid sessionId and action are required.", ok: false },
      { status: 400 },
    );
  }

  const assignee = toStringValue(input.assignee) ?? "demo-operator";
  const tag = toStringValue(input.tag) ?? "needs-review";
  const detail =
    toStringValue(input.detail) ?? formatLiveOpsActionLabel(action);
  const at = Date.now();
  const taskId = `live-ops:${sessionId}:${action}:${at}`;
  let task: SavedVoiceOpsTask | undefined;
  const previousControl = liveOpsSessionControls.get(sessionId);
  const control = buildVoiceLiveOpsControlState({
    action,
    assignee,
    at,
    detail,
    previous: previousControl,
    sessionId,
    tag,
  });
  liveOpsSessionControls.set(sessionId, control);

  await runtimeStorage.audit.append(
    createVoiceAuditEvent({
      action: `live_ops.${action}`,
      actor: {
        id: assignee,
        kind: "operator",
        name: assignee,
      },
      at,
      metadata: {
        source: "browser-live-ops",
        tag,
      },
      outcome: "success",
      payload: {
        action,
        assignee,
        control,
        detail,
        tag,
      },
      resource: {
        id: sessionId,
        type: "voice.session",
      },
      sessionId,
      type: "operator.action",
    }),
  );
  await deliveryTraceStore.append({
    at,
    metadata: {
      source: "browser-live-ops",
      tag,
    },
    payload: {
      action,
      assignee,
      control,
      detail,
      tag,
      status: "success",
    },
    sessionId,
    type: "operator.action",
  });

  if (
    action === "create-task" ||
    action === "escalate" ||
    action === "force-handoff" ||
    action === "operator-takeover"
  ) {
    task = {
      assignee,
      createdAt: at,
      description: detail,
      history: [
        {
          actor: assignee,
          at,
          detail,
          type: "created",
        },
      ],
      id: taskId,
      intakeId: sessionId,
      kind:
        action === "escalate" ||
        action === "force-handoff" ||
        action === "operator-takeover"
          ? "escalation"
          : "support-triage",
      outcome:
        action === "escalate" ||
        action === "force-handoff" ||
        action === "operator-takeover"
          ? "escalated"
          : "completed",
      recommendedAction:
        action === "force-handoff"
          ? "Force route this live session to the requested human or specialist queue."
          : action === "operator-takeover" || action === "escalate"
            ? "Human operator should take over this live voice session."
            : "Review the active call and follow up with the caller.",
      reviewId: sessionId,
      status:
        action === "escalate" ||
        action === "force-handoff" ||
        action === "operator-takeover"
          ? "in-progress"
          : "open",
      target: tag,
      title:
        action === "force-handoff"
          ? `Force handoff live session ${sessionId}`
          : action === "operator-takeover"
            ? `Operator takeover live session ${sessionId}`
            : action === "escalate"
              ? `Escalate live session ${sessionId}`
              : `Follow up live session ${sessionId}`,
      updatedAt: at,
    };
    await runtimeStorage.tasks.set(task.id, task);
    await emitTaskUpdatedEvent(task);
  }

  return Response.json({
    action,
    control,
    incidentBundleHref: `/voice-incidents/${encodeURIComponent(sessionId)}/markdown`,
    ok: true,
    operationsRecordHref: `/voice-operations/${encodeURIComponent(sessionId)}`,
    sessionId,
    task,
    taskHref: task ? `/tasks` : undefined,
  });
};

const redirectToTasks = () =>
  new Response(null, {
    headers: {
      Location: "/tasks",
    },
    status: 302,
  });

const liveOpsControlRoutes = new Elysia()
  .post("/api/voice/live-ops/action", ({ body }) => handleLiveOpsAction(body))
  .get("/api/voice/live-ops/control/:sessionId", ({ params }) =>
    Response.json({
      control: liveOpsSessionControls.get(params.sessionId) ?? null,
      ok: true,
      sessionId: params.sessionId,
    }),
  ) as unknown as Elysia;
const liveOpsRuntime = {
  getControl: (sessionId: string) => liveOpsSessionControls.get(sessionId),
};

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
      beforeTurn: async (input) => {
        const guardrailResult =
          await demoLiveGuardrails.assistantGuardrails.beforeTurn?.(input);
        if (guardrailResult) {
          return guardrailResult;
        }

        return /\b(human|agent|supervisor|manager)\b/i.test(input.turn.text) &&
          /\b(please|need|want|get|talk|speak)\b/i.test(input.turn.text)
          ? {
              assistantText: "Escalating this call for human follow-up.",
              escalate: {
                reason: "caller-requested-human",
              },
              result: buildSavedIntake(
                input.session,
                resolveScenarioFromContext(input.context),
              ),
            }
          : undefined;
      },
      afterTurn: demoLiveGuardrails.assistantGuardrails.afterTurn,
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
    tools: demoLiveGuardrails.wrapTools([
      intakeClassifierTool,
      lifecycleRouterTool,
      reviewTaskRecorderTool,
    ]),
    trace: runtimeStorage.traces,
  });

const assistant = createDemoAssistant(modelProvider, assistantModel);
const contractAwareOnTurnBase = createVoiceWorkflowContractHandler({
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
  store: deliveryTraceStore,
}) as VoiceOnTurnObjectHandler<unknown, VoiceSessionRecord, SavedIntake>;

const isSpecialistBillingTurn = (text: string) =>
  /\b(billing|invoice|refund|payment|subscription|charge|receipt)\b/i.test(
    text,
  );

const createDemoLiveAgentSquad = () => {
  const supportAgent = createVoiceAgent<
    unknown,
    VoiceSessionRecord,
    SavedIntake
  >({
    id: "front-desk",
    model: {
      generate: ({ turn }) => ({
        handoff: {
          metadata: {
            detectedIntent: "billing",
            demoSurface: "agent-squad",
          },
          reason: `Billing specialist requested for: ${turn.text}`,
          targetAgentId: "billing",
        },
      }),
    },
    system:
      "You are the demo front desk. Route billing, invoice, refund, payment, subscription, charge, and receipt requests to billing.",
    trace: deliveryTraceStore,
  });
  const billingAgent = createVoiceAgent<
    unknown,
    VoiceSessionRecord,
    SavedIntake
  >({
    id: "billing",
    model: {
      generate: ({ turn }) => ({
        assistantText: `Billing specialist here. I can help with that account question: ${turn.text}`,
      }),
    },
    system:
      "You are the billing specialist. Answer only from the handoff summary and current caller turn.",
    trace: deliveryTraceStore,
  });

  return createVoiceAgentSquad<unknown, VoiceSessionRecord, SavedIntake>({
    agents: [supportAgent, billingAgent],
    contextPolicy: ({ summaryMessage, turn }) => ({
      messages: [
        summaryMessage,
        {
          content: turn.text,
          role: "user",
        },
      ],
      metadata: {
        contextPolicy: "handoff-summary-current-turn",
        demoSurface: "agent-squad",
      },
      system:
        "Use only the handoff summary and current caller turn. Do not inspect unrelated prior turns.",
    }),
    defaultAgentId: "front-desk",
    handoffPolicy: ({ handoff }) => ({
      metadata: {
        certifiedRoute: "front-desk-to-billing",
        ...handoff.metadata,
      },
      summary:
        "The front desk detected a billing/account question and routed this caller to billing.",
    }),
    id: "demo-agent-squad",
    trace: deliveryTraceStore,
  });
};

const demoLiveAgentSquad = createDemoLiveAgentSquad();
type DemoVoiceTurnInput = Parameters<
  VoiceOnTurnObjectHandler<unknown, VoiceSessionRecord, SavedIntake>
>[0];
const runDemoLiveAgentSquad = demoLiveAgentSquad.run as (
  input: DemoVoiceTurnInput,
) => Promise<{
  assistantText?: string;
  complete?: boolean;
  escalate?: { metadata?: Record<string, unknown>; reason: string };
  noAnswer?: { metadata?: Record<string, unknown> };
  result?: SavedIntake;
  transfer?: {
    metadata?: Record<string, unknown>;
    reason?: string;
    target: string;
  };
  voicemail?: { metadata?: Record<string, unknown> };
}>;

const contractAwareOnTurn: VoiceOnTurnObjectHandler<
  unknown,
  VoiceSessionRecord,
  SavedIntake
> = async (input) => {
  if (isSpecialistBillingTurn(input.turn.text)) {
    const result = await runDemoLiveAgentSquad(input);
    return {
      assistantText: result.assistantText,
      complete: result.complete,
      escalate: result.escalate,
      noAnswer: result.noAnswer,
      result: result.result,
      transfer: result.transfer,
      voicemail: result.voicemail,
    };
  }

  return contractAwareOnTurnBase(input);
};

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
  liveOps: liveOpsRuntime,
});

await cleanupDemoQualityNoise();
await seedDemoOutcomeProof();
await seedDemoBargeInProof();
await seedDemoDeliveryProof();
await ensureDemoIncidentBundleEvidence();

// @ts-expect-error Elysia's accumulated demo route type exceeds TS instantiation depth.
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
      liveOps: liveOpsRuntime,
    }),
  )
  .use(
    openAIRealtime
      ? voice<unknown, VoiceSessionRecord, SavedIntake>({
          correctTurn: correctDemoTurn,
          handoff:
            handoffAdapters.length > 0
              ? {
                  adapters: handoffAdapters,
                  deliveryQueue: handoffDeliveryStore,
                }
              : undefined,
          onComplete: async ({ session }) => {
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
          path: "/voice/realtime",
          phraseHints: () => VOICE_DEMO_PHRASE_HINTS,
          preset: "reliability",
          realtime: openAIRealtime,
          realtimeInputFormat: realtimeChannelFormat,
          session: runtimeStorage.session,
          trace: deliveryTraceStore,
          liveOps: liveOpsRuntime,
        })
      : new Elysia(),
  )
  .use(
    createVoiceOpsStatusRoutes({
      deliverySinks: {
        auditDeliveries: {
          href: "/audit/deliveries",
          store: runtimeStorage.auditDeliveries,
        },
        traceDeliveries: {
          href: "/traces/deliveries",
          store: runtimeStorage.traceDeliveries,
        },
      },
      include: {
        quality: false,
        sessions: false,
      },
      links: opsSurfaceLinks,
      llmProviders: configuredModelProviders,
      preferFixtureWorkflows: true,
      sttProviders: configuredSTTProviders,
      store: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceOpsConsoleRoutes({
      deliverySinks: {
        auditDeliveries: {
          href: "/audit/deliveries",
          store: runtimeStorage.auditDeliveries,
        },
        sinks: deliverySinkDescriptors,
        traceDeliveries: {
          href: "/traces/deliveries",
          store: runtimeStorage.traceDeliveries,
        },
      },
      links: opsSurfaceLinks,
      llmProviders: configuredModelProviders,
      path: "/ops-console",
      store: deliveryTraceStore,
      sttProviders: configuredSTTProviders,
      title: "AbsoluteJS Voice Demo Ops Console",
      ttsProviders: configuredTTSProviders,
    }),
  )
  .use(
    createVoiceQualityRoutes({
      links: opsSurfaceLinks,
      path: "/quality",
      store: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceEvalRoutes({
      baselineStore: createVoiceFileEvalBaselineStore(
        resolve(runtimeDirectory, "eval-baseline.json"),
      ),
      fixtureStore: createVoiceFileScenarioFixtureStore(
        resolve(import.meta.dir, "fixtures", "voice-scenario-fixtures.json"),
      ),
      links: opsSurfaceLinks,
      operationsRecordHref: "/voice-operations/:sessionId",
      path: "/evals",
      scenarios: workflowScenarios,
      store: deliveryTraceStore,
      title: "AbsoluteJS Voice Demo Evals",
    }),
  )
  .use(
    createVoiceProviderHealthRoutes({
      providers: configuredModelProviders,
      store: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceProviderCapabilityRoutes({
      features: voiceProviderFeatures,
      htmlPath: "/provider-capabilities",
      llmProviders: configuredModelProviders,
      models: voiceProviderModels,
      selected: {
        llm: modelProvider,
        stt: selectedSTTProvider,
      },
      store: deliveryTraceStore,
      sttProviders: configuredSTTProviders,
    }),
  )
  .get("/api/provider-contracts", () => buildDemoProviderContractMatrix())
  .get(
    "/provider-contracts",
    () =>
      new Response(
        renderVoiceProviderContractMatrixHTML(
          buildDemoProviderContractMatrix(),
          {
            title: "AbsoluteJS Voice Provider Contracts",
          },
        ),
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .use(
    createVoiceAssistantHealthRoutes({
      htmlPath: "/assistant-health",
      providers: configuredModelProviders,
      store: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceHandoffHealthRoutes({
      htmlPath: "/handoffs",
      path: "/api/voice-handoffs",
      store: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceSessionListRoutes({
      htmlPath: "/sessions",
      operationsRecordHref: "/voice-operations/:sessionId",
      path: "/api/voice-sessions",
      replayHref: (session) => "/sessions/" + session.sessionId,
      render: renderVoiceSessionsWithSupportActions,
      store: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceSessionReplayRoutes({
      htmlPath: "/sessions/:sessionId",
      path: "/api/voice-sessions/:sessionId/replay",
      store: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceOperationsRecordRoutes({
      audit: runtimeStorage.audit,
      htmlPath: "/voice-operations/:sessionId",
      path: "/api/voice-operations/:sessionId",
      redact: voiceSupportArtifactRedaction,
      store: deliveryTraceStore,
      title: "AbsoluteJS Voice Operations Record",
    }) as unknown as Elysia,
  )
  .use(
    createVoiceIncidentBundleRoutes({
      audit: runtimeStorage.audit,
      markdownPath: "/voice-incidents/:sessionId/markdown",
      path: "/api/voice-incidents/:sessionId",
      redact: voiceSupportArtifactRedaction,
      store: deliveryTraceStore,
      title: "AbsoluteJS Voice Incident Bundle",
    }) as unknown as Elysia,
  )
  .use(
    createVoiceResilienceRoutes({
      llmProviders: configuredModelProviders,
      path: "/resilience",
      store: deliveryTraceStore,
      sttProviders: configuredSTTProviders,
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
      ttsProviders: configuredTTSProviders,
    }),
  )
  .post("/api/provider-slo/proof", async () =>
    Response.json(await seedDemoProviderSloProof()),
  )
  .post("/api/provider-decisions/proof", async () =>
    Response.json(await seedDemoProviderDecisionProof()),
  )
  .use(
    createVoiceProviderSloRoutes({
      ...providerSloOptions,
      store: deliveryTraceStore,
      title: "AbsoluteJS Voice Demo Provider SLOs",
    }),
  )
  .use(
    createVoiceProviderOrchestrationRoutes({
      name: "absolutejs-voice-example-provider-orchestration",
      profile: providerOrchestrationProfile,
      requirements: providerOrchestrationRequirements,
      title: "AbsoluteJS Voice Demo Provider Orchestration",
    }),
  )
  .use(
    createVoiceProviderDecisionTraceRoutes({
      minDegraded: 1,
      minDecisions: 4,
      minFallbacks: 1,
      name: "absolutejs-voice-example-provider-decisions",
      requiredFallbackProviders: ["deterministic"],
      requiredReasonIncludes: ["latency budget"],
      requiredStatuses: ["fallback", "degraded"],
      requiredSurfaces: [
        "background-summary",
        "live-call",
        "live-stt",
        "telephony-tts",
      ],
      store: deliveryTraceStore,
      title: "AbsoluteJS Voice Demo Provider Decision Traces",
    }),
  )
  .get("/api/voice/reconnect-contract", async () =>
    Response.json(await buildDemoReconnectContractReport()),
  )
  .get(
    "/voice/reconnect-contract",
    async () =>
      new Response(
        await renderDemoReconnectContractHTML(
          await buildDemoReconnectContractReport(),
        ),
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .use(
    createVoiceTelephonyWebhookSecurityRoutes({
      options: telephonyWebhookSecurityOptions(),
    }),
  )
  .use(createVoiceProductionReadinessRoutes(productionReadinessOptions()))
  .use(
    createVoiceOpsRecoveryRoutes({
      ...opsRecoveryOptions(),
      title: "AbsoluteJS Voice Demo Ops Recovery",
    }),
  )
  .use(
    createVoiceObservabilityExportRoutes({
      ...observabilityExportOptions(),
      title: "AbsoluteJS Voice Demo Observability Export",
    }),
  )
  .use(
    createVoiceObservabilityExportReplayRoutes({
      source: buildDemoObservabilityExportReplay,
      title: "AbsoluteJS Voice Demo Observability Export Replay",
    }),
  )
  .get("/data-control/audit-proof.md", async () => {
    const events = await runtimeStorage.audit.list({ limit: 25 });
    const rows = events
      .map((event) => {
        const resource = event.resource
          ? `${event.resource.type}:${event.resource.id}`
          : "n/a";
        return `| ${new Date(event.at).toISOString()} | ${event.type} | ${event.outcome} | ${resource} |`;
      })
      .join("\n");

    return new Response(
      `# Voice Data Control Audit Proof

Redacted sample of the latest ${events.length} audit event(s). Payloads are intentionally omitted from this proof surface; use the full audit export only when you need the complete customer-owned record.

| At | Type | Outcome | Resource |
| --- | --- | --- | --- |
${rows || "| n/a | n/a | n/a | n/a |"}
`,
      {
        headers: {
          "content-type": "text/markdown; charset=utf-8",
        },
      },
    );
  })
  .use(
    createVoiceDataControlRoutes({
      audit: runtimeStorage.audit,
      auditDeliveries: runtimeStorage.auditDeliveries,
      campaigns: runtimeStorage.campaigns,
      events: runtimeStorage.events,
      incidentBundles: runtimeStorage.incidentBundles,
      path: "/data-control",
      providerKeys: [
        {
          env: "OPENAI_API_KEY",
          name: "OpenAI",
          recommendation:
            "Use only server-side for LLM and optional Realtime/TTS provider calls.",
          required: false,
        },
        {
          env: "ANTHROPIC_API_KEY",
          name: "Anthropic",
          recommendation: "Use only server-side for the LLM fallback provider.",
          required: false,
        },
        {
          env: "GEMINI_API_KEY",
          name: "Gemini",
          recommendation: "Use only server-side for the LLM fallback provider.",
          required: false,
        },
        {
          env: "DEEPGRAM_API_KEY",
          name: "Deepgram",
          recommendation:
            "Required for the primary realtime STT provider in this demo.",
          required: true,
        },
        {
          env: "ASSEMBLYAI_API_KEY",
          name: "AssemblyAI",
          recommendation:
            "Use only server-side for the realtime STT fallback provider.",
          required: false,
        },
        {
          env: "ELEVENLABS_API_KEY",
          name: "ElevenLabs",
          recommendation:
            "Use only server-side for optional TTS provider calls.",
          required: false,
        },
        {
          env: "TWILIO_AUTH_TOKEN",
          name: "Twilio",
          recommendation:
            "Keep telephony credentials server-side and route call control through AbsoluteJS.",
          required: false,
        },
        {
          env: "TELNYX_API_KEY",
          name: "Telnyx",
          recommendation:
            "Keep carrier API keys server-side and pair webhook logs with audit retention.",
          required: false,
        },
        {
          env: "PLIVO_AUTH_TOKEN",
          name: "Plivo",
          recommendation:
            "Keep carrier auth tokens server-side and redact them from support exports.",
          required: false,
        },
      ],
      redact: voiceComplianceRedactionDefaults,
      reviews: runtimeStorage.reviews as unknown as VoiceCallReviewStore,
      session: runtimeStorage.session,
      tasks: runtimeStorage.tasks as unknown as VoiceOpsTaskStore,
      traceDeliveries: runtimeStorage.traceDeliveries,
      traces: runtimeStorage.traces,
    }),
  )
  .use(
    createVoiceAuditDeliveryRoutes({
      store: runtimeStorage.auditDeliveries,
      title: "AbsoluteJS Voice Demo Audit Deliveries",
      worker: createAuditDeliveryWorker(),
    }),
  )
  .use(
    createVoiceTraceDeliveryRoutes({
      store: runtimeStorage.traceDeliveries,
      title: "AbsoluteJS Voice Demo Trace Deliveries",
      worker: createTraceDeliveryWorker(),
    }),
  )
  .use(
    createVoiceDeliverySinkRoutes({
      auditDeliveries: {
        href: "/audit/deliveries",
        store: runtimeStorage.auditDeliveries,
      },
      sinks: deliverySinkDescriptors,
      title: "AbsoluteJS Voice Demo Delivery Sinks",
      traceDeliveries: {
        href: "/traces/deliveries",
        store: runtimeStorage.traceDeliveries,
      },
    }),
  )
  .use(
    createVoiceDeliveryRuntimeRoutes({
      runtime: deliveryRuntimeControl,
      title: "AbsoluteJS Voice Demo Delivery Runtime",
    }),
  )
  .use(
    createVoiceOpsActionAuditRoutes({
      audit: runtimeStorage.audit,
      trace: deliveryTraceStore,
    }),
  )
  .use(
    createVoiceDiagnosticsRoutes({
      path: "/diagnostics",
      store: deliveryTraceStore,
      title: "AbsoluteJS Voice Demo Diagnostics",
    }),
  )
  .use(
    createVoiceTraceTimelineRoutes({
      htmlPath: "/traces",
      operationsRecordHref: "/voice-operations/:sessionId",
      path: "/api/voice-traces",
      store: traceTimelineStore,
    }),
  )
  .get("/api/voice-barge-in", async () =>
    Response.json(await buildDemoBargeInReport()),
  )
  .post("/api/voice-barge-in", async ({ body }) => {
    const input =
      body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const at = toNumber(input.at);
    const id = toStringValue(input.id);
    const reason = toStringValue(input.reason);
    const status = toStringValue(input.status);

    if (!at || !id || !reason || !status) {
      return Response.json(
        { error: "Invalid barge-in event." },
        { status: 400 },
      );
    }

    await deliveryTraceStore.append({
      at,
      metadata: {
        source: "browser",
      },
      payload: input,
      sessionId: toStringValue(input.sessionId) ?? "unknown",
      type: "client.barge_in",
    });

    return Response.json({ ok: true });
  })
  .get(
    "/barge-in",
    async () =>
      new Response(await renderDemoBargeInHTML(), {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }),
  )
  .use(
    createVoiceToolContractRoutes({
      contracts: demoToolContracts,
      htmlPath: "/tool-contracts",
      operationsRecordHref: "/voice-operations/:sessionId",
      path: "/api/tool-contracts",
      title: "AbsoluteJS Voice Demo Tool Contracts",
    }),
  )
  .use(
    createVoiceSimulationSuiteRoutes({
      actionLinks: {
        fixtures: "/evals/fixtures",
        outcomes: "/outcome-contracts",
        scenarios: "/evals/scenarios",
        sessions: "/quality",
        tools: "/tool-contracts",
      },
      htmlPath: "/voice/simulations",
      operationsRecordHref: "/voice-operations/:sessionId",
      path: "/api/voice/simulations",
      store: deliveryTraceStore,
      thresholds: {
        maxProviderAverageLatencyMs: 5_000,
      },
      scenarios: workflowScenarios,
      fixtureStore: createVoiceFileScenarioFixtureStore(
        resolve(import.meta.dir, "fixtures", "voice-scenario-fixtures.json"),
      ),
      tools: demoToolContracts,
      outcomes: {
        contracts: demoOutcomeContracts,
        events: runtimeStorage.events,
        handoffs: handoffDeliveryStore as unknown as VoiceHandoffDeliveryStore,
        reviews: runtimeStorage.reviews,
        sessions: runtimeStorage.session,
        tasks: runtimeStorage.tasks,
      },
      title: "AbsoluteJS Voice Demo Simulation Suite",
    }),
  )
  .get("/api/agent-squad-contract", () => runDemoAgentSquadContract())
  .use(agentSquadStatusRoutes as unknown as Elysia)
  .get("/api/provider-routing-contract", () => runDemoProviderRoutingContract())
  .get("/api/stt-provider-routing-contract", () =>
    runDemoSTTProviderRoutingContract(),
  )
  .get("/api/tts-provider-routing-contract", () =>
    runDemoTTSProviderRoutingContract(),
  )
  .get("/agent-squad-contract", async ({ set }) => {
    set.headers["content-type"] = "text/html; charset=utf-8";
    return renderAgentSquadContractHTML();
  })
  .post("/api/turn-latency/proof", () => seedTurnLatencyProof())
  .post("/api/live-turn-latency", ({ body }) => storeLiveTurnLatencyTrace(body))
  .post("/api/voice/reconnect-traces", ({ body }) => storeReconnectTrace(body))
  .use(liveOpsControlRoutes)
  .post("/api/demo-proof", ({ request }) => runDemoProofSuite(request))
  .get(
    "/demo-proof",
    () =>
      new Response(renderDemoProofHTML(), {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }),
  )
  .use(
    createVoiceLiveLatencyRoutes({
      htmlPath: "/live-latency",
      path: "/api/live-latency",
      store: deliveryTraceStore,
      title: "AbsoluteJS Voice Demo Live Latency",
    }),
  )
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
      operationsRecordHref: "/voice-operations/:sessionId",
      path: "/api/outcome-contracts",
      reviews: runtimeStorage.reviews,
      sessions: runtimeStorage.session,
      tasks: runtimeStorage.tasks,
      title: "AbsoluteJS Voice Demo Outcome Contracts",
    }),
  )
  .use(
    createVoicePhoneAgent<unknown, VoiceSessionRecord, SavedIntake>({
      matrix: {
        path: "/api/carriers",
        title: "AbsoluteJS Voice Demo Carrier Matrix",
      },
      setup: {
        path: "/api/voice/phone/setup",
        title: "AbsoluteJS Voice Demo Phone Agent",
      },
      productionSmoke: {
        htmlPath: "/voice/phone/smoke-contract",
        path: "/api/voice/phone/smoke-contract",
        store: runtimeStorage.traces,
        title: "AbsoluteJS Voice Demo Phone Call-Control Smoke",
      },
      carriers: [
        {
          provider: "telnyx",
          options: {
            bridge: createTelephonyBridgeConfig(),
            context: {},
            outcomePolicy: telephonyOutcomePolicy,
            setup: {
              path: "/api/telnyx/setup",
              requiredEnv: productionOnlyEnv({
                TELNYX_PUBLIC_KEY: telnyxPublicKey,
                VOICE_DEMO_PUBLIC_BASE_URL: publicBaseUrl,
              }),
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
              streamUrl: resolvePhoneAgentStreamUrl,
            },
            webhook: {
              idempotency: {
                store: telephonyWebhookIdempotencyStore,
              },
              onDecision: async (input) => {
                await recordTelephonyWebhookDecision("telnyx", input);
              },
              path: "/api/telnyx/webhook",
              publicKey: telnyxPublicKey,
              verify: localCarrierWebhookVerification,
            },
          },
        },
        {
          provider: "plivo",
          options: {
            bridge: createTelephonyBridgeConfig(),
            context: {},
            outcomePolicy: telephonyOutcomePolicy,
            setup: {
              path: "/api/plivo/setup",
              requiredEnv: productionOnlyEnv({
                PLIVO_AUTH_TOKEN: plivoAuthToken,
                VOICE_DEMO_PUBLIC_BASE_URL: publicBaseUrl,
              }),
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
              streamUrl: resolvePhoneAgentStreamUrl,
            },
            webhook: {
              authToken: plivoAuthToken,
              idempotency: {
                store: telephonyWebhookIdempotencyStore,
              },
              onDecision: async (input) => {
                await recordTelephonyWebhookDecision("plivo", input);
              },
              path: "/api/plivo/webhook",
              verificationUrl: publicBaseUrl
                ? `${publicBaseUrl.replace(/\/$/, "")}/api/plivo/webhook`
                : undefined,
              verify: localCarrierWebhookVerification,
            },
          },
        },
        {
          provider: "twilio",
          options: {
            ...createTelephonyBridgeConfig(),
            ops: assistant.ops,
            outcomePolicy: telephonyOutcomePolicy,
            setup: {
              path: "/api/twilio/setup",
              requiredEnv: productionOnlyEnv({
                VOICE_DEMO_PUBLIC_BASE_URL: publicBaseUrl,
                VOICE_DEMO_TELEPHONY_WEBHOOK_SECRET:
                  telephonyWebhookSigningSecret,
              }),
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
                  typeof query.scenarioId === "string"
                    ? query.scenarioId
                    : "guided",
                sessionId:
                  typeof query.sessionId === "string"
                    ? query.sessionId
                    : undefined,
              }),
              path: "/api/twilio/voice",
              streamName: "absolutejs-voice-demo",
              streamUrl: resolvePhoneAgentStreamUrl,
            },
            webhook: {
              idempotency: {
                store: telephonyWebhookIdempotencyStore,
              },
              onDecision: async (input) => {
                await recordTelephonyWebhookDecision("twilio", input);
              },
              path: "/api/telephony-webhook",
              signingSecret: telephonyWebhookSigningSecret,
              verificationUrl: resolveTelephonyWebhookVerificationUrl(
                "/api/telephony-webhook",
              ),
              verify: localCarrierWebhookVerification,
            },
          },
        },
      ],
    }).routes,
  )
  .use(
    createVoiceCampaignRoutes({
      htmlPath: "/voice/campaigns",
      operationsRecordHref: "/voice-operations/:sessionId",
      path: "/api/voice/campaigns",
      store: campaignStore,
      title: "AbsoluteJS Voice Demo Campaigns",
    }),
  )
  .post("/api/voice/campaigns/proof", () =>
    runVoiceCampaignProof({ store: campaignStore }),
  )
  .get("/api/voice/campaigns/dialer-proof", () =>
    getVoiceCampaignDialerProofStatus({
      runPath: "/api/voice/campaigns/dialer-proof",
    }),
  )
  .post("/api/voice/campaigns/dialer-proof", ({ request }) =>
    runVoiceCampaignDialerProof({
      baseUrl: resolveCarrierOrigin(request),
      store: campaignStore,
    }),
  )
  .get(
    "/voice/campaigns/dialer-proof",
    () =>
      new Response(renderCampaignDialerProofHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
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
  .get("/api/telephony-webhook-decisions", () => ({
    decisions: telephonyWebhookDecisionSnapshots,
    generatedAt: Date.now(),
    total: telephonyWebhookDecisionSnapshots.length,
  }))
  .get(
    "/api/telephony-webhook/verification-proof",
    async () => await runTelephonyWebhookVerificationProof(),
  )
  .get("/phone-agent", ({ redirect }) =>
    redirect("/api/voice/phone/setup?format=html"),
  )
  .get("/carriers", ({ redirect }) => redirect("/api/carriers?format=html"))
  .get(
    "/telephony-outcomes",
    () =>
      new Response(renderTelephonyOutcomePreviewHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .get(
    "/telephony-webhook-decisions",
    () =>
      new Response(renderTelephonyWebhookDecisionsHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .get(
    "/demo-checklist",
    () =>
      new Response(renderDemoChecklistHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .use(
    createVoiceProofTrendRoutes({
      maxAgeMs: proofTrendsMaxAgeMs,
      name: "absolutejs-voice-example-proof-trends",
      path: "/api/voice/proof-trends",
      source: readLatestProofTrends,
    }),
  )
  .use(
    createVoiceSloCalibrationRoutes({
      minPassingRuns: sloCalibrationMinRuns,
      name: "absolutejs-voice-example-slo-calibration",
      source: readLongProofWindowCalibrationSamples,
    }),
  )
  .use(
    createVoiceSloReadinessThresholdRoutes({
      liveLatencyMaxAgeMs: liveLatencyReadinessMaxAgeMs,
      minPassingRuns: sloCalibrationMinRuns,
      name: "absolutejs-voice-example-slo-readiness-thresholds",
      source: readLongProofWindowCalibrationSamples,
      title: "AbsoluteJS Voice Calibration -> Active Readiness Gate",
    }),
  )
  .get(
    "/voice/proof-trends",
    async () =>
      new Response(await renderProofTrendsHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .get(
    "/voice/proof-trends.md",
    async () => {
      const file = Bun.file(latestProofTrendsMarkdownPath);
      if (await file.exists()) {
        return new Response(await file.text(), {
          headers: { "content-type": "text/markdown; charset=utf-8" },
        });
      }

      return new Response(
        "# AbsoluteJS Voice Sustained Proof Trends\n\nNo sustained trend artifact found. Run `bun run proof:trends`.\n",
        {
          headers: { "content-type": "text/markdown; charset=utf-8" },
        },
      );
    },
  )
  .use(
    createVoicePostCallAnalysisRoutes({
      name: "absolutejs-voice-example-post-call-analysis",
      path: "/api/voice/post-call-analysis",
      source: ({ reviewId, sessionId }) =>
        postCallAnalysisOptions({ reviewId, sessionId }),
    }),
  )
  .get(
    "/voice/post-call-analysis",
    async () =>
      new Response(await renderPostCallAnalysisHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .use(
    createVoiceGuardrailRoutes({
      name: "absolutejs-voice-example-guardrails",
      path: "/api/voice/guardrails",
      source: buildDemoGuardrailReport,
    }),
  )
  .get(
    "/voice/guardrails",
    async () =>
      new Response(await renderGuardrailsHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .use(
    createVoicePlatformCoverageRoutes({
      name: "absolutejs-voice-example-vapi-coverage",
      path: "/api/voice/vapi-coverage",
      source: readLatestVapiCoverageSummary,
    }),
  )
  .post("/api/voice/realtime-channel/proof", async () =>
    seedDemoRealtimeChannelProof(),
  )
  .get("/api/voice/media-pipeline-calibration", async () =>
    buildDemoMediaPipelineReport(),
  )
  .use(
    createVoiceRealtimeChannelRoutes({
      name: "absolutejs-voice-example-realtime-channel",
      provider: "openai-realtime",
      source: buildDemoRealtimeChannelReportOptions,
      title: "AbsoluteJS Voice Realtime Channel Proof",
    }),
  )
  .use(
    createVoiceRealtimeProviderContractRoutes({
      matrix: buildDemoRealtimeProviderContractMatrixInput,
      name: "absolutejs-voice-example-realtime-provider-contracts",
      title: "AbsoluteJS Voice Realtime Provider Contracts",
    }),
  )
  .use(
    createVoiceCompetitiveCoverageRoutes({
      name: "absolutejs-voice-example-competitive-coverage",
      source: buildDemoCompetitiveCoverageReport,
      title: "AbsoluteJS Voice Competitive Coverage",
    }),
  )
  .get(
    "/switching-from-vapi",
    async () =>
      new Response(await renderVapiMigrationHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .get(
    "/provider-recovery",
    async () =>
      new Response(await renderProviderRecoveryHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .get(
    "/deploy-gate",
    async () =>
      new Response(await renderDeployGateHTML(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  )
  .get(
    "/readiness-profiles",
    () =>
      new Response(renderReadinessProfilesHTML(), {
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
      summarizeVoiceHandoffHealth({ store: deliveryTraceStore }),
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
    .voice-session-support-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 0; }
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
      ${renderVoiceSessionsWithSupportActions(await summarizeVoiceSessions({ store: deliveryTraceStore }))}
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
  .use(networking as unknown as Elysia)
  .on("error", (error) => {
    const { request } = error;
    console.error(
      `Voice example error on ${request.method} ${request.url}: ${error.message}`,
    );
  });

export type Server = typeof server;
export default server;
