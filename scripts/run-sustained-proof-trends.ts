export {};

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

type JsonRecord = Record<string, unknown>;

type TrendCycle = {
  at: string;
  cycle: number;
  liveLatency?: TrendMetric;
  ok: boolean;
  opsRecovery?: {
    issues?: number;
    status?: string;
  };
  productionReadiness?: {
    failingChecks?: Array<{
      detail?: string;
      label?: string;
      status?: string;
    }>;
    status?: string;
  };
  providerSlo?: {
    events?: number;
    eventsWithLatency?: number;
    issues?: number;
    kinds: Record<string, TrendMetric & { status?: string }>;
    status?: string;
  };
  turnLatency?: TrendMetric & {
    status?: string;
    total?: number;
  };
};

type TrendMetric = {
  averageMs?: number;
  p50Ms?: number;
  p95Ms?: number;
  samples?: number;
};

const baseUrl = (
  process.env.VOICE_DEMO_URL ?? `http://127.0.0.1:${process.env.PORT ?? "3004"}`
).replace(/\/$/, "");
const cycles = Math.max(1, Number(process.env.VOICE_TREND_CYCLES ?? 6));
const intervalMs = Math.max(0, Number(process.env.VOICE_TREND_INTERVAL_MS ?? 750));
const liveLatencySamplesPerCycle = Math.max(
  1,
  Number(process.env.VOICE_TREND_LIVE_SAMPLES_PER_CYCLE ?? 50),
);
const waitTimeoutMs = Number(process.env.VOICE_TREND_SERVER_WAIT_MS ?? 30_000);
const pollMs = Number(process.env.VOICE_TREND_SERVER_POLL_MS ?? 500);
const outputRoot =
  process.env.VOICE_TREND_OUTPUT_DIR ?? ".voice-runtime/proof-trends";
const runId = new Date().toISOString().replaceAll(":", "-");
const outputDir = join(outputRoot, runId);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRecord = (value: unknown): value is JsonRecord =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const readNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const readArray = (value: unknown) => (Array.isArray(value) ? value : []);

const readMetric = (record: JsonRecord | undefined, keys: string[]) => {
  if (!record) {
    return undefined;
  }
  for (const key of keys) {
    const value = readNumber(record[key]);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
};

const readMetricActual = (record: JsonRecord | undefined, key: string) => {
  const direct = readNumber(record?.[key]);
  if (direct !== undefined) {
    return direct;
  }
  const metric = record && isRecord(record[key]) ? record[key] : undefined;
  return readNumber(metric?.actual);
};

const percentile = (values: number[], percentileValue: number) => {
  if (values.length === 0) {
    return undefined;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((percentileValue / 100) * sorted.length) - 1),
  );
  return sorted[index];
};

const fetchJson = async (
  path: string,
  init: RequestInit = {},
): Promise<JsonRecord> => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      accept: "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  const body = await response.json();
  return isRecord(body) ? body : {};
};

const pingServer = async () => {
  await fetchJson("/api/production-readiness");
};

const isServerRunning = async () => {
  try {
    await pingServer();
    return true;
  } catch {
    return false;
  }
};

