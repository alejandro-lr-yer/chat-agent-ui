import type { Feedback, Message } from "./types";
import corporateBullshitRaw from "../../corporate-bullshit.txt?raw";

const corporateBullshit = corporateBullshitRaw
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

/**
 * Backend adapter — this is the only file a real integration needs to touch.
 *
 * `streamReply` receives the full message history for a chat and must yield
 * the assistant's reply as it becomes available. The store consumes it as an
 * async generator of text chunks, so both token-by-token streaming and a
 * single full-text yield work unchanged.
 *
 * To wire up a real RAG backend, replace the body below with something like:
 *
 *   export async function* streamReply(history: Message[], signal?: AbortSignal) {
 *     const res = await fetch("/api/chat", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ messages: history }),
 *       signal,
 *     });
 *     const reader = res.body!.getReader();
 *     const decoder = new TextDecoder();
 *     while (true) {
 *       const { done, value } = await reader.read();
 *       if (done) return;
 *       yield decoder.decode(value, { stream: true });
 *     }
 *   }
 */
export async function* streamReply(
  history: Message[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  yield* mockStreamReply(history, signal);
}

/**
 * Sends user feedback for a message. Replace the body with a real request,
 * e.g. `fetch("/api/feedback", { method: "POST", body: JSON.stringify({...}) })`.
 */
export async function submitFeedback(
  chatId: string,
  messageId: string,
  value: Feedback,
): Promise<void> {
  console.log("[mock backend] feedback", { chatId, messageId, value });
}

async function* mockStreamReply(_history: Message[], signal?: AbortSignal) {
  const reply = corporateBullshit[Math.floor(Math.random() * corporateBullshit.length)];

  for (const word of reply.split(" ")) {
    if (signal?.aborted) return;
    await delay(30);
    yield word + " ";
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
