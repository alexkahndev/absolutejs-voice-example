export {};

type EndpointName =
  | "agentSquadContract"
  | "appKit"
  | "bargeIn"
  | "campaignProof"
  | "campaigns"
  | "carriers"
  | "handoffs"
  | "liveLatency"
  | "phoneAgent"
  | "productionReadiness"
  | "providerCapabilities"
  | "providerRoutingContract"
  | "simulationSuite"
  | "sttProviderRoutingContract"
  | "telephonyWebhookDecisions"
  | "ttsProviderRoutingContract"
  | "turnLatency"
  | "voiceTraces";

type EndpointResult = {
  elapsedMs: number;
  error?: string;
  name: EndpointName;
  ok: boolean;
  status?: number;
  summary?: Record<string, unknown>;
  url: string;
};

const baseUrl = (
  process.env.VOICE_DEMO_URL ??
  `http://127.0.0.1:${process.env.PORT ?? "3004"}`
).replace(/\/$/, "");
const timeoutMs = Number(process.env.VOICE_READINESS_SMOKE_TIMEOUT_MS ?? 8_000);
const strict = process.env.VOICE_READINESS_SMOKE_STRICT === "true";

const endpoints: Array<{
  name: EndpointName;
  path: string;
  summarize: (body: unknown) => Record<string, unknown>;
}> = [
  {
    name: "productionReadiness",
    path: "/api/production-readiness",
    summarize: (body) => {
      const report = body as {
        status?: unknown;
        summary?: {
          agentSquadContracts?: unknown;
          carriers?: unknown;
          handoffs?: unknown;
          liveLatency?: unknown;
          providerRoutingContracts?: unknown;
          providers?: unknown;
          quality?: unknown;
          routing?: unknown;
          sessions?: unknown;
        };
      };
      return {
        agentSquadContracts: report.summary?.agentSquadContracts,
        carriers: report.summary?.carriers,
        handoffs: report.summary?.handoffs,
        liveLatency: report.summary?.liveLatency,
        providerRoutingContracts: report.summary?.providerRoutingContracts,
        providers: report.summary?.providers,
        quality: report.summary?.quality,
        readinessStatus: report.status,
        routing: report.summary?.routing,
        sessions: report.summary?.sessions,
      };
    },
  },
  {
    name: "carriers",
    path: "/api/carriers",
    summarize: (body) => {
      const matrix = body as {
        pass?: unknown;
        summary?: unknown;
      };
      return {
        carrierPass: matrix.pass,
        carrierSummary: matrix.summary,
      };
    },
  },
  {
    name: "phoneAgent",
    path: "/api/voice/phone/setup",
    summarize: (body) => {
      const report = body as {
        lifecycleStages?: unknown[];
        matrix?: {
          pass?: unknown;
          summary?: unknown;
        };
        ready?: unknown;
      };
      return {
        lifecycleStages: Array.isArray(report.lifecycleStages)
          ? report.lifecycleStages.length
          : undefined,
        phoneAgentReady: report.ready,
        phoneAgentMatrixPass: report.matrix?.pass,
        phoneAgentMatrixSummary: report.matrix?.summary,
      };
    },
  },
  {
    name: "agentSquadContract",
    path: "/api/agent-squad-contract",
    summarize: (body) => {
      const report = body as {
        issues?: unknown[];
        pass?: unknown;
        turns?: Array<{
          agentId?: unknown;
          handoffs?: unknown[];
          outcome?: unknown;
          pass?: unknown;
        }>;
      };
      const firstTurn = report.turns?.[0];
      const handoffs = report.turns?.flatMap((turn) =>
        Array.isArray(turn.handoffs) ? turn.handoffs : [],
      );
      return {
        agentSquadContractPass: report.pass,
        blockedHandoffs: handoffs?.filter(
          (handoff) =>
            handoff &&
            typeof handoff === "object" &&
            "status" in handoff &&
            handoff.status === "blocked",
        ).length,
        finalAgentId: firstTurn?.agentId,
        firstTurnHandoffs: Array.isArray(firstTurn?.handoffs)
          ? firstTurn.handoffs.length
          : undefined,
        firstTurnOutcome: firstTurn?.outcome,
        issueCount: Array.isArray(report.issues) ? report.issues.length : 0,
        turnCount: Array.isArray(report.turns) ? report.turns.length : 0,
      };
    },
  },
  {
    name: "providerRoutingContract",
    path: "/api/provider-routing-contract",
    summarize: (body) => {
      const report = body as {
        contractId?: unknown;
        events?: unknown[];
        issues?: unknown[];
        pass?: unknown;
      };
      return {
        contractId: report.contractId,
        eventCount: Array.isArray(report.events) ? report.events.length : 0,
        issueCount: Array.isArray(report.issues) ? report.issues.length : 0,
        providerRoutingContractPass: report.pass,
      };
    },
  },
  {
    name: "sttProviderRoutingContract",
    path: "/api/stt-provider-routing-contract",
    summarize: (body) => {
      const report = body as {
        contractId?: unknown;
        events?: unknown[];
        issues?: unknown[];
        pass?: unknown;
      };
      return {
        contractId: report.contractId,
        eventCount: Array.isArray(report.events) ? report.events.length : 0,
        issueCount: Array.isArray(report.issues) ? report.issues.length : 0,
        sttProviderRoutingContractPass: report.pass,
      };
    },
  },
  {
    name: "ttsProviderRoutingContract",
    path: "/api/tts-provider-routing-contract",
    summarize: (body) => {
      const report = body as {
        contractId?: unknown;
        events?: unknown[];
        issues?: unknown[];
        pass?: unknown;
      };
      return {
        contractId: report.contractId,
        eventCount: Array.isArray(report.events) ? report.events.length : 0,
        issueCount: Array.isArray(report.issues) ? report.issues.length : 0,
        ttsProviderRoutingContractPass: report.pass,
      };
    },
  },
  {
    name: "campaigns",
    path: "/api/voice/campaigns",
    summarize: (body) => {
      const report = body as {
        campaigns?: unknown[];
        summary?: {
          attempts?: { total?: unknown };
          campaigns?: { total?: unknown };
          recipients?: { total?: unknown };
        };
      };
      return {
        attempts: report.summary?.attempts?.total,
        campaignCount: Array.isArray(report.campaigns)
          ? report.campaigns.length
          : report.summary?.campaigns?.total,
        recipients: report.summary?.recipients?.total,
      };
    },
  },
  {
    name: "telephonyWebhookDecisions",
    path: "/api/telephony-webhook-decisions",
    summarize: (body) => {
      const report = body as {
        decisions?: Array<{
          action?: unknown;
          provider?: unknown;
        }>;
        total?: unknown;
      };
      const actions = new Set<string>();
      const providers = new Set<string>();
      for (const decision of report.decisions ?? []) {
        if (typeof decision.action === "string") {
          actions.add(decision.action);
        }
        if (typeof decision.provider === "string") {
          providers.add(decision.provider);
        }
      }

      return {
        actions: [...actions].sort(),
        providers: [...providers].sort(),
        total: report.total,
      };
    },
  },
  {
    name: "providerCapabilities",
    path: "/api/provider-capabilities",
    summarize: (body) => {
      const report = body as {
        capabilities?: unknown[];
        selected?: unknown;
        total?: unknown;
      };
      return {
        capabilityCount: Array.isArray(report.capabilities)
          ? report.capabilities.length
          : report.total,
        selected: report.selected,
      };
    },
  },
  {
    name: "handoffs",
    path: "/api/voice-handoffs",
    summarize: (body) => {
      const summary = body as {
        failed?: unknown;
        total?: unknown;
      };
      return {
        failed: summary.failed,
        total: summary.total,
      };
    },
  },
  {
    name: "voiceTraces",
    path: "/api/voice-traces",
    summarize: (body) => {
      const report = body as {
        failed?: unknown;
        total?: unknown;
        warnings?: unknown;
      };
      return {
        failed: report.failed,
        total: report.total,
        warnings: report.warnings,
      };
    },
  },
  {
    name: "turnLatency",
    path: "/api/turn-latency",
    summarize: (body) => {
      const report = body as {
        averageTotalMs?: unknown;
        failed?: unknown;
        status?: unknown;
        total?: unknown;
        warnings?: unknown;
      };
      return {
        averageTotalMs: report.averageTotalMs,
        failed: report.failed,
        status: report.status,
        total: report.total,
        warnings: report.warnings,
      };
    },
  },
  {
    name: "simulationSuite",
    path: "/api/voice/simulations",
    summarize: (body) => {
      const report = body as {
        actions?: unknown[];
        failed?: unknown;
        status?: unknown;
        summary?: unknown;
        total?: unknown;
      };
      return {
        actions: Array.isArray(report.actions) ? report.actions.length : 0,
        failed: report.failed,
        status: report.status,
        summary: report.summary,
        total: report.total,
      };
    },
  },
  {
    name: "liveLatency",
    path: "/api/live-latency",
    summarize: (body) => {
      const report = body as {
        averageLatencyMs?: unknown;
        failed?: unknown;
        p50LatencyMs?: unknown;
        p95LatencyMs?: unknown;
        status?: unknown;
        total?: unknown;
        warnings?: unknown;
      };
      return {
        averageLatencyMs: report.averageLatencyMs,
        failed: report.failed,
        p50LatencyMs: report.p50LatencyMs,
        p95LatencyMs: report.p95LatencyMs,
        status: report.status,
        total: report.total,
        warnings: report.warnings,
      };
    },
  },
  {
    name: "bargeIn",
    path: "/api/voice-barge-in",
    summarize: (body) => {
      const report = body as {
        averageLatencyMs?: unknown;
        failed?: unknown;
        status?: unknown;
        total?: unknown;
      };
      return {
        averageLatencyMs: report.averageLatencyMs,
        failed: report.failed,
        status: report.status,
        total: report.total,
      };
    },
  },
  {
    name: "appKit",
    path: "/app-kit/status",
    summarize: (body) => {
      const status = body as {
        failed?: unknown;
        passed?: unknown;
        status?: unknown;
        total?: unknown;
      };
      return {
        appKitStatus: status.status,
        failed: status.failed,
        passed: status.passed,
        total: status.total,
      };
    },
  },
];

