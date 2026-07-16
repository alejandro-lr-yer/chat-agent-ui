import { For, Show, createEffect } from "solid-js";
import { chatStore } from "../store/chat";
import { Message } from "./Message";

export function ChatView() {
  let scrollRef: HTMLDivElement | undefined;

  createEffect(() => {
    const chat = chatStore.activeChat();
    chat?.messages.forEach((m) => m.content);

    queueMicrotask(() => {
      scrollRef?.scrollTo({ top: scrollRef.scrollHeight });
    });
  });

  return (
    <div ref={scrollRef} class="flex-1 overflow-y-auto">
      <div class="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-4 px-4 py-6">
        <Show when={chatStore.activeChat()?.messages.length === 0}>
          <p class="m-auto text-sm text-neutral-400 dark:text-neutral-600">Ask anything to get started.</p>
        </Show>
        <For each={chatStore.activeChat()?.messages}>
          {(message) => <Message chatId={chatStore.activeChatId()} message={message} />}
        </For>
      </div>
    </div>
  );
}
