import { useEffect, useState } from 'react';

type TProps = {
  title: string;
  truth: string;
};

export function StoryReveal({ title, truth }: TProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section
      className={[
        'relative overflow-hidden rounded-lg border border-amber-400/20 bg-slate-950 p-4 shadow-lg transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-400/5 via-transparent to-transparent" />
      <div className="relative">
        <div className="text-sm text-slate-300">汤底揭晓</div>
        <div className="mt-1 text-base font-semibold text-amber-400">
          {title}
        </div>
        <div className="mt-4 rounded-md bg-slate-900/80 p-4 text-sm leading-relaxed text-slate-100 ring-1 ring-amber-400/20">
          {truth}
        </div>
      </div>
    </section>
  );
}

