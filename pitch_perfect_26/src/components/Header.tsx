import React, { useState, useEffect } from 'react';
import { formatLastRefresh } from '../utils/format';

interface HeaderProps {
  lastRefresh: Date | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, mins: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        mins: Math.floor((diff % 3_600_000) / 60_000)
      });
    };
    calc();
    const id = setInterval(calc, 30_000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

const WC_START = new Date('2026-06-11T18:00:00Z');

export const Header: React.FC<HeaderProps> = ({ lastRefresh, isRefreshing, onRefresh }) => {
  const countdown = useCountdown(WC_START);
  const [refreshLabel, setRefreshLabel] = useState('');
  const started = Date.now() >= WC_START.getTime();

  useEffect(() => {
    setRefreshLabel(formatLastRefresh(lastRefresh));
    const id = setInterval(() => setRefreshLabel(formatLastRefresh(lastRefresh)), 5000);
    return () => clearInterval(id);
  }, [lastRefresh]);

  return (
    <header className="relative z-10 bg-fifa-blue border-b border-fifa-gold-muted/30" role="banner">
      <div className="gold-shimmer h-0.5 w-full" aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0" aria-hidden="true">
              <svg viewBox="0 0 40 40" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="22" r="14" fill="#c9a84c"/>
                <path d="M20 8 L23 14 L18 17 L15 14 Z" fill="#0a1628"/>
                <path d="M29 15 L32 20 L27 22 L24 17 Z" fill="#0a1628"/>
                <path d="M28 29 L25 33 L21 30 L22 25 Z" fill="#0a1628"/>
                <path d="M12 29 L15 33 L19 30 L18 25 Z" fill="#0a1628"/>
                <path d="M11 15 L8 20 L13 22 L16 17 Z" fill="#0a1628"/>
                <path d="M18 17 L22 17 L22 25 L18 25 Z" fill="#0a1628"/>
                <polygon points="20,2 21.5,6.5 26,6.5 22.5,9 24,13 20,10.5 16,13 17.5,9 14,6.5 18.5,6.5" fill="#f0c040"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-lg md:text-xl font-bold text-fifa-gold leading-tight truncate">
                Pitch Perfect 26
              </h1>
              <p className="text-xs text-fifa-silver/50 font-body tracking-wider uppercase">
                USA · Canada · Mexico
              </p>
            </div>
          </div>

          {/* Countdown or LIVE */}
          <div className="flex-shrink-0 text-center">
            {!started ? (
              <div className="bg-fifa-blue-mid border border-fifa-gold-muted/40 rounded-lg px-3 py-1.5">
                <p className="text-xs text-fifa-silver/50 uppercase tracking-wider mb-0.5">Kickoff in</p>
                <div className="flex items-center gap-2 text-fifa-gold font-display text-sm font-bold">
                  <span>{countdown.days}<span className="text-xs text-fifa-silver/50 font-body font-normal ml-0.5">d</span></span>
                  <span className="text-fifa-gold-muted">·</span>
                  <span>{countdown.hours}<span className="text-xs text-fifa-silver/50 font-body font-normal ml-0.5">h</span></span>
                  <span className="text-fifa-gold-muted">·</span>
                  <span>{countdown.mins}<span className="text-xs text-fifa-silver/50 font-body font-normal ml-0.5">m</span></span>
                </div>
              </div>
            ) : (
              <div className="live-pulse bg-fifa-red/10 border border-fifa-red/50 rounded-lg px-4 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fifa-red animate-blink flex-shrink-0" />
                <span className="text-fifa-red font-display font-bold text-sm tracking-wider">LIVE</span>
              </div>
            )}
          </div>

          {/* Refresh */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-fifa-silver/40">Updated</span>
              <span className="text-xs text-fifa-gold/70">{refreshLabel || '—'}</span>
            </div>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh data now"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-fifa-gold-muted/40 bg-fifa-blue-mid text-fifa-gold hover:border-fifa-gold hover:bg-fifa-blue-light transition-all duration-200 focus-visible:ring-2 focus-visible:ring-fifa-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-fifa-silver/40">
          <span>Jun 11 – Jul 19, 2026</span>
          <span aria-hidden="true">·</span>
          <span>104 matches</span>
          <span aria-hidden="true">·</span>
          <span>48 teams</span>
          <span aria-hidden="true">·</span>
          <span>16 venues</span>
          <span className="ml-auto text-fifa-silver/30">Auto-refresh ≈2 min</span>
        </div>
      </div>
    </header>
  );
};
