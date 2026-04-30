import {
  buildVoiceOperationsRecord,
  createTwilioMediaStreamBridge,
  createVoiceMemoryStore,
  createVoiceMemoryTraceEventStore,
  encodeTwilioMulawBase64,
  type AudioChunk,
  type STTAdapter,
  type STTAdapterOpenOptions,
  type STTAdapterSession,
  type TTSAdapter,
  type TTSAdapterSession,
  type Transcript,
} from "@absolutejs/voice";

const timeoutMs = Number(
  process.env.TELEPHONY_MEDIA_OPERATIONS_SMOKE_TIMEOUT_MS ?? 5_000,
);
const sessionId = `telephony-media-ops-smoke-${Date.now()}`;
const streamSid = "telephony-media-ops-smoke-stream";
const callSid = "telephony-media-ops-smoke-call";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeAudio = (audio: AudioChunk) =>
  audio instanceof Uint8Array
    ? audio
    : audio instanceof ArrayBuffer
      ? new Uint8Array(audio)
      : new Uint8Array(audio.buffer, audio.byteOffset, audio.byteLength);

const createSmokeSTTAdapter = (): STTAdapter => ({
  kind: "stt",
  open: (_options: STTAdapterOpenOptions): STTAdapterSession => {
    const listeners = {
      close: new Set<(payload: { type: "close" }) => void>(),
      endOfTurn: new Set<
        (payload: {
          reason: "vendor";
          receivedAt: number;
          type: "endOfTurn";
        }) => void
      >(),
      error: new Set<
        (payload: { error: Error; recoverable: boolean; type: "error" }) => void
      >(),
      final: new Set<
        (payload: {
          receivedAt: number;
          transcript: Transcript;
          type: "final";
        }) => void
      >(),
      partial: new Set<
        (payload: {
          receivedAt: number;
          transcript: Transcript;
          type: "partial";
        }) => void
      >(),
    };
    let delivered = false;

    return {
      close: async () => {
        for (const handler of listeners.close) {
          handler({ type: "close" });
        }
      },
      on: (event, handler) => {
        (listeners[event] as Set<typeof handler>).add(handler as never);
        return () => {
          (listeners[event] as Set<typeof handler>).delete(handler as never);
        };
      },
      send: async (audio: AudioChunk) => {
        if (delivered || normalizeAudio(audio).byteLength === 0) {
          return;
        }

        delivered = true;
        const receivedAt = Date.now();
        for (const handler of listeners.final) {
          handler({
            receivedAt,
            transcript: {
              id: "telephony-media-ops-smoke-final",
              isFinal: true,
              text: "Please confirm two way carrier media works.",
            },
            type: "final",
          });
        }
        for (const handler of listeners.endOfTurn) {
          handler({
            reason: "vendor",
            receivedAt,
            type: "endOfTurn",
          });
        }
      },
    };
  },
});

const createSmokeTTSAdapter = (): TTSAdapter => ({
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
        const samples = 2_400;
        const chunk = new Uint8Array(samples * 2);
        const view = new DataView(chunk.buffer);
        for (let index = 0; index < samples; index += 1) {
          const envelope = Math.sin((Math.PI * index) / samples);
          const tone = Math.sin((2 * Math.PI * 660 * index) / sampleRateHz);
          view.setInt16(index * 2, Math.round(tone * envelope * 4_000), true);
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

const waitFor = async (predicate: () => boolean, label: string) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (predicate()) {
      return;
    }
    await sleep(25);
  }

  throw new Error(`${label} did not complete within ${timeoutMs}ms`);
};

const trace = createVoiceMemoryTraceEventStore();
const sentMessages: Array<Record<string, unknown>> = [];
const bridge = createTwilioMediaStreamBridge(
  {
    close: () => {},
    send: (data) => {
      sentMessages.push(JSON.parse(data) as Record<string, unknown>);
    },
  },
  {
    context: {},
    onComplete: async () => {},
    onTurn: async () => ({
      assistantText: "Confirmed. Two way carrier media is visible.",
    }),
    session: createVoiceMemoryStore(),
    stt: createSmokeSTTAdapter(),
    trace,
    tts: createSmokeTTSAdapter(),
    turnDetection: {
      transcriptStabilityMs: 0,
    },
  },
);

const payload = encodeTwilioMulawBase64(
  new Int16Array([500, -500, 1_500, -1_500, 2_500, -2_500]),
);

await bridge.handleMessage({
  event: "start",
  start: {
    callSid,
    customParameters: {
      scenarioId: "telephony-media-operations-smoke",
      sessionId,
    },
    streamSid,
  },
  streamSid,
});

await bridge.handleMessage({
  event: "media",
  media: {
    payload,
    track: "inbound",
  },
  streamSid,
});

await waitFor(
  () => sentMessages.some((message) => message.event === "media"),
  "outbound media",
);

await bridge.handleMessage({
  event: "media",
  media: {
    payload,
    track: "inbound",
  },
  streamSid,
});

await waitFor(
  () => sentMessages.some((message) => message.event === "clear"),
  "outbound clear",
);

await bridge.handleMessage({
  event: "stop",
  stop: {
    callSid,
  },
  streamSid,
});
await bridge.close("telephony-media-operations-smoke-complete");

const record = await buildVoiceOperationsRecord({
  sessionId,
  store: trace,
});
const media = record.telephonyMedia;
const issues = [
  media.starts < 1 ? "missing start event" : undefined,
  media.stops < 1 ? "missing stop event" : undefined,
  media.inbound < 2 ? "expected at least two inbound media/control events" : undefined,
  media.outbound < 2 ? "expected outbound assistant media and clear evidence" : undefined,
  media.media < 3 ? "expected inbound and outbound media events" : undefined,
  media.clears < 1 ? "missing outbound clear evidence" : undefined,
  media.audioBytes <= 0 ? "missing media audio bytes" : undefined,
  !media.carriers.includes("twilio") ? "missing twilio carrier evidence" : undefined,
  !media.streamIds.includes(streamSid) ? "missing stream id evidence" : undefined,
].filter((issue): issue is string => typeof issue === "string");

const result = {
  ok: issues.length === 0,
  issues,
  operationsRecordHref: `/voice-operations/${encodeURIComponent(sessionId)}`,
  sentEvents: sentMessages.map((message) => message.event),
  sessionId,
  telephonyMedia: media,
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
