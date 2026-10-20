# Public Pressure — Web

React + Vite + TypeScript reader. On‑brand per `brand/tokens.css`: ink header,
Paper surfaces, Archivo / Hind / JetBrains Mono, red reserved for the पP mark,
the live dot, and one action per screen.

## Run
```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api and /live to :4000)
npm run build      # type-check + production bundle into dist/
npm run preview    # serve the build
```
Start the backend first (`cd ../backend && npm start`).

## Configuration
`.env` (copy from `.env.example`):
```
VITE_API_BASE=/api     # dev: Vite proxies to the backend
VITE_WS_BASE=/live     # dev: Vite proxies the WebSocket
```
For a deployed build, point `VITE_API_BASE` at the API origin and remove
`VITE_WS_BASE` so the live socket uses `config.realtime.host` directly.

## Structure
```
src/
  api/client.ts       typed API calls
  hooks/useLive.ts    realtime subscription (WebSocket; swap to MQTT in prod)
  components/         Logo, Header, NewsCard
  App.tsx             feed / search / saved views + live wiring
  styles.css          brand system (imports brand-tokens.css)
```
