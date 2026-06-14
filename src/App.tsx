import { useState, useCallback } from 'react';
import type { TabId } from './types';
import { Header } from './components/Header';
import { NavTabs } from './components/NavTabs';
import { ScoresPanel } from './components/ScoresPanel';
import { ScorersLeaderboard } from './components/ScorersLeaderboard';
import { StandingsPanel } from './components/StandingsPanel';
import { SchedulePanel } from './components/SchedulePanel';
import { DisciplinePanel } from './components/DisciplinePanel';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { fetchMatches, fetchScorers, fetchStandings, fetchDiscipline } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('scores');

  const matches    = useAutoRefresh({ fetcher: fetchMatches });
  const scorers    = useAutoRefresh({ fetcher: fetchScorers });
  const standings  = useAutoRefresh({ fetcher: fetchStandings });
  const discipline = useAutoRefresh({ fetcher: fetchDiscipline });

  const handleRefresh = useCallback(async () => {
    await Promise.allSettled([matches.refresh(), scorers.refresh(), standings.refresh(), discipline.refresh()]);
  }, [matches, scorers, standings, discipline]);

  const lastRefresh = [matches.lastRefresh, scorers.lastRefresh, standings.lastRefresh]
    .filter(Boolean)
    .reduce<Date | null>((latest, d) => {
      if (!latest) return d ?? null;
      if (!d) return latest;
      return d > latest ? d : latest;
    }, null);

  const isRefreshing = matches.isRefreshing || scorers.isRefreshing || standings.isRefreshing;

  return (
    <div className="min-h-screen min-h-dvh bg-fifa-gradient relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-fifa-gold focus:text-fifa-blue focus:px-4 focus:py-2 focus:rounded-lg font-bold">
        Skip to main content
      </a>

      <Header lastRefresh={lastRefresh} isRefreshing={isRefreshing} onRefresh={handleRefresh} />
      <NavTabs activeTab={activeTab} onChange={setActiveTab} />

      <main id="main-content" className="max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-20 relative z-10" role="main">
        <div role="tabpanel" id="panel-scores" aria-labelledby="tab-scores" hidden={activeTab !== 'scores'}>
          {activeTab === 'scores' && <ScoresPanel matches={matches.data} loading={matches.loading} error={matches.error}/>}
        </div>
        <div role="tabpanel" id="panel-scorers" aria-labelledby="tab-scorers" hidden={activeTab !== 'scorers'}>
          {activeTab === 'scorers' && <ScorersLeaderboard scorers={scorers.data} loading={scorers.loading} error={scorers.error} mode="goals"/>}
        </div>
        <div role="tabpanel" id="panel-assists" aria-labelledby="tab-assists" hidden={activeTab !== 'assists'}>
          {activeTab === 'assists' && <ScorersLeaderboard scorers={scorers.data} loading={scorers.loading} error={scorers.error} mode="assists"/>}
        </div>
        <div role="tabpanel" id="panel-standings" aria-labelledby="tab-standings" hidden={activeTab !== 'standings'}>
          {activeTab === 'standings' && <StandingsPanel standings={standings.data} loading={standings.loading} error={standings.error}/>}
        </div>
        <div role="tabpanel" id="panel-schedule" aria-labelledby="tab-schedule" hidden={activeTab !== 'schedule'}>
          {activeTab === 'schedule' && <SchedulePanel matches={matches.data} loading={matches.loading} error={matches.error}/>}
        </div>
        <div role="tabpanel" id="panel-discipline" aria-labelledby="tab-discipline" hidden={activeTab !== 'discipline'}>
          {activeTab === 'discipline' && <DisciplinePanel discipline={discipline.data} loading={discipline.loading} error={discipline.error}/>}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-fifa-blue/95 backdrop-blur-sm border-t border-fifa-gold-muted/20 py-2 px-4 z-10" role="contentinfo">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-fifa-silver/30">
          <span>Pitch Perfect 26 · dylangrow.github.io</span>
          <span>PWA · Auto-refresh 2min</span>
        </div>
      </footer>
    </div>
  );
}
