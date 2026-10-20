// News / feed routes — mirrors the Inshorts NewsApiService surface.
import { Router } from 'express';
import { store } from '../store.js';

const TENANT = 'public-pressure';
export const news = Router();

const envelope = ({ slice, newsOffset, hasMore }) => ({
  cards: slice,
  newsOffset,
  hasMore,
  servedAt: new Date().toISOString(),
});

const lang = (req) => (req.query.lang === 'hi' ? 'hi' : 'en');
const limit = (req) => Math.min(parseInt(req.query.max_limit, 10) || 10, 30);

// GET /:tenant/v4/news/top_refresh
news.get('/:tenant/v4/news/top_refresh', (req, res) =>
  res.json(envelope(store.topRefresh(lang(req), limit(req)))),
);

// GET /:tenant/v4/news/load_more?news_offset=...
news.get('/:tenant/v4/news/load_more', (req, res) =>
  res.json(envelope(store.loadMore(lang(req), req.query.news_offset, limit(req)))),
);

// GET /:tenant/v4/news/trending
news.get('/:tenant/v4/news/trending', (req, res) =>
  res.json(envelope(store.trending(lang(req), limit(req)))),
);

// GET /:tenant/v4/news/top_stories/top_refresh
news.get('/:tenant/v4/news/top_stories/top_refresh', (req, res) =>
  res.json(envelope(store.topStories(lang(req), limit(req)))),
);

// GET /:tenant/v2/news/:newsId
news.get('/:tenant/v2/news/:newsId', (req, res) => {
  const card = store.getCard(req.params.newsId);
  if (!card) return res.status(404).json({ error: 'not_found' });
  return res.json(card);
});

// POST /:tenant/v2/hash_id/search  { hashIds: [...] }
news.post('/:tenant/v2/hash_id/search', (req, res) => {
  const ids = Array.isArray(req.body?.hashIds) ? req.body.hashIds : [];
  res.json({ cards: store.getByIds(ids) });
});

export { TENANT };
