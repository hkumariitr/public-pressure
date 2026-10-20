// ============================================================================
// Public Pressure — API server.
// REST surface (Inshorts-shaped) + a WebSocket live channel, all in one
// process. Run: `npm start` (or `npm run dev` for watch mode).
// ============================================================================
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { buildConfig, REALTIME } from './config.js';
import { createRealtime } from './realtime.js';
import { news } from './routes/news.js';
import { search } from './routes/search.js';
import { poll } from './routes/poll.js';
import { user } from './routes/user.js';
import { editorialRouter } from './routes/editorial.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// request log — quiet, one line
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method}  ${req.url}`);
  next();
});

app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'public-pressure-api' }));

// Remote config (read on launch; carries the realtime block)
app.get('/v1/config/android_config', (req, res) => res.json(buildConfig(req)));
app.get('/v1/config/app_config', (req, res) => res.json(buildConfig(req)));

// Feature routers
app.use('/', news);
app.use('/', search);
app.use('/', poll);
app.use('/', user);

// HTTP + WS server share one port
const server = http.createServer(app);
const realtime = createRealtime(server);

// Editorial (publish -> live). Give it the topic config.
app.use('/', editorialRouter(realtime, { realtime: REALTIME }));

// 404 fallthrough
app.use((_req, res) => res.status(404).json({ error: 'not_found' }));

server.listen(PORT, () => {
  console.log(`\n  Public Pressure API  ·  http://localhost:${PORT}`);
  console.log(`  Live channel         ·  ws://localhost:${PORT}/live`);
  console.log(`  Config               ·  http://localhost:${PORT}/v1/config/app_config\n`);
});
