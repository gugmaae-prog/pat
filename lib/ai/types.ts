export type ProviderName = 'groq' | 'mistral' | 'qwen';
export type Modality = 'text' | 'vision' | 'audio';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: unknown;
  name?: string;
  tool_call_id?: string;
};

export type GenerateReplyParams = {
  messages: ChatMessage[];
  provider?: ProviderName;
  modality?: Modality;
};

export type GenerateReplyResult = {
  provider: ProviderName;
  modality: Modality;
  model: string;
  reply: string;
};
