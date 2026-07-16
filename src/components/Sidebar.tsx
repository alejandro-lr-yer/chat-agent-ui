import { For } from "solid-js";
import { Button } from "@kobalte/core/button";
import { chatStore } from "../store/chat";

export function Sidebar() {
  return (
    <aside class="flex h-full w-56 shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800">
      <div class="p-2">
        <Button
          onClick={() => chatStore.createChat()}
          class="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          + New chat
        </Button>
      </div>
      <nav class="flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
        <For each={chatStore.chats}>
          {(chat) => (
            <button
              type="button"
              onClick={() => chatStore.selectChat(chat.id)}
              class="block w-full truncate rounded-md px-2 py-1.5 text-left text-sm"
              classList={{
                "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100":
                  chat.id === chatStore.activeChatId(),
                "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100":
                  chat.id !== chatStore.activeChatId(),
              }}
            >
              {chat.title}
            </button>
          )}
        </For>
      </nav>
    </aside>
  );
}
