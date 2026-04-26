<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useVoiceStream } from "@absolutejs/voice/vue";
import {
  FRAMEWORKS,
  FRAMEWORK_DESCRIPTIONS,
  getInitialVoiceModelProvider,
  getVoiceLeadMessage,
  getVoiceModeLabel,
  getVoiceModePrompt,
  getVoiceProviderLabel,
  getVoiceRoutePath,
  rememberVoiceModelProvider,
  VOICE_ASSISTANT_CONFIG,
  VOICE_DEMO_GUIDE_STEPS,
  VOICE_DEMO_GUIDE_TITLE,
  VOICE_DEMO_GENERAL_LABEL,
  VOICE_DEMO_GUIDED_LABEL,
  VOICE_DEMO_MIC_IDLE,
  VOICE_DEMO_MIC_LIVE,
  VOICE_DEMO_STOP_LABEL,
  VOICE_MODEL_PROVIDERS,
  type VoiceDemoMode,
  type VoiceModelProvider,
  type SavedIntake,
} from "../../../shared/demo";
import {
  createInitialVoiceWaveLevels,
  createVoiceWavePath,
  createDemoMicrophone,
  fetchSavedIntakes,
  formatErrorMessage,
  formatDateTime,
  pushVoiceWaveLevel,
} from "../../shared/browser";

const modelProvider = ref<VoiceModelProvider>(getInitialVoiceModelProvider());
const guidedVoice = useVoiceStream<SavedIntake>(
  getVoiceRoutePath("guided", modelProvider.value),
);
const generalVoice = useVoiceStream<SavedIntake>(
  getVoiceRoutePath("general", modelProvider.value),
);
const activeMode = ref<VoiceDemoMode | null>(null);
const isCapturing = ref(false);
const hasStartedModes = ref<Record<VoiceDemoMode, boolean>>({
  general: false,
  guided: false,
});
const micError = ref<string | null>(null);
const savedIntakes = ref<SavedIntake[]>([]);
const waveLevels = ref(createInitialVoiceWaveLevels());
let microphone: ReturnType<typeof createDemoMicrophone> | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;
const currentVoice = computed(() =>
  activeMode.value === "general" ? generalVoice : guidedVoice,
);
const wavePath = computed(() => createVoiceWavePath(waveLevels.value));
const errorMessage = computed(
  () => micError.value || currentVoice.value.error.value || "None",
);
const currentPrompt = computed(() =>
  getVoiceModePrompt({
    hasStarted:
      (activeMode.value ? hasStartedModes.value[activeMode.value] : false) ||
      currentVoice.value.turns.value.length > 0,
    mode: activeMode.value,
    status: currentVoice.value.status.value,
    turnCount: currentVoice.value.turns.value.length,
  }),
);
const leadMessage = computed(() =>
  getVoiceLeadMessage({
    hasStarted:
      (activeMode.value ? hasStartedModes.value[activeMode.value] : false) ||
      currentVoice.value.turns.value.length > 0,
    mode: activeMode.value,
    status: currentVoice.value.status.value,
    turnCount: currentVoice.value.turns.value.length,
  }),
);

const refreshIntakes = async () => {
  savedIntakes.value = await fetchSavedIntakes();
};

const startMic = async () => {
  try {
    microphone ??= createDemoMicrophone(
      (audio) =>
        (activeMode.value === "general" ? generalVoice : guidedVoice).sendAudio(
          audio,
        ),
      (level) => {
        waveLevels.value = pushVoiceWaveLevel(waveLevels.value, level);
      },
    );
    await microphone.start();
    micError.value = null;
    isCapturing.value = true;
  } catch (error) {
    microphone?.stop();
    microphone = null;
    isCapturing.value = false;
    waveLevels.value = createInitialVoiceWaveLevels();
    micError.value = formatErrorMessage(error);
  }
};

const stopMic = () => {
  microphone?.stop();
  isCapturing.value = false;
  waveLevels.value = createInitialVoiceWaveLevels();
};

const changeModelProvider = (provider: VoiceModelProvider) => {
  stopMic();
  rememberVoiceModelProvider(provider);
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("provider", provider);
  window.location.href = nextUrl.toString();
};

const changeModelProviderFromEvent = (event: Event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement) {
    changeModelProvider(target.value as VoiceModelProvider);
  }
};

const startMode = async (mode: VoiceDemoMode) => {
  activeMode.value = mode;
  hasStartedModes.value = {
    ...hasStartedModes.value,
    [mode]: true,
  };
  await startMic();
};

onMounted(() => {
  void refreshIntakes();
  refreshTimer = setInterval(() => {
    void refreshIntakes();
  }, 4_000);
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  stopMic();
});
</script>

