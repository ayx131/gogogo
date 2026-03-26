import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { askAI } from '../api';
import { ChatBox } from '../components/ChatBox';
import { stories } from '../data/stories';
import type { TMessage } from '../types';

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type TToast = {
  type: 'success' | 'error' | 'info';
  message: string;
};

const TURTLE_GIF_URL =
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmV4eDZiZmJkMjd6MHZ4MnM2Y3N4dGVsejhzY3A4N3M2eWVubjF2YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oriO0OEd9QIDdllqo/giphy.gif';

export function Game() {
  const { id } = useParams();
  const navigate = useNavigate();

  const story = useMemo(
    () => stories.find((s) => s.id === id),
    [id],
  );

  const [messages, setMessages] = useState<TMessage[]>([]);
  const [status, setStatus] = useState<'playing' | 'ended'>('playing');
  const [wrongStreak, setWrongStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState<TToast | null>(null);
  const lastSendAtRef = useRef(0);

  if (!story) {
    return (
      <main className="min-h-full bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-lg">
            <div className="text-sm text-slate-300">未找到剧本。</div>
            <div className="mt-3">
              <Link className="text-amber-400 underline" to="/">
                返回大厅
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast(null);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: TToast['type'], message: string) => {
    setToast({ type, message });
  };

  const handleSend = async (content: string) => {
    if (status === 'ended' || isSending) {
      return;
    }
    const now = Date.now();
    const THROTTLE_MS = 450;
    if (now - lastSendAtRef.current < THROTTLE_MS) {
      showToast('info', '发送太快了，请稍候一下再提问');
      return;
    }
    lastSendAtRef.current = now;

    setErrorMessage('');
    setLastQuestion(content);
    setIsSending(true);
    const userMsg: TMessage = {
      id: createId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const thinkingMsgId = createId();
    const thinkingMsg: TMessage = {
      id: thinkingMsgId,
      role: 'assistant',
      content: '思考中...',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);

    try {
      const answer = await askAI(content, story);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMsgId
            ? {
                ...m,
                content: answer,
                timestamp: Date.now(),
              }
            : m,
        ),
      );

      setWrongStreak((prev) => {
        const next = answer === '是' ? 0 : prev + 1;
        return next;
      });
      if (answer === '是') {
        showToast('success', '命中了关键线索，继续追问');
      }
    } catch (error) {
      const userFacingError =
        error instanceof Error ? error.message : '网络异常，请稍后重试。';

      const fallback =
        error instanceof Error
          ? `抱歉，AI 暂时无法回答：${userFacingError}`
          : '抱歉，AI 暂时无法回答，请稍后再试。';
      setErrorMessage(userFacingError);
      showToast('error', 'AI 调用失败，请检查网络或稍后重试');

      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMsgId
            ? {
                ...m,
                content: fallback,
                timestamp: Date.now(),
              }
            : m,
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-full bg-slate-900">
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
          <div
            className={[
              'animate-fade-in rounded-lg px-3 py-2 text-xs shadow-lg ring-1',
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 ring-emerald-500/40'
                : toast.type === 'error'
                  ? 'bg-rose-950/90 text-rose-100 ring-rose-500/40'
                  : 'bg-slate-900/90 text-slate-100 ring-slate-600/60',
            ].join(' ')}
          >
            {toast.message}
          </div>
        </div>
      )}
      <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-4 px-3 py-4 sm:px-4 sm:py-10">
        <header className="glass-panel glass-panel-glow rounded-lg p-3 shadow-lg sm:p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>汤面</span>
                <span
                  className={
                    status === 'playing'
                      ? 'rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300'
                      : 'rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-300'
                  }
                >
                  {status === 'playing' ? '进行中' : '已结束'}
                </span>
              </div>
              <div className="mt-1 truncate text-base font-semibold text-amber-400">
                {story.title}
              </div>
            </div>
            <Link className="text-sm text-slate-300 transition hover:text-slate-100" to="/">
              返回大厅
            </Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-amber-400/20">
            <img
              src={TURTLE_GIF_URL}
              alt="海龟主题动图"
              className="h-20 w-full object-cover sm:h-24"
              loading="lazy"
            />
          </div>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
            {story.face}
          </div>
        </header>

        {wrongStreak >= 3 && status === 'playing' && !hintUsed && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                const hintMessage: TMessage = {
                  id: createId(),
                  role: 'assistant',
                  content:
                    '提示：试着换一个角度提问，比如聚焦「时间」「地点」「动机」或关键物品。',
                  timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, hintMessage]);
                setHintUsed(true);
                setWrongStreak(0);
              }}
              className="mb-1 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-950/80 px-4 py-1.5 text-xs text-amber-300 shadow-lg ring-1 ring-amber-400/20 transition hover:border-amber-400 hover:bg-slate-950 hover:text-amber-200 animate-pulse"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              灵感提示
            </button>
          </div>
        )}

        <ChatBox
          messages={messages}
          onSend={handleSend}
          disabled={status === 'ended' || isSending}
          isSending={isSending}
          errorMessage={errorMessage}
          onRetry={() => {
            if (!lastQuestion || isSending || status === 'ended') return;
            void handleSend(lastQuestion);
          }}
        />

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setStatus('ended');
              navigate(`/result/${story.id}`);
            }}
            className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-400 shadow-lg transition hover:border-amber-400/40 hover:shadow-xl"
          >
            查看汤底
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus('ended');
              navigate('/');
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 shadow-lg transition hover:border-slate-500 hover:shadow-xl"
          >
            结束游戏
          </button>
        </div>
      </div>
    </main>
  );
}

