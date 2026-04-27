import {
  defineVoiceOpsStatusElement,
  defineVoiceProviderCapabilitiesElement,
  defineVoiceProviderSimulationControlsElement,
  defineVoiceProviderStatusElement,
  defineVoiceRoutingStatusElement,
  defineVoiceTraceTimelineElement,
  defineVoiceTurnLatencyElement,
  defineVoiceTurnQualityElement,
} from "@absolutejs/voice/client";
import { mountDemoBargeInProof } from "../../shared/browser";

defineVoiceOpsStatusElement();
defineVoiceProviderCapabilitiesElement();
defineVoiceProviderSimulationControlsElement();
defineVoiceProviderStatusElement();
defineVoiceRoutingStatusElement();
defineVoiceTraceTimelineElement();
defineVoiceTurnLatencyElement();
defineVoiceTurnQualityElement();

const bargeInProofHost = document.querySelector("#barge-in-proof-card");
if (bargeInProofHost instanceof HTMLElement) {
  mountDemoBargeInProof(bargeInProofHost);
}
