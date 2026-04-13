'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type HealthData = {
  counts: {
    memories: number;
    facts: number;
    chats: number;
  };
};

const suggestedActions = [
  'Review my inbox and pull only priority emails.',
  'Draft replies for urgent client threads.',
  'Summarize decisions made in the dashboard today.',
  'Plan follow-ups for leads with no response in 5 days.',
];

const autonomousSignals = [
  'Background inbox triage enabled',
  'Priority detection: active',
  'Learning loop: adapting from edits',
];

export default function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [health, setHealth] = useState<HealthData['counts']>({ memories: 0, facts: 0, chats: 0 });
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const showSuggestions = messages.length === 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const prefill = searchParams.get('prefill');
    if (prefill) {
      setInput(prefill);
      inputRef.current?.focus();
    }
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      const [healthRes, memoryRes] = await Promise.allSettled([fetch('/api/health'), fetch('/api/memories')]);

      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        const payload = await healthRes.value.json();
        setHealth(payload.counts || { memories: 0, facts: 0, chats: 0 });
      }

      if (memoryRes.status === 'fulfilled' && memoryRes.value.ok) {
        const payload = await memoryRes.value.json();
        const loaded = (payload.messages || []).map((row: any) => ({
          role: row.metadata?.role === 'assistant' ? 'assistant' : 'user',
          content: row.content || '',
        }));
        setMessages(loaded);
      }
    };

    load();
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) {
      return;
    }

    setIsSending(true);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const payload = await response.json();
      const reply = payload.reply || 'PAT could not generate a response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network issue while reaching PAT backend.' }]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const statusText = useMemo(
    () => `Memories ${health.memories} • Facts ${health.facts} • Chats ${health.chats}`,
    [health],
  );

  return (
    <main className="shell">
      <aside className="rail">
        <div className="rail-card brand">
          <p className="rail-label">PAT</p>
          <h1>Autonomous Assistant</h1>
          <p>Black + white, sleek, and focused. Learns from your flow.</p>
        </div>

        <div className="rail-card">
          <p className="rail-label">Autonomy</p>
          <ul>
            {autonomousSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rail-card">
          <p className="rail-label">System</p>
          <p>{statusText}</p>
        </div>

        <Link href="/dashboard" className="dashboard-link">
          Open Build Dashboard
        </Link>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="rail-label">Conversation</p>
            <h2>PAT</h2>
          </div>
          <span className="dot">Live</span>
        </header>

        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="message assistant">
              I am on standby. I can review inbox activity in the background, surface priorities, and draft next actions.
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                {message.content}
              </div>
            ))
          )}
        </div>

        {showSuggestions && (
          <div className="suggestions">
            {suggestedActions.map((item) => (
              <button key={item} type="button" onClick={() => sendMessage(item)}>
                {item}
              </button>
            ))}
          </div>
        )}

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            ref={inputRef}
            placeholder="Message PAT"
            aria-label="Message PAT"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send'}
          </button>
        </form>
      </section>

      <style jsx>{`
        .shell { min-height: 100vh; display: grid; grid-template-columns: 300px 1fr; gap: 18px; padding: 18px; max-width: 1300px; margin: 0 auto; }
        .rail { display: grid; gap: 12px; align-content: start; }
        .rail-card { border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; background: rgba(255,255,255,0.03); padding: 16px; }
        .rail-card h1 { margin: 6px 0 8px; font-size: 22px; font-weight: 600; }
        .rail-card p { margin: 0; color: rgba(255,255,255,0.8); }
        .rail-label { margin: 0; text-transform: uppercase; letter-spacing: .14em; font-size: 11px; color: rgba(255,255,255,.58); }
        ul { margin: 10px 0 0; padding-left: 18px; display: grid; gap: 8px; color: rgba(255,255,255,.84); }
        .dashboard-link { border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 12px 14px; text-align: center; background: rgba(255,255,255,0.06); }
        .chat-panel { border: 1px solid rgba(255,255,255,0.12); border-radius: 30px; background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); padding: 14px; display: grid; gap: 12px; }
        .chat-header { display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 12px 14px; }
        h2 { margin: 4px 0 0; font-size: 22px; font-weight: 600; }
        .dot { border: 1px solid rgba(255,255,255,.26); border-radius: 999px; padding: 6px 10px; font-size: 12px; background: rgba(255,255,255,.08); }
        .chat-window { min-height: 58vh; max-height: 62vh; overflow: auto; display: grid; gap: 10px; align-content: start; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 14px; background: rgba(0,0,0,0.35); }
        .message { max-width: min(90%, 720px); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 13px 14px; line-height: 1.45; }
        .message.assistant { background: rgba(255,255,255,0.06); }
        .message.user { margin-left: auto; background: rgba(255,255,255,0.12); }
        .suggestions { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .suggestions button { text-align: left; border: 1px solid rgba(255,255,255,0.14); border-radius: 16px; background: rgba(255,255,255,0.05); color: white; padding: 11px 12px; }
        .composer { display: grid; grid-template-columns: 1fr auto; gap: 10px; border: 1px solid rgba(255,255,255,0.16); border-radius: 18px; padding: 8px; background: rgba(255,255,255,0.03); }
        .composer input { background: transparent; border: 0; outline: none; color: white; padding: 10px; }
        .composer button { border: 1px solid rgba(255,255,255,0.25); border-radius: 14px; background: rgba(255,255,255,0.1); color: white; padding: 10px 14px; }
        @media (max-width: 980px) {
          .shell { grid-template-columns: 1fr; }
          .suggestions { grid-template-columns: 1fr; }
          .chat-window { min-height: 52vh; }
        }
      `}</style>
    </main>
  );
}
