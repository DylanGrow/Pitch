import React from 'react';
import type { GroupStanding } from '../types';
import { prettifyGroup } from '../utils/format';

interface Props { standings: GroupStanding[] | null; loading: boolean; error: string | null; }

const FORM_COLORS: Record<string, string> = {
  W: 'bg-fifa-green text-white',
  D: 'bg-fifa-grey text-white',
  L: 'bg-fifa-red/70 text-white'
};

function GroupTable({ group }: { group: GroupStanding }) {
  const label = prettifyGroup(group.group) || group.group;
  return (
    <section className="bg-card-gradient border border-fifa-gold-muted/20 rounded-xl overflow-hidden" aria-label={`${label} standings`}>
      <div className="bg-fifa-blue-mid px-4 py-2 border-b border-fifa-gold-muted/20">
        <h3 className="font-display font-bold text-fifa-gold text-sm tracking-wide">{label}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="grid">
          <thead>
            <tr className="text-xs text-fifa-silver/40 uppercase tracking-wider border-b border-fifa-gold-muted/10">
              <th scope="col" className="text-left px-3 py-2">#</th>
              <th scope="col" className="text-left px-3 py-2">Team</th>
              <th scope="col" className="text-center px-2 py-2">P</th>
              <th scope="col" className="text-center px-2 py-2">W</th>
              <th scope="col" className="text-center px-2 py-2">D</th>
              <th scope="col" className="text-center px-2 py-2">L</th>
              <th scope="col" className="text-center px-2 py-2">GF</th>
              <th scope="col" className="text-center px-2 py-2">GA</th>
              <th scope="col" className="text-center px-2 py-2">GD</th>
              <th scope="col" className="text-center px-3 py-2 font-bold text-fifa-gold/60">Pts</th>
              <th scope="col" className="text-center px-3 py-2 hidden sm:table-cell">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fifa-gold-muted/10">
            {group.table.map((row, idx) => (
              <tr key={row.team.id} className={`transition-colors hover:bg-white/5 ${idx < 2 ? 'bg-fifa-green/5' : ''}`}>
                <td className="px-3 py-2.5 font-bold text-fifa-silver/60">
                  <div className="flex items-center gap-1.5">
                    {idx < 2 && <span className="w-1 h-4 rounded-full bg-fifa-green" aria-label="Qualification spot"/>}
                    {row.position}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="font-bold text-fifa-silver block truncate max-w-[120px]">{row.team.shortName}</span>
                  <span className="text-xs text-fifa-silver/40">{row.team.tla}</span>
                </td>
                <td className="px-2 py-2.5 text-center text-fifa-silver/70 tabular-nums">{row.playedGames}</td>
                <td className="px-2 py-2.5 text-center text-fifa-green tabular-nums">{row.won}</td>
                <td className="px-2 py-2.5 text-center text-fifa-silver/50 tabular-nums">{row.draw}</td>
                <td className="px-2 py-2.5 text-center text-fifa-red tabular-nums">{row.lost}</td>
                <td className="px-2 py-2.5 text-center text-fifa-silver/70 tabular-nums">{row.goalsFor}</td>
                <td className="px-2 py-2.5 text-center text-fifa-silver/70 tabular-nums">{row.goalsAgainst}</td>
                <td className={`px-2 py-2.5 text-center tabular-nums font-bold ${row.goalDifference > 0 ? 'text-fifa-green' : row.goalDifference < 0 ? 'text-fifa-red' : 'text-fifa-silver/50'}`}>
                  {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                </td>
                <td className="px-3 py-2.5 text-center font-display font-bold text-fifa-gold-bright text-base tabular-nums">{row.points}</td>
                <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                  {row.form ? (
                    <div className="flex gap-0.5 justify-center">
                      {row.form.split(',').slice(-5).map((r, i) => (
                        <span key={i} className={`inline-flex w-5 h-5 rounded-sm items-center justify-center text-xs font-bold ${FORM_COLORS[r] ?? 'bg-white/10 text-white/50'}`}>{r}</span>
                      ))}
                    </div>
                  ) : <span className="text-fifa-silver/20">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-fifa-gold-muted/10 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-fifa-silver/40">
          <span className="w-1 h-3 rounded-full bg-fifa-green" aria-hidden="true"/>Qualification places
        </span>
      </div>
    </section>
  );
}

export const StandingsPanel: React.FC<Props> = ({ standings, loading, error }) => {
  if (loading) return (
    <div className="grid gap-4 sm:grid-cols-2" aria-busy="true">
      {[0,1,2,3].map(i => (
        <div key={i} className="bg-card-gradient border border-fifa-gold-muted/10 rounded-xl overflow-hidden">
          <div className="bg-fifa-blue-mid px-4 py-2"><div className="skeleton h-4 w-20"/></div>
          <div className="p-3 space-y-2">{[0,1,2,3].map(j => <div key={j} className="flex gap-3"><div className="skeleton h-4 w-4"/><div className="skeleton h-4 flex-1"/><div className="skeleton h-4 w-24"/></div>)}</div>
        </div>
      ))}
    </div>
  );
  if (error) return <div className="rounded-xl border border-fifa-red/30 bg-fifa-red/10 p-6 text-center" role="alert"><p className="text-fifa-red font-bold">{error}</p></div>;
  if (!standings || standings.length === 0) return <div className="text-center py-8 text-fifa-silver/40"><p>Group standings will appear once the tournament begins.</p></div>;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {standings.map(g => <div key={g.group} className="stagger-item"><GroupTable group={g}/></div>)}
    </div>
  );
};
