'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type HealthCounts = {
  memories: number;
  facts: number;
  chats: number;
};

const starterPrompts = [
  'Review my inbox and pull only priority emails.',
  'Draft replies for urgent client threads.',
  'Summarize decisions made in the dashboard today.',
  'Plan follow-ups for leads with no response in 5 days.',
];

const defaultHealth: HealthCounts = { memories: 0, facts: 0, chats: 0 };

export default function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [health, setHealth] = useState<HealthCounts>(defaultHealth);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [hasLoaded, setHasLoaded] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const statusText = useMemo(
    () => `Memories ${health.memories} • Facts ${health.facts} • Chats ${health.chats}`,
    [health],
  );

  const focusComposer = () => {
    requestAnimationFrame(() => composerRef.current?.focus());
  };

  const clearPrefillFromUrl = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const url = new URL(window.location.href);
    if (!url.searchParams.has('prefill')) {
      return;
    }

    url.searchParams.delete('prefill');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const loadWorkspace = async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') {
      setIsRefreshing(true);
      setStatusMessage('Refreshing workspace…');
    }

    try {
      const [healthRes, memoryRes] = await Promise.allSettled([fetch('/api/health'), fetch('/api/memories')]);

      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        const payload = await healthRes.value.json();
        setHealth(payload.counts || defaultHealth);
      }

      if (memoryRes.status === 'fulfilled' && memoryRes.value.ok) {
        const payload = await memoryRes.value.json();
        const loadedMessages = (payload.messages || []).map((row: any) => ({
          role: row.metadata?.role === 'assistant' ? 'assistant' : 'user',
          content: row.content || '',
        }));
        setMessages(loadedMessages);
      }

      setStatusMessage(mode === 'refresh' ? 'Workspace refreshed' : 'Ready');
    } catch {
      setStatusMessage('Workspace loaded with limited connectivity');
    } finally {
      setHasLoaded(true);
      setIsRefreshing(false);
      focusComposer();
    }
  };

  useEffect(() => {
    loadWorkspace('initial');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const prefill = new URLSearchParams(window.location.search).get('prefill');
    if (prefill) {
      setInput(prefill);
      setStatusMessage('Prompt loaded from dashboard');
      focusComposer();
      clearPrefillFromUrl();
    }
  }, []);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages, isSending]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) {
      return;
    }

    setIsSending(true);
    setStatusMessage('PAT is thinking…');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const payload = await response.json().catch(() => ({}));
      const reply = response.ok && payload.reply ? payload.reply : payload.message || 'PAT could not generate a response.';

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setStatusMessage('Response ready');
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network issue while reaching PAT backend. Please try again.' },
      ]);
      setStatusMessage('Connection issue');
    } finally {
      setIsSending(false);
      focusComposer();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setStatusMessage('New chat started');
    focusComposer();
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setStatusMessage('Message copied');
    } catch {
      setStatusMessage('Copy unavailable');
    }
  };

  const showEmptyState = hasLoaded && messages.length === 0;

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brandCard">
          <p className="eyebrow">PAT</p>
          <h1>Assistant</h1>
          <p>Simple chat workspace with working controls, fast prompts, and a clean deploy-safe layout.</p>
        </div>

        <div className="sidebarGroup">
          <button type="button" className="primaryButton" onClick={handleNewChat}>
            + New chat
          </button>
          <button type="button" className="secondaryButton" onClick={() => loadWorkspace('refresh')} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing…' : 'Reload context'}
          </button>
          <Link href="/dashboard" className="secondaryButton linkButton">
            Open dashboard
          </Link>
        </div>

        <div className="statusCard">
          <p className="eyebrow">Workspace</p>
          <p className="statusValue">{statusText}</p>
          <p className="statusHint">{statusMessage}</p>
        </div>
      </aside>

      <section className="chatShell">
        <header className="chatHeader">
          <div>
            <p className="eyebrow">Chat</p>
            <h2>PAT</h2>
          </div>
          <span className="badge">Live</span>
        </header>

        <div ref={messagesRef} className="messagesPane">
          {showEmptyState ? (
            <div className="emptyState">
              <h3>How can I help today?</h3>
              <p>Use one of the quick actions below or type directly into the composer.</p>
              <div className="promptGrid">
                {starterPrompts.map((prompt) => (
                  <button key={prompt} type="button" className="promptCard" onClick={() => sendMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messageList">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`messageRow ${message.role}`}>
                  <div className={`avatar ${message.role}`}>{message.role === 'assistant' ? 'P' : 'Y'}</div>
                  <div className="messageBody">
                    <div className="messageMeta">
                      <span>{message.role === 'assistant' ? 'PAT' : 'You'}</span>
                      <button type="button" className="copyButton" onClick={() => handleCopy(message.content)}>
                        Copy
                      </button>
                    </div>
                    <div className={`messageBubble ${message.role}`}>{message.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="composerWrap">
          <div className="composer">
            <textarea
              ref={composerRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Message PAT"
              rows={1}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <button type="button" className="sendButton" disabled={isSending || !input.trim()} onClick={() => sendMessage(input)}>
              {isSending ? 'Sending…' : 'Send'}
            </button>
          </div>
          <p className="composerHint">Enter to send • Shift + Enter for a new line</p>
        </div>
      </section>

      <style jsx>{`
        .shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          background: #0d0d0d;
          color: #f5f5f5;
        }
        .sidebar {
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 20px;
          display: grid;
          gap: 18px;
          align-content: start;
          background: #111111;
        }
        .brandCard,
        .statusCard {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
        }
        .brandCard h1,
        .chatHeader h2,
        .emptyState h3 {
          margin: 6px 0 8px;
          font-size: 24px;
          font-weight: 600;
        }
        .brandCard p,
        .statusCard p,
        .emptyState p,
        .composerHint {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.45;
        }
        .eyebrow {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.48);
        }
        .sidebarGroup {
          display: grid;
          gap: 10px;
        }
        .primaryButton,
        .secondaryButton,
        .promptCard,
        .sendButton,
        .copyButton {
          transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
        }
        .primaryButton,
        .secondaryButton,
        .linkButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
        }
        .primaryButton {
          background: white;
          color: black;
          font-weight: 600;
        }
        .secondaryButton,
        .linkButton {
          background: rgba(255, 255, 255, 0.04);
        }
        .secondaryButton:disabled,
        .sendButton:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .statusValue {
          margin-top: 8px;
          font-size: 15px;
          color: white;
        }
        .statusHint {
          margin-top: 6px;
          font-size: 13px;
        }
        .chatShell {
          display: grid;
          grid-template-rows: auto 1fr auto;
          min-height: 100vh;
        }
        .chatHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(13, 13, 13, 0.92);
          position: sticky;
          top: 0;
          z-index: 2;
          backdrop-filter: blur(10px);
        }
        .badge {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.78);
        }
        .messagesPane {
          overflow: auto;
          padding: 24px;
        }
        .emptyState {
          max-width: 760px;
          margin: 8vh auto 0;
          text-align: center;
        }
        .promptGrid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .promptCard {
          text-align: left;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: white;
          padding: 16px;
          min-height: 86px;
          cursor: pointer;
        }
        .promptCard:hover,
        .secondaryButton:hover,
        .copyButton:hover,
        .linkButton:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .messageList {
          max-width: 860px;
          margin: 0 auto;
          display: grid;
          gap: 18px;
        }
        .messageRow {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          align-items: start;
        }
        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.06);
        }
        .avatar.user {
          background: white;
          color: black;
        }
        .messageBody {
          min-width: 0;
        }
        .messageMeta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 13px;
        }
        .copyButton {
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 0;
        }
        .messageBubble {
          border-radius: 18px;
          padding: 14px 16px;
          line-height: 1.55;
          white-space: pre-wrap;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .messageBubble.assistant {
          background: rgba(255, 255, 255, 0.04);
        }
        .messageBubble.user {
          background: rgba(255, 255, 255, 0.1);
        }
        .composerWrap {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 24px 22px;
          background: linear-gradient(180deg, rgba(13,13,13,0.86), #0d0d0d);
        }
        .composer {
          max-width: 860px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.04);
          padding: 12px;
        }
        textarea {
          resize: none;
          border: 0;
          outline: none;
          background: transparent;
          color: white;
          font: inherit;
          min-height: 28px;
          max-height: 220px;
        }
        .sendButton {
          align-self: end;
          min-width: 88px;
          min-height: 46px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: white;
          color: black;
          font-weight: 600;
          cursor: pointer;
        }
        .composerHint {
          max-width: 860px;
          margin: 10px auto 0;
          font-size: 12px;
        }
        @media (max-width: 920px) {
          .shell {
            grid-template-columns: 1fr;
          }
          .sidebar {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .promptGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
