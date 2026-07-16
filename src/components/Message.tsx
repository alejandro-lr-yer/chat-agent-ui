import { Show } from "solid-js";
import { ToggleButton } from "@kobalte/core/toggle-button";
import type { Message as MessageType } from "../lib/types";
import { chatStore } from "../store/chat";
import { ThumbDownIcon, ThumbUpIcon } from "./icons";

interface MessageProps {
  chatId: string;
  message: MessageType;
}

export function Message(props: MessageProps) {
  const isUser = () => props.message.role === "user";

  return (
    <div class="group flex flex-col" classList={{ "items-end": isUser(), "items-start": !isUser() }}>
      <div
        class="max-w-[70ch] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed"
        classList={{
          "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900": isUser(),
          "border border-neutral-200 text-neutral-800 dark:border-neutral-800 dark:text-neutral-200":
            !isUser(),
        }}
      >
        {props.message.content}
        <Show when={props.message.pending && !props.message.content}>
          <span class="inline-block h-3.5 w-3.5 animate-pulse rounded-full bg-current opacity-40 align-middle" />
        </Show>
      </div>

      <Show when={!isUser() && !props.message.pending}>
        <div
          class="mt-1 flex gap-0.5"
          classList={{ "opacity-0 group-hover:opacity-100": !props.message.feedback }}
        >
          <ToggleButton
            pressed={props.message.feedback === "up"}
            onChange={() => chatStore.setFeedback(props.chatId, props.message.id, "up")}
            aria-label="Good response"
            class="rounded-md p-1 text-neutral-400 hover:text-neutral-700 data-[pressed]:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 dark:data-[pressed]:text-neutral-100"
          >
            <ThumbUpIcon class="h-3.5 w-3.5" />
          </ToggleButton>
          <ToggleButton
            pressed={props.message.feedback === "down"}
            onChange={() => chatStore.setFeedback(props.chatId, props.message.id, "down")}
            aria-label="Bad response"
            class="rounded-md p-1 text-neutral-400 hover:text-neutral-700 data-[pressed]:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 dark:data-[pressed]:text-neutral-100"
          >
            <ThumbDownIcon class="h-3.5 w-3.5" />
          </ToggleButton>
        </div>
      </Show>
    </div>
  );
}
