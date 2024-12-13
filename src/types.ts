export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  content: string;
}

export interface MessageError {
  code?: number;
  message: string;
}

export interface MessageWithError extends Message {
  error?: MessageError;
  partialContent?: string;
}

export interface ChatConfig {
  maxTokens: number;
  temperature: number;
  topP: number;
  model: string;
}

export interface ChatState {
  messages: MessageWithError[];
  isLoading: boolean;
  config: ChatConfig;
}
