import React, { useState } from 'react';
import type { Match } from '../types';
import { getStatusLabel, isLive, groupByDate, getDateLabel, formatMatchTime, prettifyGroup, prettifyStage } from '../utils/format';

interface Props { matches: Match[] | null; loading: boolean; error: string | null; }
type StageFilter = 'ALL' | 'GROUP_STAGE' | 'ROUND_OF_16' | 'QUARTER_FINALS' | 'SEMI_FINALS' | 'FINAL';

const STAGE_LABELS: Record<StageFilter, string> = {
  ALL: 'All', GROUP_STAGE: 'Groups', ROUND_OF_16: 'R16',
  QUARTER_FINALS: 'QF', SEMI_FINALS: 'SF', FINAL: 'Final'
};

function ScheduleRow({ match }: { match: Match }) {
  const live = isLive(match.status);
  const finished = match.status === 'FINISHED';
  const home = match.score.fullTime.home;
  const away = match.score.fullTime.away;

  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors
      ${live ? 'bg-fifa-red/5 border border-fifa-red/20' : 'hover:bg-white/3 border border-transparent'}`}>
      <div className="w-12 flex-shrink-0 text-center">
        {finished || live ? (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${live ? 'text-fifa-red bg-fifa-red/15' : 'text-fifa-silver/40 bg-white/5'}`}>
            {getStatusLabel(match.status, match.minute)}
          </span>
        ) : (
          <span className="text-sm text-fifa-gold/60 tabular-nums">{formatMatchTime(match.utcDate)}</span>
        )}
      </div>
      <div className="flex-1 text-right min-w-0">
        <span className={`font-bold text-sm truncate block ${finished && home !== null && away !== null && home > away ? 'text-fifa-gold' : 'text-fifa-silver'}`}>
          {match.homeTeam.shortName}
        </span>
      </div>
      <div className="flex-shrink-0 w-14 text-center">
        {!finished && !live
          ? <span className="text-xs text-fifa-silver/30 font-display">vs</span>
          : <span className="font-display font-bold text-base text-fifa-silver tabular-nums">{home ?? 0} – {away ?? 0}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <span className={`font-bold text-sm truncate block ${finished && home !== null && away !== null && away > home ? 'text-fifa-gold' : 'text-fifa-silver'}`}>
          {match.awayTeam.shortName}
        </span>
      </div>
      <div className="hidden sm:block w-20 text-right flex-shrink-0">
        <span className="text-xs text-fifa-silver/30">{match.group ? prettifyGroup(match.group) : prettifyStage(match.stage)}</span>
      </div>
    </div>
  );
}

export const SchedulePanel: React.FC<Props> = ({ matches, loading, error }) => {
  const [filter, setFilter] = useState<StageFilter>('ALL');

  const filtered = React.useMemo(() => {
    if (!matches) return [];
    return filter === 'ALL' ? matches : matches.filter(m => m.stage === filter);
  }, [matches, filter]);

  const grouped = React.useMemo(() => groupByDate(filtered), [filtered]);

  if (loading) return (
    <div aria-busy="true" className="space-y-6">
      {[0,1,2].map(d => <div key={d}><div className="skeleton h-4 w-24 mb-3"/><div className="space-y-1">{[0,1,2].map(r => <div key={r} className="flex items-center gap-3 py-2.5 px-3"><div className="skeleton h-5 w-12"/><div className="skeleton h-4 flex-1"/><div className="skeleton h-5 w-14"/><div className="skeleton h-4 flex-1"/></div>)}</div></div>)}
    </div>
  );

  if (error) return <div className="rounded-xl border border-fifa-red/30 bg-fifa-red/10 p-6 text-center" role="alert"><p className="text-fifa-red font-bold">{error}</p></div>;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" role="group" aria-label="Filter by stage">
        {(Object.keys(STAGE_LABELS) as StageFilter[]).map(s => (
          <button key={s} onClick={() => setFilter(s)} aria-pressed={filter===s}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all
              ${filter===s ? 'bg-fifa-gold text-fifa-blue' : 'bg-fifa-blue-mid border border-fifa-gold-muted/30 text-fifa-silver/60 hover:border-fifa-gold/40'}`}>
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>
      {matches && <p className="text-xs text-fifa-silver/40 mb-4">{filtered.length} match{filtered.length!==1?'es':''}</p>}
      {Array.from(grouped.entries()).map(([, dayMatches]) => (
        <section key={dayMatches[0].utcDate} className="mb-6 stagger-item">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-sm font-bold text-fifa-gold/60 uppercase tracking-widest">{getDateLabel(dayMatches[0].utcDate)}</h2>
            <div className="flex-1 h-px bg-fifa-gold-muted/20"/>
            <span className="text-xs text-fifa-silver/30">{dayMatches.length} matches</span>
          </div>
          <div className="space-y-0.5">{dayMatches.map(m => <ScheduleRow key={m.id} match={m}/>)}</div>
        </section>
      ))}
      {filtered.length === 0 && !loading && <div className="text-center py-8 text-fifa-silver/40"><p>No matches for this stage yet.</p></div>}
    </div>
  );
};
