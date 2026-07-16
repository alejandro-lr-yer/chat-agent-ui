export type Role = "user" | "assistant";

export type Feedback = "up" | "down" | null;

export interface Message {
  id: string;
  role: Role;
  content: string;
  feedback?: Feedback;
  pending?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
