import { providerConfig } from '../config';
import type { ChatMessage, GenerateReplyResult, Modality, ProviderName } from '../types';

function textFromContent(content: unknown): string {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          if (typeof record.text === 'string') return record.text;
          if (typeof record.content === 'string') return record.content;
        }
        return '';
      })
      .join('\n')
      .trim();
  }

  return '';
}

export async function generateWithOpenAICompatible(
  provider: ProviderName,
  modality: Modality,
  messages: ChatMessage[],
): Promise<GenerateReplyResult> {
  const config = providerConfig(provider, modality);

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${provider} error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const reply = textFromContent(data?.choices?.[0]?.message?.content);

  if (!reply) {
    throw new Error(`${provider} returned no reply`);
  }

  return {
    provider,
    modality,
    model: config.model,
    reply,
  };
}
