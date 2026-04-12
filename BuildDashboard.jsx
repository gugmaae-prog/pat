import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Database,
  Mail,
  Monitor,
  Globe,
  CheckCircle2,
  Circle,
  Layers3,
  Route,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  GitBranch,
} from 'lucide-react';

const tracks = [
  {
    id: 'A',
    name: 'Supabase Memory Migration',
    phase: 'Phase 0 / 1',
    status: 'in_progress',
    dependency: 'A1 service key',
    fallback: 'Stay on SQLite temporarily',
    summary: 'Move memory to Supabase for stability.',
    description: 'Move memory from local storage to Supabase for reliability and scale.',
    tasks: ['A1 Obtain service role key', 'A2 Create schemas', 'A3 Migrate records', 'A4 Validate memory reads', 'A5 Cut over app writes'],
    icon: Database,
  },
  {
    id: 'KB',
    name: 'Knowledge Base',
    phase: 'Phase 1',
    status: 'in_progress',
    dependency: 'A1 service key',
    fallback: 'Skip semantic recall and keep keyword mode',
    summary: 'Create long-term semantic memory.',
    description: 'Long-term semantic memory using vector embeddings and retrieval.',
    tasks: [
      'KB1 Enable pgvector + embeddings table',
      'KB2 Build embed_and_store(text, metadata)',
      'KB3 Build recall(query, top_k=5)',
      'KB4 Inject memories into /chat context',
      'KB5 Add decision/outcome learning loop',
    ],
    icon: Brain,
  },
  {
    id: 'B',
    name: 'Vector Learning',
    phase: 'Phase 1',
    status: 'todo',
    dependency: 'A1 service key',
    fallback: 'Use keyword search only',
    summary: 'Understand recurring intent patterns.',
    description: 'Use embeddings to detect recurring patterns and improve matching.',
    tasks: ['B1 Index historical data', 'B2 Similarity scoring', 'B3 Ranking tests', 'B4 Pattern tagging', 'B5 Deploy semantic retrieval'],
    icon: Search,
  },
  {
    id: 'C',
    name: 'Data Processing Engine',
    phase: 'Phase 1',
    status: 'in_progress',
    dependency: 'None',
    fallback: 'Text-only parsing pipeline',
    summary: 'Turn files + emails into usable signals.',
    description: 'Process emails, docs, and uploads into normalized memory events.',
    tasks: ['C1 Ingestion queue', 'C2 Parser for docs', 'C3 Parser for email bodies', 'C4 Metadata extractor', 'C5 Validation + logs'],
    icon: Layers3,
  },
  {
    id: 'D',
    name: 'Email Marketing System',
    phase: 'Phase 2',
    status: 'todo',
    dependency: 'F1 + A1',
    fallback: 'Gmail SMTP only',
    summary: 'Send triggered follow-ups from PAT.',
    description: 'Draft, schedule, and send contextual follow-up campaigns.',
    tasks: ['D1 Template engine', 'D2 Contact segmentation', 'D3 Trigger rules', 'D4 Draft generation', 'D5 Approval flow', 'D6 Send + tracking'],
    icon: Mail,
  },
  {
    id: 'E',
    name: 'Vercel Frontend',
    phase: 'Phase 3',
    status: 'todo',
    dependency: 'A1 + KB4 + C5 + D6',
    fallback: 'Keep UI on ECS',
    summary: 'Ship app UI to pat.espacios.me.',
    description: 'Deploy final chat interface at pat.espacios.me with API routing.',
    tasks: ['E1 Build chat screens', 'E2 Add card decision UI', 'E3 Add button-first flows', 'E4 Hook API gateway', 'E5 Deploy to Vercel domain'],
    icon: Monitor,
  },
  {
    id: 'F',
    name: 'Email Identity (Resend)',
    phase: 'Phase 1',
    status: 'done',
    dependency: 'None',
    fallback: 'Gmail only',
    summary: 'Verify sender identity + deliverability.',
    description: 'Set up verified sender identity and DNS records for deliverability.',
    tasks: ['F1 Verify domain', 'F2 SPF/DKIM', 'F3 Test send', 'F4 Bounce handling', 'F5 Monitoring'],
    icon: ShieldCheck,
  },
  {
    id: 'G',
    name: 'Domain + DNS Management',
    phase: 'Phase 1',
    status: 'todo',
    dependency: 'None',
    fallback: 'Manual console management',
    summary: 'Point root + subdomains safely.',
    description: 'Route root domain, APIs, and subdomains through controlled DNS.',
    tasks: ['G1 DNS inventory', 'G2 CNAME/A records', 'G3 SSL validation', 'G4 Routing verification'],
    icon: Globe,
  },
];