const waitForServer = async (server?: ReturnType<typeof Bun.spawn>) => {
  const deadline = Date.now() + waitTimeoutMs;
  let lastError = "Server did not respond.";
  let serverExited = false;
  let serverExitCode: number | undefined;

  if (server) {
    void server.exited.then((exitCode) => {
      serverExited = true;
      serverExitCode = exitCode;
    });
  }

  while (Date.now() < deadline) {
    if (serverExited) {
      throw new Error(
        `Dev server exited before trends could run with code ${serverExitCode ?? "unknown"}: ${lastError}`,
      );
    }

    try {
      await pingServer();
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await Promise.race([
      sleep(pollMs),
      server?.exited.then((exitCode) => {
        serverExited = true;
        serverExitCode = exitCode;
      }),
    ]);
  }

  throw new Error(`Timed out waiting for ${baseUrl}: ${lastError}`);
};

const seedLiveLatencySamples = async (cycle: number) => {
  const now = Date.now();
  await Promise.all(
    Array.from({ length: liveLatencySamplesPerCycle }, (_, index) => {
      const latencyMs = 280 + cycle * 11 + index * 5;
      const startedAt = now - latencyMs;
      return fetchJson("/api/live-turn-latency", {
        body: JSON.stringify({
          assistantTextAt: now,
          completedAt: now,
          id: `trend-live-latency-${runId}-${cycle}-${index}`,
          latencyMs,
          sessionId: `trend-live-latency-${runId}-${cycle}`,
          startedAt,
          status: latencyMs <= 800 ? "pass" : "warn",
          thresholdMs: 800,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
    }),
  );
};

const seedCycle = async (cycle: number) => {
  await Promise.all([
    fetchJson("/api/turn-latency/proof", { method: "POST" }),
    fetchJson("/api/turn-latency/proof", { method: "POST" }),
    fetchJson("/api/provider-slo/proof", { method: "POST" }),
    seedLiveLatencySamples(cycle),
  ]);
};

const summarizeProviderSlo = (body: JsonRecord) => {
  const kinds = isRecord(body.kinds) ? body.kinds : {};
  return {
    events: readNumber(body.events),
    eventsWithLatency: readNumber(body.eventsWithLatency),
    issues: readArray(body.issues).length,
    kinds: Object.fromEntries(
      ["llm", "stt", "tts"].map((kind) => {
        const row = isRecord(kinds[kind]) ? kinds[kind] : {};
        const metrics = isRecord(row.metrics) ? row.metrics : row;
        return [
          kind,
          {
            averageMs:
              readMetric(row, ["averageMs"]) ??
              readMetricActual(metrics, "averageElapsedMs"),
            p50Ms:
              readMetric(row, ["p50Ms"]) ?? readMetricActual(metrics, "p50ElapsedMs"),
            p95Ms:
              readMetric(row, ["p95Ms"]) ?? readMetricActual(metrics, "p95ElapsedMs"),
            samples: readMetric(row, ["eventsWithLatency", "samples"]),
            status: typeof row.status === "string" ? row.status : undefined,
          },
        ];
      }),
    ),
    status: typeof body.status === "string" ? body.status : undefined,
  };
};

const summarizeTurnLatency = (body: JsonRecord) => {
  const totals = readArray(body.turns)
    .map((turn) => (isRecord(turn) ? readNumber(turn.totalMs) : undefined))
    .filter((value): value is number => value !== undefined);

  return {
    averageMs:
      readMetric(body, ["averageTotalMs", "averageMs"]) ??
      (totals.length
        ? Math.round(totals.reduce((total, value) => total + value, 0) / totals.length)
        : undefined),
    p50Ms: readMetric(body, ["p50TotalMs", "p50Ms"]) ?? percentile(totals, 50),
    p95Ms: readMetric(body, ["p95TotalMs", "p95Ms"]) ?? percentile(totals, 95),
    samples: readMetric(body, ["total", "samples"]),
    status: typeof body.status === "string" ? body.status : undefined,
    total: readNumber(body.total),
  };
};

const summarizeLiveLatency = (body: JsonRecord) => ({
  averageMs: readMetric(body, ["averageLatencyMs", "averageMs"]),
  p50Ms: readMetric(body, ["p50LatencyMs", "p50Ms"]),
  p95Ms: readMetric(body, ["p95LatencyMs", "p95Ms"]),
  samples: readMetric(body, ["total", "samples"]),
});

const runCycle = async (cycle: number): Promise<TrendCycle> => {
  await seedCycle(cycle);
  const [
    providerSlo,
    turnLatency,
    liveLatency,
    opsRecovery,
    productionReadiness,
  ] = await Promise.all([
    fetchJson("/api/voice/provider-slos"),
    fetchJson("/api/turn-latency"),
    fetchJson("/api/live-latency"),
    fetchJson("/api/voice/ops-recovery"),
    fetchJson("/api/production-readiness"),
  ]);

  const summarizedProviderSlo = summarizeProviderSlo(providerSlo);
  const summarizedTurnLatency = summarizeTurnLatency(turnLatency);
  const summarizedLiveLatency = summarizeLiveLatency(liveLatency);
  const opsIssues = readArray(opsRecovery.issues).length;
  const readinessStatus =
    typeof productionReadiness.status === "string"
      ? productionReadiness.status
      : undefined;
  const failingReadinessChecks = readArray(productionReadiness.checks)
    .filter(
      (check): check is JsonRecord =>
        isRecord(check) && check.status !== "pass",
    )
    .map((check) => ({
      detail: typeof check.detail === "string" ? check.detail : undefined,
      label: typeof check.label === "string" ? check.label : undefined,
      status: typeof check.status === "string" ? check.status : undefined,
    }));
  const providerIssues = summarizedProviderSlo.issues ?? 0;

  return {
    at: new Date().toISOString(),
    cycle,
    liveLatency: summarizedLiveLatency,
    ok:
      readinessStatus === "pass" &&
      summarizedProviderSlo.status === "pass" &&
      summarizedTurnLatency.status === "pass" &&
      opsIssues === 0 &&
      providerIssues === 0,
    opsRecovery: {
      issues: opsIssues,
      status: typeof opsRecovery.status === "string" ? opsRecovery.status : undefined,
    },
    productionReadiness: {
      failingChecks: failingReadinessChecks,
      status: readinessStatus,
    },
    providerSlo: summarizedProviderSlo,
    turnLatency: summarizedTurnLatency,
  };
};

const maxOf = <T>(items: T[], read: (item: T) => number | undefined) => {
  const values = items.map(read).filter((value): value is number => value !== undefined);
  return values.length ? Math.max(...values) : undefined;
};

const lastOf = <T>(items: T[]) => items.at(-1);

const renderMs = (value?: number) => (value === undefined ? "n/a" : `${Math.round(value)}ms`);

const renderMarkdown = (cycles: TrendCycle[]) => {
  const latest = lastOf(cycles);
  const ok = cycles.every((cycle) => cycle.ok);
  const maxTurnP95 = maxOf(cycles, (cycle) => cycle.turnLatency?.p95Ms);
  const maxLiveP95 = maxOf(cycles, (cycle) => cycle.liveLatency?.p95Ms);
  const maxProviderP95 = maxOf(cycles, (cycle) =>
    maxOf(
      Object.values(cycle.providerSlo?.kinds ?? {}).map((kind) => ({ kind })),
      (entry) => entry.kind.p95Ms,
    ),
  );

  const rows = cycles
    .map(
      (cycle) =>
        `| ${cycle.cycle} | ${cycle.ok ? "pass" : "fail"} | ${cycle.productionReadiness?.status ?? "n/a"} | ${cycle.providerSlo?.status ?? "n/a"} | ${renderMs(cycle.turnLatency?.p95Ms)} | ${renderMs(cycle.liveLatency?.p95Ms)} | ${cycle.opsRecovery?.issues ?? 0} |`,
    )
    .join("\n");

  return `# AbsoluteJS Voice Sustained Proof Trends

Generated: ${new Date().toISOString()}

Overall: **${ok ? "pass" : "fail"}**

Cycles: ${cycles.length}

Latest readiness: ${latest?.productionReadiness?.status ?? "n/a"}

Max turn p95: ${renderMs(maxTurnP95)}

Max live p95: ${renderMs(maxLiveP95)}

Max provider p95: ${renderMs(maxProviderP95)}

| Cycle | Status | Readiness | Provider SLO | Turn p95 | Live p95 | Ops issues |
| ---: | --- | --- | --- | ---: | ---: | ---: |
${rows}
`;
};

let server: ReturnType<typeof Bun.spawn> | undefined;
let exitCode = 0;

try {
  if (await isServerRunning()) {
    console.log(`Reusing running demo server at ${baseUrl}.`);
  } else {
    server = Bun.spawn(["bun", "run", "dev"], {
      env: {
        ...process.env,
        PORT: process.env.PORT ?? "3004",
      },
      stderr: "inherit",
      stdout: "inherit",
    });
  }

  await waitForServer(server);
  await mkdir(outputDir, { recursive: true });

  const trendCycles: TrendCycle[] = [];
  for (let cycle = 1; cycle <= cycles; cycle += 1) {
    const result = await runCycle(cycle);
    trendCycles.push(result);
    console.log(
      `cycle ${cycle}/${cycles}: ${result.ok ? "pass" : "fail"} provider=${result.providerSlo?.status ?? "n/a"} turnP95=${renderMs(result.turnLatency?.p95Ms)} liveP95=${renderMs(result.liveLatency?.p95Ms)}`,
    );
    if (cycle < cycles && intervalMs > 0) {
      await sleep(intervalMs);
    }
  }

  const output = {
    baseUrl,
    cycles: trendCycles,
    generatedAt: new Date().toISOString(),
    ok: trendCycles.every((cycle) => cycle.ok),
    outputDir,
    runId,
    summary: {
      cycles: trendCycles.length,
      maxLiveP95Ms: maxOf(trendCycles, (cycle) => cycle.liveLatency?.p95Ms),
      maxProviderP95Ms: maxOf(trendCycles, (cycle) =>
        maxOf(
          Object.values(cycle.providerSlo?.kinds ?? {}).map((kind) => ({ kind })),
          (entry) => entry.kind.p95Ms,
        ),
      ),
      maxTurnP95Ms: maxOf(trendCycles, (cycle) => cycle.turnLatency?.p95Ms),
    },
  };

  await writeFile(
    join(outputDir, "proof-trends.json"),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  await writeFile(join(outputDir, "proof-trends.md"), renderMarkdown(trendCycles));
  await mkdir(outputRoot, { recursive: true });
  await writeFile(
    join(outputRoot, "latest.json"),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  await writeFile(join(outputRoot, "latest.md"), renderMarkdown(trendCycles));

  if (!output.ok) {
    exitCode = 1;
  }

  console.log(JSON.stringify(output, null, 2));
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.message : String(error));
} finally {
  if (server) {
    server.kill();
    await Promise.race([server.exited, sleep(2_000)]);
  }
}

process.exit(exitCode);
