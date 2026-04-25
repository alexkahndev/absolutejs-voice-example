import { getEnv, networking, prepare } from "@absolutejs/absolute";
import {
  applyPhraseHintCorrections,
  assignVoiceOpsTask,
  completeVoiceOpsTask,
  createVoiceAssistant,
  createVoiceAgentTool,
  createVoiceExperiment,
  createVoiceFileRuntimeStorage,
  createVoiceTaskUpdatedEvent,
  reopenVoiceOpsTask,
  startVoiceOpsTask,
  summarizeVoiceAssistantRuns,
  type VoiceCallReviewStore,
  type VoiceAgentModel,
  type VoiceOpsTaskStatus,
  type VoiceOpsTaskStore,
  type VoiceTurnCorrectionHandler,
  type VoiceSessionRecord,
  voice,
} from "@absolutejs/voice";
import { deepgram } from "@absolutejs/voice-deepgram";
import { Elysia } from "elysia";
import { resolve } from "node:path";
import {
  filterVoiceOpsTasks,
  listVoiceOpsTasks,
  renderVoiceOpsPage,
  summarizeVoiceOpsTasks,
  type SavedVoiceOpsTask,
  type VoiceOpsTaskFilterInput,
} from "./opsPage";
import {
  listVoiceIntegrationEvents,
  renderVoiceIntegrationEventsPage,
  type SavedVoiceIntegrationEvent,
} from "./integrationsPage";
import { renderVoiceAssistantPage } from "./assistantPage";
import { pagesPlugin } from "./plugins/pagesPlugin";
import {
  buildSavedVoiceReview,
  filterVoiceReviews,
  findVoiceReview,
  listVoiceReviews,
  type SavedVoiceReviewArtifact,
  type VoiceReviewFilterInput,
  renderVoiceReviewComparePage,
  renderVoiceReviewIndexPage,
  renderVoiceReviewPage,
} from "./reviewPage";
import {
  buildSavedIntake,
  decideIntakeTurn,
  resolveScenarioFromContext,
  VOICE_DEMO_PHRASE_HINTS,
} from "./voiceFlow";
import { VOICE_ASSISTANT_CONFIG, type SavedIntake } from "../shared/demo";

const { absolutejs, manifest } = await prepare();

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatCallDisposition = (value: SavedIntake["callDisposition"]) => {
  switch (value) {
    case "transferred":
      return "Transferred";
    case "escalated":
      return "Escalated";
    case "voicemail":
      return "Voicemail";
    case "no-answer":
      return "No answer";
    case "failed":
      return "Failed";
    case "closed":
      return "Closed";
    case "completed":
      return "Completed";
    default:
      return undefined;
  }
};

const renderPromptAnswers = (promptAnswers: SavedIntake["promptAnswers"]) =>
  promptAnswers
    .map(
      (entry) => `<div class="saved-answer">
  <div class="saved-answer-label">${escapeHtml(entry.prompt)}</div>
  <p class="saved-answer-text">${escapeHtml(entry.response)}</p>
</div>`,
    )
    .join("");

const normalizeReviewFilters = (
  query: Record<string, unknown>,
): VoiceReviewFilterInput => ({
  outcome:
    query.outcome === "completed" ||
    query.outcome === "transferred" ||
    query.outcome === "escalated" ||
    query.outcome === "voicemail" ||
    query.outcome === "no-answer" ||
    query.outcome === "failed" ||
    query.outcome === "closed"
      ? query.outcome
      : "all",
  q: typeof query.q === "string" && query.q.trim() ? query.q.trim() : undefined,
  scenario:
    query.scenario === "guided" || query.scenario === "general"
      ? query.scenario
      : "all",
  status:
    query.status === "healthy" ||
    query.status === "partial" ||
    query.status === "failed"
      ? query.status
      : "all",
});

