// Editorial routes — the "publish" side of the live mechanism.
// Posting a card here inserts it at the top of the feed AND fans it out over
// the realtime hub to every subscriber of the matching language topic. This is
// what makes a story go "live" the instant the desk hits publish.
//
// Protect this with real auth before deploying — it is the newsroom control.
import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { store } from '../store.js';

export function editorialRouter(realtime, config) {
  const r = Router();

  // POST /editorial/publish   { card: Partial<NewsCard>, breaking?: boolean }
  r.post('/editorial/publish', (req, res) => {
    const input = req.body?.card || {};
    const lang = input.lang === 'hi' ? 'hi' : 'en';
    const card = {
      hashId: input.hashId || `pp-${randomUUID().slice(0, 8)}`,
      tenant: 'public-pressure',
      lang,
      title: input.title || 'Untitled',
      content: input.content || '',
      imageUrl: input.imageUrl ?? null,
      sourceName: input.sourceName || 'PP Desk',
      sourceUrl: input.sourceUrl ?? null,
      categories: input.categories || ['civic'],
      authorName: input.authorName || 'PP Desk',
      createdAt: new Date().toISOString(),
      readMoreUrl: input.readMoreUrl ?? null,
      live: Boolean(input.live),
      breaking: Boolean(req.body?.breaking ?? input.breaking),
      poll: input.poll ?? null,
    };

    store.publishCard(card);

    const topic = lang === 'hi' ? config.realtime.topicHi : config.realtime.topicEn;
    const delivered = realtime.publish(topic, {
      type: card.breaking ? 'breaking' : 'live_update',
      topic,
      card,
      at: new Date().toISOString(),
    });

    res.status(201).json({ published: card.hashId, topic, delivered });
  });

  // GET /editorial/realtime_stats  — who is listening right now
  r.get('/editorial/realtime_stats', (_req, res) => res.json(realtime.stats()));

  return r;
}
