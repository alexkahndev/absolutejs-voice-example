<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Head from "@absolutejs/absolute/svelte/components/Head.js";
  import {
    createVoiceAppKitStatus,
    createVoiceStream,
  } from "@absolutejs/voice/svelte";
  import type { VoiceStream, VoiceStreamState } from "@absolutejs/voice";
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
    getAppKitStatusLabel,
    formatErrorMessage,
    formatDateTime,
    pushVoiceWaveLevel,
    type VoiceAppKitStatusReport,
  } from "../../shared/browser";

  const createInitialVoiceState = (): VoiceStreamState<SavedIntake> => ({
    assistantTexts: [],
    assistantAudio: [],
    call: null,
    error: null,
    isConnected: false,
    partial: "",
    scenarioId: null,
    sessionId: null,
    status: "idle",
    turns: [],
  });

  let { cssPath }: { cssPath?: string } = $props();
  let activeMode = $state<VoiceDemoMode | null>(null);
  let modelProvider = $state<VoiceModelProvider>(
    getInitialVoiceModelProvider(),
  );
  let error = $state<string | null>(null);
  let hasStartedModes = $state<Record<VoiceDemoMode, boolean>>({
    general: false,
    guided: false,
  });
  let isCapturing = $state(false);
  let savedIntakes = $state<SavedIntake[]>([]);
  let appKitReport = $state<VoiceAppKitStatusReport | null>(null);
  let guidedState = $state(createInitialVoiceState());
  let generalState = $state(createInitialVoiceState());
  let waveLevels = $state(createInitialVoiceWaveLevels());
  let microphone: ReturnType<typeof createDemoMicrophone> | null = null;
  let refreshTimer: ReturnType<typeof setInterval> | null = null;
  let guidedVoice: VoiceStream<SavedIntake> | null = null;
  let generalVoice: VoiceStream<SavedIntake> | null = null;
  const appKitStatus = createVoiceAppKitStatus("/app-kit/status", {
    intervalMs: 5_000,
  });
  let unsubscribeGuided = () => {};
  let unsubscribeGeneral = () => {};
  let unsubscribeAppKitStatus = () => {};
  let currentVoice = $derived(
    activeMode === "general" ? generalState : guidedState,
  );
  let wavePath = $derived(createVoiceWavePath(waveLevels));
  let errorMessage = $derived(error || currentVoice.error || "None");
  let currentPrompt = $derived(
    getVoiceModePrompt({
      hasStarted:
        (activeMode ? hasStartedModes[activeMode] : false) ||
        currentVoice.turns.length > 0,
      mode: activeMode,
      status: currentVoice.status,
      turnCount: currentVoice.turns.length,
    }),
  );
  let leadMessage = $derived(
    getVoiceLeadMessage({
      hasStarted:
        (activeMode ? hasStartedModes[activeMode] : false) ||
        currentVoice.turns.length > 0,
      mode: activeMode,
      status: currentVoice.status,
      turnCount: currentVoice.turns.length,
    }),
  );
  let callLifecycleLabel = $derived(
    currentVoice.call?.disposition
      ? `${currentVoice.call.disposition} after ${currentVoice.call.events.length} lifecycle event${currentVoice.call.events.length === 1 ? "" : "s"}`
      : (currentVoice.call?.events.at(-1)?.type ?? "Not started"),
  );

  const refreshIntakes = async () => {
    savedIntakes = await fetchSavedIntakes();
  };

  const startMic = async () => {
    try {
      microphone ??= createDemoMicrophone(
        (audio) => {
          const activeVoice =
            activeMode === "general" ? generalVoice : guidedVoice;

          activeVoice?.sendAudio(audio);
        },
        (level) => {
          waveLevels = pushVoiceWaveLevel(waveLevels, level);
        },
      );
      await microphone.start();
      error = null;
      isCapturing = true;
    } catch (micError) {
      microphone?.stop();
      microphone = null;
      isCapturing = false;
      waveLevels = createInitialVoiceWaveLevels();
      error = formatErrorMessage(micError);
    }
  };

  const stopMic = () => {
    microphone?.stop();
    isCapturing = false;
    waveLevels = createInitialVoiceWaveLevels();
  };

  const startMode = async (mode: VoiceDemoMode) => {
    activeMode = mode;
    hasStartedModes = { ...hasStartedModes, [mode]: true };
    await startMic();
  };

  const runCallControl = (
    action: (typeof VOICE_CALL_CONTROL_ACTIONS)[number],
  ) => {
    const activeVoice = activeMode === "general" ? generalVoice : guidedVoice;
    activeVoice?.callControl(action);
    stopMic();
  };

  const connectVoices = () => {
    unsubscribeGuided();
    unsubscribeGeneral();
    guidedVoice?.close();
    generalVoice?.close();
    guidedVoice = createVoiceStream<SavedIntake>(
      getVoiceRoutePath("guided", modelProvider),
    );
    generalVoice = createVoiceStream<SavedIntake>(
      getVoiceRoutePath("general", modelProvider),
    );
    guidedState = { ...guidedVoice.getSnapshot() };
    generalState = { ...generalVoice.getSnapshot() };
    unsubscribeGuided = guidedVoice.subscribe(() => {
      guidedState = { ...guidedVoice!.getSnapshot() };
    });
    unsubscribeGeneral = generalVoice.subscribe(() => {
      generalState = { ...generalVoice!.getSnapshot() };
    });
  };

  const changeModelProvider = (provider: VoiceModelProvider) => {
    stopMic();
    activeMode = null;
    modelProvider = provider;
    rememberVoiceModelProvider(provider);
    connectVoices();
  };

  const changeModelProviderFromEvent = (event: Event) => {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      changeModelProvider(target.value as VoiceModelProvider);
    }
  };

  onMount(() => {
    connectVoices();
    unsubscribeAppKitStatus = appKitStatus.subscribe(() => {
      appKitReport = appKitStatus.getSnapshot().report ?? null;
    });
    void appKitStatus.refresh().catch(() => {});
    void refreshIntakes();
    refreshTimer = setInterval(() => {
      void refreshIntakes();
    }, 4000);
  });

  onDestroy(() => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    stopMic();
    unsubscribeGuided();
    unsubscribeGeneral();
    unsubscribeAppKitStatus();
    guidedVoice?.close();
    generalVoice?.close();
    appKitStatus.close();
  });
