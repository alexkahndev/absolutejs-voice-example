import {
  createVoiceStream,
  mountVoiceOpsStatus,
  mountVoiceProviderCapabilities,
  mountVoiceProviderSimulationControls,
  mountVoiceProviderStatus,
  mountVoiceRoutingStatus,
} from "@absolutejs/voice/client";
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
  getVoiceLeadMessage,
  getVoiceModeLabel,
  getVoiceModePrompt,
  getVoiceProviderLabel,
  getVoiceRoutingLabel,
  getVoiceRoutePath,
  getInitialVoiceModelProvider,
  getInitialVoiceRoutingMode,
  rememberVoiceModelProvider,
  rememberVoiceRoutingMode,
  VOICE_DEMO_GENERAL_LABEL,
  VOICE_DEMO_GUIDED_LABEL,
  VOICE_DEMO_MIC_IDLE,
  VOICE_DEMO_MIC_LIVE,
  VOICE_DEMO_STOP_LABEL,
  VOICE_CALL_CONTROL_ACTIONS,
  VOICE_ROUTING_MODES,
  type VoiceModelProvider,
  type VoiceRoutingMode,
  type SavedIntake,
  type VoiceDemoMode,
} from "../../../shared/demo";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

type HtmxWindow = Window & {
  htmx?: {
    trigger: (target: string | Element, event: string) => void;
  };
};

const framework = document.body.dataset.framework ?? "html";
const chatList = document.querySelector("#chat-list");
const connectionMetric = document.querySelector("#metric-connection");
const errorStatus = document.querySelector("#status-error");
const intakesMetric = document.querySelector("#metric-intakes");
const microphoneStatus = document.querySelector("#status-mic");
const modelProviderMetric = document.querySelector("#metric-provider");
const modelProviderSelect = document.querySelector("#model-provider-select");
const partialStatus = document.querySelector("#status-partial");
const promptStatus = document.querySelector("#status-prompt");
const savedIntakesRoot = document.querySelector("#saved-intakes");
const sessionMetric = document.querySelector("#metric-session");
const startGuidedButton = document.querySelector("#start-guided");
const startGeneralButton = document.querySelector("#start-general");
const stopButton = document.querySelector("#stop-mic");
const callControlRoot = document.querySelector("#call-control-actions");
const callLifecycleStatus = document.querySelector("#status-call-lifecycle");
const voiceStatus = document.querySelector("#status-voice");
const voiceMonitor = document.querySelector("#voice-monitor");
const voiceMonitorCopy = document.querySelector("#voice-monitor-copy");
const voiceWaveGlow = document.querySelector("#voice-wave-glow");
const voiceWavePath = document.querySelector("#voice-wave-path");
const workflowStatusHost = document.querySelector("#workflow-status-card");
const providerCapabilitiesHost = document.querySelector(
  "#provider-capabilities-card",
);
const providerStatusHost = document.querySelector("#provider-status-card");
const providerSimulationHost = document.querySelector(
  "#provider-simulation-card",
);
const routingModeCopy = document.querySelector("#routing-mode-copy");
const routingDecisionRoot = document.querySelector("#routing-decision");
const routingModeMetric = document.querySelector("#metric-routing");
const routingModeSelect = document.querySelector("#routing-mode-select");

