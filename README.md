# daviaviss.me — Personal Portfolio v2

> Bilingual personal portfolio built with Next.js 16, React 19, Three.js, and Framer Motion. Features a command palette, 3D particle hero, scroll-driven animations, and dark/light theme — deployed on Vercel.

**Live:** [daviaviss.me](https://daviaviss.me)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| 3D Graphics | Three.js 0.184 |
| i18n | next-intl 4 (PT · EN) |
| Deployment | Vercel |

---

## Features

- **Bilingual (PT / EN)** — full translation via `next-intl`, persistent via cookie, zero flash on reload
- **Command palette** — `⌘K` / `Ctrl+K` with 13 commands: section navigation, contact actions, theme and language toggle
- **Three.js hero** — 1 600 particles (sienna + cream) with mouse parallax and 60 fps cap, respects `prefers-reduced-motion`
- **Scroll reveal** — `IntersectionObserver`-based section entrance animations via Framer Motion
- **Text scramble** — character-shuffle effect on key headings (`useTextScramble`)
- **Dark / Light theme** — warm espresso palette (dark) ↔ paper palette (light), persisted via cookie
- **Status line** — fixed bottom bar with real-time clock, location, and availability badge
- **Security headers** — CSP, X-Frame-Options, XSS protection, and Permissions-Policy configured in `next.config.ts`

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens — colors, typography, spacing, easings
│   ├── layout.tsx           # Root layout
│   └── [locale]/            # Dynamic locale routes (pt, en)
│       ├── layout.tsx       # Locale provider + theme injection
│       ├── page.tsx         # Home — all sections composed here
│       ├── contato/         # /contato → redirects to /#contact
│       ├── exp/             # /exp    → redirects to /#experience
│       └── projetos/        # /projetos → redirects to /#projects
├── components/
│   ├── nav/
│   │   └── Nav.tsx          # Fixed header, active section tracking, blur on scroll
│   ├── sections/
│   │   ├── Hero.tsx         # Three.js particles + animated headline + CTA
│   │   ├── About.tsx        # Bio + portrait
│   │   ├── Stack.tsx        # Tech stack grid (4 groups)
│   │   ├── Experience.tsx   # Work timeline, alternating desktop layout
│   │   ├── Projects.tsx     # Portfolio grid (featured + WIP)
│   │   └── Contact.tsx      # Email copy + social links
│   ├── ui/
│   │   ├── Button.tsx       # primary / secondary / ghost variants
│   │   ├── CommandPalette.tsx
│   │   ├── Divider.tsx
│   │   └── StatusLine.tsx   # Fixed bottom bar with clock
│   └── three/
│       └── ParticlesCanvas.tsx  # Lazy-loaded Three.js scene
├── hooks/
│   ├── useIsMobile.ts       # 768px breakpoint, SSR-safe
│   ├── useScrollReveal.ts   # IntersectionObserver → visible boolean
│   └── useTextScramble.ts   # Character scramble animation
├── i18n/
│   └── routing.ts           # Locales: [pt, en], default: pt, localePrefix: as-needed
├── messages/
│   ├── en.json
│   └── pt.json
├── i18n.ts                  # Message loader
└── proxy.ts                 # next-intl middleware
```

---

## Design System

All tokens live in `src/app/globals.css`.

**Palette**

| Token | Role | Dark | Light |
|---|---|---|---|
| `espresso` | Background | 950–600 | — |
| `sienna` | Accent | #d96a3a | sienna-600 |
| `cream` | Primary text | 100–300 | — |
| `ink` | Text (light mode) | — | 900–500 |
| `paper` | Background (light) | — | 50–200 |
| `signal-green` | Available badge | #8fa872 | |

**Typography**

| Role | Font |
|---|---|
| Display / headings | Instrument Serif (italic) |
| Body / UI | IBM Plex Sans |
| Code / labels | IBM Plex Mono |

**Animations** — custom easing curves (`ease-out`, `ease-in-out`, `ease-spring`, `ease-pop`) and duration scale from `140ms` (fast) to `700ms` (scene).

---

## Sections

| Section | ID | Description |
|---|---|---|
| Hero | `#home` | Full-viewport with Three.js particles, animated headline, CTA |
| About | `#about` | Bio, portrait, location |
| Stack | `#stack` | Frameworks · Languages · Styling · Tools |
| Experience | `#experience` | 5 roles — ci&t, Quality Digital, InfinityWorks |
| Projects | `#projects` | Featured live project + WIP items |
| Contact | `#contact` | Email copy, LinkedIn, GitHub, Instagram, WhatsApp |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## i18n

URLs follow the `as-needed` prefix strategy:

| Language | URL |
|---|---|
| Portuguese (default) | `daviaviss.me/` |
| English | `daviaviss.me/en` |

Translations are in `src/messages/pt.json` and `src/messages/en.json`, consumed via `useTranslations()` from `next-intl`. Language preference is persisted in the `NEXT_LOCALE` cookie.

---

## Deployment

Deployed on **Vercel** with automatic deploys on every push to `main`.

DNS is managed externally (Hostinger) with:
- `A` record `@` → `76.76.21.21`
- `CNAME` `www` → `cname.vercel-dns.com`

---

## License

MIT — feel free to use as reference or inspiration. If you do, a mention would be appreciated.
