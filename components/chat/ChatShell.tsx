'use client';

import Link from 'next/link';

const suggestedActions = [
  'Plan my marketing workflow for this week',
  'Review urgent emails and draft responses',
  'Summarize progress from dashboard tracks',
];

export default function ChatShell() {
  return (
    <main className="chat-root">
      <header className="chat-header">
        <div>
          <p className="label">PAT</p>
          <h1>AI Assistant</h1>
        </div>
        <Link href="/dashboard" className="link-btn">
          Open Dashboard
        </Link>
      </header>

      <section className="chat-window">
        <div className="message assistant">
          I am ready. I can help with planning, campaigns, and email decisions.
        </div>
      </section>

      <section className="suggestions">
        {suggestedActions.map((item) => (
          <button key={item} className="suggestion-btn" type="button">
            {item}
          </button>
        ))}
      </section>

      <form className="composer">
        <input placeholder="Message PAT" aria-label="Message PAT" />
        <button type="button">Send</button>
      </form>

      <style jsx>{`
        .chat-root {
          min-height: 100vh;
          max-width: 980px;
          margin: 0 auto;
          padding: 24px;
          display: grid;
          gap: 16px;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 18px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.04);
        }
        .label {
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: 12px;
          opacity: 0.7;
          margin: 0;
        }
        h1 {
          margin: 8px 0 0;
          font-size: 24px;
          font-weight: 600;
        }
        .link-btn {
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.05);
        }
        .chat-window {
          min-height: 48vh;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
        }
        .message {
          max-width: 680px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.04);
          line-height: 1.45;
        }
        .suggestions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .suggestion-btn {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          border-radius: 12px;
          padding: 12px;
          text-align: left;
        }
        .composer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.03);
        }
        input {
          background: transparent;
          color: #fff;
          border: 0;
          outline: none;
          font-size: 14px;
          padding: 8px;
        }
        button {
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 10px 14px;
          font-size: 14px;
        }
        @media (max-width: 900px) {
          .suggestions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
