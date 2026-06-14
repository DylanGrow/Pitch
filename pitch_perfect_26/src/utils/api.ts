import type { Match, Scorer, GroupStanding, DisciplineEntry } from '../types';

const API_BASE = 'https://api.football-data.org/v4';
const WC_2026_ID = 2000;
const API_KEY: string = (import.meta as unknown as { env?: Record<string, string> }).env?.['VITE_FD_API_KEY'] ?? '';
const HEADERS: HeadersInit = API_KEY ? { 'X-Auth-Token': API_KEY } : {};

export function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  const el = document.createElement('span');
  el.textContent = value;
  return el.innerHTML;
}

async function safeFetch<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer'
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

interface RawMatch {
  id: number; utcDate: string; status: string; matchday: number | null;
  stage: string; group: string | null;
  homeTeam: { id: number; name: string; shortName: string; tla: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; tla: string; crest: string };
  score: { winner: string | null; duration: string; fullTime: { home: number | null; away: number | null }; halfTime: { home: number | null; away: number | null } };
  minute?: number;
}

export async function fetchMatches(): Promise<Match[]> {
  try {
    const data = await safeFetch<{ matches: RawMatch[] }>(`${API_BASE}/competitions/${WC_2026_ID}/matches`);
    return (data.matches || []).map(m => ({
      id: m.id, utcDate: m.utcDate, status: m.status as Match['status'],
      matchday: m.matchday, stage: sanitize(m.stage), group: m.group ? sanitize(m.group) : null,
      homeTeam: { id: m.homeTeam.id, name: sanitize(m.homeTeam.name), shortName: sanitize(m.homeTeam.shortName), tla: sanitize(m.homeTeam.tla), crest: null },
      awayTeam: { id: m.awayTeam.id, name: sanitize(m.awayTeam.name), shortName: sanitize(m.awayTeam.shortName), tla: sanitize(m.awayTeam.tla), crest: null },
      score: { winner: m.score.winner as Match['score']['winner'], duration: m.score.duration as Match['score']['duration'], fullTime: m.score.fullTime, halfTime: m.score.halfTime },
      minute: m.minute
    }));
  } catch { return getMockMatches(); }
}

export async function fetchScorers(): Promise<Scorer[]> {
  try {
    const data = await safeFetch<{ scorers: { player: { id: number; name: string; nationality: string }; team: { id: number; name: string; tla: string }; goals: number; assists: number; penalties: number }[] }>(`${API_BASE}/competitions/${WC_2026_ID}/scorers?limit=20`);
    return (data.scorers || []).map(s => ({
      player: { id: s.player.id, name: sanitize(s.player.name), nationality: sanitize(s.player.nationality) },
      team: { id: s.team.id, name: sanitize(s.team.name), tla: sanitize(s.team.tla) },
      goals: s.goals, assists: s.assists ?? 0, penalties: s.penalties ?? 0
    }));
  } catch { return getMockScorers(); }
}

export async function fetchStandings(): Promise<GroupStanding[]> {
  try {
    const data = await safeFetch<{ standings: GroupStanding[] }>(`${API_BASE}/competitions/${WC_2026_ID}/standings`);
    return data.standings || [];
  } catch { return getMockStandings(); }
}

export async function fetchDiscipline(): Promise<DisciplineEntry[]> {
  return getMockDiscipline();
}

// ── Mock data ──────────────────────────────────────────────────────────
export function getMockMatches(): Match[] {
  const now = new Date();
  const base = new Date('2026-06-11T18:00:00Z');
  return [
    { id: 1, utcDate: base.toISOString(), status: 'FINISHED', matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_A',
      homeTeam: { id: 1, name: 'Mexico', shortName: 'Mexico', tla: 'MEX', crest: null },
      awayTeam: { id: 2, name: 'Qatar', shortName: 'Qatar', tla: 'QAT', crest: null },
      score: { winner: 'HOME_TEAM', duration: 'REGULAR', fullTime: { home: 2, away: 0 }, halfTime: { home: 1, away: 0 } } },
    { id: 2, utcDate: new Date(base.getTime() + 3.6e6 * 4).toISOString(), status: 'IN_PLAY', matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_A',
      homeTeam: { id: 3, name: 'USA', shortName: 'USA', tla: 'USA', crest: null },
      awayTeam: { id: 4, name: 'Canada', shortName: 'Canada', tla: 'CAN', crest: null },
      score: { winner: null, duration: 'REGULAR', fullTime: { home: 1, away: 1 }, halfTime: { home: 0, away: 1 } }, minute: 67 },
    { id: 3, utcDate: new Date(now.getTime() + 3.6e6 * 8).toISOString(), status: 'SCHEDULED', matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_B',
      homeTeam: { id: 5, name: 'Brazil', shortName: 'Brazil', tla: 'BRA', crest: null },
      awayTeam: { id: 6, name: 'Germany', shortName: 'Germany', tla: 'GER', crest: null },
      score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } } },
    { id: 4, utcDate: new Date(now.getTime() + 3.6e6 * 12).toISOString(), status: 'TIMED', matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_B',
      homeTeam: { id: 7, name: 'France', shortName: 'France', tla: 'FRA', crest: null },
      awayTeam: { id: 8, name: 'Argentina', shortName: 'Argentina', tla: 'ARG', crest: null },
      score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } } },
    { id: 5, utcDate: new Date(now.getTime() + 3.6e6 * 32).toISOString(), status: 'SCHEDULED', matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_C',
      homeTeam: { id: 9, name: 'Spain', shortName: 'Spain', tla: 'ESP', crest: null },
      awayTeam: { id: 10, name: 'England', shortName: 'England', tla: 'ENG', crest: null },
      score: { winner: null, duration: 'REGULAR', fullTime: { home: null, away: null }, halfTime: { home: null, away: null } } }
  ];
}