const deploymentSteps = [
  'Finish Phase 0 + Phase 1 including KB',
  'Update ECS Nginx to proxy /api/* and /api/memory',
  'Deploy frontend to Vercel on pat.espacios.me',
  'Point Cloudflare CNAME pat.espacios.me to Vercel',
  'Restart container: docker restart void-aether-app',
  'Run end-to-end test on https://espacios.me',
];

const statusCopy = {
  done: 'Done',
  in_progress: 'In progress',
  todo: 'Queued',
};

function TrackCard({ track, isOpen, onToggle }) {
  const Icon = track.icon;

  return (
    <motion.article
      layout
      className="rounded-[28px] border border-black/10 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md"
    >
      <button onClick={onToggle} className="w-full text-left p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 min-w-0">
            <div className="h-11 w-11 rounded-2xl border border-black/10 bg-black text-white flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">{track.phase}</p>
              <h3 className="text-lg font-semibold text-black mt-1 truncate">{track.id} · {track.name}</h3>
              <p className="text-sm text-black/65 mt-2">{track.summary}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black/60">
              {statusCopy[track.status]}
            </span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-black/45" /> : <ChevronDown className="w-4 h-4 text-black/45" />}
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 border-t border-black/8">
              <p className="text-sm text-black/70 mt-4">{track.description}</p>

              <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                <div className="rounded-2xl border border-black/10 bg-white p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/45 mb-1">Dependency</p>
                  <p className="text-black/80">{track.dependency}</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/45 mb-1">Fallback</p>
                  <p className="text-black/80">{track.fallback}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {track.tasks.map((task) => (
                  <div key={task} className="rounded-xl border border-black/10 bg-[#f5f5f5] px-3 py-2 flex items-start gap-2 text-sm text-black/85">
                    {track.status === 'done' ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <Circle className="w-4 h-4 mt-0.5" />}
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function BuildDashboard() {
  const [openTrackId, setOpenTrackId] = useState('KB');

  const progress = useMemo(() => {
    const done = tracks.filter((track) => track.status === 'done').length;
    return Math.round((done / tracks.length) * 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#ececec] text-black p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[32px] border border-black/10 bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-[0_20px_40px_rgba(15,23,42,0.07)] mb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-black/50">PAT Build Board</p>
              <h1 className="text-3xl sm:text-4xl font-semibold mt-2">Execution cards</h1>
              <p className="text-black/65 mt-3 max-w-2xl">Minimal expandable cards based on your README plan and KB rollout.</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#f4f4f4] px-4 py-3 min-w-[170px]">
              <div className="text-[11px] uppercase tracking-[0.2em] text-black/45 flex items-center gap-2"><GitBranch className="w-3.5 h-3.5" /> Progress</div>
              <div className="text-2xl font-semibold mt-1">{progress}%</div>
              <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
                <motion.div className="h-full bg-black" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
          <section className="space-y-4">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isOpen={openTrackId === track.id}
                onToggle={() => setOpenTrackId((prev) => (prev === track.id ? '' : track.id))}
              />
            ))}
          </section>

          <aside className="rounded-[28px] border border-black/10 bg-white/75 backdrop-blur-md p-5 sticky top-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <Route className="w-4 h-4" />
              <h2 className="text-lg font-semibold">Deployment order</h2>
            </div>
            <ol className="space-y-2 text-sm text-black/75 list-decimal pl-5">
              {deploymentSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </div>
  );
}