const fetchJson = async (
  endpoint: (typeof endpoints)[number],
): Promise<EndpointResult> => {
  const url = `${baseUrl}${endpoint.path}`;
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
      signal: controller.signal,
    });
    const text = await response.text();
    const body = text ? (JSON.parse(text) as unknown) : undefined;

    return {
      elapsedMs: Math.round(performance.now() - startedAt),
      name: endpoint.name,
      ok: response.ok,
      status: response.status,
      summary: endpoint.summarize(body),
      url,
    };
  } catch (error) {
    return {
      elapsedMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
      name: endpoint.name,
      ok: false,
      url,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const postCampaignProof = async (): Promise<EndpointResult> => {
  const url = `${baseUrl}/api/voice/campaigns/proof`;
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
    });
    const body = (await response.json()) as {
      final?: {
        attempts?: unknown[];
        recipients?: unknown[];
      };
      summary?: unknown;
      tick?: {
        attempted?: unknown;
      };
    };

    return {
      elapsedMs: Math.round(performance.now() - startedAt),
      name: "campaignProof",
      ok: response.ok,
      status: response.status,
      summary: {
        attempts: Array.isArray(body.final?.attempts)
          ? body.final?.attempts.length
          : undefined,
        recipients: Array.isArray(body.final?.recipients)
          ? body.final?.recipients.length
          : undefined,
        tickAttempted: body.tick?.attempted,
      },
      url,
    };
  } catch (error) {
    return {
      elapsedMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
      name: "campaignProof",
      ok: false,
      url,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const results = await Promise.all(endpoints.map((endpoint) => fetchJson(endpoint)));
results.push(await postCampaignProof());
const readinessStatus = results.find(
  (result) => result.name === "productionReadiness",
)?.summary?.readinessStatus;
const endpointOk = results.every((result) => result.ok);
const readinessOk =
  !strict || (readinessStatus === "pass" || readinessStatus === undefined);
const ok = endpointOk && readinessOk;

console.log(
  JSON.stringify(
    {
      baseUrl,
      endpointOk,
      ok,
      readinessStatus,
      results,
      strict,
    },
    null,
    2,
  ),
);

if (!ok) {
  process.exit(1);
}
