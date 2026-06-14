import React from 'react';
import type { Scorer } from '../types';

interface Props { scorers: Scorer[] | null; loading: boolean; error: string | null; mode: 'goals' | 'assists'; }

const MEDALS = ['#f0c040', '#c0c0c0', '#cd7f32'];

export const ScorersLeaderboard: React.FC<Props> = ({ scorers, loading, error, mode }) => {
  const sorted = React.useMemo(() => {
    if (!scorers) return [];
    return [...scorers].sort((a, b) =>
      mode === 'goals' ? b.goals - a.goals || b.assists - a.assists : b.assists - a.assists || b.goals - a.goals
    );
  }, [scorers, mode]);

  const maxVal = sorted.length > 0 ? (mode === 'goals' ? sorted[0].goals : sorted[0].assists) : 1;

  if (loading) return (
    <div aria-busy="true" className="space-y-1">
      {Array.from({length:8},(_,i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-fifa-gold-muted/10">
          <div className="skeleton h-5 w-6"/><div className="skeleton h-4 flex-1"/><div className="skeleton h-4 w-16"/>
        </div>
      ))}
    </div>
  );

  if (error) return <div className="rounded-xl border border-fifa-red/30 bg-fifa-red/10 p-6 text-center" role="alert"><p className="text-fifa-red font-bold">{error}</p></div>;

  if (!sorted.length) return <div className="text-center py-8 text-fifa-silver/40"><p>No {mode} data yet. Tournament begins June 11, 2026.</p></div>;

  const primaryKey = mode === 'goals' ? 'goals' : 'assists';
  const secondaryKey = mode === 'goals' ? 'assists' : 'goals';
  const secondaryLabel = mode === 'goals' ? 'AST' : 'GLS';

  return (
    <section aria-label={mode === 'goals' ? 'Goal Leaders' : 'Assist Leaders'}>
      <div className="flex items-center gap-3 pb-2 border-b border-fifa-gold-muted/20 text-xs text-fifa-silver/40 uppercase tracking-wider">
        <span className="w-6 text-center">#</span>
        <span className="flex-1">Player</span>
        <span className="w-8 text-center">Pen</span>
        <span className="w-10 text-center">{secondaryLabel}</span>
        <span className="w-10 text-center font-bold text-fifa-gold/60">{mode === 'goals' ? 'GLS' : 'AST'}</span>
      </div>
      <ol className="divide-y divide-fifa-gold-muted/10">
        {sorted.map((s, i) => {
          const val = s[primaryKey as keyof Scorer] as number;
          const secVal = s[secondaryKey as keyof Scorer] as number;
          const medal = i < 3 ? MEDALS[i] : null;
          return (
            <li key={s.player.id} className="stagger-item flex items-center gap-3 py-3">
              <span className="w-6 text-center font-display text-sm font-bold flex-shrink-0" style={{color: medal ?? '#6b7280'}}>{i+1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`font-bold text-sm truncate ${i===0?'text-fifa-gold-bright':'text-fifa-silver'}`}>{s.player.name}</span>
                  <span className="text-xs text-fifa-silver/40 flex-shrink-0">{s.team.tla}</span>
                </div>
                <div className="h-1 bg-fifa-blue-light rounded-full overflow-hidden" aria-hidden="true">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{width:`${maxVal>0?(val/maxVal)*100:0}%`, background: medal ? `linear-gradient(90deg,${medal}88,${medal})` : 'linear-gradient(90deg,#1e3a5f,#c9a84c44)'}}/>
                </div>
              </div>
              <span className="w-8 text-center text-xs text-fifa-silver/40 flex-shrink-0">{s.penalties>0?`${s.penalties}p`:'—'}</span>
              <span className="w-10 text-center text-sm text-fifa-silver/50 flex-shrink-0 tabular-nums">{secVal}</span>
              <span className="w-10 text-center font-display font-bold text-lg flex-shrink-0 tabular-nums" style={{color:medal??'#e8e8e8'}}>{val}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
