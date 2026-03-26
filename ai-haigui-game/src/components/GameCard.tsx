import { Link } from 'react-router-dom';
import type { TStory } from '../types';

type TProps = {
  story: TStory;
};

export function GameCard({ story }: TProps) {
  return (
    <Link
      to={`/game/${story.id}`}
      className="group glass-panel block w-full rounded-lg p-4 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-100">
            {story.title}
          </div>
          <div className="mt-1 text-sm text-slate-300">
            难度：
            <span className="ml-1 text-amber-400">{story.difficulty}</span>
          </div>
        </div>
        <span className="shrink-0 rounded-lg border border-amber-400/20 px-2 py-1 text-xs text-amber-400 transition group-hover:border-amber-400/40">
          进入
        </span>
      </div>
      <div className="mt-3 line-clamp-2 text-sm text-slate-200">
        {story.face}
      </div>
    </Link>
  );
}

