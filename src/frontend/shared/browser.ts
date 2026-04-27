import {
  createMicrophoneCapture,
  createVoiceAudioPlayer,
  createVoiceBargeInMonitor,
} from "@absolutejs/voice/client";
import type {
  VoiceAudioPlayer,
  VoiceBargeInMonitor,
  VoiceBargeInReport,
  VoiceAppKitStatusReport,
  VoiceRoutingDecisionSummary,
  VoiceStreamState,
} from "@absolutejs/voice";
import type { SavedIntake } from "../../shared/demo";

const VOICE_WAVE_POINTS = 48;
const VOICE_WAVE_WIDTH = 320;
const VOICE_WAVE_HEIGHT = 88;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getPcmLevel = (audio: Uint8Array | ArrayBuffer) => {
  const bytes = audio instanceof Uint8Array ? audio : new Uint8Array(audio);

  if (bytes.byteLength < 2) {
    return 0;
  }

  const samples = new Int16Array(
    bytes.buffer,
    bytes.byteOffset,
    Math.floor(bytes.byteLength / 2),
  );

  if (samples.length === 0) {
    return 0;
  }

  let sumSquares = 0;

  for (const sample of samples) {
    const normalized = sample / 0x8000;
    sumSquares += normalized * normalized;
  }

  const rms = Math.sqrt(sumSquares / samples.length);
  return clamp(rms * 5.5, 0, 1);
};

const readErrorField = (
  value: Record<string, unknown>,
  key: string,
): string | null => {
  const candidate = value[key];

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate;
  }

  return null;
};

export const fetchSavedIntakes = async () => {
  const response = await fetch("/api/intakes");

  if (!response.ok) {
    return [] as SavedIntake[];
  }

  return (await response.json()) as SavedIntake[];
};

export const fetchLatestRoutingDecision = async () => {
  const response = await fetch("/api/routing/latest");

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as VoiceRoutingDecisionSummary | null;
};

export const fetchBargeInReport = async () => {
  const response = await fetch("/api/voice-barge-in");

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as VoiceBargeInReport;
};

export const getAppKitStatusLabel = (
  report?: VoiceAppKitStatusReport | null,
) => {
  if (!report) {
    return "Checking";
  }

  return report.status === "pass" ? "Passing" : "Needs attention";
};

export const formatDateTime = (value: number) =>
  new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    const direct =
      readErrorField(record, "message") ??
      readErrorField(record, "reason") ??
      readErrorField(record, "description");

    if (direct) {
      return direct;
    }

    if ("error" in record) {
      return formatErrorMessage(record.error);
    }

    if ("cause" in record) {
      return formatErrorMessage(record.cause);
    }

    try {
      return JSON.stringify(error);
    } catch {}
  }

  return "Unexpected error";
};

export const createInitialVoiceWaveLevels = (count = VOICE_WAVE_POINTS) =>
  Array.from({ length: count }, () => 0);

export const pushVoiceWaveLevel = (
  levels: number[],
  nextLevel: number,
  count = VOICE_WAVE_POINTS,
) => {
  const next = levels.slice(-(count - 1));
  next.push(clamp(nextLevel, 0, 1));

  while (next.length < count) {
    next.unshift(0);
  }

  return next;
};

export const createVoiceWavePath = (
  levels: number[],
  width = VOICE_WAVE_WIDTH,
  height = VOICE_WAVE_HEIGHT,
) => {
  const samples =
    levels.length > 1
      ? levels
      : createInitialVoiceWaveLevels(VOICE_WAVE_POINTS);
  const step = width / (samples.length - 1);
  const center = height / 2;
  const maxAmplitude = height * 0.34;
  const peakLevel = Math.max(...samples, 0);

  if (peakLevel <= 0.015) {
    return `M 0 ${center} L ${width} ${center}`;
  }

  const points = samples.map((level, index) => {
    const phase = index * 0.76;
    const wobble = Math.sin(phase) * 0.78 + Math.sin(phase * 0.41) * 0.22;
    const amplitude = level * maxAmplitude;
    const x = step * index;
    const y = clamp(center + wobble * amplitude, 8, height - 8);

    return { x, y };
  });

  if (points.length === 0) {
    return `M 0 ${center} L ${width} ${center}`;
  }

  let path = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? center}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    if (!previous || !current) {
      continue;
    }

    const controlX = (previous.x + current.x) / 2;
    path += ` Q ${controlX} ${previous.y} ${current.x} ${current.y}`;
  }

  return path;
};

