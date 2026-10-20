# Public Pressure — Mobile (Expo)

React Native + TypeScript reader, feature‑matched to the web app: feed, live
channel, bilingual toggle, search, polls, bookmarks, share.

## Run
```bash
npm install
npm start          # Expo dev server — press i (iOS), a (Android), or scan in Expo Go
```

## Point it at the API
`app.json → expo.extra.apiBase` defaults to `http://localhost:4000` (works on
iOS simulator). On a **physical device**, set it to your machine's LAN IP, e.g.
`http://192.168.1.20:4000`, so the phone can reach the API and the `/live` socket.

## Fonts & weights
Brand fonts load from `@expo-google-fonts/*` in `App.tsx`. The regular weights
are mapped to the family names in `src/brand/tokens.ts`. For exact headline
weight on Android, reference the specific weighted families
(`Archivo_800ExtraBold`, `Hind_700Bold`) on headline `Text` styles — noted inline.

## Structure
```
App.tsx               fonts + tab navigation + live wiring
src/api/client.ts     API calls (reads apiBase from app.json)
src/hooks/useLive.ts  realtime subscription
src/components/        Logo, Header, NewsCard
src/screens/           Feed, Search, Saved
src/brand/tokens.ts    brand tokens
```
