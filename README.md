<div align="center">

# ⚽ Pitch Perfect 26

### Live FIFA World Cup 2026 Tracker — Scores, Goals, Standings & Schedule

**A government-grade, security-hardened Progressive Web App for following every kick of the tournament.**

[![Live Site](https://img.shields.io/badge/Live-dylangrow.github.io%2FPitch-c9a84c?style=for-the-badge&logo=googlechrome&logoColor=white)](https://dylangrow.github.io/Pitch/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/DylanGrow/Pitch/deploy.yml?branch=main&style=for-the-badge&label=Deploy&logo=githubactions&logoColor=white&color=2ec27e)](https://github.com/DylanGrow/Pitch/actions)
[![License](https://img.shields.io/badge/License-MIT-c9a84c?style=for-the-badge)](#-license)

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](#-pwa-features)

</div>

<br>

<div align="center">
<table>
<tr>
<td align="center">🔴<br><b>Live Scores</b><br><sub>Auto-refresh every 2min</sub></td>
<td align="center">🥇<br><b>Goal Leaders</b><br><sub>Top scorers & assists</sub></td>
<td align="center">📊<br><b>Standings</b><br><sub>All 12 groups</sub></td>
<td align="center">📅<br><b>Schedule</b><br><sub>104 matches, filterable</sub></td>
<td align="center">🟨<br><b>Discipline</b><br><sub>Cards & suspensions</sub></td>
</tr>
</table>
</div>

---

## 📸 Overview

Pitch Perfect 26 is a single-page tracker built for the **2026 FIFA World Cup** (USA · Canada · Mexico, June 11 – July 19). It polls live match data on a timer, pauses politely when your tab is in the background, and resumes the instant you switch back — so the tab sitting open in your browser all tournament long never gets stale and never burns your battery.

No backend. No database. No tracking. Just a static site, a public football API, and a service worker that keeps it installable and resilient offline.

---

## ✨ Features

| | |
|---|---|
| 🔴 **Live Scores** | Real-time match cards grouped by day, with live matches pinned to the top and a pulsing indicator while the ball's in play |
| 🥇 **Goal Leaders** | Ranked leaderboard with medal styling for the top 3, penalty/assist breakdowns, and proportional progress bars |
| 🎯 **Assists** | Same leaderboard engine, re-sorted to spotlight the playmakers |
| 📊 **Group Standings** | All 12 groups, qualification places highlighted, last-5 form pips (W/D/L) |
| 📅 **Full Schedule** | Every match across the tournament, filterable by stage (Groups → Round of 16 → QF → SF → Final) |
| 🟨 **Discipline Table** | Yellow/red card tracker sorted by severity, with suspension-rule context |
| ⏱️ **Live Countdown** | Header counts down to kickoff, then flips to a LIVE badge once the tournament starts |
| 📱 **Installable PWA** | Add to home screen on iOS/Android/Desktop — works offline with cached data |

---

## 🔒 Security First

This isn't a typical weekend project — it's built to a **government-contractor security baseline**, because that's the standard its author works to daily.

```
✓ Strict Content-Security-Policy   — no unsafe-eval, no third-party scripts
✓ Zero remote fonts                — system font stack only (adblocker-proof)
✓ Zero remote images               — no external image requests, ever
✓ XSS-hardened                     — every API value sanitized via textContent
✓ HSTS preload                     — forced HTTPS, subdomain-inclusive
✓ X-Frame-Options: DENY            — no clickjacking surface
✓ Permissions-Policy locked        — camera, mic, geolocation all denied
✓ credentials: 'omit'              — no cookies leak cross-origin, ever
```

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'` + explicit allowlist |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

---

## 🏗️ Tech Stack

<div align="center">

| Layer | Choice |
|---|---|
| **Framework** | React 18 + TypeScript (strict mode, zero `any`) |
| **Build** | Vite 5 |
| **Styling** | Tailwind CSS 3 — custom FIFA gold/blue theme, no CDN |
| **PWA** | `vite-plugin-pwa` + Workbox, auto-updating service worker |
| **Data** | [football-data.org](https://www.football-data.org/) free API |
| **Hosting** | GitHub Pages |
| **CI/CD** | GitHub Actions — push to `main`, auto-deploy |

</div>

---

## 🚀 Quick Start

```bash
git clone https://github.com/DylanGrow/Pitch.git
cd Pitch
npm install
npm run dev
```

Build for production:

```bash
npm run build    # outputs to /dist
npm run preview  # preview the production build locally
```

---

## 🔑 Live Data Setup

The app works out of the box with realistic demo data. For **real, live tournament data**:

1. Register free at **[football-data.org/client/register](https://www.football-data.org/client/register)** — no credit card, ~1 minute
2. Add your key as a GitHub Secret:
   `Settings → Secrets and variables → Actions → New repository secret`
   - Name: `VITE_FD_API_KEY`
   - Value: *your key*
3. Push to `main` — GitHub Actions bakes the key into the next build

> Local dev: copy `.env.example` → `.env.local` and drop your key in `VITE_FD_API_KEY=...`

---

## 📁 Project Structure

```
Pitch/
├── .github/workflows/
│   └── deploy.yml          # CI/CD → GitHub Pages on push to main
├── public/
│   ├── favicon.svg         # Inline SVG, zero external requests
│   ├── robots.txt
│   ├── sitemap.xml
│   └── _headers             # Security headers (CSP, HSTS, etc.)
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Logo, countdown, refresh control
│   │   ├── NavTabs.tsx             # Tab navigation
│   │   ├── ScoresPanel.tsx         # Live + upcoming match cards
│   │   ├── ScorersLeaderboard.tsx  # Goals & assists leaderboard
│   │   ├── StandingsPanel.tsx      # Group tables
│   │   ├── SchedulePanel.tsx       # Full fixture list, stage filters
│   │   └── DisciplinePanel.tsx     # Cards tracker
│   ├── hooks/
│   │   └── useAutoRefresh.ts       # 2-min polling, visibility-aware
│   ├── types/
│   │   └── index.ts                # Match, Scorer, Standing, etc.
│   ├── utils/
│   │   ├── api.ts                  # Fetch layer + XSS sanitization
│   │   └── format.ts               # Date/status formatting helpers
│   ├── App.tsx
│   └── main.tsx
├── index.html               # Full SEO meta, JSON-LD, CSP
├── tailwind.config.js        # FIFA gold/blue theme
└── vite.config.ts            # PWA + CSP + build config
```

---

## ⚡ Auto-Refresh Behavior

```
┌─────────────────────────────────────────────┐
│  Tab visible    →  Poll every 2 minutes      │
│  Tab hidden     →  Polling paused            │
│  Tab refocused  →  Immediate refresh + reset │
└─────────────────────────────────────────────┘
```

No wasted requests, no draining battery on a backgrounded tab, no stale data when you come back to check a score.

---

## 🧪 Lighthouse Targets

<div align="center">

| Performance | Accessibility | Best Practices | SEO |
|:---:|:---:|:---:|:---:|
| 🟢 100 | 🟢 100 | 🟢 100 | 🟢 100 |

</div>

Achieved through: code-split vendor bundle, content-hashed cache-busting assets, zero render-blocking resources, full semantic HTML + ARIA labeling, skip-to-content link, and a system font stack with no flash-of-unstyled-text.

---

## 🗺️ Roadmap

- [ ] Knockout bracket visualization (R16 → Final)
- [ ] Push notifications for goals in followed matches
- [ ] Dark/light theme toggle
- [ ] Team detail pages (squad, group path, history)

---

## 🤝 Contributing

Issues and PRs welcome. Keep it dependency-light, keep it secure, keep it fast.

---

## 📜 License

MIT — use it, fork it, ship it. Credit appreciated, not required.

<div align="center">
<br>

**Built for the 2026 FIFA World Cup** 🏆 USA · Canada · Mexico

[Live Site](https://dylangrow.github.io/Pitch/) · [Report a Bug](https://github.com/DylanGrow/Pitch/issues) · [Request a Feature](https://github.com/DylanGrow/Pitch/issues)

</div>
