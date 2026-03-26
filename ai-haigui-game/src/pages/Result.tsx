import { Link, useParams } from 'react-router-dom';

import { StoryReveal } from '../components/StoryReveal';
import { stories } from '../data/stories';

const TURTLE_GIF_URL =
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzAxMWw1czV3eXV4ZHV4eXcwc21jbnY2b3g5OW8wd3cxMWJtM2FpNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26xByFvrI1MQvtlDO/giphy.gif';

export function Result() {
  const { storyId } = useParams();
  const story = stories.find((s) => s.id === storyId);

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

  return (
    <main className="min-h-full bg-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <header className="glass-panel mb-5 rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">结算</div>
              <div className="mt-1 text-xl font-bold text-slate-50">
                真相大白
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-400 shadow-lg hover:border-amber-400/40"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              慢慢揭晓
            </button>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-amber-400/20">
            <img
              src={TURTLE_GIF_URL}
              alt="海龟主题动图"
              className="h-24 w-full object-cover sm:h-28"
              loading="lazy"
            />
          </div>
        </header>

        <StoryReveal title={story.title} truth={story.truth} />

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link className="text-sm text-slate-300 hover:text-slate-100" to={`/game/${story.id}`}>
            返回本局推理
          </Link>
          <Link
            to="/"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg hover:bg-amber-300"
          >
            再来一局
          </Link>
        </div>
      </div>
    </main>
  );
}

