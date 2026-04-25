import { Head } from "@absolutejs/absolute/react/components";
import { useEffect, useRef, useState } from "react";
import type { VoiceTurnRecord } from "@absolutejs/voice";
import { useVoiceStream } from "@absolutejs/voice/react";
import {
  createInitialVoiceWaveLevels,
  createVoiceWavePath,
  createDemoMicrophone,
  fetchSavedIntakes,
  formatErrorMessage,
  formatDateTime,
  pushVoiceWaveLevel,
} from "../../shared/browser";
import {
  FRAMEWORKS,
  FRAMEWORK_DESCRIPTIONS,
  getVoiceLeadMessage,
  getVoiceModeLabel,
  getVoiceModePrompt,
  getVoiceRoutePath,
  VOICE_DEMO_GUIDE_STEPS,
  VOICE_DEMO_GUIDE_TITLE,
  VOICE_DEMO_GENERAL_LABEL,
  VOICE_DEMO_GUIDED_LABEL,
  VOICE_DEMO_MIC_IDLE,
  VOICE_DEMO_MIC_LIVE,
  VOICE_DEMO_STOP_LABEL,
  type VoiceDemoMode,
  type SavedIntake,
} from "../../../shared/demo";

type ReactVoiceDemoProps = {
  cssPath?: string;
};

const EMPTY_VOICE = {
  assistantTexts: [] as string[],
  assistantAudio: [] as Array<{ chunk: Uint8Array; format: { channels: 1 | 2; container: "raw"; encoding: "alaw" | "mulaw" | "pcm_s16le"; sampleRateHz: number; }; receivedAt: number; turnId?: string; }>,
  close: () => {},
  endTurn: () => {},
  error: null as string | null,
  isConnected: false,
  partial: "",
  scenarioId: null as string | null,
  sendAudio: (_audio: Uint8Array | ArrayBuffer) => {},
  sessionId: "",
  status: "idle" as const,
  turns: [] as VoiceTurnRecord<SavedIntake>[],
};