if (
  !(chatList instanceof HTMLElement) ||
  !(connectionMetric instanceof HTMLElement) ||
  !(errorStatus instanceof HTMLElement) ||
  !(intakesMetric instanceof HTMLElement) ||
  !(microphoneStatus instanceof HTMLElement) ||
  !(modelProviderMetric instanceof HTMLElement) ||
  !(modelProviderSelect instanceof HTMLSelectElement) ||
  !(partialStatus instanceof HTMLElement) ||
  !(promptStatus instanceof HTMLElement) ||
  !(savedIntakesRoot instanceof HTMLElement) ||
  !(sessionMetric instanceof HTMLElement) ||
  !(startGuidedButton instanceof HTMLButtonElement) ||
  !(startGeneralButton instanceof HTMLButtonElement) ||
  !(stopButton instanceof HTMLButtonElement) ||
  !(callControlRoot instanceof HTMLElement) ||
  !(callLifecycleStatus instanceof HTMLElement) ||
  !(voiceMonitor instanceof HTMLElement) ||
  !(voiceMonitorCopy instanceof HTMLElement) ||
  !(voiceWaveGlow instanceof SVGPathElement) ||
  !(voiceWavePath instanceof SVGPathElement) ||
  !(workflowStatusHost instanceof HTMLElement) ||
  !(providerCapabilitiesHost instanceof HTMLElement) ||
  !(providerStatusHost instanceof HTMLElement) ||
  !(providerSimulationHost instanceof HTMLElement) ||
  !(routingModeCopy instanceof HTMLElement) ||
  !(routingDecisionRoot instanceof HTMLElement) ||
  !(routingModeMetric instanceof HTMLElement) ||
  !(routingModeSelect instanceof HTMLSelectElement) ||
  !(voiceStatus instanceof HTMLElement)
) {
  throw new Error("Voice demo page is missing expected elements.");
}

const modelProvider = getInitialVoiceModelProvider();
const routingMode = getInitialVoiceRoutingMode();
modelProviderSelect.value = modelProvider;
routingModeSelect.value = routingMode;
const guidedVoice = createVoiceStream<SavedIntake>(
  getVoiceRoutePath("guided", modelProvider, routingMode),
);
const generalVoice = createVoiceStream<SavedIntake>(
  getVoiceRoutePath("general", modelProvider, routingMode),
);
const opsStatus = mountVoiceOpsStatus(workflowStatusHost, "/app-kit/status", {
  intervalMs: 5_000,
});
const providerStatus = mountVoiceProviderStatus(
  providerStatusHost,
  "/api/provider-status",
  {
    intervalMs: 5_000,
  },
);
const providerCapabilities = mountVoiceProviderCapabilities(
  providerCapabilitiesHost,
  "/api/provider-capabilities",
  {
    intervalMs: 5_000,
  },
);
const providerSimulation = mountVoiceProviderSimulationControls(
  providerSimulationHost,
  {
    failureMessage:
      "Prove Deepgram STT failover to AssemblyAI without changing credentials.",
    failureProviders: ["deepgram"],
    fallbackRequiredMessage:
      "Add ASSEMBLYAI_API_KEY to enable the fallback simulation.",
    fallbackRequiredProvider: "assemblyai",
    kind: "stt",
    providers: [{ provider: "deepgram" }, { provider: "assemblyai" }],
  },
);
const routingStatus = mountVoiceRoutingStatus(
  routingDecisionRoot,
  "/api/routing/latest",
  {
    intervalMs: 4_000,
  },
);
let activeMode: VoiceDemoMode | null = null;
let hasStartedModes: Record<VoiceDemoMode, boolean> = {
  general: false,
  guided: false,
};
const currentVoice = () =>
  activeMode === "general" ? generalVoice : guidedVoice;
const microphone = createDemoMicrophone(
  (audio) => currentVoice().sendAudio(audio),
  (level) => {
    waveLevels = pushVoiceWaveLevel(waveLevels, level);
    renderWave();
  },
);
let isCapturing = false;
let micError: string | null = null;
let waveLevels = createInitialVoiceWaveLevels();

const renderWave = () => {
  const path = createVoiceWavePath(waveLevels);
  voiceWaveGlow.setAttribute("d", path);
  voiceWavePath.setAttribute("d", path);
  voiceMonitorCopy.innerHTML = `<span class="voice-live-dot"></span>${
    isCapturing ? "Microphone live" : "Microphone idle"
  }`;
  voiceMonitorCopy.classList.toggle("is-live", isCapturing);
  voiceMonitor.classList.toggle("is-live", isCapturing);
};

