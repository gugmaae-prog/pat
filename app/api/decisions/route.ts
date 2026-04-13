import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trackId = String(body?.trackId || '').trim();
    const optionId = String(body?.optionId || '').trim();
    const title = String(body?.title || '').trim();

    if (!trackId || !optionId || !title) {
      return NextResponse.json({ ok: false, message: 'trackId, optionId, and title are required.' }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('cards').insert({
      card_type: 'decision',
      content: title,
      metadata: {
        trackId,
        optionId,
        savedAt: new Date().toISOString(),
      },
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
