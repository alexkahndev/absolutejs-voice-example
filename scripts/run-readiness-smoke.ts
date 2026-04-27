export {};

type EndpointName =
  | "appKit"
  | "bargeIn"
  | "carriers"
  | "handoffs"
  | "productionReadiness"
  | "providerCapabilities"
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
          carriers?: unknown;
          handoffs?: unknown;
          providers?: unknown;
          quality?: unknown;
          routing?: unknown;
          sessions?: unknown;
        };
      };
      return {
        carriers: report.summary?.carriers,
        handoffs: report.summary?.handoffs,
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

const results = await Promise.all(endpoints.map((endpoint) => fetchJson(endpoint)));
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