const renderChat = () => {
  const voice = currentVoice();
  const leadMessage = getVoiceLeadMessage({
    hasStarted:
      (activeMode ? hasStartedModes[activeMode] : false) ||
      voice.turns.length > 0,
    mode: activeMode,
    status: voice.status,
    turnCount: voice.turns.length,
  });

  chatList.innerHTML = `<article class="voice-chat-message assistant">
  <div class="voice-chat-role">${escapeHtml(activeMode ? getVoiceModeLabel(activeMode) : "Voice demo")}</div>
  <p class="voice-turn-text">${escapeHtml(leadMessage)}</p>
</article>${voice.turns
    .map(
      (turn) => `<div class="voice-chat-stack">
  <article class="voice-chat-message user">
    <div class="voice-chat-role">You</div>
    <p class="voice-turn-text">${escapeHtml(turn.text)}</p>
  </article>
  ${
    turn.assistantText
      ? `<article class="voice-chat-message assistant">
    <div class="voice-chat-role">${escapeHtml(activeMode ? getVoiceModeLabel(activeMode) : "Guide")}</div>
    <p class="voice-turn-text">${escapeHtml(turn.assistantText)}</p>
  </article>`
      : ""
  }
</div>`,
    )
    .join("")}${
    voice.partial
      ? `<article class="voice-chat-message user pending">
  <div class="voice-chat-role">Speaking</div>
  <p class="voice-turn-text">${escapeHtml(voice.partial)}</p>
</article>`
      : ""
  }`;
};

const renderSavedIntakes = async () => {
  const intakes = await fetchSavedIntakes();
  intakesMetric.textContent = String(intakes.length);

  if (framework === "htmx") {
    const htmxWindow = window as unknown as HtmxWindow;

    if (htmxWindow.htmx) {
      htmxWindow.htmx.trigger(document.body, "refresh");
    }
    return;
  }

  if (intakes.length === 0) {
    savedIntakesRoot.innerHTML = `<p class="empty-copy">No saved captures yet.</p>`;
    return;
  }

  savedIntakesRoot.innerHTML = intakes
    .map(
      (intake) => `<article class="saved-item">
  <div class="saved-item-header">
    <strong>${escapeHtml(intake.title)}</strong>
    <span>${formatDateTime(intake.completedAt)}</span>
  </div>
  <div class="saved-item-meta">
    <span class="pill">${escapeHtml(getVoiceModeLabel(intake.scenarioId))}</span>
    <span class="pill">${intake.turnCount} turn${intake.turnCount === 1 ? "" : "s"}</span>
    ${intake.detectedName ? `<span class="pill">${escapeHtml(intake.detectedName)}</span>` : ""}
  </div>
  <div class="saved-answer-list">
    ${intake.promptAnswers
      .map(
        (entry) => `<div class="saved-answer">
  <div class="saved-answer-label">${escapeHtml(entry.prompt)}</div>
  <p class="saved-answer-text">${escapeHtml(entry.response)}</p>
</div>`,
      )
      .join("")}
  </div>
  <div class="voice-assistant-label">Full transcript</div>
  <p>${escapeHtml(intake.transcript)}</p>
  <p class="saved-summary">${escapeHtml(intake.assistantSummary)}</p>
</article>`,
    )
    .join("");
};

