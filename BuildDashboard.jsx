import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Database,
  Server,
  Mail,
  Monitor,
  Globe,
  CheckCircle2,
  Circle,
  Layers3,
  Route,
  Rocket,
  ShieldCheck,
  Search,
  GitBranch,
} from 'lucide-react';

const tracks = [
  {
    id: 'A',
    name: 'Supabase Memory Migration',
    phase: 'Phase 0/1',
    status: 'in_progress',
    dependency: 'A1 service key',
    fallback: 'Stay on SQLite temporarily',
    description: 'Move memory from local storage to Supabase for reliability and scale.',
    tasks: ['A1 Obtain service role key', 'A2 Create schemas', 'A3 Migrate records', 'A4 Validate memory reads', 'A5 Cut over app writes'],
    tools: ['Supabase', 'Flask'],
    icon: Database,
  },
  {
    id: 'KB',
    name: 'Knowledge Base',
    phase: 'Phase 1',
    status: 'in_progress',
    dependency: 'A1 service key',
    fallback: 'Skip semantic recall and keep keyword mode',
    description: 'Long-term semantic memory using vector embeddings and retrieval.',
    tasks: [
      'KB1 Enable pgvector + embeddings table',
      'KB2 Build embed_and_store(text, metadata)',
      'KB3 Build recall(query, top_k=5)',
      'KB4 Inject memories into /chat context',
      'KB5 Add decision/outcome learning loop',
    ],
    tools: ['Supabase', 'Mistral', 'Python'],
    icon: Brain,
  },
  {
    id: 'B',
    name: 'Vector Learning',
    phase: 'Phase 1',
    status: 'todo',
    dependency: 'A1 service key',
    fallback: 'Use keyword search only',
    description: 'Use embeddings to detect recurring patterns and better intent matching.',
    tasks: ['B1 Index historical data', 'B2 Similarity scoring', 'B3 Ranking tests', 'B4 Pattern tagging', 'B5 Deploy semantic retrieval'],
    tools: ['Supabase', 'Mistral'],
    icon: Search,
  },
  {
    id: 'C',
    name: 'Data Processing Engine',
    phase: 'Phase 1',
    status: 'in_progress',
    dependency: 'None',
    fallback: 'Text-only parsing pipeline',
    description: 'Process emails, docs, and uploaded content into normalized memory events.',
    tasks: ['C1 Ingestion queue', 'C2 Parser for docs', 'C3 Parser for email bodies', 'C4 Metadata extractor', 'C5 Validation + logs'],
    tools: ['Python', 'Flask'],
    icon: Layers3,
  },
  {
    id: 'D',
    name: 'Email Marketing System',
    phase: 'Phase 2',
    status: 'todo',
    dependency: 'F1 + A1',
    fallback: 'Gmail SMTP only',
    description: 'Draft, schedule, and send contextual follow-up campaigns.',
    tasks: ['D1 Template engine', 'D2 Contact segmentation', 'D3 Trigger rules', 'D4 Draft generation', 'D5 Approval flow', 'D6 Send + tracking'],
    tools: ['Resend', 'Gmail'],
    icon: Mail,
  },
  {
    id: 'E',
    name: 'Vercel Frontend',
    phase: 'Phase 3',
    status: 'todo',
    dependency: 'A1 + KB4 + C5 + D6',
    fallback: 'Keep UI on ECS',
    description: 'Deploy final chat interface at pat.espacios.me with build-safe API routing.',
    tasks: ['E1 Build chat screens', 'E2 Add card decision UI', 'E3 Add button-first flows', 'E4 Hook API gateway', 'E5 Deploy to Vercel domain'],
    tools: ['React', 'Vercel'],
    icon: Monitor,
  },
  {
    id: 'F',
    name: 'Email Identity (Resend)',
    phase: 'Phase 1',
    status: 'done',
    dependency: 'None',
    fallback: 'Gmail only',
    description: 'Set up verified sender identity and DNS records for deliverability.',
    tasks: ['F1 Verify domain', 'F2 SPF/DKIM', 'F3 Test send', 'F4 Bounce handling', 'F5 Monitoring'],
    tools: ['Resend', 'Cloudflare'],
    icon: ShieldCheck,
  },
  {
    id: 'G',
    name: 'Domain + DNS Management',
    phase: 'Phase 1',
    status: 'todo',
    dependency: 'None',
    fallback: 'Manual console management',
    description: 'Route root domain, APIs, and subdomains through controlled DNS.',
    tasks: ['G1 DNS inventory', 'G2 CNAME/A records', 'G3 SSL validation', 'G4 Routing verification'],
    tools: ['GoDaddy', 'Cloudflare'],
    icon: Globe,
  },
];

