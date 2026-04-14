import type { Modality, ProviderName } from './types';

type ProviderConfig = {
  provider: ProviderName;
  apiKey: string;
  endpoint: string;
  model: string;
};

const counters: Record<ProviderName, number> = {
  groq: 0,
  mistral: 0,
  qwen: 0,
};

function splitCsv(value?: string) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function keyPool(prefix: 'GROQ' | 'MISTRAL' | 'QWEN') {
  return unique([
    ...splitCsv(process.env[`${prefix}_API_KEYS`]),
    process.env[`${prefix}_API_KEY_1`] || '',
    process.env[`${prefix}_API_KEY_2`] || '',
    process.env[`${prefix}_API_KEY_3`] || '',
    process.env[`${prefix}_API_KEY`] || '',
  ].filter(Boolean));
}

function nextKey(provider: ProviderName) {
  const pool =
    provider === 'groq'
      ? keyPool('GROQ')
      : provider === 'mistral'
        ? keyPool('MISTRAL')
        : keyPool('QWEN');

  if (!pool.length) {
    throw new Error(`Missing API key pool for ${provider}`);
  }

  const index = counters[provider] % pool.length;
  counters[provider] += 1;
  return pool[index];
}

function envModel(name: string, fallback?: string) {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (fallback) return fallback;
  throw new Error(`Missing model env: ${name}`);
}

export function resolveProvider(modality: Modality, requested?: ProviderName): ProviderName {
  if (requested) return requested;

  if (modality === 'vision') {
    return (process.env.DEFAULT_VISION_PROVIDER as ProviderName) || 'mistral';
  }

  if (modality === 'audio') {
    return (process.env.DEFAULT_AUDIO_PROVIDER as ProviderName) || 'mistral';
  }

  return (process.env.DEFAULT_TEXT_PROVIDER as ProviderName) || 'groq';
}

export function fallbackOrder(modality: Modality, primary: ProviderName): ProviderName[] {
  const defaults: ProviderName[] =
    modality === 'text' ? ['groq', 'mistral', 'qwen'] : ['mistral', 'groq', 'qwen'];

  return [primary, ...defaults.filter((provider) => provider !== primary)];
}

export function providerConfig(provider: ProviderName, modality: Modality): ProviderConfig {
  if (provider === 'groq') {
    const model =
      modality === 'vision'
        ? envModel('GROQ_VISION_MODEL', envModel('GROQ_TEXT_MODEL', 'llama-3.3-70b-versatile'))
        : modality === 'audio'
          ? envModel('GROQ_AUDIO_MODEL', envModel('GROQ_TEXT_MODEL', 'llama-3.3-70b-versatile'))
          : envModel('GROQ_TEXT_MODEL', 'llama-3.3-70b-versatile');

    return {
      provider,
      apiKey: nextKey(provider),
      endpoint: process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions',
      model,
    };
  }

  if (provider === 'mistral') {
    const textModel = envModel('MISTRAL_TEXT_MODEL', 'mistral-large-latest');
    const model =
      modality === 'vision'
        ? envModel('MISTRAL_VISION_MODEL', textModel)
        : modality === 'audio'
          ? envModel('MISTRAL_AUDIO_MODEL', textModel)
          : textModel;

    return {
      provider,
      apiKey: nextKey(provider),
      endpoint: process.env.MISTRAL_API_BASE_URL || 'https://api.mistral.ai/v1/chat/completions',
      model,
    };
  }

  const qwenBaseUrl = process.env.QWEN_API_BASE_URL || process.env.QWEN_BASE_URL;
  if (!qwenBaseUrl) {
    throw new Error('Missing QWEN_API_BASE_URL or QWEN_BASE_URL');
  }

  const qwenTextModel = envModel('QWEN_TEXT_MODEL', process.env.QWEN_MODEL || 'qwen-max');
  const model =
    modality === 'vision'
      ? envModel('QWEN_VISION_MODEL', qwenTextModel)
      : modality === 'audio'
        ? envModel('QWEN_AUDIO_MODEL', qwenTextModel)
        : qwenTextModel;

  return {
    provider,
    apiKey: nextKey(provider),
    endpoint: qwenBaseUrl,
    model,
  };
}
