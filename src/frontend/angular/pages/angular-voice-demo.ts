import { Component, computed, inject, signal } from "@angular/core";
import { VoiceStreamService } from "@absolutejs/voice/angular";
import {
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
  VOICE_CALL_CONTROL_ACTIONS,
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

@Component({
  selector: "angular-voice-demo-page",
  standalone: true,
  template: `
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
          <a href="/">React</a>
          <a href="/svelte">Svelte</a>
          <a href="/vue">Vue</a>
          <a href="/angular" class="active">Angular</a>
          <a href="/html">HTML</a>
          <a href="/htmx">HTMX</a>
          <a href="/reviews">Reviews</a>
        </nav>
      </header>
      <main class="voice-shell">
        <section class="voice-grid">
          <article class="voice-card voice-hero">
            <div class="voice-hero-layout">
              <div>
                <span class="voice-framework-pill">Angular Service</span>
                <h2>Chat-style voice demo in Angular</h2>
                <p class="voice-brand-copy">{{ description }}</p>
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
                    {{ currentVoice().isConnected() ? "Connected" : "Waiting" }}
                  </span>
                </div>
                <div class="voice-metric">
                  <span class="voice-metric-label">Scenario</span>
                  <span class="voice-metric-value">{{
                    activeMode()
                      ? getVoiceModeLabel(activeMode()!)
                      : "Choose one"
                  }}</span>
                </div>
                <div class="voice-metric">
                  <span class="voice-metric-label">Saved captures</span>
                  <span class="voice-metric-value">{{
                    savedIntakes().length
                  }}</span>
                </div>
                <div class="voice-metric">
                  <span class="voice-metric-label">Model</span>
                  <span class="voice-metric-value">{{
                    getVoiceProviderLabel(modelProvider())
                  }}</span>
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
              <select (change)="changeModelProvider($any($event.target).value)">
                @for (provider of modelProviders; track provider.id) {
                  <option value="{{ provider.id }}">
                    {{ provider.label }}
                  </option>
                }
              </select>
            </label>
          </article>

          <article class="voice-card voice-card-side">
            <h2>{{ guideTitle }}</h2>
            <ol class="voice-guide-list">
              @for (step of guideSteps; track step) {
                <li>{{ step }}</li>
              }
            </ol>
          </article>

          <article class="voice-card voice-assistant-config">
            <span class="voice-framework-pill">Assistant API</span>
            <h2>{{ assistantConfig.id }}</h2>
            <p class="voice-footnote">
              Powered by createVoiceAssistant with a
              {{ assistantConfig.recipe }} artifact plan.
            </p>
            <div class="voice-config-grid">
              <div>
                <div class="voice-assistant-label">Tools</div>
                <ul class="voice-compact-list">
                  @for (item of assistantConfig.tools; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
              <div>
                <div class="voice-assistant-label">Guardrails</div>
                <ul class="voice-compact-list">
                  @for (item of assistantConfig.guardrails; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
              <div>
                <div class="voice-assistant-label">Experiments</div>
                <ul class="voice-compact-list">
                  @for (item of assistantConfig.experiments; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
              <div>
                <div class="voice-assistant-label">Artifacts</div>
                <ul class="voice-compact-list">
                  @for (item of assistantConfig.artifacts; track item) {
                    <li>{{ item }}</li>
                  }
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
                <span class="value">{{ currentVoice().status() }}</span>
              </div>
              <div class="status-row">
                <span class="label">Current prompt</span>
                <span class="value">{{ currentPrompt() }}</span>
              </div>
              <div class="status-row">
                <span class="label">Microphone</span>
                <span class="value">{{
                  isCapturing() ? liveMicCopy : idleMicCopy
                }}</span>
              </div>
              <div class="status-row">
                <span class="label">Current utterance</span>
                <span class="value">{{
                  currentVoice().partial() || "No speech captured yet"
                }}</span>
              </div>
              <div class="status-row">
                <span class="label">Errors</span>
                <span class="value">{{ errorMessage() }}</span>
              </div>
              <div class="status-row">
                <span class="label">Call lifecycle</span>
                <span class="value">{{ callLifecycleLabel() }}</span>
              </div>
            </div>
            <div class="voice-chat-list">
              <article class="voice-chat-message assistant">
                <div class="voice-chat-role">
                  {{
                    activeMode()
                      ? getVoiceModeLabel(activeMode()!)
                      : "Voice demo"
                  }}
                </div>
                <p class="voice-turn-text">{{ leadMessage() }}</p>
              </article>
              @for (turn of currentVoice().turns(); track turn.id) {
                <div class="voice-chat-stack">
                  <article class="voice-chat-message user">
                    <div class="voice-chat-role">You</div>
                    <p class="voice-turn-text">{{ turn.text }}</p>
                  </article>
                  @if (turn.assistantText) {
                    <article class="voice-chat-message assistant">
                      <div class="voice-chat-role">
                        {{
                          activeMode()
                            ? getVoiceModeLabel(activeMode()!)
                            : "Guide"
                        }}
                      </div>
                      <p class="voice-turn-text">{{ turn.assistantText }}</p>
                    </article>
                  }
                </div>
              }
              @if (currentVoice().partial()) {
                <article class="voice-chat-message user pending">
                  <div class="voice-chat-role">Speaking</div>
                  <p class="voice-turn-text">{{ currentVoice().partial() }}</p>
                </article>
              }
            </div>
            <div class="voice-monitor" [class.is-live]="isCapturing()">
              <div class="voice-monitor-header">
                <span class="voice-monitor-label">Input monitor</span>
                <span class="voice-live-pill" [class.is-live]="isCapturing()">
                  <span class="voice-live-dot"></span>
                  {{ isCapturing() ? "Microphone live" : "Microphone idle" }}
                </span>
              </div>
              <svg
                aria-label="Microphone waveform"
                class="voice-wave"
                viewBox="0 0 320 88"
              >
                <path class="voice-wave-baseline" d="M 0 44 L 320 44" />
                <path class="voice-wave-glow" [attr.d]="wavePath()" />
                <path class="voice-wave-line" [attr.d]="wavePath()" />
              </svg>
            </div>
            <div class="voice-actions">
              @if (isCapturing()) {
                <button class="primary" type="button" (click)="stopMic()">
                  {{ stopLabel }}
                </button>
              } @else {
                <button
                  class="primary"
                  type="button"
                  (click)="startMode('guided')"
                >
                  {{ guidedLabel }}
                </button>
                <button type="button" (click)="startMode('general')">
                  {{ generalLabel }}
                </button>
              }
            </div>
            <div class="voice-actions">
              @for (action of callControlActions; track action.action) {
                <button type="button" (click)="runCallControl(action)">
                  {{ action.label }}
                </button>
              }
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
              @if (savedIntakes().length === 0) {
                <p class="empty-copy">No saved captures yet.</p>
              } @else {
                @for (intake of savedIntakes(); track intake.id) {
                  <article class="saved-item">
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
                      @if (intake.detectedName) {
                        <span class="pill">
                          {{ intake.detectedName }}
                        </span>
                      }
                    </div>
                    <div class="saved-answer-list">
                      @for (entry of intake.promptAnswers; track entry.prompt) {
                        <div class="saved-answer">
                          <div class="saved-answer-label">
                            {{ entry.prompt }}
                          </div>
                          <p class="saved-answer-text">{{ entry.response }}</p>
                        </div>
                      }
                    </div>
                    <div class="voice-assistant-label">Full transcript</div>
                    <p>{{ intake.transcript }}</p>
                    <p class="saved-summary">{{ intake.assistantSummary }}</p>
                  </article>
                }
              }
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
  `,
})
export class AngularVoiceDemoComponent {
  assistantConfig = VOICE_ASSISTANT_CONFIG;
  description = FRAMEWORK_DESCRIPTIONS.angular;
  guideSteps = VOICE_DEMO_GUIDE_STEPS;
  guideTitle = VOICE_DEMO_GUIDE_TITLE;
  activeMode = signal<VoiceDemoMode | null>(null);
  modelProvider = signal<VoiceModelProvider>(getInitialVoiceModelProvider());
  modelProviders = VOICE_MODEL_PROVIDERS;
  callControlActions = VOICE_CALL_CONTROL_ACTIONS;
  getVoiceProviderLabel = getVoiceProviderLabel;
  hasStartedModes = signal<Record<VoiceDemoMode, boolean>>({
    general: false,
    guided: false,
  });
  isCapturing = signal(false);
  idleMicCopy = VOICE_DEMO_MIC_IDLE;
  liveMicCopy = VOICE_DEMO_MIC_LIVE;
  micError = signal<string | null>(null);
  savedIntakes = signal<SavedIntake[]>([]);
  generalLabel = VOICE_DEMO_GENERAL_LABEL;
  guidedLabel = VOICE_DEMO_GUIDED_LABEL;
  stopLabel = VOICE_DEMO_STOP_LABEL;
  getVoiceModeLabel = getVoiceModeLabel;
  guidedVoice = inject(VoiceStreamService).connect<SavedIntake>(
    getVoiceRoutePath("guided", this.modelProvider()),
  );
  generalVoice = inject(VoiceStreamService).connect<SavedIntake>(
    getVoiceRoutePath("general", this.modelProvider()),
  );
  currentVoice = computed(() =>
    this.activeMode() === "general" ? this.generalVoice : this.guidedVoice,
  );
  waveLevels = signal(createInitialVoiceWaveLevels());
  currentPrompt = computed(() =>
    getVoiceModePrompt({
      hasStarted:
        (this.activeMode()
          ? this.hasStartedModes()[this.activeMode()!]
          : false) || this.currentVoice().turns().length > 0,
      mode: this.activeMode(),
      status: this.currentVoice().status(),
      turnCount: this.currentVoice().turns().length,
    }),
  );
  leadMessage = computed(() =>
    getVoiceLeadMessage({
      hasStarted:
        (this.activeMode()
          ? this.hasStartedModes()[this.activeMode()!]
          : false) || this.currentVoice().turns().length > 0,
      mode: this.activeMode(),
      status: this.currentVoice().status(),
      turnCount: this.currentVoice().turns().length,
    }),
  );
  errorMessage = computed(
    () => this.micError() ?? this.currentVoice().error() ?? "None",
  );
  callLifecycleLabel = computed(() => {
    const call = this.currentVoice().call();
    return call?.disposition
      ? `${call.disposition} after ${call.events.length} lifecycle event${call.events.length === 1 ? "" : "s"}`
      : (call?.events.at(-1)?.type ?? "Not started");
  });
  wavePath = computed(() => createVoiceWavePath(this.waveLevels()));
  private microphone: ReturnType<typeof createDemoMicrophone> | null = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      void this.refreshIntakes();
      this.refreshTimer = setInterval(() => {
        void this.refreshIntakes();
      }, 4_000);
    }
  }

  formatDateTime = formatDateTime;

  async refreshIntakes() {
    this.savedIntakes.set(await fetchSavedIntakes());
  }

  async startMic() {
    try {
      this.microphone ??= createDemoMicrophone(
        (audio) =>
          (this.activeMode() === "general"
            ? this.generalVoice
            : this.guidedVoice
          ).sendAudio(audio),
        (level) => {
          this.waveLevels.update((current) =>
            pushVoiceWaveLevel(current, level),
          );
        },
      );
      await this.microphone.start();
      this.micError.set(null);
      this.isCapturing.set(true);
    } catch (error) {
      this.microphone?.stop();
      this.microphone = null;
      this.isCapturing.set(false);
      this.waveLevels.set(createInitialVoiceWaveLevels());
      this.micError.set(formatErrorMessage(error));
    }
  }

  stopMic() {
    this.microphone?.stop();
    this.isCapturing.set(false);
    this.waveLevels.set(createInitialVoiceWaveLevels());
  }

  changeModelProvider(provider: VoiceModelProvider) {
    this.stopMic();
    rememberVoiceModelProvider(provider);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("provider", provider);
    window.location.href = nextUrl.toString();
  }

  async startMode(mode: VoiceDemoMode) {
    this.activeMode.set(mode);
    this.hasStartedModes.update((current) => ({
      ...current,
      [mode]: true,
    }));
    await this.startMic();
  }

  runCallControl(action: (typeof VOICE_CALL_CONTROL_ACTIONS)[number]) {
    this.currentVoice().callControl(action);
    this.stopMic();
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.stopMic();
    this.guidedVoice.close();
    this.generalVoice.close();
  }
}

export const factory = () => AngularVoiceDemoComponent;
