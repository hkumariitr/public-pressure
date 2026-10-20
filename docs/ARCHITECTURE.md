# Architecture — and how it maps to Inshorts

Public Pressure is a clean‑room reimplementation of the *shape* of the Inshorts
Android client (`com.nis.app`, v6.1.0), recovered by static analysis. This note
records what was observed and how each concern was rebuilt here with fresh code.

## Inshorts → Public Pressure mapping

| Inshorts (observed) | Public Pressure (this repo) |
|---|---|
| 5 backend microservices (read‑api, user‑service, news‑search, live‑score, parse) | One modular Express API with routers per concern (`routes/news`, `search`, `user`, `poll`, `editorial`). Split back out into services when you need to scale. |
| Retrofit + OkHttp + RxJava2 + Gson | `fetch` client (`api/client.ts`) on web & mobile; plain JSON over HTTP. |
| `{tenant}` path param, `X‑REGION‑ID` header | `{tenant}` kept in paths (`public-pressure`); region header is a future hook. |
| Remote config `v1/config/android_config` | `GET /v1/config/app_config` — same role: client reads it on launch. |
| **MQTT (Eclipse Paho, :1883)** live push, config‑driven topics | **WebSocket** live channel with the identical config contract (see below). |
| HMS / FCM push + Parse poll/ack fallback | Out of scope for the demo; the realtime layer is the in‑app path. Hooks noted. |
| Feed: `v4/news/top_refresh`, `load_more`, `trending`, `top_stories` | Same endpoints, same semantics. |
| Search: `v3/news_search`, `auto_suggest`, `trending_topics` | Same. |
| Poll: `v2/poll/answer` | Same. |
| Federated login (`provider`, `provider_user_id`) | Same request shape, stubbed IdP. |
| ExoPlayer + FFmpeg video | Out of scope; cards are text/image. Add a player later. |

## The realtime contract

The single most important design carry‑over is that **the live transport is
described by remote config, not hard‑coded in the client.** Inshorts shipped
these config fields:

```
mqtt_notification_host, mqtt_notification_username, mqtt_notification_password,
mqtt_notification_topic_en, mqtt_notification_topic_hi,
mqtt_notification_topic_device_hash_en/-_hi, mqtt_notification_disabled
```

Public Pressure's `/v1/config/app_config` returns the same idea in a
transport‑neutral `realtime` block:

```json
{
  "realtime": {
    "disabled": false,
    "transport": "websocket",
    "host": "ws://localhost:4000/live",
    "topicEn": "pp/breaking/en",
    "topicHi": "pp/breaking/hi",
    "topicDeviceHashEn": "pp/device/{hash}/en",
    "topicDeviceHashHi": "pp/device/{hash}/hi",
    "keepAliveSeconds": 30
  }
}
```

Because the client only knows "connect to `host`, subscribe to `topic`", moving
from the WebSocket demo to a production MQTT broker is a server‑config change:

1. Stand up an MQTT broker (EMQX / HiveMQ / Mosquitto).
2. Set `PP_REALTIME=mqtt` and change `host` to the broker URL in `config.js`.
3. In `useLive.ts` (web & mobile), replace the `WebSocket` with an MQTT client
   (`mqtt.js`) subscribing to the same topic. No component above the hook changes.
4. In `editorial.js`, replace `realtime.publish()` with a broker publish.

## REST surface

All feed/search/poll/user routes live under `backend/src/routes/`. The base path
convention is `/{tenant}/{version}/...` to match the observed Inshorts structure
and to leave room for multiple tenants and API versions.

## Data layer

`backend/src/store.js` is an in‑memory store seeded from
`backend/src/data/seed.js`. **Every data access in the app goes through `store`**,
so it is the one seam to replace with Postgres/Redis/a CMS. Swapping it requires
no route changes.

## Security notes (before production)

- `POST /editorial/publish` is the newsroom control and is currently open — put
  auth in front of it.
- Login is stubbed; wire a real IdP (Google / Facebook / phone‑OTP).
- Add TLS, rate limiting, and (matching Inshorts) certificate pinning on mobile.