const savedIntakes: SavedIntake[] = [];
const runtimeDirectory = resolve(
  import.meta.dir,
  "..",
  "..",
  ".voice-runtime",
  "voice-demo",
);
const runtimeStorage = createVoiceFileRuntimeStorage<
  VoiceSessionRecord,
  SavedVoiceReviewArtifact,
  SavedVoiceOpsTask,
  SavedVoiceIntegrationEvent
>({
  directory: runtimeDirectory,
});
const deepgramApiKey = getEnv("DEEPGRAM_API_KEY");
const webhookUrl = process.env.VOICE_DEMO_WEBHOOK_URL;
const intakeModel: VoiceAgentModel<unknown, VoiceSessionRecord, SavedIntake> = {
  generate: ({ context, session, turn, system }) => {
    const result = decideIntakeTurn(session, turn, undefined, context);

    if (system?.includes("direct") && result.assistantText === "Received.") {
      return {
        ...result,
        assistantText: "Captured.",
      };
    }

    return result;
  },
};
const intakeClassifierTool = createVoiceAgentTool<
  unknown,
  VoiceSessionRecord,
  Record<string, unknown>,
  unknown,
  SavedIntake
>({
  description:
    "Classify whether the caller is in guided or general intake mode.",
  execute: ({ context }) => ({
    mode: resolveScenarioFromContext(context),
  }),
  name: "intake_classifier",
});
const lifecycleRouterTool = createVoiceAgentTool<
  unknown,
  VoiceSessionRecord,
  Record<string, unknown>,
  unknown,
  SavedIntake
>({
  description:
    "Route transfer, escalation, voicemail, and no-answer phrases into call outcomes.",
  execute: ({ turn }) => ({
    text: turn.text,
  }),
  name: "lifecycle_router",
});
const reviewTaskRecorderTool = createVoiceAgentTool<
  unknown,
  VoiceSessionRecord,
  Record<string, unknown>,
  unknown,
  SavedIntake
>({
  description:
    "Expose the runtime stores that record reviews, tasks, and integration events.",
  execute: () => ({
    events: true,
    reviews: true,
    tasks: true,
  }),
  name: "review_task_recorder",
});
const correctDemoTurn: VoiceTurnCorrectionHandler<
  unknown,
  VoiceSessionRecord,
  SavedIntake
> = async ({ phraseHints, text }) => {
  const result = applyPhraseHintCorrections(text, phraseHints);

  if (!result.changed) {
    return;
  }

  return {
    metadata:
      result.matches.length > 0
        ? {
            matchedAliases: result.matches.map((match) => match.alias),
            matchedHints: result.matches.map((match) => match.hint.text),
          }
        : undefined,
    provider: "absolutejs-voice-example",
    reason: "demo-phrase-hint-correction",
    text: result.text,
  };
};

const listIntakes = (): SavedIntake[] => [...savedIntakes];

const persistIntake = (intake: SavedIntake) => {
  const existingIndex = savedIntakes.findIndex(
    (savedIntake) => savedIntake.id === intake.id,
  );

  if (existingIndex >= 0) {
    savedIntakes.splice(existingIndex, 1, intake);
    return;
  }

  savedIntakes.unshift(intake);
  savedIntakes.splice(12);
};

const normalizeTaskFilters = (
  query: Record<string, unknown>,
): VoiceOpsTaskFilterInput => ({
  kind:
    query.kind === "callback" ||
    query.kind === "escalation" ||
    query.kind === "appointment-booking" ||
    query.kind === "lead-qualification" ||
    query.kind === "support-triage" ||
    query.kind === "transfer-check" ||
    query.kind === "retry-review"
      ? query.kind
      : "all",
  outcome:
    query.outcome === "completed" ||
    query.outcome === "transferred" ||
    query.outcome === "escalated" ||
    query.outcome === "voicemail" ||
    query.outcome === "no-answer" ||
    query.outcome === "failed" ||
    query.outcome === "closed"
      ? query.outcome
      : "all",
  status:
    query.status === "open" ||
    query.status === "in-progress" ||
    query.status === "done"
      ? query.status
      : "all",
});

