import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generateReply } from '@/lib/ai/router';
import type { ChatMessage, Modality, ProviderName } from '@/lib/ai/types';

function isProviderName(value: unknown): value is ProviderName {
  return value === 'groq' || value === 'mistral' || value === 'qwen';
}

function isModality(value: unknown): value is Modality {
  return value === 'text' || value === 'vision' || value === 'audio';
}

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

function lastUserText(messages: ChatMessage[]) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  return lastUserMessage ? textFromContent(lastUserMessage.content) : '';
}

export async function POST(request: Request) {
  const body = await request.json();
  const provider = isProviderName(body?.provider) ? body.provider : undefined;
  const modality = isModality(body?.modality) ? body.modality : 'text';
  const message = String(body?.message || '').trim();

  const messages: ChatMessage[] = Array.isArray(body?.messages) && body.messages.length
    ? body.messages
    : [
        {
          role: 'system',
          content:
            'You are PAT, a concise and practical executive assistant. Be clear, structured, and action-oriented.',
        },
        {
          role: 'user',
          content: message,
        },
      ];

  const userText = message || lastUserText(messages);

  if (!userText) {
    return NextResponse.json({ ok: false, message: 'Message is required.' }, { status: 400 });
  }

  try {
    const result = await generateReply({
      messages,
      provider,
      modality,
    });

    try {
      const supabase = createSupabaseServerClient();
      await supabase.from('cards').insert([
        {
          card_type: 'chat',
          content: userText,
          metadata: { role: 'user', provider: result.provider, modality: result.modality },
        },
        {
          card_type: 'chat',
          content: result.reply,
          metadata: {
            role: 'assistant',
            provider: result.provider,
            modality: result.modality,
            model: result.model,
          },
        },
      ]);
    } catch {
      // keep chat responsive even if DB write fails
    }

    return NextResponse.json({
      ok: true,
      reply: result.reply,
      provider: result.provider,
      modality: result.modality,
      model: result.model,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'All AI providers failed';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
