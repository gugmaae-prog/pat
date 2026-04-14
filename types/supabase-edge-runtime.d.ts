declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export * from '@supabase/supabase-js';
}

declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (...args: any[]) => Response | Promise<Response>): void;
};