const listReviews = async (): Promise<SavedVoiceReviewArtifact[]> =>
  listVoiceReviews(await runtimeStorage.reviews.list());

const deliverIntegrationEvent = async (
  event: SavedVoiceIntegrationEvent,
): Promise<SavedVoiceIntegrationEvent> => {
  const storedEvent: SavedVoiceIntegrationEvent = { ...event };

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        body: JSON.stringify(storedEvent),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        storedEvent.deliveryError = `HTTP ${response.status}`;
      } else {
        storedEvent.deliveredAt = Date.now();
        storedEvent.deliveredTo = webhookUrl;
        storedEvent.deliveryError = undefined;
      }
    } catch (error) {
      storedEvent.deliveryError =
        error instanceof Error ? error.message : String(error);
    }
  }

  await runtimeStorage.events.set(storedEvent.id, storedEvent);
  return storedEvent;
};

const listIntegrationEvents = async (): Promise<SavedVoiceIntegrationEvent[]> =>
  listVoiceIntegrationEvents(await runtimeStorage.events.list());

const listTasks = async (): Promise<SavedVoiceOpsTask[]> =>
  listVoiceOpsTasks(await runtimeStorage.tasks.list());

const summarizeAssistantRuns = async () =>
  summarizeVoiceAssistantRuns({ store: runtimeStorage.traces });

const getTask = async (taskId: string): Promise<SavedVoiceOpsTask | null> =>
  (await runtimeStorage.tasks.get(taskId)) ?? null;

const emitTaskUpdatedEvent = async (task: SavedVoiceOpsTask) => {
  await deliverIntegrationEvent(
    createVoiceTaskUpdatedEvent(task) as SavedVoiceIntegrationEvent,
  );
};

const updateTaskStatus = async (
  taskId: string,
  input: {
    actor: string;
    detail?: string;
    status: VoiceOpsTaskStatus;
  },
) => {
  const task = await getTask(taskId);

  if (!task) {
    return null;
  }

  const updatedTask = (
    input.status === "in-progress"
      ? startVoiceOpsTask(task, {
          actor: input.actor,
          detail: input.detail,
        })
      : input.status === "done"
        ? completeVoiceOpsTask(task, {
            actor: input.actor,
            detail: input.detail,
          })
        : reopenVoiceOpsTask(task, {
            actor: input.actor,
            detail: input.detail,
          })
  ) as SavedVoiceOpsTask;

  await runtimeStorage.tasks.set(updatedTask.id, updatedTask);
  await emitTaskUpdatedEvent(updatedTask);
  return updatedTask;
};

const assignTask = async (taskId: string, owner: string) => {
  const task = await getTask(taskId);

  if (!task) {
    return null;
  }

  const updatedTask = assignVoiceOpsTask(task, owner) as SavedVoiceOpsTask;
  await runtimeStorage.tasks.set(updatedTask.id, updatedTask);
  await emitTaskUpdatedEvent(updatedTask);
  return updatedTask;
};

const redirectToTasks = () =>
  new Response(null, {
    headers: {
      Location: "/tasks",
    },
    status: 302,
  });

const assistant = createVoiceAssistant<
  unknown,
  VoiceSessionRecord,
  SavedIntake
