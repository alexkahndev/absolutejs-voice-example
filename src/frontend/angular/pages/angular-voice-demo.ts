import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { defineVoiceProviderSimulationControlsElement } from "@absolutejs/voice/client";
import {
  VoiceOpsStatusService,
  VoiceCampaignDialerProofService,
  VoiceProviderCapabilitiesService,
  VoiceProviderStatusService,
  VoiceRoutingStatusService,
  VoiceStreamService,
  VoiceTraceTimelineService,
  VoiceTurnLatencyService,
  VoiceTurnQualityService,
} from "@absolutejs/voice/angular";
import {
  FRAMEWORK_DESCRIPTIONS,
  getInitialVoiceModelProvider,
  getInitialVoiceRoutingMode,
  getVoiceLeadMessage,
  getVoiceModeLabel,
  getVoiceModePrompt,
  getVoiceProviderLabel,
  getVoiceRoutingLabel,
  getVoiceRoutePath,
  rememberVoiceModelProvider,
  rememberVoiceRoutingMode,
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
  VOICE_ROUTING_MODES,
  type SavedIntake,
  type VoiceDemoMode,
  type VoiceModelProvider,
  type VoiceRoutingMode,
} from "../../../shared/demo";
import {
  createInitialVoiceWaveLevels,
  createVoiceWavePath,
  createDemoBargeInEvidence,
  createDemoLiveTurnLatencyEvidence,
  createDemoMicrophone,
  fetchBargeInReport,
  fetchSavedIntakes,
  getOpsStatusLabel,
  formatErrorMessage,
  formatDateTime,
  renderDemoBargeInProofHTML,
  renderDemoLiveTurnLatencyHTML,
  pushVoiceWaveLevel,
} from "../../shared/browser";