export function getMockScorers(): Scorer[] {
  return [
    { player: { id: 1, name: 'Lionel Messi', nationality: 'Argentina' }, team: { id: 8, name: 'Argentina', tla: 'ARG' }, goals: 3, assists: 2, penalties: 1 },
    { player: { id: 2, name: 'Kylian Mbappé', nationality: 'France' }, team: { id: 7, name: 'France', tla: 'FRA' }, goals: 2, assists: 1, penalties: 0 },
    { player: { id: 3, name: 'Vinícius Jr.', nationality: 'Brazil' }, team: { id: 5, name: 'Brazil', tla: 'BRA' }, goals: 2, assists: 3, penalties: 0 },
    { player: { id: 4, name: 'Harry Kane', nationality: 'England' }, team: { id: 10, name: 'England', tla: 'ENG' }, goals: 2, assists: 0, penalties: 1 },
    { player: { id: 5, name: 'Erling Haaland', nationality: 'Norway' }, team: { id: 11, name: 'Norway', tla: 'NOR' }, goals: 2, assists: 1, penalties: 0 },
    { player: { id: 6, name: 'Rodri', nationality: 'Spain' }, team: { id: 9, name: 'Spain', tla: 'ESP' }, goals: 1, assists: 2, penalties: 0 },
    { player: { id: 7, name: 'Lamine Yamal', nationality: 'Spain' }, team: { id: 9, name: 'Spain', tla: 'ESP' }, goals: 1, assists: 1, penalties: 0 },
    { player: { id: 8, name: 'Jude Bellingham', nationality: 'England' }, team: { id: 10, name: 'England', tla: 'ENG' }, goals: 1, assists: 2, penalties: 0 },
    { player: { id: 9, name: 'Florian Wirtz', nationality: 'Germany' }, team: { id: 6, name: 'Germany', tla: 'GER' }, goals: 1, assists: 1, penalties: 0 },
    { player: { id: 10, name: 'Hirving Lozano', nationality: 'Mexico' }, team: { id: 1, name: 'Mexico', tla: 'MEX' }, goals: 1, assists: 0, penalties: 0 },
  ];
}

export function getMockStandings(): GroupStanding[] {
  return [
    { stage: 'GROUP_STAGE', type: 'TOTAL', group: 'GROUP_A', table: [
      { position: 1, team: { id: 1, name: 'Mexico', shortName: 'Mexico', tla: 'MEX', crest: null }, playedGames: 1, won: 1, draw: 0, lost: 0, points: 3, goalsFor: 2, goalsAgainst: 0, goalDifference: 2, form: 'W' },
      { position: 2, team: { id: 3, name: 'USA', shortName: 'USA', tla: 'USA', crest: null }, playedGames: 1, won: 0, draw: 1, lost: 0, points: 1, goalsFor: 1, goalsAgainst: 1, goalDifference: 0, form: 'D' },
      { position: 3, team: { id: 4, name: 'Canada', shortName: 'Canada', tla: 'CAN', crest: null }, playedGames: 1, won: 0, draw: 1, lost: 0, points: 1, goalsFor: 1, goalsAgainst: 1, goalDifference: 0, form: 'D' },
      { position: 4, team: { id: 2, name: 'Qatar', shortName: 'Qatar', tla: 'QAT', crest: null }, playedGames: 1, won: 0, draw: 0, lost: 1, points: 0, goalsFor: 0, goalsAgainst: 2, goalDifference: -2, form: 'L' },
    ]},
    { stage: 'GROUP_STAGE', type: 'TOTAL', group: 'GROUP_B', table: [
      { position: 1, team: { id: 7, name: 'France', shortName: 'France', tla: 'FRA', crest: null }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, form: null },
      { position: 2, team: { id: 8, name: 'Argentina', shortName: 'Argentina', tla: 'ARG', crest: null }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, form: null },
      { position: 3, team: { id: 5, name: 'Brazil', shortName: 'Brazil', tla: 'BRA', crest: null }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, form: null },
      { position: 4, team: { id: 6, name: 'Germany', shortName: 'Germany', tla: 'GER', crest: null }, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, form: null },
    ]}
  ];
}

export function getMockDiscipline(): DisciplineEntry[] {
  return [
    { player: { id: 1, name: 'Nicolás Otamendi', nationality: 'Argentina' }, team: { id: 8, name: 'Argentina', tla: 'ARG' }, yellowCards: 2, redCards: 0, yellowRedCards: 0 },
    { player: { id: 2, name: 'Casemiro', nationality: 'Brazil' }, team: { id: 5, name: 'Brazil', tla: 'BRA' }, yellowCards: 2, redCards: 0, yellowRedCards: 0 },
    { player: { id: 3, name: 'Aurélien Tchouaméni', nationality: 'France' }, team: { id: 7, name: 'France', tla: 'FRA' }, yellowCards: 1, redCards: 1, yellowRedCards: 0 },
    { player: { id: 4, name: 'Declan Rice', nationality: 'England' }, team: { id: 10, name: 'England', tla: 'ENG' }, yellowCards: 1, redCards: 0, yellowRedCards: 0 },
    { player: { id: 5, name: 'Joshua Kimmich', nationality: 'Germany' }, team: { id: 6, name: 'Germany', tla: 'GER' }, yellowCards: 1, redCards: 0, yellowRedCards: 0 },
  ];
}