>({
  artifactPlan: {
    ops: {
      buildReview: ({ result, session }) =>
        buildSavedVoiceReview({
          phraseHints: VOICE_DEMO_PHRASE_HINTS,
          result: result ?? buildSavedIntake(session),
          session,
        }),
      events: runtimeStorage.events,
      onEvent: async ({ event }) => {
        await deliverIntegrationEvent(event as SavedVoiceIntegrationEvent);
      },
      reviews: runtimeStorage.reviews as unknown as VoiceCallReviewStore,
      tasks: runtimeStorage.tasks as unknown as VoiceOpsTaskStore,
    },
    preset: {
      name: "support-triage",
      options: {
        assignee: "support-oncall",
        escalationAssignee: "support-lead",
        escalationQueue: "support-escalations",
        queue: "support-triage",
      },
    },
  },
  experiment: createVoiceExperiment({
    id: "support-copy",
    variants: [
      {
        id: "baseline",
        weight: 1,
      },
      {
        id: "direct",
        system: "direct support copy",
        weight: 1,
      },
    ],
  }),
  guardrails: {
    beforeTurn: ({ context, session, turn }) =>
      /\b(human|agent|supervisor|manager)\b/i.test(turn.text) &&
      /\b(please|need|want|get|talk|speak)\b/i.test(turn.text)
        ? {
            assistantText: "Escalating this call for human follow-up.",
            escalate: {
              reason: "caller-requested-human",
            },
            result: buildSavedIntake(
              session,
              resolveScenarioFromContext(context),
            ),
          }
        : undefined,
  },
  id: "support",
  model: intakeModel,
  system: "baseline guide copy",
  tools: [intakeClassifierTool, lifecycleRouterTool, reviewTaskRecorderTool],
  trace: runtimeStorage.traces,
});

