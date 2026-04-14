import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function buildReply(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('inbox') || normalized.includes('email')) {
    return [
      'Here is a focused inbox plan:',
      '1. Pull unread, flagged, and high-priority threads from the last 48 hours.',
      '2. Group them into reply now, delegate, and archive.',
      '3. Draft responses for the reply now bucket first.',
      '',
      'Send me a specific inbox goal and I will turn it into an action list.',
    ].join('\n');
  }

  if (normalized.includes('dashboard') || normalized.includes('decision') || normalized.includes('roadmap')) {
    return [
      'I can help turn the dashboard into next actions.',
      '',
      'Suggested flow:',
      '- choose the track that is blocked',
      '- save the path you want',
      '- ask for a revision if you need a lower-risk option',
      '',
      'Tell me which track you want to work on and I will summarize the next move.',
    ].join('\n');
  }

  if (normalized.includes('follow') || normalized.includes('lead') || normalized.includes('reply')) {
    return [
      'Here is a clean follow-up sequence:',
      '1. Identify contacts with no reply in the last 5 days.',
      '2. Segment them by warm, active, and cold status.',
      '3. Draft one short, specific follow-up per segment.',
      '',
      'I can also help draft the first version right away.',
    ].join('\n');
  }

  return [
    'Got it — I can help with that.',
    '',
    `Your prompt: "${message}"`,
    '',
    'Best next step: give me the exact outcome you want and I will turn it into a clearer action plan or draft.',
  ].join('\n');
}

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message || '').trim();

  if (!message) {
    return NextResponse.json({ ok: false, message: 'Message is required.' }, { status: 400 });
  }

  const reply = buildReply(message);

  try {
    const supabase = createSupabaseServerClient();
    await supabase.from('cards').insert([
      { card_type: 'chat', content: message, metadata: { role: 'user' } },
      { card_type: 'chat', content: reply, metadata: { role: 'assistant' } },
    ]);
  } catch {
    // non-blocking fallback: keep chat responsive even if DB write fails
  }

  return NextResponse.json({ ok: true, reply });
}