export const createDemoMicrophone = (
  onAudio: (audio: Uint8Array | ArrayBuffer) => void,
  onLevel?: (level: number) => void,
) => {
  let capture: ReturnType<typeof createMicrophoneCapture> | null = null;

  return {
    start: async () => {
      if (capture) {
        return;
      }

      if (typeof createMicrophoneCapture !== "function") {
        throw new Error(
          "@absolutejs/voice/client did not provide createMicrophoneCapture. Reinstall @absolutejs/voice and restart the dev server.",
        );
      }

      const nextCapture = createMicrophoneCapture({
        onAudio: (audio) => {
          onLevel?.(getPcmLevel(audio));
          onAudio(audio);
        },
        sampleRateHz: 16_000,
      });

      capture = nextCapture;

      try {
        await capture.start();
      } catch (error) {
        capture = null;
        throw error;
      }
    },
    stop: () => {
      capture?.stop();
      capture = null;
      onLevel?.(0);
    },
  };
};

const formatLatency = (value?: number) =>
  typeof value === "number" ? `${Math.round(value)}ms` : "Not measured";

const createBargeInTestChunk = () => {
  const sampleRateHz = 16_000;
  const durationSeconds = 5;
  const sampleCount = sampleRateHz * durationSeconds;
  const chunk = new Uint8Array(sampleCount * 2);
  const view = new DataView(chunk.buffer);

  for (let index = 0; index < sampleCount; index += 1) {
    const seconds = index / sampleRateHz;
    const carrier = Math.sin(2 * Math.PI * 440 * seconds);
    const pulse = 0.55 + 0.25 * Math.sin(2 * Math.PI * 2.2 * seconds);
    const fadeIn = Math.min(1, seconds / 0.08);
    const fadeOut = Math.min(1, (durationSeconds - seconds) / 0.18);
    const sample = Math.max(-1, Math.min(1, carrier * pulse * fadeIn * fadeOut));
    view.setInt16(index * 2, Math.round(sample * 0x7fff), true);
  }

  return {
    chunk,
    format: {
      channels: 1 as const,
      container: "raw" as const,
      encoding: "pcm_s16le" as const,
      sampleRateHz,
    },
    receivedAt: Date.now(),
    turnId: "barge-in-test",
  };
};

const formatBargeInStatus = (status?: VoiceBargeInReport["status"]) => {
  if (!status || status === "empty") {
    return {
      className: "empty",
      copy: "Waiting for an interruption",
      label: "No proof yet",
    };
  }

  if (status === "pass") {
    return {
      className: "pass",
      copy: "Assistant playback stopped inside the latency budget.",
      label: "Barge-in passing",
    };
  }

  if (status === "warn") {
    return {
      className: "warn",
      copy: "Interruption was detected but playback stop latency is not complete.",
      label: "Needs a full playback interruption",
    };
  }

  return {
    className: "fail",
    copy: "At least one interruption missed the latency budget.",
    label: "Barge-in failing",
  };
};

