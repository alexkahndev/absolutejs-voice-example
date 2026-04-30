export {};

const baseUrl = (
  process.env.VOICE_DEMO_URL ?? `http://127.0.0.1:${process.env.PORT ?? "3004"}`
).replace(/\/$/, "");
const waitTimeoutMs = Number(
  process.env.VOICE_PROOF_PACK_SERVER_WAIT_MS ?? 30_000,
);
const pollMs = Number(process.env.VOICE_PROOF_PACK_SERVER_POLL_MS ?? 500);
const serverOutputLineLimit = Number(
  process.env.VOICE_PROOF_PACK_SERVER_OUTPUT_LINES ?? 80,
);
const refreshTrends =
  process.env.VOICE_PROOF_PACK_REFRESH_TRENDS !== "false";
const refreshObservabilityExport =
  process.env.VOICE_PROOF_PACK_REFRESH_OBSERVABILITY_EXPORT !== "false";
const refreshBrowserCalls =
  process.env.VOICE_PROOF_PACK_REFRESH_BROWSER_CALLS !== "false";
const refreshRealCallProfiles =
  process.env.VOICE_PROOF_PACK_REFRESH_REAL_CALL_PROFILES !== "false";
const useExistingServer =
  process.env.VOICE_PROOF_PACK_USE_EXISTING_SERVER === "1";
const trendRefreshPasses = Math.max(
  1,
  Number(process.env.VOICE_PROOF_PACK_TREND_REFRESH_PASSES ?? 2),
);
const proofRuntimeDir =
  process.env.VOICE_DEMO_RUNTIME_DIR ??
  `.voice-runtime/proof-pack/runtime/${new Date()
    .toISOString()
    .replaceAll(":", "-")}`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const textDecoder = new TextDecoder();
const recentServerOutput: string[] = [];

const rememberServerOutput = (chunk: Uint8Array) => {
  process.stdout.write(chunk);
  for (const line of textDecoder.decode(chunk).split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }
    recentServerOutput.push(line);
    recentServerOutput.splice(
      0,
      recentServerOutput.length - serverOutputLineLimit,
    );
  }
};

const pipeServerOutput = async (stream: ReadableStream<Uint8Array> | null) => {
  if (!stream) {
    return;
  }

  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      if (value) {
        rememberServerOutput(value);
      }
    }
  } catch {
    // Expected when the dev server is stopped.
  }
};

const isReadableByteStream = (
  stream: unknown,
): stream is ReadableStream<Uint8Array> => stream instanceof ReadableStream;

const formatRecentServerOutput = () =>
  recentServerOutput.length > 0
    ? `\n\nRecent dev server output:\n${recentServerOutput.join("\n")}`
    : "";

