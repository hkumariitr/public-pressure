// Search routes — mirrors the Inshorts SearchApiService surface.
import { Router } from 'express';
import { store } from '../store.js';

export const search = Router();
const lang = (req) => (req.query.lang === 'hi' ? 'hi' : 'en');

// GET /:tenant/v3/news_search?query_str=...&page=0
search.get('/:tenant/v3/news_search', (req, res) => {
  const q = req.query.query_str || '';
  const page = parseInt(req.query.page, 10) || 0;
  const { cards, topics } = store.search(q, lang(req), page);
  res.json({ query: q, cards, topics, page });
});

// GET /:tenant/v3/auto_suggest?query_str=...
search.get('/:tenant/v3/auto_suggest', (req, res) =>
  res.json({ suggestions: store.autoSuggest(req.query.query_str || '') }),
);

// GET /:tenant/v3/trending_topics
search.get('/:tenant/v3/trending_topics', (_req, res) =>
  res.json({ topics: store.topics() }),
);