export const renderDemoBargeInProofHTML = (
  report: VoiceBargeInReport | null,
  input?: string | null | { error?: string | null; testState?: string | null },
) => {
  const status = formatBargeInStatus(report?.status);
  const lastEvent = report?.lastEvent;
  const sessions = report?.sessions ?? [];
  const error = typeof input === "string" ? input : input?.error;
  const testState = typeof input === "string" ? null : input?.testState;

  return `<article class="voice-card voice-barge-in-proof voice-barge-in-proof--${status.className}">
  <header class="voice-barge-in-proof__header">
    <span class="voice-framework-pill">Live Barge-in Proof</span>
    <strong>${escapeHtml(status.label)}</strong>
  </header>
  <p class="voice-footnote">${escapeHtml(error || status.copy)}</p>
  <div class="voice-barge-in-proof__actions">
    <button type="button" data-barge-in-test>
      ${testState === "running" ? "Listening - speak now" : "Try barge-in test"}
    </button>
    <span>${escapeHtml(testState === "running" ? "A local assistant test clip is playing. Talk over it." : testState === "done" ? "Test submitted. Results refresh automatically." : "Runs locally through the browser audio player.")}</span>
  </div>
  <div class="voice-barge-in-proof__grid">
    <div>
      <span>Interrupt latency</span>
      <strong>${escapeHtml(formatLatency(lastEvent?.latencyMs))}</strong>
    </div>
    <div>
      <span>Playback stop</span>
      <strong>${escapeHtml(formatLatency(lastEvent?.playbackStopLatencyMs))}</strong>
    </div>
    <div>
      <span>Passed</span>
      <strong>${report?.passed ?? 0}</strong>
    </div>
    <div>
      <span>Failed</span>
      <strong>${report?.failed ?? 0}</strong>
    </div>
  </div>
  ${
    lastEvent
      ? `<p class="voice-footnote">Last ${escapeHtml(lastEvent.status)} event: ${escapeHtml(lastEvent.reason)}${lastEvent.sessionId ? ` · ${escapeHtml(lastEvent.sessionId)}` : ""}</p>`
      : `<p class="voice-footnote">Start assistant audio, speak over it, then open this card for measured proof.</p>`
  }
  ${
    sessions.length
      ? `<div class="voice-barge-in-proof__sessions">${sessions
          .slice(0, 2)
          .map(
            (session) => `<div>
      <strong>${escapeHtml(session.sessionId)}</strong>
      <span>${session.passed} pass · ${session.failed} fail · ${escapeHtml(formatLatency(session.averageLatencyMs))}</span>
    </div>`,
          )
          .join("")}</div>`
      : ""
  }
  <a href="/barge-in">Open barge-in dashboard</a>
</article>`;
};

export const mountDemoBargeInProof = (
  element: HTMLElement,
  options: { intervalMs?: number } = {},
) => {
  let isClosed = false;
  let timer: ReturnType<typeof setInterval> | null = null;
  let report: VoiceBargeInReport | null = null;
  let errorMessage: string | null = null;
  let testState: "idle" | "running" | "done" = "idle";
  let testPlayer: VoiceAudioPlayer | null = null;
  let testCapture: ReturnType<typeof createMicrophoneCapture> | null = null;

  const render = () => {
    element.innerHTML = renderDemoBargeInProofHTML(report, {
      error: errorMessage,
      testState,
    });
  };

  const refresh = async () => {
    try {
      report = await fetchBargeInReport();
      errorMessage = null;
      if (!isClosed) {
        render();
      }
    } catch (error) {
      errorMessage = formatErrorMessage(error);
      if (!isClosed) {
        render();
      }
    }
  };

  const stopTest = () => {
    testCapture?.stop();
    testCapture = null;
  };

  const runTest = async () => {
    if (testState === "running") {
      return;
    }

    const monitor = createVoiceBargeInMonitor({
      path: "/api/voice-barge-in",
      thresholdMs: 250,
    });
    const assistantAudio = [createBargeInTestChunk()];
    let hasInterrupted = false;

    testState = "running";
    errorMessage = null;
    render();
    stopTest();
    void testPlayer?.close();
    testPlayer = createVoiceAudioPlayer({
      assistantAudio,
      subscribe: () => () => {},
    });

    try {
      testCapture = createMicrophoneCapture({
        onAudio: (audio) => {
          if (
            hasInterrupted ||
            !testPlayer?.isPlaying ||
            getPcmLevel(audio) < 0.04
          ) {
            return;
          }

          hasInterrupted = true;
          stopTest();
          monitor.recordRequested({
            reason: "manual-audio",
            sessionId: "barge-in-proof-test",
          });
          void testPlayer.interrupt().then(() => {
            monitor.recordStopped({
              latencyMs: testPlayer?.lastInterruptLatencyMs,
              playbackStopLatencyMs: testPlayer?.lastPlaybackStopLatencyMs,
              reason: "manual-audio",
              sessionId: "barge-in-proof-test",
            });
            testState = "done";
            void refresh();
          });
        },
        sampleRateHz: 16_000,
      });

      await testCapture.start();
      await testPlayer.start();
      setTimeout(() => {
        if (hasInterrupted || isClosed) {
          return;
        }

        stopTest();
        monitor.recordSkipped({
          reason: "manual-audio",
          sessionId: "barge-in-proof-test",
        });
        testState = "done";
        void refresh();
      }, 5_500);
    } catch (error) {
      stopTest();
      void testPlayer?.close();
      testState = "idle";
      errorMessage = formatErrorMessage(error);
      render();
    }
  };

  const onClick = (event: Event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("[data-barge-in-test]")) {
      void runTest();
    }
  };

  element.addEventListener("click", onClick);
  render();
  void refresh();
  timer = setInterval(refresh, options.intervalMs ?? 3_000);

  return {
    close: () => {
      isClosed = true;
      element.removeEventListener("click", onClick);
      stopTest();
      void testPlayer?.close();
      if (timer) {
        clearInterval(timer);
      }
    },
    refresh,
  };
};

