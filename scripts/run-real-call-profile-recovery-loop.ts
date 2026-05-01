export {};

type RecoveryAction = {
  href?: string;
  id?: string;
  label?: string;
  method?: string;
  profileId?: string;
  sourceCheckLabel?: string;
};

type RecoveryActionStartResponse = {
  jobId?: string;
  jobStatus?: string;
  message?: string;
};

type RecoveryActionStart = RecoveryActionStartResponse & {
  action: RecoveryAction;
};

type RecoveryJob = {
  completedAt?: string;
  error?: string;
  id?: string;
  message?: string;
  startedAt?: string;
  status?: string;
};

type RecoveryJobResponse = {
  job?: RecoveryJob;
  ok?: boolean;
};

type ReadinessCheck = {
  detail?: string;
  label?: string;
  status?: string;
  value?: unknown;
};

const baseUrl = (
  process.env.VOICE_DEMO_URL ?? `http://127.0.0.1:${process.env.PORT ?? "3004"}`
).replace(/\/$/, "");
const port = process.env.PORT ?? "3004";
const waitTimeoutMs = Number(
  process.env.VOICE_RECOVERY_LOOP_SERVER_WAIT_MS ?? 30_000,
);
const serverPollMs = Number(
  process.env.VOICE_RECOVERY_LOOP_SERVER_POLL_MS ?? 500,
);
const jobPollMs = Number(process.env.VOICE_RECOVERY_LOOP_JOB_POLL_MS ?? 1_200);
const jobTimeoutMs = Number(
  process.env.VOICE_RECOVERY_LOOP_JOB_TIMEOUT_MS ?? 600_000,
);
const requestTimeoutMs = Number(
  process.env.VOICE_RECOVERY_LOOP_REQUEST_TIMEOUT_MS ?? 5_000,
);
const useExistingServer =
  process.env.VOICE_RECOVERY_LOOP_USE_EXISTING_SERVER === "1";
const runtimeDir =
  process.env.VOICE_DEMO_RUNTIME_DIR ??
  `.voice-runtime/recovery-loop/runtime/${new Date()
    .toISOString()
    .replaceAll(":", "-")}`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toAbsoluteUrl = (href: string) => new URL(href, baseUrl).toString();

const parseJson = async <Value>(response: Response): Promise<Value> => {
  const text = await response.text();
  try {
    return JSON.parse(text) as Value;
  } catch (error) {
    throw new Error(
      `Expected JSON from ${response.url}, got: ${text.slice(0, 300)}`,
      { cause: error },
    );
  }
};

const fetchJson = async <Value>(
  href: string,
  init?: RequestInit,
): Promise<Value> => {
  const response = await fetch(toAbsoluteUrl(href), {
    headers: { accept: "application/json", ...init?.headers },
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(requestTimeoutMs),
  });

  if (!response.ok) {
    throw new Error(`${href} returned HTTP ${response.status}.`);
  }

  return parseJson<Value>(response);
};

const pingServer = async () => {
  await fetchJson<unknown>("/api/production-readiness");
};

const isServerRunning = async () => {
  try {
    await pingServer();
    return true;
  } catch {
    return false;
  }
};

const startServer = (): ReturnType<typeof Bun.spawn> =>
  Bun.spawn(["bun", "run", "dev"], {
    env: {
      ...process.env,
      PORT: port,
      VOICE_DEMO_RUNTIME_DIR: runtimeDir,
      VOICE_REAL_CALL_PROFILES_ROOT: `${runtimeDir}/real-call-profiles`,
    },
    stderr: "inherit",
    stdout: "inherit",
  });

