'use client';

import React from 'react';
import { CheckCircle2, Circle, FolderKanban, Target, ShieldAlert, ListChecks } from 'lucide-react';

function SectionCard({ title, children, icon: Icon }) {
  return (
    <section className="rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-white/80" />
        <h3 className="text-sm uppercase tracking-[0.2em] text-white/65">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function ProjectDashboardTool({ project }) {
  if (!project) return null;

  return (
    <div className="mt-5 rounded-[28px] border border-white/20 bg-white/[0.03] p-4 sm:p-5 space-y-4">
      <header className="rounded-2xl border border-white/15 bg-black/40 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-white/50">PAT Tool</p>
        <h2 className="text-xl sm:text-2xl font-semibold mt-1">Project Dashboard · {project.name}</h2>
        <p className="text-sm text-white/70 mt-2">Generated from the chat planning flow.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Goal" icon={Target}>
          <p className="text-sm text-white/85 leading-6">{project.goal}</p>
          <p className="text-xs text-white/55 mt-3">Scope: {project.scope}</p>
          <p className="text-xs text-white/55 mt-1">Constraints: {project.constraints}</p>
        </SectionCard>

        <SectionCard title="Phase cards" icon={FolderKanban}>
          <div className="space-y-2">
            {project.phases.map((phase) => (
              <div key={phase.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{phase.id} · {phase.name}</p>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-white/55">{phase.status}</span>
                </div>
                <p className="text-xs text-white/65 mt-1">{phase.summary}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Task list" icon={ListChecks}>
          <div className="space-y-2">
            {project.tasks.map((task) => (
              <div key={task.title} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm flex items-start gap-2">
                {task.done ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <Circle className="w-4 h-4 mt-0.5" />}
                <span>{task.title}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Risks + safeguards" icon={ShieldAlert}>
          <ul className="list-disc pl-5 space-y-2 text-sm text-white/80">
            {project.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55 mb-1">Next actions</p>
            <ul className="list-decimal pl-5 text-sm space-y-1 text-white/80">
              {project.nextActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
