import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('cards')
      .select('id, content, metadata, created_at')
      .eq('card_type', 'chat')
      .order('id', { ascending: true })
      .limit(50);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, messages: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, messages: [], message }, { status: 500 });
  }
}
