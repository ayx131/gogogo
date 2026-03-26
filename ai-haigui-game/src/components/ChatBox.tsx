import { useEffect, useRef, useState } from 'react';

import type { TMessage } from '../types';
import { Message } from './Message';

type TProps = {
  messages: TMessage[];
  onSend: (content: string) => void;
  disabled?: boolean;
  isSending?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
};

export function ChatBox({
  messages,
  onSend,
  disabled = false,
  isSending = false,
  errorMessage,
  onRetry,
}: TProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    if (disabled || isSending) return;
    onSend(content);
    setInput('');
  };

  return (
    <section className="flex flex-1 flex-col gap-3">
      {errorMessage && (
        <div className="animate-fade-in rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-xs text-rose-100 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <span>{errorMessage}</span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-md border border-rose-300/30 px-2 py-1 text-[11px] text-rose-100 transition hover:border-rose-200/50"
              >
                重试
              </button>
            )}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="glass-panel flex flex-1 flex-col gap-3 overflow-auto rounded-lg p-4 shadow-lg"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-400">
            <div className="h-10 w-10 rounded-full border border-dashed border-amber-400/40 bg-slate-900/60 animate-float" />
            <p>还没有任何提问。</p>
            <p className="text-xs text-slate-500">
              先从「人物关系」「死因」「时间地点」这三类问题切入会更快。
            </p>
          </div>
        ) : (
          messages.map((m) => <Message key={m.id} message={m} />)
        )}
      </div>

      <footer className="glass-panel rounded-lg p-3 shadow-lg">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              disabled
                ? '本局已结束，无法继续提问'
                : isSending
                  ? 'AI 思考中，请稍候...'
                  : '输入你的提问（回车发送）'
            }
            disabled={disabled || isSending}
            className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-amber-400/40 focus:shadow-[0_0_0_1px_rgba(251,191,36,0.25)] disabled:cursor-not-allowed disabled:border-slate-800/60 disabled:bg-slate-900/60 disabled:text-slate-500"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || isSending}
            className="min-w-[72px] rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            {isSending ? '发送中' : '发送'}
          </button>
        </div>
      </footer>
    </section>
  );
}

