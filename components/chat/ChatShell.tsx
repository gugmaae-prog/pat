'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const quickPrompts = [
  'Create a launch checklist for today.',
  'Summarize my top priorities in 3 bullets.',
  'Draft a friendly follow-up message for a client.',
  'Give me one focused task for the next 30 minutes.',
];

export default function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

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
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

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
      const reply = payload.reply || 'kt pat sys is online, but no response was generated.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network issue while reaching kt pat sys. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <main className="chat-app">
      <section className="chat-card" aria-label="kt pat sys chat interface">
        <header className="top-bar">
          <div className="brand-wrap">
            <p className="brand-label">Thinking</p>
            <h1>kt pat sys</h1>
          </div>
          <span className="status-pill">Live</span>
        </header>

        <section className="messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>Start a conversation with kt pat sys.</p>
              <div className="prompt-grid">
                {quickPrompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                {message.content}
              </article>
            ))
          )}
          {isSending && <article className="bubble assistant">Thinking…</article>}
          <div ref={endRef} />
        </section>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message kt pat sys"
            aria-label="Message kt pat sys"
          />
          <button type="submit" disabled={isSending || input.trim().length === 0}>
            Send
          </button>
        </form>
      </section>

      <style jsx>{`
        .chat-app {
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right))
            max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
          background: #ffffff;
          color: #111111;
        }

        .chat-card {
          width: min(980px, 100%);
          height: min(92vh, 920px);
          height: min(92dvh, 920px);
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 14px;
          padding: clamp(12px, 2.4vw, 24px);
          border: 1px solid rgba(17, 17, 17, 0.1);
          border-radius: clamp(22px, 3.2vw, 34px);
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 24px 48px rgba(16, 24, 40, 0.14);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid rgba(17, 17, 17, 0.08);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.7);
        }

        .brand-wrap h1 {
          margin: 2px 0 0;
          font-size: clamp(24px, 3.2vw, 34px);
          letter-spacing: 0.01em;
        }

        .brand-label {
          margin: 0;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(17, 17, 17, 0.56);
        }

        .status-pill {
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid rgba(17, 17, 17, 0.14);
          background: rgba(255, 255, 255, 0.9);
        }

        .messages {
          overflow: auto;
          border: 1px solid rgba(17, 17, 17, 0.08);
          border-radius: 22px;
          padding: 14px;
          display: grid;
          align-content: start;
          gap: 10px;
          background: rgba(249, 249, 251, 0.92);
          overscroll-behavior: contain;
        }

        .empty-state {
          display: grid;
          gap: 14px;
        }

        .empty-state p {
          margin: 0;
          color: rgba(17, 17, 17, 0.74);
        }

        .prompt-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .prompt-grid button {
          border: 1px solid rgba(17, 17, 17, 0.12);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.9);
          color: #111111;
          padding: 10px 12px;
          font: inherit;
          transition: transform 120ms ease, background-color 120ms ease;
        }

        .composer button {
          border: 1px solid rgba(17, 17, 17, 0.12);
          border-radius: 16px;
          background: #111111;
          color: #ffffff;
          padding: 10px 14px;
          font: inherit;
          transition: transform 120ms ease, background-color 120ms ease;
        }

        .prompt-grid button:hover {
          transform: translateY(-1px);
          background: rgba(17, 17, 17, 0.06);
          cursor: pointer;
        }

        .composer button:hover:not(:disabled) {
          transform: translateY(-1px);
          background: #222222;
          cursor: pointer;
        }

        .bubble {
          max-width: min(88%, 720px);
          border-radius: 18px;
          padding: 11px 12px;
          line-height: 1.45;
          border: 1px solid rgba(17, 17, 17, 0.1);
        }

        .bubble.assistant {
          background: rgba(255, 255, 255, 0.95);
          justify-self: start;
        }

        .bubble.user {
          background: rgba(17, 17, 17, 0.08);
          justify-self: end;
        }

        .composer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          border: 1px solid rgba(17, 17, 17, 0.12);
          border-radius: 18px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.88);
          position: sticky;
          bottom: 0;
        }

        .composer input {
          border: 0;
          outline: none;
          background: transparent;
          color: #111111;
          font: inherit;
          padding: 10px;
        }

        .composer input::placeholder {
          color: rgba(17, 17, 17, 0.4);
        }

        .composer button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 740px) {
          .chat-card {
            height: calc(100dvh - 8px);
            border-radius: 20px;
            padding: 10px;
          }

          .prompt-grid {
            grid-template-columns: 1fr;
          }

          .top-bar {
            padding: 10px;
          }

          .status-pill {
            font-size: 11px;
          }

          .composer {
            grid-template-columns: 1fr;
          }

          .composer button {
            width: 100%;
          }
        }

        @media (max-height: 560px) and (orientation: landscape) {
          .chat-app {
            place-items: stretch;
            padding: max(6px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right))
              max(6px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
          }

          .chat-card {
            width: 100%;
            height: calc(100dvh - 8px);
            border-radius: 16px;
            padding: 8px;
            gap: 8px;
          }

          .top-bar {
            padding: 8px 10px;
          }

          .brand-wrap h1 {
            font-size: clamp(18px, 2.2vw, 24px);
          }

          .messages {
            padding: 10px;
            gap: 8px;
          }

          .bubble {
            max-width: 94%;
            padding: 9px 10px;
          }

          .composer {
            padding: 6px;
            gap: 8px;
          }

          .composer input {
            padding: 8px;
          }
        }
      `}</style>
    </main>
  );
}
