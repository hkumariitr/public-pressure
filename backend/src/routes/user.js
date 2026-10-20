// User service routes — login, device registration, bookmarks.
// Federated login is stubbed: it trusts the provider payload and issues a
// demo token. Wire a real IdP (Google/Facebook/phone-OTP) here in production.
import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { store } from '../store.js';

export const user = Router();

// POST /v3/registration/login
user.post('/v3/registration/login', (req, res) => {
  const { provider = 'guest', providerUserId = randomUUID(), displayName } = req.body || {};
  const userId = `u_${provider}_${providerUserId}`.slice(0, 48);
  res.json({ userId, token: `demo.${randomUUID()}`, displayName: displayName || 'Reader' });
});

// POST /v3/registration/register_device
user.post('/v3/registration/register_device', (req, res) => {
  const installationId = randomUUID();
  store.registerDevice(installationId, {
    deviceRegId: req.body?.deviceRegId || null,
    lang: req.body?.lang === 'hi' ? 'hi' : 'en',
    displayName: req.body?.displayName || null,
  });
  res.json({ installationId });
});

// POST /:tenant/v3/bookmark/toggle  { userId, hashId }
user.post('/:tenant/v3/bookmark/toggle', (req, res) => {
  const { userId = 'guest', hashId } = req.body || {};
  if (!hashId) return res.status(400).json({ error: 'hashId_required' });
  res.json({ bookmarks: store.toggleBookmark(userId, hashId) });
});

// GET /:tenant/v3/bookmark/my_bookmarks?userId=...
user.get('/:tenant/v3/bookmark/my_bookmarks', (req, res) =>
  res.json({ cards: store.listBookmarks(req.query.userId || 'guest') }),
);