<template>
  <div class="voice-demo-page">
    <header>
      <a class="logo" href="/">
        <img
          alt="AbsoluteJS"
          height="24"
          src="/assets/png/absolutejs-temp.png"
        />
        AbsoluteJS
      </a>
      <nav>
        <a
          v-for="framework in FRAMEWORKS"
          :key="framework.id"
          :class="{ active: framework.id === 'vue' }"
          :href="framework.href"
        >
          {{ framework.label }}
        </a>
        <a href="/reviews">Reviews</a>
      </nav>
    </header>
    <main class="voice-shell">
      <section class="voice-grid">
        <article class="voice-card voice-hero">
          <div class="voice-hero-layout">
            <div>
              <span class="voice-framework-pill">Vue Composable</span>
              <h2>Chat-style voice demo in Vue</h2>
              <p class="voice-brand-copy">
                {{ FRAMEWORK_DESCRIPTIONS.vue }}
              </p>
              <div class="voice-badges">
                <span class="voice-badge">Deepgram Flux</span>
                <span class="voice-badge">Phrase hint correction</span>
                <span class="voice-badge">Reconnect-aware sessions</span>
              </div>
            </div>
            <div class="voice-metrics">
              <div class="voice-metric">
                <span class="voice-metric-label">Connection</span>
                <span class="voice-metric-value">
                  {{ currentVoice.isConnected.value ? "Connected" : "Waiting" }}
                </span>
              </div>
              <div class="voice-metric">
                <span class="voice-metric-label">Scenario</span>
                <span class="voice-metric-value">
                  {{
                    activeMode ? getVoiceModeLabel(activeMode) : "Choose one"
                  }}
                </span>
              </div>
              <div class="voice-metric">
                <span class="voice-metric-label">Saved captures</span>
                <span class="voice-metric-value">{{
                  savedIntakes.length
                }}</span>
              </div>
              <div class="voice-metric">
                <span class="voice-metric-label">Model</span>
                <span class="voice-metric-value">
                  {{ getVoiceProviderLabel(modelProvider) }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article class="voice-card voice-provider-card">
          <span class="voice-framework-pill">Model Provider</span>
          <h2>Choose the assistant brain</h2>
          <p class="voice-footnote">
            Switch providers before starting the microphone. The voice route
            receives the selected provider on every session.
          </p>
          <label class="voice-provider-select">
            <span>Provider</span>
            <select
              :value="modelProvider"
              @change="changeModelProviderFromEvent"
            >
              <option
                v-for="provider in VOICE_MODEL_PROVIDERS"
                :key="provider.id"
                :value="provider.id"
              >
                {{ provider.label }}
              </option>
            </select>
          </label>
        </article>

        <article class="voice-card voice-card-side">
          <h2>{{ VOICE_DEMO_GUIDE_TITLE }}</h2>
          <ol class="voice-guide-list">
            <li v-for="step in VOICE_DEMO_GUIDE_STEPS" :key="step">
              {{ step }}
            </li>
          </ol>
        </article>

        <article class="voice-card voice-assistant-config">
          <span class="voice-framework-pill">Assistant API</span>
          <h2>{{ VOICE_ASSISTANT_CONFIG.id }}</h2>
          <p class="voice-footnote">
            Powered by createVoiceAssistant with a
            {{ VOICE_ASSISTANT_CONFIG.recipe }} artifact plan.
          </p>
          <div class="voice-config-grid">
            <div>
              <div class="voice-assistant-label">Tools</div>
              <ul class="voice-compact-list">
                <li v-for="item in VOICE_ASSISTANT_CONFIG.tools" :key="item">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div>
              <div class="voice-assistant-label">Guardrails</div>
              <ul class="voice-compact-list">
                <li
                  v-for="item in VOICE_ASSISTANT_CONFIG.guardrails"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
            <div>
              <div class="voice-assistant-label">Experiments</div>
              <ul class="voice-compact-list">
                <li
                  v-for="item in VOICE_ASSISTANT_CONFIG.experiments"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
            <div>
              <div class="voice-assistant-label">Artifacts</div>
              <ul class="voice-compact-list">
                <li
                  v-for="item in VOICE_ASSISTANT_CONFIG.artifacts"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <p class="voice-footnote">
            <a href="/assistant">Open analytics</a> ·
            <a href="/tasks">Open tasks</a> ·
            <a href="/integrations">Open integration events</a>
          </p>
        </article>

        <article class="voice-card voice-card-wide">
          <h2>Conversation</h2>
          <div class="voice-status-list">
            <div class="status-row">
              <span class="label">Voice status</span>
              <span class="value">{{ currentVoice.status.value }}</span>
            </div>
            <div class="status-row">
              <span class="label">Current prompt</span>
              <span class="value">{{ currentPrompt }}</span>
            </div>
            <div class="status-row">
              <span class="label">Microphone</span>
              <span class="value">{{
                isCapturing ? VOICE_DEMO_MIC_LIVE : VOICE_DEMO_MIC_IDLE
              }}</span>
            </div>
            <div class="status-row">
              <span class="label">Current utterance</span>
              <span class="value">
                {{ currentVoice.partial.value || "No speech captured yet" }}
              </span>
            </div>
            <div class="status-row">
              <span class="label">Errors</span>
              <span class="value">{{ errorMessage }}</span>
            </div>
          </div>
          <div class="voice-chat-list">
            <article class="voice-chat-message assistant">
              <div class="voice-chat-role">
                {{ activeMode ? getVoiceModeLabel(activeMode) : "Voice demo" }}
              </div>
              <p class="voice-turn-text">{{ leadMessage }}</p>
            </article>
            <div
              v-for="turn in currentVoice.turns.value"
              :key="turn.id"
              class="voice-chat-stack"
            >
              <article class="voice-chat-message user">
                <div class="voice-chat-role">You</div>
                <p class="voice-turn-text">{{ turn.text }}</p>
              </article>
              <article
                v-if="turn.assistantText"
                class="voice-chat-message assistant"
              >
                <div class="voice-chat-role">
                  {{ activeMode ? getVoiceModeLabel(activeMode) : "Guide" }}
                </div>
                <p class="voice-turn-text">{{ turn.assistantText }}</p>
              </article>
            </div>
            <article
              v-if="currentVoice.partial.value"
              class="voice-chat-message user pending"
            >
              <div class="voice-chat-role">Speaking</div>
              <p class="voice-turn-text">{{ currentVoice.partial.value }}</p>
            </article>
          </div>
          <div :class="['voice-monitor', { 'is-live': isCapturing }]">
            <div class="voice-monitor-header">
              <span class="voice-monitor-label">Input monitor</span>
              <span :class="['voice-live-pill', { 'is-live': isCapturing }]">
                <span class="voice-live-dot"></span>
                {{ isCapturing ? "Microphone live" : "Microphone idle" }}
              </span>
            </div>
            <svg
              aria-label="Microphone waveform"
              class="voice-wave"
              viewBox="0 0 320 88"
            >
              <path class="voice-wave-baseline" d="M 0 44 L 320 44" />
              <path class="voice-wave-glow" :d="wavePath" />
              <path class="voice-wave-line" :d="wavePath" />
            </svg>
          </div>
          <div class="voice-actions">
            <template v-if="isCapturing">
              <button class="primary" @click="stopMic">
                {{ VOICE_DEMO_STOP_LABEL }}
              </button>
            </template>
            <template v-else>
              <button class="primary" @click="startMode('guided')">
                {{ VOICE_DEMO_GUIDED_LABEL }}
              </button>
              <button @click="startMode('general')">
                {{ VOICE_DEMO_GENERAL_LABEL }}
              </button>
            </template>
          </div>
          <p class="voice-footnote">
            This demo uses the dev-only in-memory voice session store. Real
            deployments should replace it with Redis or Postgres.
          </p>
        </article>

        <article class="voice-card voice-hero">
          <h2>Saved captures</h2>
          <p class="voice-footnote">
            Open <a href="/reviews/latest">the latest review</a> or
            <a href="/reviews">browse all reviews</a> after a completed demo
            call.
          </p>
          <div class="voice-saved-list">
            <p v-if="savedIntakes.length === 0" class="empty-copy">
              No saved captures yet.
            </p>
            <article
              v-for="intake in savedIntakes"
              :key="intake.id"
              class="saved-item"
            >
              <div class="saved-item-header">
                <strong>{{ intake.title }}</strong>
                <span>{{ formatDateTime(intake.completedAt) }}</span>
              </div>
              <div class="saved-item-meta">
                <span class="pill">{{
                  getVoiceModeLabel(intake.scenarioId)
                }}</span>
                <span class="pill"
                  >{{ intake.turnCount }} turn{{
                    intake.turnCount === 1 ? "" : "s"
                  }}</span
                >
                <span v-if="intake.detectedName" class="pill">
                  {{ intake.detectedName }}
                </span>
              </div>
              <div class="saved-answer-list">
                <div
                  v-for="entry in intake.promptAnswers"
                  :key="entry.prompt"
                  class="saved-answer"
                >
                  <div class="saved-answer-label">{{ entry.prompt }}</div>
                  <p class="saved-answer-text">{{ entry.response }}</p>
                </div>
              </div>
              <div class="voice-assistant-label">Full transcript</div>
              <p>{{ intake.transcript }}</p>
              <p class="saved-summary">{{ intake.assistantSummary }}</p>
            </article>
          </div>
        </article>
      </section>
      <p class="footer">
        <img src="/assets/png/absolutejs-temp.png" alt="" />
        Powered by
        <a
          href="https://absolutejs.com"
          target="_blank"
          rel="noopener noreferrer"
          >AbsoluteJS</a
        >
      </p>
    </main>
  </div>
</template>