const server = new Elysia()
  .use(absolutejs)
  .use(pagesPlugin(manifest))
  .use(
    voice<unknown, VoiceSessionRecord, SavedIntake>({
      htmx: ({ result }) => {
        if (!result) {
          return `<p class="empty-copy">No saved captures yet.</p>`;
        }

        return `<article class="saved-item">
  <div class="saved-item-header">
    <strong>${escapeHtml(result.title)}</strong>
    <span>${new Date(result.completedAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })}</span>
  </div>
  <p>${escapeHtml(result.transcript)}</p>
  <div class="saved-item-meta">
    <span class="pill">${escapeHtml(result.scenarioId === "guided" ? "Guided test" : "General recording")}</span>
    <span class="pill">${result.turnCount} turn${result.turnCount === 1 ? "" : "s"}</span>
    ${result.callDisposition ? `<span class="pill">${escapeHtml(formatCallDisposition(result.callDisposition) ?? result.callDisposition)}</span>` : ""}
    ${result.callTarget ? `<span class="pill">${escapeHtml(result.callTarget)}</span>` : ""}
    ${result.detectedName ? `<span class="pill">${escapeHtml(result.detectedName)}</span>` : ""}
  </div>
  <div class="saved-answer-list">
    ${renderPromptAnswers(result.promptAnswers)}
  </div>
  <div class="voice-assistant-label">Full transcript</div>
  <p>${escapeHtml(result.transcript)}</p>
  <p class="saved-summary">${escapeHtml(result.assistantSummary)}</p>
</article>`;
      },
      onComplete: async ({ session }) => {
        const result = session.turns
          .toReversed()
          .find((turn) => turn.result !== undefined)?.result as
          | SavedIntake
          | undefined;
        const savedIntake = result ?? buildSavedIntake(session);
        persistIntake(savedIntake);
      },
      ops: assistant.ops,
      correctTurn: correctDemoTurn,
      phraseHints: VOICE_DEMO_PHRASE_HINTS,
      onTurn: assistant.onTurn,
      path: "/voice/intake",
      preset: "reliability",
      session: runtimeStorage.session,
      stt: deepgram({
        apiKey: deepgramApiKey,
        interimResults: true,
        model: "flux-general-en",
        punctuate: true,
        smartFormat: true,
        vadEvents: true,
      }),
    }),
  )
  .get("/api/intakes", () => listIntakes())
  .get("/api/assistant-config", () => VOICE_ASSISTANT_CONFIG)
  .get("/api/assistant-summary", async () => summarizeAssistantRuns())
  .get("/api/reviews", async ({ query }) => {
    const reviews = await listReviews();
    return filterVoiceReviews(reviews, normalizeReviewFilters(query));
  })
  .get(
    "/api/reviews/latest",
    async () =>
      (await listReviews())[0] ?? { error: "No review artifact found" },
  )
  .get("/api/reviews/:reviewId", async ({ params }) => {
    const review = await runtimeStorage.reviews.get(params.reviewId);
    return review ?? { error: "Review not found" };
  })
  .get("/api/tasks", async ({ query }) =>
    filterVoiceOpsTasks(await listTasks(), normalizeTaskFilters(query)),
  )
  .get("/api/tasks/summary", async () =>
    summarizeVoiceOpsTasks(await listTasks()),
  )
  .get(
    "/api/tasks/:taskId",
    async ({ params }) =>
      (await getTask(params.taskId)) ?? { error: "Task not found" },
  )
  .get("/api/integrations/events", async () => await listIntegrationEvents())
  .get(
    "/reviews",
    async ({ query }) =>
      new Response(
        renderVoiceReviewIndexPage(
          await listReviews(),
          normalizeReviewFilters(query),
        ),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get(
    "/reviews/latest",
    async () =>
      new Response(renderVoiceReviewPage((await listReviews())[0] ?? null), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }),
  )
  .get(
    "/tasks",
    async ({ query }) =>
      new Response(
        renderVoiceOpsPage(await listTasks(), normalizeTaskFilters(query)),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get(
    "/integrations",
    async () =>
      new Response(
        renderVoiceIntegrationEventsPage(
          await listIntegrationEvents(),
          webhookUrl,
        ),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .get(
    "/assistant",
    async () =>
      new Response(renderVoiceAssistantPage(await summarizeAssistantRuns()), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }),
  )
  .get("/tasks/:taskId/assign", async ({ params, query }) => {
    const owner =
      typeof query.owner === "string" && query.owner.trim()
        ? query.owner.trim()
        : "ops-demo";
    await assignTask(params.taskId, owner);
    return redirectToTasks();
  })
  .get("/tasks/:taskId/start", async ({ params }) => {
    const task = await getTask(params.taskId);
    if (task) {
      await updateTaskStatus(params.taskId, {
        actor: task.assignee ?? "ops-demo",
        detail: "Work started",
        status: "in-progress",
      });
    }
    return redirectToTasks();
  })
  .get("/tasks/:taskId/complete", async ({ params }) => {
    const task = await getTask(params.taskId);
    if (task) {
      await updateTaskStatus(params.taskId, {
        actor: task.assignee ?? "ops-demo",
        detail: "Marked done",
        status: "done",
      });
    }
    return redirectToTasks();
  })
  .get("/tasks/:taskId/reopen", async ({ params }) => {
    const task = await getTask(params.taskId);
    if (task) {
      await updateTaskStatus(params.taskId, {
        actor: task.assignee ?? "ops-demo",
        detail: "Task reopened",
        status: "open",
      });
    }
    return redirectToTasks();
  })
  .get("/reviews/compare", async ({ query }) => {
    const reviews = await listReviews();
    const leftId =
      typeof query.left === "string" && query.left.trim()
        ? query.left
        : undefined;
    const rightId =
      typeof query.right === "string" && query.right.trim()
        ? query.right
        : reviews[0]?.id;
    const left = leftId
      ? findVoiceReview(reviews, leftId)
      : (reviews[0] ?? null);
    const right = rightId
      ? findVoiceReview(reviews, rightId)
      : (reviews[1] ?? null);

    return new Response(renderVoiceReviewComparePage(left, right), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  })
  .get(
    "/reviews/:reviewId",
    async ({ params }) =>
      new Response(
        renderVoiceReviewPage(
          findVoiceReview(await listReviews(), params.reviewId),
        ),
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      ),
  )
  .use(networking)
  .on("error", (error) => {
    const { request } = error;
    console.error(
      `Voice example error on ${request.method} ${request.url}: ${error.message}`,
    );
  });

export type Server = typeof server;
export default server;
