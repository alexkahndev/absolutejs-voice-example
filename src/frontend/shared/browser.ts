import { createMicrophoneCapture } from "@absolutejs/voice/client";
import type { VoiceAppKitStatusReport } from "@absolutejs/voice";
import type { SavedIntake } from "../../shared/demo";

const VOICE_WAVE_POINTS = 48;
const VOICE_WAVE_WIDTH = 320;
const VOICE_WAVE_HEIGHT = 88;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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