const deploymentSteps = [
  'Finish Phase 0 + Phase 1 including KB.',
  'Update ECS Nginx to proxy /api/* and /api/memory.',
  'Deploy frontend to Vercel on pat.espacios.me.',
  'Point Cloudflare CNAME pat.espacios.me to Vercel.',
  'Restart container: docker restart void-aether-app.',
  'Run end-to-end test on https://espacios.me.',
];

const statusStyle = {
  done: 'text-white bg-white/15 border-white/40',
  in_progress: 'text-white bg-white/10 border-white/25',
  todo: 'text-white/75 bg-black/30 border-white/10',
};

function StatusPill({ status }) {
  const label = status === 'in_progress' ? 'in progress' : status;
  return <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${statusStyle[status]}`}>{label}</span>;
}

export default function BuildDashboard() {
  const [active, setActive] = useState(tracks[0]);

  const progress = useMemo(() => {
    const done = tracks.filter((track) => track.status === 'done').length;
    return Math.round((done / tracks.length) * 100);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <header className="rounded-3xl border border-white/15 bg-white/5 p-6 mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">PAT Build</p>
            <h1 className="text-3xl font-semibold mt-2">Execution Dashboard</h1>
            <p className="text-white/70 mt-3 max-w-3xl">
              Build view generated from the README plan: tracks, dependencies, fallbacks, and deployment sequence.
            </p>
            <div className="mt-4 text-sm text-white/70 flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> Overall completion: {progress}%
            </div>
          </header>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <motion.button
                  key={track.id}
                  onClick={() => setActive(track)}
                  whileHover={{ y: -4 }}
                  className="text-left rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="h-10 w-10 rounded-2xl border border-white/20 bg-black/40 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <StatusPill status={track.status} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">{track.phase}</p>
                  <h3 className="text-lg font-medium mt-1">{track.id} · {track.name}</h3>
                  <p className="text-sm text-white/70 mt-2">{track.description}</p>
                </motion.button>
              );
            })}
          </div>

          <section className="rounded-3xl border border-white/15 bg-white/5 p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Route className="w-4 h-4" />
              <h2 className="text-lg font-medium">Deployment order (espacios.me)</h2>
            </div>
            <ol className="space-y-2 text-white/80 text-sm list-decimal pl-5">
              {deploymentSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </section>

        <aside className="rounded-3xl border border-white/15 bg-white/5 p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold">{active.id} · {active.name}</h2>
          <p className="text-sm text-white/70 mt-2">{active.description}</p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
              <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-1">Dependency</p>
              <p>{active.dependency}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
              <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-1">Fallback</p>
              <p>{active.fallback}</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-2">Build steps</p>
            <div className="space-y-2">
              {active.tasks.map((task) => (
                <div key={task} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm flex items-start gap-2">
                  {active.status === 'done' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <Circle className="w-4 h-4 mt-0.5" />}
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-white/10 text-xs text-white/60 flex items-center gap-2">
            <Rocket className="w-4 h-4" /> Turn this into execution tickets next.
          </div>
        </aside>
      </div>
    </div>
  );
}
