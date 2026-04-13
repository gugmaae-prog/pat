'use client';

import React, { useState } from 'react';

const quickChoices = [
  'Review today priorities',
  'Draft reply to latest urgent email',
  'Summarize recent memory signals',
];

export default function ChatShell() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'I am PAT. I can help with planning, memory-aware context, and email support. Choose a quick action or type your message.',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (text) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: cleaned },
      {
        role: 'assistant',
        text: 'Acknowledged. I would route this through memory recall, check related context, and then draft a concise response.',
      },
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-3xl border border-white/20 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">PAT AI Assistant</p>
          <h1 className="text-3xl font-semibold mt-2">Minimal intelligence shell</h1>
          <p className="text-white/65 mt-3">
            Clean black and white interface. Button-first support for common decisions.
          </p>
        </header>

        <main className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {quickChoices.map((choice) => (
              <button
                key={choice}
                onClick={() => sendMessage(choice)}
                className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                {choice}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                  message.role === 'assistant'
                    ? 'border-white/15 bg-white/5 text-white/90'
                    : 'border-white/25 bg-white text-black ml-auto max-w-[85%]'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message"
              className="flex-1 rounded-2xl border border-white/20 bg-black px-4 h-11 text-sm text-white outline-none"
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage(input);
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              className="rounded-2xl border border-white/30 bg-white text-black px-4 h-11 text-sm font-medium"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
