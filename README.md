# agent-ui

A minimal chat UI template for a RAG agent — multi-turn conversation, multiple chats, and per-message feedback. Built with [SolidJS](https://solidjs.com), [Kobalte](https://kobalte.dev) and Tailwind CSS.

Demo: https://chat-agent-ui.fly.dev

## Features

- Textarea composer with auto-resize, Enter to send / Shift+Enter for a newline
- Streaming message list with auto-scroll
- Sidebar with multiple chats, switch between them, start new ones
- Thumbs up / down feedback on assistant messages

## Project structure

```
src/
  lib/
    types.ts     Chat and Message types
    backend.ts   Backend adapter — the only file a real integration needs to touch
  store/
    chat.ts      App state: chats, active chat, send/stream/feedback actions
  components/
    Sidebar.tsx    Chat list + new chat
    ChatView.tsx   Scrollable message list
    Message.tsx    Message bubble + feedback buttons
    Composer.tsx   Textarea + send button
    icons.tsx      Inline SVG icons
```

## Wiring up a real backend

`src/lib/backend.ts` currently returns a random line from `corporate-bullshit.txt` as a stand-in reply. Swap `streamReply` for a real request, e.g.:

```ts
export async function* streamReply(history: Message[], signal?: AbortSignal) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history }),
    signal,
  });
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    yield decoder.decode(value, { stream: true });
  }
}
```

Do the same for `submitFeedback` to send thumbs up/down to your backend. No other file needs to change — the store consumes `streamReply` as an async generator of text chunks.

## Available scripts

### `npm run dev`

Runs the app in development mode.

### `npm run build`

Type-checks and builds the app for production to the `dist` folder.

### `npm run preview`

Serves the production build locally to test before deploying.
