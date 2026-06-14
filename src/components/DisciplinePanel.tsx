import React from 'react';
import type { DisciplineEntry } from '../types';

interface Props { discipline: DisciplineEntry[] | null; loading: boolean; error: string | null; }

export const DisciplinePanel: React.FC<Props> = ({ discipline, loading, error }) => {
  const sorted = React.useMemo(() => {
    if (!discipline) return [];
    return [...discipline].sort((a, b) => {
      const aScore = a.redCards * 100 + a.yellowRedCards * 10 + a.yellowCards;
      const bScore = b.redCards * 100 + b.yellowRedCards * 10 + b.yellowCards;
      return bScore - aScore;
    });
  }, [discipline]);

  if (loading) return (
    <div className="space-y-1" aria-busy="true">
      {Array.from({length:6},(_,i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-fifa-gold-muted/10">
          <div className="skeleton h-4 flex-1"/><div className="skeleton h-4 w-24"/>
        </div>
      ))}
    </div>
  );

  if (error) return <div className="rounded-xl border border-fifa-red/30 bg-fifa-red/10 p-6 text-center" role="alert"><p className="text-fifa-red font-bold">{error}</p></div>;

  return (
    <section aria-label="Discipline table">
      <div className="bg-fifa-gold/10 border border-fifa-gold-muted/30 rounded-xl p-3 mb-4 text-xs text-fifa-silver/60 flex items-start gap-2">
        <span aria-hidden="true">ℹ️</span>
        <span>2 yellow cards across matches = 1-match suspension. A direct red = minimum 1-match ban.</span>
      </div>

      <div className="flex items-center gap-3 pb-2 border-b border-fifa-gold-muted/20 text-xs text-fifa-silver/40 uppercase tracking-wider">
        <span className="flex-1">Player / Team</span>
        <span className="w-16 text-center">Yellow</span>
        <span className="w-16 text-center">Y/R</span>
        <span className="w-16 text-center">Red</span>
      </div>

      <ol className="divide-y divide-fifa-gold-muted/10">
        {sorted.map((e, idx) => (
          <li key={`${e.player.id}-${idx}`} className="stagger-item flex items-center gap-3 py-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-fifa-silver truncate">{e.player.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-fifa-silver/40">{e.team.tla}</span>
                <span className="text-xs text-fifa-silver/30">·</span>
                <span className="text-xs text-fifa-silver/40">{e.player.nationality}</span>
              </div>
            </div>
            <div className="w-16 text-center">
              {e.yellowCards > 0
                ? <div className="flex gap-0.5 justify-center">{Array.from({length:Math.min(e.yellowCards,3)},(_,i)=><span key={i} className="w-3 h-4 rounded-sm bg-yellow-400 inline-block"/>)}{e.yellowCards>3&&<span className="text-xs text-yellow-400 ml-0.5">+{e.yellowCards-3}</span>}</div>
                : <span className="text-fifa-silver/20">—</span>}
            </div>
            <div className="w-16 text-center">
              {e.yellowRedCards > 0
                ? <span className="w-3 h-4 rounded-sm bg-orange-500 inline-block"/>
                : <span className="text-fifa-silver/20">—</span>}
            </div>
            <div className="w-16 text-center">
              {e.redCards > 0
                ? <div className="flex gap-0.5 justify-center">{Array.from({length:e.redCards},(_,i)=><span key={i} className="w-3 h-4 rounded-sm bg-fifa-red inline-block"/>)}</div>
                : <span className="text-fifa-silver/20">—</span>}
            </div>
          </li>
        ))}
      </ol>

      {sorted.length === 0 && (
        <div className="text-center py-8 text-fifa-silver/40">
          <p>No disciplinary data yet. Cards issued during the tournament will appear here.</p>
        </div>
      )}
    </section>
  );
};