@Component({
  selector: "angular-voice-demo-page",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
          <a href="/traces">Traces</a>
          <a href="/carriers">Carriers</a>
          <a href="/phone-agent">Phone Agent</a>
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
                <div class="voice-metric">
                  <span class="voice-metric-label">Routing</span>
                  <span class="voice-metric-value">{{
                    getVoiceRoutingLabel(routingMode())
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
              <select
                (change)="changeModelProvider($any($event.target).value)"
              >
                @for (provider of modelProviders; track provider.id) {
                  <option
                    value="{{ provider.id }}"
                    [attr.selected]="provider.id === modelProvider() ? '' : null"
                  >
                    {{ provider.label }}
                  </option>
                }
              </select>
            </label>
            <label class="voice-provider-select">
              <span>STT routing</span>
              <select
                (change)="changeRoutingMode($any($event.target).value)"
              >
                @for (routing of routingModes; track routing.id) {
                  <option
                    value="{{ routing.id }}"
                    [attr.selected]="routing.id === routingMode() ? '' : null"
                  >
                    {{ routing.label }}
                  </option>
                }
              </select>
            </label>
            <p class="voice-footnote">
              {{ routingDescription() }}
            </p>
          </article>

          <article class="voice-card voice-routing-card">
            <span class="voice-framework-pill">Routing Trace</span>
            <h2>Why this STT provider?</h2>
            <p class="voice-footnote">
              Latest router event from the self-hosted trace store.
            </p>
            @if (routingStatus.decision(); as decision) {
              <div class="voice-routing-grid">
                <div>
                  <span>Policy</span>
                  <strong>{{ getVoiceRoutingLabel(decision.routing) }}</strong>
                </div>
                <div>
                  <span>Provider</span>
                  <strong>{{ decision.provider }}</strong>
                </div>
                <div>
                  <span>Selected</span>
                  <strong>{{ decision.selectedProvider }}</strong>
                </div>
                <div>
                  <span>Fallback</span>
                  <strong>{{ decision.fallbackProvider ?? "None" }}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{{ decision.status }}</strong>
                </div>
                <div>
                  <span>Latency budget</span>
                  <strong>{{
                    decision.latencyBudgetMs
                      ? decision.latencyBudgetMs + "ms"
                      : "None"
                  }}</strong>
                </div>
              </div>
            } @else {
              <p class="empty-copy">
                Start a voice session to see the selected STT provider.
              </p>
            }
          </article>

          <article class="voice-card voice-provider-health-card">
            <span class="voice-framework-pill">Campaign Dialer Proof</span>
            <h2>Carrier dialer dry-run</h2>
            <p class="voice-footnote">
              Twilio, Telnyx, and Plivo campaign dials run through the Angular
              service, attach campaign metadata, and resolve synthetic webhook
              outcomes.
            </p>
            <button
              class="absolute-voice-turn-latency__proof"
              type="button"
              [disabled]="campaignDialerProof.isLoading()"
              (click)="runCampaignDialerProof()"
            >
              {{
                campaignDialerProof.isLoading()
                  ? "Running proof"
                  : "Run campaign dialer proof"
              }}
            </button>
            @if (campaignDialerProof.report()?.providers?.length) {
              <div class="voice-provider-health-list">
                @for (provider of campaignDialerProof.report()!.providers; track provider.provider) {
                  <div class="voice-provider-health-item">
                    <strong>{{ provider.provider }}</strong>
                    <span>
                      {{
                        campaignDialerProofProviderPassed(provider)
                          ? "passed"
                          : "needs attention"
                      }}
                    </span>
                    <small>
                      {{ provider.carrierRequests.length }} dry-run carrier request{{
                        provider.carrierRequests.length === 1 ? "" : "s"
                      }}
                    </small>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-copy">
                Ready for
                {{
                  (campaignDialerProof.status()?.providers ?? [
                    "twilio",
                    "telnyx",
                    "plivo"
                  ]).join(", ")
                }}.
              </p>
            }
            @if (campaignDialerProof.error()) {
              <p class="voice-footnote">{{ campaignDialerProof.error() }}</p>
            }
            <p class="voice-footnote">
              <a href="/voice/campaigns/dialer-proof">Open full proof</a>
            </p>
          </article>

          <article class="voice-card voice-provider-health-card">
            <span class="voice-framework-pill">Provider Health</span>
            <h2>
              {{
                providerStatus.providers().length
                  ? providerStatus.providers().length + " tracked"
                  : "Checking providers"
              }}
            </h2>
            <p class="voice-footnote">
              Live model provider health, fallback counts, and cooldown state.
            </p>
            @if (providerStatus.providers().length) {
              <div class="voice-provider-health-list">
                @for (provider of providerStatus.providers(); track provider.provider) {
                  <div class="voice-provider-health-item">
                    <strong>{{ provider.provider }}</strong>
                    <span>{{ provider.status }}</span>
                    <small>
                      {{ provider.runCount }} runs · {{ provider.errorCount }}
                      errors · {{ provider.fallbackCount }} fallbacks
                    </small>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-copy">Run assistant traffic to see provider health.</p>
            }
          </article>

          <article class="voice-card voice-provider-health-card">
            <span class="voice-framework-pill">Provider Capabilities</span>
            <h2>
              {{
                providerCapabilities.report()
                  ? providerCapabilities.report()!.selected + " selected"
                  : "Checking capabilities"
              }}
            </h2>
            <p class="voice-footnote">
              Configured LLM/STT providers, selected defaults, models, and feature coverage.
            </p>
            @if (providerCapabilities.report()?.capabilities?.length) {
              <div class="voice-provider-health-list">
                @for (
                  capability of providerCapabilities.report()!.capabilities;
                  track capability.kind + ":" + capability.provider
                ) {
                  <div class="voice-provider-health-item">
                    <strong>{{ capability.provider }} {{ capability.kind }}</strong>
                    <span>{{ capability.status }}</span>
                    <small>
                      {{ capability.model || "default" }} ·
                      {{ capability.features?.join(", ") || "features not specified" }}
                    </small>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-copy">Configure provider capabilities to see coverage.</p>
            }
          </article>

          <absolute-voice-provider-simulation
            class="voice-card voice-provider-simulation-card"
            failure-message="Prove Deepgram STT failover to AssemblyAI without changing credentials."
            failure-providers="deepgram"
            fallback-required-message="Add ASSEMBLYAI_API_KEY to enable the fallback simulation."
            fallback-required-provider="assemblyai"
            kind="stt"
            providers="deepgram,assemblyai"
          ></absolute-voice-provider-simulation>

          <article class="voice-card voice-provider-health-card">
            <span class="voice-framework-pill">Turn Quality</span>
            <h2>
              {{
                turnQuality.report()
                  ? turnQuality.report()!.warnings + " warnings"
                  : "Checking turns"
              }}
            </h2>
            <p class="voice-footnote">
              STT confidence, fallback selection, correction, and transcript coverage.
            </p>
            @if (turnQuality.report()?.turns?.length) {
              <div class="voice-provider-health-list">
                @for (turn of turnQuality.report()!.turns; track turn.sessionId + ":" + turn.turnId) {
                  <div class="voice-provider-health-item">
                    <strong>{{ turn.text || "Empty turn" }}</strong>
                    <span>{{ turn.status }}</span>
                    <small>
                      {{ turn.source || "unknown" }} ·
                      {{ turn.fallbackUsed ? "fallback" : "primary" }} ·
                      confidence
                      {{
                        turn.averageConfidence === undefined
                          ? "n/a"
                          : (turn.averageConfidence * 100).toFixed(0) + "%"
                      }}
                    </small>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-copy">Complete a turn to see quality diagnostics.</p>
            }
          </article>

          <article class="voice-card voice-provider-health-card">
            <span class="voice-framework-pill">Turn Latency</span>
            <h2>
              {{
                turnLatency.report()?.averageTotalMs
                  ? turnLatency.report()!.averageTotalMs + "ms avg"
                  : "Checking latency"
              }}
            </h2>
            <p class="voice-footnote">
              End-to-end turn responsiveness from transcript timing to assistant start.
            </p>
            <button
              class="absolute-voice-turn-latency__proof"
              type="button"
              (click)="runTurnLatencyProof()"
            >
              Run latency proof
            </button>
            @if (turnLatency.report()?.turns?.length) {
              <div class="voice-provider-health-list">
                @for (turn of turnLatency.report()!.turns; track turn.sessionId + ":" + turn.turnId) {
                  <div class="voice-provider-health-item">
                    <strong>{{ turn.text || "Empty turn" }}</strong>
                    <span>{{ turn.status }}</span>
                    <small>
                      {{
                        turn.totalMs === undefined ? "n/a" : turn.totalMs + "ms"
                      }}
                      · {{ turn.stages[0]?.label || "stage" }}
                    </small>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-copy">Complete a turn to see latency diagnostics.</p>
            }
          </article>

          <article
            class="voice-card voice-workflow-card"
            [class.is-failing]="opsStatus.report()?.status === 'fail'"
          >
            <span class="voice-framework-pill">Voice Ops Status</span>
            <h2>{{ getOpsStatusLabel(opsStatus.report()) }}</h2>
            <p class="voice-footnote">
              One embedded readiness check for certified workflows, provider
              health, and handoffs.
            </p>
            <div class="voice-workflow-summary">
              <span class="pill"
                >{{ opsStatus.report()?.passed ?? 0 }} passing</span
              >
              <span class="pill"
                >{{ opsStatus.report()?.failed ?? 0 }} failing</span
              >
              <span class="pill"
                >{{ opsStatus.report()?.total ?? 0 }} checks</span
              >
            </div>
            <p class="voice-footnote">
              <a href="/api/voice/ops-status">Open ops status</a> ·
              <a href="/evals/fixtures">Open certified fixtures</a>
            </p>
          </article>

          <article
            class="voice-card voice-provider-health-card absolute-voice-trace-timeline"
            [class.absolute-voice-trace-timeline--failed]="
              (traceTimeline.report()?.failed ?? 0) > 0
            "
          >
            <header class="absolute-voice-trace-timeline__header">
              <span class="absolute-voice-trace-timeline__eyebrow"
                >Voice Traces</span
              >
              <strong class="absolute-voice-trace-timeline__label">
                {{ traceTimeline.report()?.total ?? 0 }} recent
              </strong>
            </header>
            <p class="absolute-voice-trace-timeline__description">
              Latest call timelines from the Angular service primitive.
            </p>
            @if ((traceTimeline.report()?.sessions?.length ?? 0) > 0) {
              <div class="absolute-voice-trace-timeline__sessions">
                @for (
                  session of traceTimeline.report()?.sessions?.slice(0, 2) ?? [];
                  track session.sessionId
                ) {
                  <article
                    class="absolute-voice-trace-timeline__session"
                    [class.absolute-voice-trace-timeline__session--failed]="
                      session.status === 'failed'
                    "
                  >
                    <header>
                      <strong>{{ session.sessionId }}</strong>
                      <span>{{ session.status }}</span>
                    </header>
                    <p>
                      {{ session.summary.eventCount }} events ·
                      {{ session.summary.turnCount }} turns ·
                      {{ session.providers.length }} providers
                    </p>
                    <a href="/traces/{{ session.sessionId }}">Open timeline</a>
                  </article>
                }
              </div>
            } @else {
              <p class="absolute-voice-trace-timeline__empty">
                Run a voice session to see call timelines.
              </p>
            }
          </article>

          <div [innerHTML]="bargeInProofHtml()"></div>

          <div [innerHTML]="liveLatencyHtml()"></div>

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
              <a href="/integrations">Open integration events</a> ·
              <a href="/barge-in">Open barge-in proof</a>
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
  routingMode = signal<VoiceRoutingMode>(getInitialVoiceRoutingMode());
  modelProviders = VOICE_MODEL_PROVIDERS;
  routingModes = VOICE_ROUTING_MODES;
  callControlActions = VOICE_CALL_CONTROL_ACTIONS;
  getVoiceProviderLabel = getVoiceProviderLabel;
  getVoiceRoutingLabel = getVoiceRoutingLabel;
  getOpsStatusLabel = getOpsStatusLabel;
  hasStartedModes = signal<Record<VoiceDemoMode, boolean>>({
    general: false,
    guided: false,
  });
  isCapturing = signal(false);
  idleMicCopy = VOICE_DEMO_MIC_IDLE;
  liveMicCopy = VOICE_DEMO_MIC_LIVE;
  micError = signal<string | null>(null);
  bargeInProofHtml = signal(renderDemoBargeInProofHTML(null));
  liveLatencyHtml = signal("");
  savedIntakes = signal<SavedIntake[]>([]);
  generalLabel = VOICE_DEMO_GENERAL_LABEL;
  guidedLabel = VOICE_DEMO_GUIDED_LABEL;
  stopLabel = VOICE_DEMO_STOP_LABEL;
  getVoiceModeLabel = getVoiceModeLabel;
  guidedVoice = inject(VoiceStreamService).connect<SavedIntake>(
    getVoiceRoutePath("guided", this.modelProvider(), this.routingMode()),
  );
  generalVoice = inject(VoiceStreamService).connect<SavedIntake>(
    getVoiceRoutePath("general", this.modelProvider(), this.routingMode()),
  );
  opsStatus = inject(VoiceOpsStatusService).connect("/api/voice/ops-status", {
    intervalMs: 5_000,
  });
  providerStatus = inject(VoiceProviderStatusService).connect(
    "/api/provider-status",
    {
      intervalMs: 5_000,
    },
  );
  providerCapabilities = inject(VoiceProviderCapabilitiesService).connect(
    "/api/provider-capabilities",
    {
      intervalMs: 5_000,
    },
  );
  routingStatus = inject(VoiceRoutingStatusService).connect(
    "/api/routing/latest",
    {
      intervalMs: 4_000,
    },
  );
  campaignDialerProof = inject(VoiceCampaignDialerProofService).connect(
    "/api/voice/campaigns/dialer-proof",
  );
  turnQuality = inject(VoiceTurnQualityService).connect("/api/turn-quality", {
    intervalMs: 5_000,
  });
  turnLatency = inject(VoiceTurnLatencyService).connect("/api/turn-latency", {
    intervalMs: 5_000,
    proofPath: "/api/turn-latency/proof",
  });
  traceTimeline = inject(VoiceTraceTimelineService).connect(
    "/api/voice-traces",
    {
      intervalMs: 5_000,
    },
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
  bargeInEvidence = createDemoBargeInEvidence(() => {
    const voice = this.currentVoice();
    return {
      assistantAudio: voice.assistantAudio(),
      assistantTexts: voice.assistantTexts(),
      sendAudio: (audio) => voice.sendAudio(audio),
      sessionId: voice.sessionId(),
    };
  });
  liveLatencyEvidence = createDemoLiveTurnLatencyEvidence(() => {
    const voice = this.currentVoice();
    return {
      assistantAudio: voice.assistantAudio(),
      assistantTexts: voice.assistantTexts(),
      sessionId: voice.sessionId(),
    };
  });
  routingDescription = computed(
    () =>
      this.routingModes.find((item) => item.id === this.routingMode())
        ?.description ?? "",
  );
  wavePath = computed(() => createVoiceWavePath(this.waveLevels()));
  private microphone: ReturnType<typeof createDemoMicrophone> | null = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private bargeInProofTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    defineVoiceProviderSimulationControlsElement();
    effect(() => {
      const voice = this.currentVoice();
      voice.assistantAudio().length;
      voice.assistantTexts().length;
      voice.sessionId();
      queueMicrotask(() => this.syncLiveLatencyProof());
    });
    if (typeof window !== "undefined") {
      void this.refreshBargeInProof();
      this.bargeInProofTimer = setInterval(() => {
        void this.refreshBargeInProof();
      }, 3_000);
      void this.refreshIntakes();
      this.refreshTimer = setInterval(() => {
        void this.refreshIntakes();
      }, 4_000);
      this.syncLiveLatencyProof();
    }
  }

  formatDateTime = formatDateTime;

  async refreshIntakes() {
    this.savedIntakes.set(await fetchSavedIntakes());
  }

  async refreshBargeInProof() {
    try {
      this.bargeInProofHtml.set(
        renderDemoBargeInProofHTML(await fetchBargeInReport()),
      );
    } catch (error) {
      this.bargeInProofHtml.set(
        renderDemoBargeInProofHTML(null, formatErrorMessage(error)),
      );
    }
  }

  async startMic() {
    try {
      this.microphone ??= createDemoMicrophone(
        (audio) => {
          this.liveLatencyEvidence.recordAudio(audio);
          this.syncLiveLatencyProof();
          this.bargeInEvidence.sendAudio(audio);
        },
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

  changeRoutingMode(routing: VoiceRoutingMode) {
    this.stopMic();
    rememberVoiceRoutingMode(routing);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("routing", routing);
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

  runTurnLatencyProof() {
    void this.turnLatency.runProof().catch(() => {});
  }

  runCampaignDialerProof() {
    void this.campaignDialerProof.runProof().catch(() => {});
  }

  campaignDialerProofProviderPassed(provider: {
    outcomes: Array<{ applied: boolean }>;
  }) {
    return provider.outcomes.every((outcome) => outcome.applied);
  }

  syncLiveLatencyProof() {
    this.liveLatencyEvidence.syncAssistantOutput();
    this.liveLatencyHtml.set(
      renderDemoLiveTurnLatencyHTML(this.liveLatencyEvidence.getSnapshot()),
    );
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    if (this.bargeInProofTimer) {
      clearInterval(this.bargeInProofTimer);
    }
    this.stopMic();
    this.guidedVoice.close();
    this.generalVoice.close();
    this.opsStatus.close();
    this.providerCapabilities.close();
    this.providerStatus.close();
    this.campaignDialerProof.close();
    this.routingStatus.close();
    this.turnQuality.close();
    this.turnLatency.close();
  }
}

export const factory = () => AngularVoiceDemoComponent;

const AngularVoiceDemoDefault = AngularVoiceDemoComponent;

export default AngularVoiceDemoDefault;
