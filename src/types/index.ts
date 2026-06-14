export type MatchStatus =
  | 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED'
  | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED' | 'AWARDED';

export interface TeamScore { home: number | null; away: number | null; }

export interface Score {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: TeamScore;
  halfTime: TeamScore;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string | null;
}

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  minute?: number;
}

export interface Scorer {
  player: { id: number; name: string; nationality: string };
  team: Pick<Team, 'id' | 'name' | 'tla'>;
  goals: number;
  assists: number;
  penalties: number;
}

export interface StandingRow {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string | null;
}

export interface GroupStanding {
  stage: string;
  type: string;
  group: string;
  table: StandingRow[];
}

export interface DisciplineEntry {
  player: { id: number; name: string; nationality: string };
  team: Pick<Team, 'id' | 'name' | 'tla'>;
  yellowCards: number;
  redCards: number;
  yellowRedCards: number;
}

export type TabId = 'scores' | 'scorers' | 'assists' | 'standings' | 'schedule' | 'discipline';
