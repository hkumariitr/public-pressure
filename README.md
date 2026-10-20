# Public Pressure

**News that comes from documents.** A bilingual (English / हिन्दी) short‑news app
in the Inshorts mould — 60‑word cards, a live breaking‑news channel, search,
polls and bookmarks — built around the Public Pressure investigative /
civic‑accountability brand.

This repository contains three tiers plus a shared brand foundation:

| Tier | Stack | What it is |
|------|-------|------------|
| `backend/` | Node + Express + `ws` | REST API + realtime live channel |
| `web/` | React + Vite + TypeScript | Responsive web reader |
| `mobile/` | React Native (Expo) + TypeScript | iOS / Android reader |
| `brand/` | CSS + TS tokens, SVG logos | Single source of brand truth |
| `shared/` | TypeScript | Data contracts shared across tiers |

> **Origin.** The feature set and API shape are modelled on a static analysis of
> the Inshorts Android client (see `docs/ARCHITECTURE.md` for the full
> Inshorts → Public Pressure mapping). This is a clean‑room reimplementation with
> fresh code and Public Pressure's own brand — no Inshorts code or assets are used.

---

## What it does

- **60‑word card feed** — top refresh, load‑more pagination, trending, top stories.
- **Live breaking news** — the newsroom publishes a card and it arrives in open
  clients instantly over a realtime channel (the Public Pressure equivalent of
  the Inshorts MQTT push pipeline — see below).
- **Bilingual** — every surface toggles between English (Archivo) and Hindi (Hind),
  with matched x‑heights so bilingual lines sit level.
- **Search** — full‑text across cards, auto‑suggest, trending topic chips.
- **Polls** — in‑card reader polls with live tallies.
- **Bookmarks** — save cards to read later.
- **Share** — native share sheet / clipboard.

---

## Quick start (three terminals)

Everything runs locally with **no database and no message broker**.

```bash
# 1 · API  (http://localhost:4000)
cd backend && npm install && npm start

# 2 · Web  (http://localhost:5173, proxies the API)
cd web && npm install && npm run dev

# 3 · Watch it go live — publish a breaking card into the running clients
cd backend && npm run seed:publish
```

Mobile:

```bash
cd mobile && npm install && npm start      # then press i / a, or scan in Expo Go
```

> On a **physical device**, set `extra.apiBase` in `mobile/app.json` to your
> machine's LAN IP (e.g. `http://192.168.1.20:4000`) so the phone can reach the API.

---

## The "live" mechanism

The defining behaviour — a story going live the instant the desk publishes — works
like this:

```
 editor ──POST /editorial/publish──► API ──► inserts card at top of feed
                                         └──► realtime.publish(topic, card)
                                                      │
          clients subscribe on launch                ▼
   (topic read from remote config)  ◄──── WebSocket fan‑out to subscribers
```

On launch each client fetches `/v1/config/app_config` and reads a `realtime`
block whose fields mirror the Inshorts `mqtt_notification_*` config exactly
(`host`, `topicEn`, `topicHi`, per‑device topics, a `disabled` kill‑switch). The
demo uses **WebSocket** so it runs with zero infrastructure; flipping
`transport` to `mqtt` and pointing `host` at a broker moves it to the production
pipeline **without any client contract change**. See `docs/ARCHITECTURE.md`.

---

## Project layout

```
public-pressure/
├── backend/    Express API + WebSocket live channel (+ demo publish script)
├── web/        Vite + React reader
├── mobile/     Expo React Native reader
├── brand/      tokens.css · tokens.ts · पP logo SVGs (3 variants)
├── shared/     types.ts — the data contracts every tier agrees on
├── docs/       ARCHITECTURE.md — Inshorts → Public Pressure mapping
└── README.md
```

---

## Installing packages at Lilly

Public PyPI and npmjs are not used on Lilly machines — package installs route
through **JFrog Artifactory**. Copy `.npmrc.example` to `.npmrc` in each Node
package (`backend/`, `web/`, `mobile/`) and authenticate per the
[Artifactory front‑door](https://developer.lilly.com) before running
`npm install`. The `.npmrc.example` points npm at the `Lilly-NPM` virtual repo.

---

## License & use

Internal starter for Public Pressure. The brand assets (colour, type, the पP
mark) belong to Public Pressure. See `LICENSE`.