const waitForServer = async (server?: ReturnType<typeof Bun.spawn>) => {
  const deadline = Date.now() + waitTimeoutMs;
  let lastError = "Server did not respond.";
  let serverExitCode: number | undefined;
  let serverExited = false;

  if (server) {
    void server.exited.then((exitCode) => {
      serverExitCode = exitCode;
      serverExited = true;
    });
  }

  while (Date.now() < deadline) {
    if (serverExited) {
      throw new Error(
        `Dev server exited with code ${serverExitCode ?? "unknown"} before recovery loop could run: ${lastError}`,
      );
    }

    try {
      await pingServer();
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await Promise.race([
      sleep(serverPollMs),
      server?.exited.then((exitCode) => {
        serverExitCode = exitCode;
        serverExited = true;
      }),
    ]);
  }

  throw new Error(
    `Timed out waiting ${waitTimeoutMs}ms for ${baseUrl}: ${lastError}`,
  );
};

const stopServer = async (server: ReturnType<typeof Bun.spawn> | undefined) => {
  if (!server) {
    return;
  }

  server.kill();
  await Promise.race([server.exited, sleep(2_000)]);
};

const getRecoveryActions = async () => {
  const body = await fetchJson<{ actions?: RecoveryAction[] }>(
    "/api/production-readiness/recovery-actions",
  );
  return body.actions ?? [];
};

const isRealCallProfilePostAction = (action: RecoveryAction) =>
  action.method?.toUpperCase() === "POST" &&
  action.sourceCheckLabel === "Real-call profile history" &&
  typeof action.href === "string" &&
  action.href.length > 0;

const getUniqueActions = (actions: RecoveryAction[]) => {
  const seen = new Set<string>();
  return actions.filter((action) => {
    const key = `${action.method?.toUpperCase() ?? "GET"} ${action.href}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const runRecoveryAction = async (
  action: RecoveryAction,
): Promise<RecoveryActionStart> => {
  if (!action.href) {
    throw new Error("Recovery action is missing href.");
  }

  const body = await fetchJson<RecoveryActionStartResponse>(action.href, {
    method: "POST",
  });
  return { action, ...body };
};

const pollJob = async (jobId: string): Promise<RecoveryJob> => {
  const deadline = Date.now() + jobTimeoutMs;

  while (Date.now() < deadline) {
    const body = await fetchJson<RecoveryJobResponse>(
      `/api/voice/real-call-profile-history/actions/${jobId}`,
    );
    const job = body.job;

    if (!job) {
      throw new Error(`Recovery job ${jobId} was not found.`);
    }

    if (job.status === "pass" || job.status === "fail") {
      return job;
    }

    await sleep(jobPollMs);
  }

  throw new Error(
    `Timed out waiting ${jobTimeoutMs}ms for recovery job ${jobId}.`,
  );
};

const getRealCallProfileCheck = async (input: { fresh?: boolean } = {}) => {
  const cacheBuster = input.fresh
    ? `?voiceRecoveryLoopFresh=${Date.now()}`
    : "";
  const readiness = await fetchJson<{ checks?: ReadinessCheck[] }>(
    `/api/production-readiness${cacheBuster}`,
  );
  return readiness.checks?.find(
    (check) => check.label === "Real-call profile history",
  );
};

const describeAction = (action: RecoveryAction) =>
  [
    action.label ?? action.id ?? "recovery action",
    action.profileId ? `profile=${action.profileId}` : undefined,
    action.href,
  ]
    .filter(Boolean)
    .join(" ");

let server: ReturnType<typeof Bun.spawn> | undefined;
let exitCode = 0;

try {
  if (await isServerRunning()) {
    console.log(`Reusing running demo server at ${baseUrl}.`);
  } else if (useExistingServer) {
    throw new Error(`No running demo server found at ${baseUrl}.`);
  } else {
    console.log(`Starting demo server at ${baseUrl}.`);
    server = startServer();
    await waitForServer(server);
  }

  const actions = getUniqueActions(
    (await getRecoveryActions()).filter(isRealCallProfilePostAction),
  );

  if (actions.length === 0) {
    const check = await getRealCallProfileCheck();
    console.log(
      JSON.stringify(
        {
          actionCount: 0,
          realCallProfileGate: check ?? null,
        },
        null,
        2,
      ),
    );
    throw new Error("No real-call profile POST recovery actions found.");
  }

  console.log(
    `Running ${actions.length} real-call profile recovery action(s) in parallel.`,
  );
  for (const action of actions) {
    console.log(`- ${describeAction(action)}`);
  }

  const starts = await Promise.allSettled(actions.map(runRecoveryAction));
  const startedJobs = starts.flatMap((result) => {
    if (result.status === "rejected") {
      return [];
    }
    return result.value.jobId ? [result.value] : [];
  });
  const startFailures = starts.flatMap((result, index) =>
    result.status === "rejected"
      ? [
          {
            action: describeAction(actions[index] ?? {}),
            error:
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason),
          },
        ]
      : [],
  );

  if (startedJobs.length === 0) {
    console.log(JSON.stringify({ startFailures }, null, 2));
    throw new Error("No real-call profile recovery jobs were started.");
  }

  console.log(`Polling ${startedJobs.length} recovery job(s) in parallel.`);
  const jobResults = await Promise.allSettled(
    startedJobs.map((start) => pollJob(start.jobId as string)),
  );
  const jobs = jobResults.map((result, index) => ({
    action: describeAction(startedJobs[index]?.action ?? {}),
    jobId: startedJobs[index]?.jobId,
    result:
      result.status === "fulfilled"
        ? result.value
        : {
            status: "fail",
            error:
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason),
          },
  }));

  await fetchJson<unknown>("/api/voice/real-call-profile-history/refresh", {
    method: "POST",
  });
  const check = await getRealCallProfileCheck({ fresh: true });

  console.log(
    JSON.stringify(
      {
        actionCount: actions.length,
        startFailures,
        jobs,
        realCallProfileGate: check ?? null,
      },
      null,
      2,
    ),
  );

  if (!check || check.status !== "pass") {
    exitCode = 1;
  }
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.message : String(error));
} finally {
  await stopServer(server);
}

process.exit(exitCode);