</script>

<Head
  title="AbsoluteJS Voice Test - Svelte"
  description="AbsoluteJS chat-style voice demo with guided and general modes in Svelte."
  {cssPath}
/>

<div class="voice-demo-page">
  <header>
    <a class="logo" href="/">
      <img src="/assets/png/absolutejs-temp.png" height="24" alt="AbsoluteJS" />
      AbsoluteJS
    </a>
    <nav>
      {#each FRAMEWORKS as framework}
        <a class:active={framework.id === "svelte"} href={framework.href}>
          {framework.label}
        </a>
      {/each}
      <a href="/reviews">Reviews</a>
    </nav>
  </header>
  <main class="voice-shell">
    <section class="voice-grid">
      <article class="voice-card voice-hero">
        <div class="voice-hero-layout">
          <div>
            <span class="voice-framework-pill">Svelte Entry Point</span>
            <h2>Chat-style voice demo in Svelte</h2>
            <p class="voice-brand-copy">{FRAMEWORK_DESCRIPTIONS.svelte}</p>
            <div class="voice-badges">
              <span class="voice-badge">Deepgram Flux</span>
              <span class="voice-badge">Phrase hint correction</span>
              <span class="voice-badge">Reconnect-aware sessions</span>
            </div>
          </div>
          <div class="voice-metrics">
            <div class="voice-metric">
              <span class="voice-metric-label">Connection</span>
              <span class="voice-metric-value"
                >{currentVoice.isConnected ? "Connected" : "Waiting"}</span
              >
            </div>
            <div class="voice-metric">
              <span class="voice-metric-label">Scenario</span>
              <span class="voice-metric-value">
                {activeMode ? getVoiceModeLabel(activeMode) : "Choose one"}
              </span>
            </div>
            <div class="voice-metric">
              <span class="voice-metric-label">Saved captures</span>
              <span class="voice-metric-value">{savedIntakes.length}</span>
            </div>
            <div class="voice-metric">
              <span class="voice-metric-label">Model</span>
              <span class="voice-metric-value"
                >{getVoiceProviderLabel(modelProvider)}</span
              >
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
            value={modelProvider}
            on:change={changeModelProviderFromEvent}
          >
            {#each VOICE_MODEL_PROVIDERS as provider}
              <option value={provider.id}>{provider.label}</option>
            {/each}
          </select>
        </label>
      </article>

      <article
        class={`voice-card voice-workflow-card ${appKitReport?.status === "fail" ? "is-failing" : ""}`}
      >
        <span class="voice-framework-pill">Voice App Kit</span>
        <h2>{getAppKitStatusLabel(appKitReport)}</h2>
        <p class="voice-footnote">
          One embedded status check for quality, workflow contracts, providers,
          sessions, and handoffs.
        </p>
        <div class="voice-workflow-summary">
          <span class="pill">{appKitReport?.passed ?? 0} passing</span>
          <span class="pill">{appKitReport?.failed ?? 0} failing</span>
          <span class="pill">{appKitReport?.total ?? 0} checks</span>
        </div>
        <p class="voice-footnote">
          <a href="/app-kit/status">Open app-kit status</a> ·
          <a href="/evals/fixtures">Open certified fixtures</a>
        </p>
      </article>

      <article class="voice-card voice-card-side">
        <h2>{VOICE_DEMO_GUIDE_TITLE}</h2>
        <ol class="voice-guide-list">
          {#each VOICE_DEMO_GUIDE_STEPS as step}
            <li>{step}</li>
          {/each}
        </ol>
      </article>

      <article class="voice-card voice-assistant-config">
        <span class="voice-framework-pill">Assistant API</span>
        <h2>{VOICE_ASSISTANT_CONFIG.id}</h2>
        <p class="voice-footnote">
          Powered by createVoiceAssistant with a {VOICE_ASSISTANT_CONFIG.recipe} artifact
          plan.
        </p>
        <div class="voice-config-grid">
          <div>
            <div class="voice-assistant-label">Tools</div>
            <ul class="voice-compact-list">
              {#each VOICE_ASSISTANT_CONFIG.tools as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
          <div>
            <div class="voice-assistant-label">Guardrails</div>
            <ul class="voice-compact-list">
              {#each VOICE_ASSISTANT_CONFIG.guardrails as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
          <div>
            <div class="voice-assistant-label">Experiments</div>
            <ul class="voice-compact-list">
              {#each VOICE_ASSISTANT_CONFIG.experiments as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
          <div>
            <div class="voice-assistant-label">Artifacts</div>
            <ul class="voice-compact-list">
              {#each VOICE_ASSISTANT_CONFIG.artifacts as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
        </div>
        <p class="voice-footnote">
          <a href="/assistant">Open analytics</a> ·
          <a href="/tasks">Open tasks</a>
          · <a href="/integrations">Open integration events</a>
        </p>
      </article>

      <article class="voice-card voice-card-wide">
        <h2>Conversation</h2>
        <div class="voice-status-list">
          <div class="status-row">
            <span class="label">Voice status</span>
            <span class="value">{currentVoice.status}</span>
          </div>
          <div class="status-row">
            <span class="label">Current prompt</span>
            <span class="value">{currentPrompt}</span>
          </div>
          <div class="status-row">
            <span class="label">Microphone</span>
            <span class="value">
              {isCapturing ? VOICE_DEMO_MIC_LIVE : VOICE_DEMO_MIC_IDLE}
            </span>
          </div>
          <div class="status-row">
            <span class="label">Current utterance</span>
            <span class="value"
              >{currentVoice.partial || "No speech captured yet"}</span
            >
          </div>
          <div class="status-row">
            <span class="label">Errors</span>
            <span class="value">{errorMessage}</span>
          </div>
          <div class="status-row">
            <span class="label">Call lifecycle</span>
            <span class="value">{callLifecycleLabel}</span>
          </div>
        </div>
        <div class="voice-chat-list">
          <article class="voice-chat-message assistant">
            <div class="voice-chat-role">
              {activeMode ? getVoiceModeLabel(activeMode) : "Voice demo"}
            </div>
            <p class="voice-turn-text">{leadMessage}</p>
          </article>
          {#each currentVoice.turns as turn}
            <div class="voice-chat-stack">
              <article class="voice-chat-message user">
                <div class="voice-chat-role">You</div>
                <p class="voice-turn-text">{turn.text}</p>
              </article>
              {#if turn.assistantText}
                <article class="voice-chat-message assistant">
                  <div class="voice-chat-role">
                    {activeMode ? getVoiceModeLabel(activeMode) : "Guide"}
                  </div>
                  <p class="voice-turn-text">{turn.assistantText}</p>
                </article>
              {/if}
            </div>
          {/each}
          {#if currentVoice.partial}
            <article class="voice-chat-message user pending">
              <div class="voice-chat-role">Speaking</div>
              <p class="voice-turn-text">{currentVoice.partial}</p>
            </article>
          {/if}
        </div>
        <div class="voice-monitor" class:is-live={isCapturing}>
          <div class="voice-monitor-header">
            <span class="voice-monitor-label">Input monitor</span>
            <span class="voice-live-pill" class:is-live={isCapturing}>
              <span class="voice-live-dot"></span>
              {isCapturing ? "Microphone live" : "Microphone idle"}
            </span>
          </div>
          <svg
            aria-label="Microphone waveform"
            class="voice-wave"
            viewBox="0 0 320 88"
          >
            <path class="voice-wave-baseline" d="M 0 44 L 320 44" />
            <path class="voice-wave-glow" d={wavePath} />
            <path class="voice-wave-line" d={wavePath} />
          </svg>
        </div>
        <div class="voice-actions">
          {#if isCapturing}
            <button class="primary" on:click={stopMic}>
              {VOICE_DEMO_STOP_LABEL}
            </button>
          {:else}
            <button class="primary" on:click={() => void startMode("guided")}>
              {VOICE_DEMO_GUIDED_LABEL}
            </button>
            <button on:click={() => void startMode("general")}>
              {VOICE_DEMO_GENERAL_LABEL}
            </button>
          {/if}
        </div>
        <div class="voice-actions">
          {#each VOICE_CALL_CONTROL_ACTIONS as action}
            <button type="button" on:click={() => runCallControl(action)}>
              {action.label}
            </button>
          {/each}
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
          <a href="/reviews">browse all reviews</a> after a completed demo call.
        </p>
        <div class="voice-saved-list">
          {#if savedIntakes.length === 0}
            <p class="empty-copy">No saved captures yet.</p>
          {:else}
            {#each savedIntakes as intake}
              <article class="saved-item">
                <div class="saved-item-header">
                  <strong>{intake.title}</strong>
                  <span>{formatDateTime(intake.completedAt)}</span>
                </div>
                <div class="saved-item-meta">
                  <span class="pill"
                    >{getVoiceModeLabel(intake.scenarioId)}</span
                  >
                  <span class="pill"
                    >{intake.turnCount} turn{intake.turnCount === 1
                      ? ""
                      : "s"}</span
                  >
                  {#if intake.detectedName}
                    <span class="pill">{intake.detectedName}</span>
                  {/if}
                </div>
                <div class="saved-answer-list">
                  {#each intake.promptAnswers as entry}
                    <div class="saved-answer">
                      <div class="saved-answer-label">{entry.prompt}</div>
                      <p class="saved-answer-text">{entry.response}</p>
                    </div>
                  {/each}
                </div>
                <div class="voice-assistant-label">Full transcript</div>
                <p>{intake.transcript}</p>
                <p class="saved-summary">{intake.assistantSummary}</p>
              </article>
            {/each}
          {/if}
        </div>
      </article>
    </section>
    <p class="footer">
      <img src="/assets/png/absolutejs-temp.png" alt="" />
      Powered by
      <a href="https://absolutejs.com" target="_blank" rel="noopener noreferrer"
        >AbsoluteJS</a
      >
    </p>
  </main>
</div>
