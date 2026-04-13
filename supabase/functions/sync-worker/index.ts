Deno.serve(async () => {
  return new Response(JSON.stringify({ ok: true, worker: 'sync-worker' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
