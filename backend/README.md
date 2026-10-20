# Public Pressure — API

Express REST API + a WebSocket live channel, in one process. No database or
broker required; data is seeded in memory (`src/data/seed.js`) and accessed only
through `src/store.js` (the seam to swap for a real DB).

## Run
```bash
npm install
npm start          # http://localhost:4000   ·   ws://localhost:4000/live
npm run dev        # same, with --watch reload
```

## Key endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/config/app_config` | Remote config incl. the `realtime` block |
| GET | `/public-pressure/v4/news/top_refresh?lang=en` | Top of feed |
| GET | `/public-pressure/v4/news/load_more?news_offset=…` | Pagination |
| GET | `/public-pressure/v4/news/trending` | Trending |
| GET | `/public-pressure/v2/news/:newsId` | Single card |
| GET | `/public-pressure/v3/news_search?query_str=…` | Search |
| GET | `/public-pressure/v3/trending_topics` | Topic chips |
| PUT | `/public-pressure/v2/poll/answer` | Vote `{pollId, optionId}` |
| POST | `/public-pressure/v3/bookmark/toggle` | Toggle `{userId, hashId}` |
| GET | `/public-pressure/v3/bookmark/my_bookmarks?userId=…` | Saved cards |
| POST | `/v3/registration/login` | Federated login (stubbed) |
| POST | `/editorial/publish` | **Newsroom:** publish a card → live fan‑out |
| GET | `/editorial/realtime_stats` | Who is subscribed right now |

## Go live
Open a client, then:
```bash
npm run seed:publish          # pushes a breaking card to all subscribers
```

## Production swaps
- **Realtime → MQTT:** set `PP_REALTIME=mqtt`, point `realtime.host` at a broker,
  and replace the `ws` fan‑out in `src/realtime.js` with broker publishes.
- **Data → DB:** reimplement the functions in `src/store.js`.
- **Auth:** guard `/editorial/*` and wire a real IdP in `src/routes/user.js`.
