export const VOICE_ROUTE_PATH = "/voice/intake";
export const VOICE_DEMO_GUIDE_TITLE = "Run the guided voice test";
export const VOICE_DEMO_GUIDE_STEPS = [
  "Click Start voice test to begin the first prompt.",
  "Answer the question in your own words, then pause so the turn commits.",
  "Keep following the next prompt after each committed turn.",
  "Click Stop microphone when you want to stop live capture."
];
export const VOICE_DEMO_GUIDED_LABEL = "Start guided test";
export const VOICE_DEMO_GENERAL_LABEL = "Start general recording";
export const VOICE_DEMO_STOP_LABEL = "Stop microphone";
export const VOICE_DEMO_MIC_IDLE = "Ready. Start guided test or general recording to begin.";
export const VOICE_DEMO_MIC_LIVE = "Live. Answer the prompt, then click Stop microphone when finished.";
export const VOICE_TEST_QUESTIONS = [
  "Start with a quick introduction about who you are.",
  "Now describe what you are trying to do or test.",
  "Finish with any detail that feels blocked, risky, or unclear."
];
export const getVoiceRoutePath = (scenarioId) => `${VOICE_ROUTE_PATH}?scenarioId=${scenarioId}`;
export const getVoiceScenarioLabel = (scenarioId) => scenarioId === "guided" ? "Guided test" : "General recording";
export const getVoiceModeLabel = getVoiceScenarioLabel;
export const getVoiceScenarioPrompt = (input) => {
  if (!input.scenarioId) {
    return "Choose a scenario to begin. Guided test asks follow-up prompts. General recording just captures what you say.";
  }
  if (input.status === "completed") {
    return input.scenarioId === "guided" ? "Guided test complete. Review the saved summary below." : "Recording saved. Start again if you want another capture.";
  }
  if (!input.hasStarted) {
    return input.scenarioId === "guided" ? `Click Start guided test to begin. First prompt: ${VOICE_TEST_QUESTIONS[0]}` : "Click Start general recording to capture one freeform answer.";
  }
  if (input.scenarioId === "general") {
    return input.turnCount === 0 ? "Speak freely. When you pause, the recording will be captured." : "Recording captured. You can stop the microphone or start another recording.";
  }
  return VOICE_TEST_QUESTIONS[input.turnCount] ?? "All prompts are covered. You can stop the microphone or keep speaking for extra detail.";
};
export const getVoiceLeadMessage = (input) => {
  const scenarioId = input.scenarioId ?? input.mode ?? null;
  if (!scenarioId) {
    return "Pick a scenario to begin the demo.";
  }
  if (!input.hasStarted) {
    return scenarioId === "guided" ? "I can walk you through a short three-turn voice test." : "I can capture one freeform recording and confirm that it landed.";
  }
  return getVoiceScenarioPrompt({
    ...input,
    scenarioId
  });
};
export const getVoiceModePrompt = (input) => getVoiceScenarioPrompt({
  ...input,
  scenarioId: input.mode
});
export const getVoiceLeadMessageLegacy = (input) => getVoiceLeadMessage({
  ...input,
  scenarioId: input.mode
});
export const FRAMEWORKS = [
  { id: "react", href: "/react", label: "React" },
  { id: "svelte", href: "/svelte", label: "Svelte" },
  { id: "vue", href: "/vue", label: "Vue" },
  { id: "angular", href: "/angular", label: "Angular" },
  { id: "html", href: "/html", label: "HTML" },
  { id: "htmx", href: "/htmx", label: "HTMX" }
];
export const FRAMEWORK_SNIPPETS = {
  angular: `import { VoiceStreamService } from "@absolutejs/voice/angular";

voice = inject(VoiceStreamService).connect("${VOICE_ROUTE_PATH}");
voice.endTurn();
voice.sendAudio(audioChunk);`,
  html: `import { createVoiceStream } from "@absolutejs/voice/client";

const voice = createVoiceStream("${VOICE_ROUTE_PATH}");
voice.endTurn();
voice.sendAudio(audioChunk);`,
  htmx: `import { bindVoiceHTMX, createVoiceStream } from "@absolutejs/voice/client";

voice({
  path: "${VOICE_ROUTE_PATH}",
  htmx: true,
  ...
});`,
  react: `import { useVoiceStream } from "@absolutejs/voice/react";

const voice = useVoiceStream("${VOICE_ROUTE_PATH}");
voice.endTurn();
voice.sendAudio(audioChunk);`,
  svelte: `import { createVoiceStream } from "@absolutejs/voice/svelte";

const voice = createVoiceStream("${VOICE_ROUTE_PATH}");
voice.subscribe(syncState);
voice.sendAudio(audioChunk);`,
  vue: `import { useVoiceStream } from "@absolutejs/voice/vue";

const voice = useVoiceStream("${VOICE_ROUTE_PATH}");
voice.endTurn();
voice.sendAudio(audioChunk);`
};
export const FRAMEWORK_DESCRIPTIONS = {
  angular: "Angular uses VoiceStreamService to expose computed signals from the shared voice connection.",
  html: "HTML uses the plain client primitive directly and keeps the page reactive with a lightweight DOM renderer.",
  htmx: "HTMX uses the plugin-owned HTMX render route and package bootstrap so the page stays declarative and never ships its own voice controller.",
  react: "React uses useVoiceStream so the page reacts to partials, committed turns, and completion state without custom wiring.",
  svelte: "Svelte uses the framework entrypoint and subscribes to the shared voice stream for local reactive state.",
  vue: "Vue uses the voice composable so refs stay aligned with the same client transport and reconnect lifecycle."
};
