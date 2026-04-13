import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message || '').trim();

  if (!message) {
    return NextResponse.json({ ok: false, message: 'Message is required.' }, { status: 400 });
  }

  const reply = `PAT: ${message}`;

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