const pingServer = async (url = baseUrl) => {
  const response = await fetch(`${url}/api/production-readiness`, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Readiness endpoint returned HTTP ${response.status}.`);
  }
};

const isServerRunning = async (url = baseUrl) => {
  try {
    await pingServer(url);
    return true;
  } catch {
    return false;
  }
};

const waitForServer = async (
  server?: ReturnType<typeof Bun.spawn>,
  url = baseUrl,
) => {
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
        `Dev server exited before proof pack could run with code ${serverExitCode ?? "unknown"}: ${lastError}`,
      );
    }

    try {
      await pingServer(url);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await Promise.race([
      sleep(pollMs),
      server?.exited.then((exitCode) => {
        serverExitCode = exitCode;
        serverExited = true;
      }),
    ]);
  }

  throw new Error(
    `Timed out waiting ${waitTimeoutMs}ms for ${url}: ${lastError}`,
  );
};

const runScript = async (script: string, env: Record<string, string> = {}) => {
  const child = Bun.spawn(["bun", "run", script], {
    env: {
      ...process.env,
      PORT: env.PORT ?? process.env.PORT ?? "3004",
      VOICE_DEMO_URL: env.VOICE_DEMO_URL ?? baseUrl,
      ...env,
    },
    stderr: "inherit",
    stdout: "inherit",
  });

  return child.exited;
};

const startServer = (
  port: string,
  runtimeDir: string,
): ReturnType<typeof Bun.spawn> =>
  Bun.spawn(["bun", "run", "dev"], {
    env: {
      ...process.env,
      PORT: port,
      VOICE_DEMO_RUNTIME_DIR: runtimeDir,
    },
    stderr: "pipe",
    stdout: "pipe",
  });

const stopServer = async (target: ReturnType<typeof Bun.spawn> | undefined) => {
  if (!target) {
    return;
  }

  target.kill();
  await Promise.race([target.exited, sleep(2_000)]);
};

const refreshBrowserCallProfiles = async () => {
  if (useExistingServer) {
    const exitCode = await runScript("proof:profiles:browser-call", {
      VOICE_BROWSER_CALL_USE_EXISTING_SERVER: "1",
    });
    if (exitCode !== 0) {
      throw new Error(`Browser-call profile refresh failed with ${exitCode}.`);
    }
    return;
  }

  const mainPort = Number(process.env.PORT ?? "3004");
  const browserPort =
    process.env.VOICE_BROWSER_CALL_PROOF_PORT ?? String(mainPort + 100);
  const browserBaseUrl = `http://127.0.0.1:${browserPort}`;
  const browserRuntimeDir = `${proofRuntimeDir}-browser-capture`;
  let browserServer: ReturnType<typeof Bun.spawn> | undefined;

  try {
    browserServer = startServer(browserPort, browserRuntimeDir);
    void pipeServerOutput(
      isReadableByteStream(browserServer.stdout) ? browserServer.stdout : null,
    );
    void pipeServerOutput(
      isReadableByteStream(browserServer.stderr) ? browserServer.stderr : null,
    );
    await waitForServer(browserServer, browserBaseUrl);

    const exitCode = await runScript("proof:profiles:browser-call", {
      PORT: browserPort,
      VOICE_BROWSER_CALL_USE_EXISTING_SERVER: "1",
      VOICE_DEMO_URL: browserBaseUrl,
    });
    if (exitCode !== 0) {
      throw new Error(`Browser-call profile refresh failed with ${exitCode}.`);
    }
  } finally {
    await stopServer(browserServer);
  }
};

const refreshObservabilityEvidence = async () => {
  const exportResponse = await fetch(`${baseUrl}/api/voice/observability-export`, {
    headers: { accept: "application/json" },
  });

  if (!exportResponse.ok) {
    throw new Error(
      `Observability export refresh returned HTTP ${exportResponse.status}.`,
    );
  }

  const deliveryResponse = await fetch(
    `${baseUrl}/api/voice/observability-export/deliveries`,
    {
      headers: { accept: "application/json" },
      method: "POST",
    },
  );

  if (!deliveryResponse.ok) {
    throw new Error(
      `Observability export delivery refresh returned HTTP ${deliveryResponse.status}.`,
    );
  }
};

let exitCode = 0;
let server: ReturnType<typeof Bun.spawn> | undefined;

try {
  if (refreshBrowserCalls) {
    console.log("Refreshing browser-call profile evidence in isolated runtime.");
    await refreshBrowserCallProfiles();
  }

  if (useExistingServer && (await isServerRunning())) {
    console.log(`Reusing running demo server at ${baseUrl}.`);
  } else {
    server = startServer(process.env.PORT ?? "3004", proofRuntimeDir);
    void pipeServerOutput(
      isReadableByteStream(server.stdout) ? server.stdout : null,
    );
    void pipeServerOutput(
      isReadableByteStream(server.stderr) ? server.stderr : null,
    );
  }

  await waitForServer(server);

  if (refreshObservabilityExport) {
    console.log("Refreshing observability export before proof trends.");
    await refreshObservabilityEvidence();
  }

  if (refreshTrends) {
    for (let pass = 1; pass <= trendRefreshPasses; pass += 1) {
      console.log(
        `Refreshing sustained proof trends before proof pack (${pass}/${trendRefreshPasses}).`,
      );
      const trendExitCode = await runScript("proof:trends");
      if (trendExitCode === 0) {
        break;
      }
      if (pass === trendRefreshPasses) {
        exitCode = trendExitCode;
      }
    }
  }

  if (refreshRealCallProfiles) {
    console.log("Refreshing real-call profile history before proof pack.");
    const realCallProfileExitCode = await runScript("proof:profiles:real-calls", {
      VOICE_REAL_CALL_BROWSER_CAPTURE: "0",
    });
    if (realCallProfileExitCode !== 0) {
      exitCode = realCallProfileExitCode;
    }
  }

  const proofPackExitCode = exitCode === 0 ? await runScript("proof:pack") : 0;

  if (proofPackExitCode !== 0) {
    exitCode = proofPackExitCode;
  }
} catch (error) {
  exitCode = 1;
  console.error(
    `${error instanceof Error ? error.message : String(error)}${formatRecentServerOutput()}`,
  );
} finally {
  await stopServer(server);
}

process.exit(exitCode);
