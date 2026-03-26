import { motion } from 'framer-motion';
import type { TMessage } from '../types';

type TProps = {
  message: TMessage;
};

export function Message({ message }: TProps) {
  const isUser = message.role === 'user';
  const isThinking = !isUser && message.content === '思考中...';
  const isError =
    !isUser && message.content.startsWith('抱歉，AI 暂时无法回答：');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={
        isUser
          ? 'flex justify-end gap-2 animate-fade-in'
          : 'flex justify-start gap-2 transition-transform duration-150 hover:translate-x-0.5 animate-fade-in'
      }
    >
      {!isUser && (
        <div
          className={[
            'mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-amber-300 shadow-lg',
            isThinking ? 'animate-pulse' : '',
          ].join(' ')}
        >
          AI
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.02 }}
        className={[
          'max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 shadow-lg transition-transform duration-150',
          isUser ? 'animate-bubble-right' : 'animate-bubble-left',
          isUser
            ? 'bg-amber-400/10 text-slate-50 ring-1 ring-amber-400/20'
            : isError
              ? 'bg-rose-950/70 text-rose-100 ring-1 ring-rose-500/40'
              : 'bg-slate-950 text-slate-100 ring-1 ring-slate-800',
        ].join(' ')}
      >
        {isThinking ? (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>思考中</span>
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400 [animation-delay:80ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400 [animation-delay:160ms]" />
            </span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        )}
      </motion.div>
      {isUser && (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-semibold text-slate-900 shadow-lg">
          我
        </div>
      )}
    </motion.div>
  );
}

