import { useMemo, useState } from 'react';

import { GameCard } from '../components/GameCard';
import { stories } from '../data/stories';

const TURTLE_GIF_URL =
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjJnMGQ2M2s4OHB5MmN4Nnl0Y3N6NHAwNHYxMnhwOXQ4M2NraDZyayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0ExncehJzexFpRHq/giphy.gif';

export function Home() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'easy',
  );

  const difficultyLabel: Record<'easy' | 'medium' | 'hard', string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

  const filteredStories = useMemo(
    () => stories.filter((s) => s.difficulty === difficulty),
    [difficulty],
  );

  return (
    <main className="min-h-full bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <header className="mb-6 rounded-lg p-4 sm:mb-8 sm:p-5 glass-panel glass-shimmer">
          <div className="text-xs font-medium tracking-widest text-slate-400">
            AI MIST
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/20 text-xl">
              🐢
            </span>
            <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">
              AI 海龟汤
            </h1>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            在迷雾深处，故事的真相被严密隐藏。选择一个汤面，向冷静的 AI 汤主发问，
            用「是 / 否 / 无关」一点点撕开黑暗。
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-amber-400/20">
            <img
              src={TURTLE_GIF_URL}
              alt="海龟主题动图"
              className="h-28 w-full object-cover sm:h-36"
              loading="lazy"
            />
          </div>
        </header>

        <div className="mb-4 glass-panel rounded-lg p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <span className="text-slate-400">难度</span>
              <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-xs text-amber-300 ring-1 ring-amber-400/20">
                {difficultyLabel[difficulty]}
              </span>
              <span className="text-xs text-slate-500">
                （共 {filteredStories.length} 题）
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400" htmlFor="difficulty">
                下拉选择
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
                }
                className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-lg outline-none transition focus:border-amber-400/40"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {filteredStories.map((story) => (
            <GameCard key={story.id} story={story} />
          ))}
        </section>
      </div>
    </main>
  );
}