type DemoBargeInVoice<TResult = unknown> = Pick<
  VoiceStreamState<TResult>,
  "assistantAudio" | "assistantTexts" | "sessionId"
> & {
  sendAudio: (audio: Uint8Array | ArrayBuffer) => void;
};

export const createDemoBargeInEvidence = <TResult = unknown>(
  getVoice: () => DemoBargeInVoice<TResult>,
  options: {
    recentAssistantWindowMs?: number;
    speechThreshold?: number;
    thresholdMs?: number;
  } = {},
) => {
  const monitor: VoiceBargeInMonitor = createVoiceBargeInMonitor({
    path: "/api/voice-barge-in",
    thresholdMs: options.thresholdMs ?? 250,
  });
  const subscribers = new Set<() => void>();
  let player: VoiceAudioPlayer | null = null;
  let lastAssistantAt = 0;
  let lastAssistantAudioCount = 0;
  let lastAssistantTextCount = 0;

  const getPlayer = () => {
    if (player) {
      return player;
    }

    player = createVoiceAudioPlayer({
      get assistantAudio() {
        return getVoice().assistantAudio;
      },
      subscribe: (subscriber) => {
        subscribers.add(subscriber);
        return () => {
          subscribers.delete(subscriber);
        };
      },
    });

    return player;
  };

  const notifyAssistantOutput = () => {
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  const syncAssistantOutput = () => {
    const voice = getVoice();
    const audioCount = voice.assistantAudio.length;
    const textCount = voice.assistantTexts.length;

    if (
      audioCount > lastAssistantAudioCount ||
      textCount > lastAssistantTextCount
    ) {
      lastAssistantAt = Date.now();
    }

    lastAssistantAudioCount = audioCount;
    lastAssistantTextCount = textCount;

    if (audioCount > 0) {
      notifyAssistantOutput();
      void getPlayer().start().catch(() => {});
    }
  };

  const sendAudio = (audio: Uint8Array | ArrayBuffer) => {
    syncAssistantOutput();

    const voice = getVoice();
    const isRecentAssistantOutput =
      Date.now() - lastAssistantAt <=
      (options.recentAssistantWindowMs ?? 4_000);
    const isSpeechLike = getPcmLevel(audio) >= (options.speechThreshold ?? 0.04);

    if (isSpeechLike && player?.isPlaying) {
      monitor.recordRequested({
        reason: "manual-audio",
        sessionId: voice.sessionId,
      });
      void player.interrupt().then(() => {
        monitor.recordStopped({
          latencyMs: player?.lastInterruptLatencyMs,
          playbackStopLatencyMs: player?.lastPlaybackStopLatencyMs,
          reason: "manual-audio",
          sessionId: voice.sessionId,
        });
      });
    } else if (isRecentAssistantOutput && isSpeechLike) {
      monitor.recordSkipped({
        reason: "manual-audio",
        sessionId: voice.sessionId,
      });
    }

    voice.sendAudio(audio);
  };

  return {
    close: () => {
      void player?.close();
      player = null;
      subscribers.clear();
    },
    getSnapshot: monitor.getSnapshot,
    sendAudio,
    subscribe: monitor.subscribe,
    syncAssistantOutput,
  };
};
