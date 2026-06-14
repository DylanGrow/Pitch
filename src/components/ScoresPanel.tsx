import React from 'react';
import type { Match } from '../types';
import { getStatusLabel, isLive, groupByDate, getDateLabel, formatMatchTime, prettifyGroup, prettifyStage } from '../utils/format';

interface ScoresPanelProps { matches: Match[] | null; loading: boolean; error: string | null; }

function MatchCard({ match }: { match: Match }) {
  const live = isLive(match.status);
  const finished = match.status === 'FINISHED';
  const home = match.score.fullTime.home;
  const away = match.score.fullTime.away;

  return (
    <article className={`match-card bg-card-gradient border rounded-xl p-3 sm:p-4
      ${live ? 'border-fifa-red/40 shadow-lg shadow-fifa-red/10' : 'border-fifa-gold-muted/20 hover:border-fifa-gold-muted/40'}`}
      aria-label={`${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-fifa-silver/40 uppercase tracking-wider">
          {match.group ? prettifyGroup(match.group) : prettifyStage(match.stage)}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full
          ${live ? 'bg-fifa-red/20 text-fifa-red live-pulse' : finished ? 'bg-white/5 text-fifa-silver/60' : 'bg-fifa-gold-muted/20 text-fifa-gold/70'}`}>
          {getStatusLabel(match.status, match.minute)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-display font-bold truncate ${finished && home !== null && away !== null && home > away ? 'text-fifa-gold' : 'text-fifa-silver'}`}>
            {match.homeTeam.shortName}
          </p>
          <p className="text-xs text-fifa-silver/40">{match.homeTeam.tla}</p>
        </div>
        <div className="flex-shrink-0 text-center min-w-[64px]">
          {!finished && !live ? (
            <div>
              <p className="text-xs text-fifa-silver/40 mb-0.5">{formatMatchTime(match.utcDate)}</p>
              <p className="text-lg font-display font-bold text-fifa-silver/30">vs</p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className={`text-2xl font-display font-bold tabular-nums ${finished && home !== null && away !== null && home > away ? 'text-fifa-gold' : 'text-fifa-silver'}`}>{home ?? '-'}</span>
              <span className="text-fifa-silver/30">–</span>
              <span className={`text-2xl font-display font-bold tabular-nums ${finished && home !== null && away !== null && away > home ? 'text-fifa-gold' : 'text-fifa-silver'}`}>{away ?? '-'}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className={`font-display font-bold truncate ${finished && home !== null && away !== null && away > home ? 'text-fifa-gold' : 'text-fifa-silver'}`}>
            {match.awayTeam.shortName}
          </p>
          <p className="text-xs text-fifa-silver/40">{match.awayTeam.tla}</p>
        </div>
      </div>
      {finished && match.score.halfTime.home !== null && (
        <p className="text-xs text-fifa-silver/30 text-center mt-1">HT: {match.score.halfTime.home} – {match.score.halfTime.away}</p>
      )}
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card-gradient border border-fifa-gold-muted/10 rounded-xl p-4 space-y-3">
      <div className="flex justify-between"><div className="skeleton h-3 w-20"/><div className="skeleton h-4 w-12"/></div>
      <div className="flex items-center gap-3"><div className="skeleton h-5 flex-1"/><div className="skeleton h-7 w-16 flex-shrink-0"/><div className="skeleton h-5 flex-1"/></div>
    </div>
  );
}

export const ScoresPanel: React.FC<ScoresPanelProps> = ({ matches, loading, error }) => {
  if (loading) return (
    <div className="space-y-6" aria-busy="true">
      {[0,1,2].map(i => <div key={i}><div className="skeleton h-4 w-24 mb-3"/><div className="space-y-2">{[0,1].map(j => <SkeletonCard key={j}/>)}</div></div>)}
    </div>
  );

  if (error) return (
    <div className="rounded-xl border border-fifa-red/30 bg-fifa-red/10 p-6 text-center" role="alert">
      <p className="text-fifa-red font-display font-bold mb-1">Could not load matches</p>
      <p className="text-sm text-fifa-silver/60">{error}</p>
    </div>
  );

  if (!matches || matches.length === 0) return (
    <div className="rounded-xl border border-fifa-gold-muted/20 bg-card-gradient p-8 text-center">
      <p className="text-fifa-gold font-display text-lg mb-2">No matches yet</p>
      <p className="text-sm text-fifa-silver/50">Check back when the tournament begins on June 11, 2026.</p>
    </div>
  );

  const liveMatches = matches.filter(m => isLive(m.status));
  const grouped = groupByDate(matches.filter(m => !isLive(m.status)));

  return (
    <div className="space-y-6">
      {liveMatches.length > 0 && (
        <section aria-label="Live matches">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-fifa-red animate-blink" aria-hidden="true"/>
            <h2 className="text-sm font-bold text-fifa-red uppercase tracking-widest">Live Now</h2>
          </div>
          <div className="space-y-2">{liveMatches.map(m => <div key={m.id} className="stagger-item"><MatchCard match={m}/></div>)}</div>
        </section>
      )}
      {Array.from(grouped.entries()).map(([, dayMatches]) => (
        <section key={dayMatches[0].utcDate} aria-label={getDateLabel(dayMatches[0].utcDate)}>
          <h2 className="text-sm font-bold text-fifa-gold/60 uppercase tracking-widest mb-3">{getDateLabel(dayMatches[0].utcDate)}</h2>
          <div className="space-y-2">{dayMatches.map(m => <div key={m.id} className="stagger-item"><MatchCard match={m}/></div>)}</div>
        </section>
      ))}
    </div>
  );
};
