# আমল ট্র্যাকার — Dhul Hijjah Amal Tracker

A Bengali-language, gamified Islamic worship tracker for the blessed 10 days of Dhul Hijjah. Built as a PWA with offline-first support, a global leaderboard, achievement badges, and push notifications.

**Live app:** [amal10.netlify.app](https://amal10.netlify.app)

---

## Features

- **Daily amal tracking** — 70+ Islamic practices (prayers, fasting, dhikr, charity) across 10 days with point values and Hadith references
- **Gamification** — points, streaks, 15+ achievement badges, and global/daily leaderboards
- **Offline-first** — progress stored in localStorage, synced to Supabase when online
- **PWA** — installable on iOS and Android, service worker caching, push notifications
- **Multi-auth** — magic link, email/password, and Google OAuth
- **Responsive** — mobile-first with bottom nav; desktop sidebar layout
- **Bengali UI** — full Bengali localization including Bengali numerals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Hosting | Netlify |
| Fonts | Hind Siliguri (Bengali), Inter |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with Email and Google auth enabled

### Installation

```bash
git clone https://github.com/your-username/amal10.git
cd amal10
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

Run the migration to create the leaderboard table:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL in the Supabase dashboard
# supabase/migrations/001_user_scores.sql
```

### Running Locally

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint with ESLint
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, PWA, AppInit)
│   ├── page.tsx                # Landing page (countdown, community stats)
│   ├── globals.css             # Tailwind theme
│   ├── (auth)/
│   │   ├── sign-in/            # Auth page (magic link, password, Google)
│   │   ├── onboard/            # First-time profile setup
│   │   └── push-permission/    # Notification permission request
│   └── (app)/                  # Protected routes (require auth)
│       ├── dashboard/          # Daily amal tracker
│       ├── leaderboard/        # Global & daily top performers
│       ├── insights/           # Stats, badges, category breakdown
│       ├── profile/            # User settings, photo upload
│       └── notifications/      # Notification history
├── components/
│   ├── AppInit.tsx             # PWA setup, in-app browser detection
│   ├── PWAInstallBanner.tsx    # iOS/Android install prompts
│   └── layout/
│       ├── BottomNav.tsx       # Mobile navigation
│       └── Sidebar.tsx         # Desktop navigation
├── lib/
│   ├── data/
│   │   ├── amal.ts             # Amal list (70+ tasks with Hadith)
│   │   └── badges.ts           # Achievement badge definitions
│   ├── utils/
│   │   └── dhulHijjah.ts       # Date/challenge period utilities
│   ├── supabase/
│   │   ├── client.ts           # Browser-side Supabase client
│   │   ├── server.ts           # SSR Supabase client
│   │   └── scores.ts           # Leaderboard queries & score sync
│   ├── notifications.ts        # Push notification setup
│   └── pwa.ts                  # PWA detection & install logic
└── middleware.ts                # Route protection & auth redirects

public/
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker
└── logo.png

supabase/
└── migrations/
    └── 001_user_scores.sql     # Leaderboard table + RLS policies
```

---

## Database Schema

**Table: `user_scores`**

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to `auth.users` |
| `display_name` | text | User's display name |
| `avatar_initial` | text | Fallback avatar letter |
| `total_points` | int | Cumulative points |
| `today_points` | int | Points earned today |
| `streak_days` | int | Consecutive active days |
| `updated_at` | timestamptz | Auto-updated on sync |

RLS policies allow public reads (for leaderboard) and restrict writes to the row owner.

---

## Authentication Flow

1. Middleware protects all `/dashboard`, `/leaderboard`, `/insights`, `/profile` routes
2. Unauthenticated requests redirect to `/sign-in`
3. Auth methods: magic link email, email + password, Google OAuth
4. `/auth/callback` completes the OAuth/magic-link flow
5. First-time users are directed to `/onboard` for profile setup
6. `/auth/signout` clears the session and redirects to `/sign-in`

---

## Challenge Period

The tracker is active from **May 19 – May 28, 2026** (10 days of Dhul Hijjah + 3 days of Ayyam al-Tashriq). The landing page shows a live countdown before the challenge starts and locks amal input outside the active window.

---

## License

MIT
