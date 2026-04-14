import { fallbackOrder, resolveProvider } from './config';
import { generateWithOpenAICompatible } from './providers/openaiCompatible';
import type { GenerateReplyParams, GenerateReplyResult } from './types';

export async function generateReply({
  messages,
  provider,
  modality = 'text',
}: GenerateReplyParams): Promise<GenerateReplyResult> {
  const primary = resolveProvider(modality, provider);
  const order = fallbackOrder(modality, primary);

  let lastError: unknown;

  for (const candidate of order) {
    try {
      return await generateWithOpenAICompatible(candidate, modality, messages);
    } catch (error) {
      lastError = error;
      console.error(`AI provider ${candidate} failed`, error);
    }
  }

  throw lastError || new Error('All AI providers failed');
}
