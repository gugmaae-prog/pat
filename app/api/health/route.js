import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const [memoriesCount, factsCount, chatsCount, heartbeat] = await Promise.all([
      supabase.from('memories').select('*', { count: 'exact', head: true }),
      supabase.from('facts').select('*', { count: 'exact', head: true }),
      supabase.from('cards').select('*', { count: 'exact', head: true }).eq('card_type', 'chat'),
      supabase
        .from('worker_heartbeats')
        .select('worker_name, heartbeat_at')
        .order('heartbeat_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    return NextResponse.json({
      ok: true,
      counts: {
        memories: memoriesCount.count ?? 0,
        facts: factsCount.count ?? 0,
        chats: chatsCount.count ?? 0,
      },
      latestHeartbeat: heartbeat.data ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        counts: { memories: 0, facts: 0, chats: 0 },
        latestHeartbeat: null,
        message,
      },
      { status: 500 },
    );
  }
}