const render = () => {
  const voice = currentVoice();
  connectionMetric.textContent = voice.isConnected ? "Connected" : "Waiting";
  errorStatus.textContent = micError || voice.error || "None";
  microphoneStatus.textContent = isCapturing
    ? VOICE_DEMO_MIC_LIVE
    : VOICE_DEMO_MIC_IDLE;
  promptStatus.textContent = getVoiceModePrompt({
    hasStarted:
      (activeMode ? hasStartedModes[activeMode] : false) ||
      voice.turns.length > 0,
    mode: activeMode,
    status: voice.status,
    turnCount: voice.turns.length,
  });
  startGuidedButton.hidden = isCapturing;
  startGeneralButton.hidden = isCapturing;
  stopButton.hidden = !isCapturing;
  startGuidedButton.textContent = VOICE_DEMO_GUIDED_LABEL;
  startGeneralButton.textContent = VOICE_DEMO_GENERAL_LABEL;
  stopButton.textContent = VOICE_DEMO_STOP_LABEL;
  partialStatus.textContent = voice.partial || "No speech captured yet";
  callLifecycleStatus.textContent = voice.call?.disposition
    ? `${voice.call.disposition} after ${voice.call.events.length} lifecycle event${voice.call.events.length === 1 ? "" : "s"}`
    : (voice.call?.events.at(-1)?.type ?? "Not started");
  modelProviderMetric.textContent = getVoiceProviderLabel(modelProvider);
  routingModeMetric.textContent = getVoiceRoutingLabel(routingMode);
  routingModeCopy.textContent =
    VOICE_ROUTING_MODES.find((item) => item.id === routingMode)?.description ??
    "";
  sessionMetric.textContent = activeMode
    ? getVoiceModeLabel(activeMode)
    : "Choose one";
  voiceStatus.textContent = voice.status;
  renderWave();
  renderChat();
};

callControlRoot.innerHTML = VOICE_CALL_CONTROL_ACTIONS.map(
  (action) =>
    `<button data-call-action="${escapeHtml(action.action)}" type="button">${escapeHtml(action.label)}</button>`,
).join("");

callControlRoot.addEventListener("click", (event) => {
  const button = event.target;
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const action = VOICE_CALL_CONTROL_ACTIONS.find(
    (item) => item.action === button.dataset.callAction,
  );
  if (!action) {
    return;
  }

  currentVoice().callControl(action);
  stopMic();
});

modelProviderSelect.addEventListener("change", () => {
  stopMic();
  rememberVoiceModelProvider(modelProviderSelect.value as VoiceModelProvider);
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("provider", modelProviderSelect.value);
  window.location.href = nextUrl.toString();
});

routingModeSelect.addEventListener("change", () => {
  stopMic();
  rememberVoiceRoutingMode(routingModeSelect.value as VoiceRoutingMode);
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("routing", routingModeSelect.value);
  window.location.href = nextUrl.toString();
});

const stopMic = () => {
  microphone.stop();
  isCapturing = false;
  micError = null;
  waveLevels = createInitialVoiceWaveLevels();
  render();
};

const startMode = async (mode: VoiceDemoMode) => {
  activeMode = mode;
  hasStartedModes = {
    ...hasStartedModes,
    [mode]: true,
  };
  try {
    await microphone.start();
    micError = null;
    isCapturing = true;
    render();
  } catch (error) {
    microphone.stop();
    isCapturing = false;
    waveLevels = createInitialVoiceWaveLevels();
    micError = formatErrorMessage(error);
    render();
  }
};

guidedVoice.subscribe(() => {
  render();
  if (guidedVoice.status === "completed") {
    void renderSavedIntakes();
  }
});

generalVoice.subscribe(() => {
  render();
  if (generalVoice.status === "completed") {
    void renderSavedIntakes();
  }
});

startGuidedButton.addEventListener("click", () => {
  void startMode("guided");
});

startGeneralButton.addEventListener("click", () => {
  void startMode("general");
});

stopButton.addEventListener("click", () => {
  stopMic();
});

window.addEventListener("beforeunload", () => {
  microphone.stop();
  guidedVoice.close();
  generalVoice.close();
});

render();
void renderSavedIntakes();
window.addEventListener("beforeunload", () => {
  opsStatus.close();
  providerCapabilities.close();
  providerSimulation.close();
  providerStatus.close();
  routingStatus.close();
});
