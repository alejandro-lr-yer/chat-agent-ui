import { createSignal } from "solid-js";
import { TextField } from "@kobalte/core/text-field";
import { Button } from "@kobalte/core/button";
import { chatStore } from "../store/chat";
import { SendIcon } from "./icons";

export function Composer() {
  const [value, setValue] = createSignal("");

  const canSend = () => value().trim().length > 0 && !chatStore.isStreaming();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!canSend()) return;
    const content = value();
    setValue("");
    void chatStore.sendMessage(content);
  }

  return (
    <form onSubmit={handleSubmit} class="border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
      <div class="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 focus-within:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-within:border-neutral-600">
        <TextField
          class="flex-1"
          value={value()}
          onChange={setValue}
          disabled={chatStore.isStreaming()}
        >
          <TextField.TextArea
            autoResize
            submitOnEnter
            rows={1}
            placeholder="Message..."
            class="max-h-[200px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </TextField>
        <Button
          type="submit"
          disabled={!canSend()}
          aria-label="Send message"
          class="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-neutral-50 disabled:opacity-30 dark:bg-neutral-100 dark:text-neutral-900"
        >
          <SendIcon class="h-3.5 w-3.5" />
        </Button>
      </div>
    </form>
  );
}