export const ReactVoiceDemo = ({ cssPath }: ReactVoiceDemoProps) => {
  const microphoneRef = useRef<ReturnType<typeof createDemoMicrophone> | null>(
    null,
  );
  const activeModeRef = useRef<VoiceDemoMode | null>(null);
  const guidedVoice = useVoiceStream<SavedIntake>(getVoiceRoutePath("guided")) ?? EMPTY_VOICE;
  const generalVoice =
    useVoiceStream<SavedIntake>(getVoiceRoutePath("general")) ?? EMPTY_VOICE;
  const [activeMode, setActiveMode] = useState<VoiceDemoMode | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasStartedModes, setHasStartedModes] = useState<
    Record<VoiceDemoMode, boolean>
  >({
    general: false,
    guided: false,
  });
  const [micError, setMicError] = useState<string | null>(null);
  const [savedIntakes, setSavedIntakes] = useState<SavedIntake[]>([]);
  const [waveLevels, setWaveLevels] = useState(createInitialVoiceWaveLevels);
  const currentVoice = activeMode === "general" ? generalVoice : guidedVoice;

  useEffect(() => {
    const refresh = () => {
      void fetchSavedIntakes().then(setSavedIntakes);
    };

    refresh();
    const intervalId = window.setInterval(refresh, 4_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(
    () => () => {
      microphoneRef.current?.stop();
    },
    [],
  );

  const startMic = async () => {
    try {
      const microphone =
        microphoneRef.current ??
        createDemoMicrophone(
          (audio) => {
            const mode = activeModeRef.current;
            const stream = mode === "general" ? generalVoice : guidedVoice;
            stream.sendAudio(audio);
          },
          (level) => {
            setWaveLevels((current) => pushVoiceWaveLevel(current, level));
          },
        );
      microphoneRef.current = microphone;
      await microphone.start();
      setMicError(null);
      setIsCapturing(true);
    } catch (error) {
      microphoneRef.current?.stop();
      microphoneRef.current = null;
      setIsCapturing(false);
      setWaveLevels(createInitialVoiceWaveLevels());
      setMicError(formatErrorMessage(error));
    }
  };

  const stopMic = () => {
    microphoneRef.current?.stop();
    setIsCapturing(false);
    setWaveLevels(createInitialVoiceWaveLevels());
  };

  const startMode = async (mode: VoiceDemoMode) => {
    activeModeRef.current = mode;
    setActiveMode(mode);
    setHasStartedModes((current) => ({
      ...current,
      [mode]: true,
    }));
    await startMic();
  };

  const voiceWavePath = createVoiceWavePath(waveLevels);
  const errorMessage = micError || currentVoice.error || "None";
  const currentPrompt = getVoiceModePrompt({
    hasStarted:
      (activeMode ? hasStartedModes[activeMode] : false) ||
      currentVoice.turns.length > 0,
    mode: activeMode,
    status: currentVoice.status,
    turnCount: currentVoice.turns.length,
  });
  const leadMessage = getVoiceLeadMessage({
    hasStarted:
      (activeMode ? hasStartedModes[activeMode] : false) ||
      currentVoice.turns.length > 0,
    mode: activeMode,
    status: currentVoice.status,
    turnCount: currentVoice.turns.length,
  });

  return (
    <html lang="en">
      <Head
        cssPath={cssPath}
        description="AbsoluteJS chat-style voice demo with guided and general modes in React."
        title="AbsoluteJS Voice Test - React"
      />
      <body className="voice-demo-page">
        <header>
          <a className="logo" href="/">
            <img
              alt="AbsoluteJS"
              height={24}
              src="/assets/png/absolutejs-temp.png"
            />
            AbsoluteJS
          </a>
          <nav>
            {FRAMEWORKS.map((framework) => (
              <a
                key={framework.id}
                className={framework.id === "react" ? "active" : undefined}
                href={framework.href}
              >
                {framework.label}
              </a>
            ))}
            <a href="/reviews">Reviews</a>
          </nav>
        </header>
        <main className="voice-shell">
          <section className="voice-grid">
            <article className="voice-card voice-hero">
              <div className="voice-hero-layout">
                <div>
                  <span className="voice-framework-pill">React Hook</span>
                  <h2>Chat-style voice demo in React</h2>
                  <p className="voice-brand-copy">
                    {FRAMEWORK_DESCRIPTIONS.react}
                  </p>
                  <div className="voice-badges">
                    <span className="voice-badge">Deepgram Flux</span>
                    <span className="voice-badge">Phrase hint correction</span>
                    <span className="voice-badge">Reconnect-aware sessions</span>
                  </div>
                </div>
                <div className="voice-metrics">
                  <div className="voice-metric">
                    <span className="voice-metric-label">Connection</span>
                    <span className="voice-metric-value">
                      {currentVoice.isConnected ? "Connected" : "Waiting"}
                    </span>
                  </div>
                  <div className="voice-metric">
                      <span className="voice-metric-label">Scenario</span>
                    <span className="voice-metric-value">
                      {activeMode ? getVoiceModeLabel(activeMode) : "Choose one"}
                    </span>
                  </div>
                  <div className="voice-metric">
                    <span className="voice-metric-label">
                      Saved captures
                    </span>
                    <span className="voice-metric-value">
                      {savedIntakes.length}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <article className="voice-card voice-card-side">
              <h2>{VOICE_DEMO_GUIDE_TITLE}</h2>
              <ol className="voice-guide-list">
                {VOICE_DEMO_GUIDE_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>

            <article className="voice-card voice-card-wide">
              <h2>Conversation</h2>
              <div className="voice-status-list">
                <div className="status-row">
                  <span className="label">Voice status</span>
                  <span className="value">{currentVoice.status}</span>
                </div>
                <div className="status-row">
                  <span className="label">Current prompt</span>
                  <span className="value">{currentPrompt}</span>
                </div>
                <div className="status-row">
                  <span className="label">Microphone</span>
                  <span className="value">
                    {isCapturing ? VOICE_DEMO_MIC_LIVE : VOICE_DEMO_MIC_IDLE}
                  </span>
                </div>
                <div className="status-row">
                  <span className="label">Current utterance</span>
                  <span className="value">
                    {currentVoice.partial || "No speech captured yet"}
                  </span>
                </div>
                <div className="status-row">
                  <span className="label">Errors</span>
                  <span className="value">{errorMessage}</span>
                </div>
              </div>
              <div className="voice-chat-list">
                <article className="voice-chat-message assistant">
                  <div className="voice-chat-role">
                    {activeMode ? getVoiceModeLabel(activeMode) : "Voice demo"}
                  </div>
                  <p className="voice-turn-text">{leadMessage}</p>
                </article>
                {currentVoice.turns.map((turn) => (
                  <div className="voice-chat-stack" key={turn.id}>
                    <article className="voice-chat-message user">
                      <div className="voice-chat-role">You</div>
                      <p className="voice-turn-text">{turn.text}</p>
                    </article>
                    {turn.assistantText ? (
                      <article className="voice-chat-message assistant">
                        <div className="voice-chat-role">
                          {activeMode ? getVoiceModeLabel(activeMode) : "Guide"}
                        </div>
                        <p className="voice-turn-text">{turn.assistantText}</p>
                      </article>
                    ) : null}
                  </div>
                ))}
                {currentVoice.partial ? (
                  <article className="voice-chat-message user pending">
                    <div className="voice-chat-role">Speaking</div>
                    <p className="voice-turn-text">{currentVoice.partial}</p>
                  </article>
                ) : null}
              </div>
              <div
                className={`voice-monitor${isCapturing ? " is-live" : ""}`}
              >
                <div className="voice-monitor-header">
                  <span className="voice-monitor-label">Input monitor</span>
                  <span
                    className={`voice-live-pill${isCapturing ? " is-live" : ""}`}
                  >
                    <span className="voice-live-dot" />
                    {isCapturing ? "Microphone live" : "Microphone idle"}
                  </span>
                </div>
                <svg
                  aria-label="Microphone waveform"
                  className="voice-wave"
                  viewBox="0 0 320 88"
                >
                  <path className="voice-wave-baseline" d="M 0 44 L 320 44" />
                  <path className="voice-wave-glow" d={voiceWavePath} />
                  <path className="voice-wave-line" d={voiceWavePath} />
                </svg>
              </div>
              <div className="voice-actions">
                {isCapturing ? (
                  <button className="primary" onClick={() => void stopMic()}>
                    {VOICE_DEMO_STOP_LABEL}
                  </button>
                ) : (
                  <>
                    <button
                      className="primary"
                      onClick={() => void startMode("guided")}
                    >
                      {VOICE_DEMO_GUIDED_LABEL}
                    </button>
                    <button onClick={() => void startMode("general")}>
                      {VOICE_DEMO_GENERAL_LABEL}
                    </button>
                  </>
                )}
              </div>
              <p className="voice-footnote">
                This demo uses the dev-only in-memory voice session store. Real
                deployments should replace it with Redis or Postgres.
              </p>
            </article>

            <article className="voice-card voice-hero">
              <h2>Saved captures</h2>
              <p className="voice-footnote">
                Open <a href="/reviews/latest">the latest review</a> or <a href="/reviews">browse all reviews</a> after a completed demo call.
              </p>
              <div className="voice-saved-list">
                {savedIntakes.length === 0 ? (
                  <p className="empty-copy">No saved captures yet.</p>
                ) : (
                  savedIntakes.map((intake) => (
                    <article className="saved-item" key={intake.id}>
                      <div className="saved-item-header">
                        <strong>{intake.title}</strong>
                        <span>{formatDateTime(intake.completedAt)}</span>
                      </div>
                      <div className="saved-item-meta">
                        <span className="pill">
                          {getVoiceModeLabel(intake.scenarioId)}
                        </span>
                        <span className="pill">
                          {intake.turnCount} turn
                          {intake.turnCount === 1 ? "" : "s"}
                        </span>
                        {intake.detectedName ? (
                          <span className="pill">{intake.detectedName}</span>
                        ) : null}
                      </div>
                      <div className="saved-answer-list">
                        {intake.promptAnswers.map((entry) => (
                          <div className="saved-answer" key={entry.prompt}>
                            <div className="saved-answer-label">
                              {entry.prompt}
                            </div>
                            <p className="saved-answer-text">
                              {entry.response}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="voice-assistant-label">
                        Full transcript
                      </div>
                      <p>{intake.transcript}</p>
                      <p className="saved-summary">{intake.assistantSummary}</p>
                    </article>
                  ))
                )}
              </div>
            </article>
          </section>
          <p className="footer">
            <img alt="" src="/assets/png/absolutejs-temp.png" />
            Powered by{" "}
            <a
              href="https://absolutejs.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              AbsoluteJS
            </a>
          </p>
        </main>
      </body>
    </html>
  );
};
