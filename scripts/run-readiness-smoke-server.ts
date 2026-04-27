export {};

const baseUrl = (
  process.env.VOICE_DEMO_URL ??
  `http://127.0.0.1:${process.env.PORT ?? "3004"}`
).replace(/\/$/, "");
const waitTimeoutMs = Number(
  process.env.VOICE_READINESS_SERVER_WAIT_MS ?? 30_000,
);
const pollMs = Number(process.env.VOICE_READINESS_SERVER_POLL_MS ?? 500);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async () => {
  const deadline = Date.now() + waitTimeoutMs;
  let lastError = "Server did not respond.";

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/production-readiness`, {
        headers: {
          accept: "application/json",
        },
      });
      if (response.ok) {
        return;
      }
      lastError = `Readiness endpoint returned HTTP ${response.status}.`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await sleep(pollMs);
  }

  throw new Error(
    `Timed out waiting ${waitTimeoutMs}ms for ${baseUrl}: ${lastError}`,
  );
};

const server = Bun.spawn(["bun", "run", "dev"], {
  env: {
    ...process.env,
    PORT: process.env.PORT ?? "3004",
  },
  stderr: "inherit",
  stdout: "inherit",
});

let exitCode = 0;

try {
  await waitForServer();

  const smoke = Bun.spawn(["bun", "run", "smoke:readiness"], {
    env: {
      ...process.env,
      PORT: process.env.PORT ?? "3004",
      VOICE_DEMO_URL: baseUrl,
    },
    stderr: "inherit",
    stdout: "inherit",
  });
  const smokeExitCode = await smoke.exited;

  if (smokeExitCode !== 0) {
    exitCode = smokeExitCode;
  }
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.message : String(error));
} finally {
  server.kill();
  await Promise.race([server.exited, sleep(2_000)]);
}

process.exit(exitCode);
