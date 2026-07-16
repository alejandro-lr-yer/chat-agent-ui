import { createStore, produce } from "solid-js/store";
import { createSignal } from "solid-js";
import type { Chat, Feedback, Message } from "../lib/types";
import { streamReply, submitFeedback } from "../lib/backend";

function createId() {
  return crypto.randomUUID();
}

function createEmptyChat(): Chat {
  return {
    id: createId(),
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
  };
}

const initialChat = createEmptyChat();

const [chats, setChats] = createStore<Chat[]>([initialChat]);
const [activeChatId, setActiveChatId] = createSignal(initialChat.id);
const [isStreaming, setIsStreaming] = createSignal(false);

function activeChat() {
  return chats.find((chat) => chat.id === activeChatId());
}

function createChat() {
  const chat = createEmptyChat();
  setChats(produce((cs) => cs.unshift(chat)));
  setActiveChatId(chat.id);
}

function selectChat(id: string) {
  setActiveChatId(id);
}

async function sendMessage(content: string) {
  const trimmed = content.trim();
  const chat = activeChat();
  if (!trimmed || !chat || isStreaming()) return;

  const chatId = chat.id;
  const userMessage: Message = { id: createId(), role: "user", content: trimmed };
  const assistantMessage: Message = {
    id: createId(),
    role: "assistant",
    content: "",
    pending: true,
  };

  setChats(
    (c) => c.id === chatId,
    produce((c) => {
      if (c.messages.length === 0) {
        c.title = trimmed.slice(0, 40);
      }
      c.messages.push(userMessage, assistantMessage);
    }),
  );

  setIsStreaming(true);
  try {
    const history = chats
      .find((c) => c.id === chatId)!
      .messages.filter((m) => m.id !== assistantMessage.id);

    for await (const chunk of streamReply(history)) {
      setChats(
        (c) => c.id === chatId,
        "messages",
        (m) => m.id === assistantMessage.id,
        "content",
        (prev) => prev + chunk,
      );
    }
  } finally {
    setChats(
      (c) => c.id === chatId,
      "messages",
      (m) => m.id === assistantMessage.id,
      "pending",
      false,
    );
    setIsStreaming(false);
  }
}

function setFeedback(chatId: string, messageId: string, value: Exclude<Feedback, null>) {
  const chat = chats.find((c) => c.id === chatId);
  const message = chat?.messages.find((m) => m.id === messageId);
  const next: Feedback = message?.feedback === value ? null : value;

  setChats(
    (c) => c.id === chatId,
    "messages",
    (m) => m.id === messageId,
    "feedback",
    next,
  );
  void submitFeedback(chatId, messageId, next);
}

export const chatStore = {
  chats,
  activeChatId,
  activeChat,
  isStreaming,
  createChat,
  selectChat,
  sendMessage,
  setFeedback,
};
