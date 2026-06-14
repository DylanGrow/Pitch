import type { Match, MatchStatus } from '../types';

export function formatMatchTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatMatchDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function isToday(utcDate: string): boolean {
  return new Date(utcDate).toDateString() === new Date().toDateString();
}

export function isTomorrow(utcDate: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Date(utcDate).toDateString() === tomorrow.toDateString();
}

export function getDateLabel(utcDate: string): string {
  if (isToday(utcDate)) return 'Today';
  if (isTomorrow(utcDate)) return 'Tomorrow';
  return formatMatchDate(utcDate);
}

export function getStatusLabel(status: MatchStatus, minute?: number): string {
  switch (status) {
    case 'IN_PLAY': return minute ? `${minute}'` : 'LIVE';
    case 'PAUSED': return 'HT';
    case 'FINISHED': return 'FT';
    case 'SCHEDULED': return 'Scheduled';
    case 'TIMED': return 'Timed';
    case 'POSTPONED': return 'Postponed';
    case 'CANCELLED': return 'Cancelled';
    case 'SUSPENDED': return 'Suspended';
    case 'AWARDED': return 'Awarded';
    default: return status;
  }
}

export function isLive(status: MatchStatus): boolean {
  return status === 'IN_PLAY' || status === 'PAUSED';
}

export function groupByDate(matches: Match[]): Map<string, Match[]> {
  const grouped = new Map<string, Match[]>();
  for (const match of matches) {
    const key = new Date(match.utcDate).toDateString();
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(match);
  }
  return grouped;
}

export function formatLastRefresh(date: Date | null): string {
  if (!date) return 'Never';
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  return `${Math.floor(diffSec / 60)}m ago`;
}

export function prettifyStage(stage: string): string {
  return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function prettifyGroup(group: string | null): string {
  if (!group) return '';
  return group.replace('GROUP_', 'Group ');
}
