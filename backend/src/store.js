// ============================================================================
// In-memory store. Deliberately swappable: every function here is the seam
// where you would drop in Postgres / Redis / a CMS. Nothing else in the app
// touches data directly.
// ============================================================================
import { SEED_CARDS, SEED_TOPICS } from './data/seed.js';

const cards = [...SEED_CARDS];                 // newest-first feed
const bookmarks = new Map();                   // userId -> Set(hashId)
const devices = new Map();                     // installationId -> record
const pollVotes = new Map();                   // pollId -> { optionId: count }

// seed poll tallies from the seed data
for (const c of cards) {
  if (c.poll) {
    const tally = {};
    for (const o of c.poll.options) tally[o.id] = o.votes;
    pollVotes.set(c.poll.pollId, tally);
  }
}

const byLang = (lang) => cards.filter((c) => !lang || c.lang === lang);

function page(list, offsetId, limit) {
  let start = 0;
  if (offsetId) {
    const i = list.findIndex((c) => c.hashId === offsetId);
    start = i >= 0 ? i + 1 : 0;
  }
  const slice = list.slice(start, start + limit);
  const last = slice[slice.length - 1];
  const hasMore = start + limit < list.length;
  return { slice, newsOffset: hasMore && last ? last.hashId : null, hasMore };
}

export const store = {
  topRefresh(lang, limit = 10) {
    return page(byLang(lang), null, limit);
  },
  loadMore(lang, offsetId, limit = 10) {
    return page(byLang(lang), offsetId, limit);
  },
  trending(lang, limit = 10) {
    // simple heuristic: breaking + live + poll float up
    const score = (c) => (c.breaking ? 3 : 0) + (c.live ? 2 : 0) + (c.poll ? 1 : 0);
    return page([...byLang(lang)].sort((a, b) => score(b) - score(a)), null, limit);
  },
  topStories(lang, limit = 10) {
    return page(byLang(lang).filter((c) => c.breaking || c.live), null, limit);
  },
  getCard(hashId) {
    return cards.find((c) => c.hashId === hashId) || null;
  },
  getByIds(ids) {
    const set = new Set(ids);
    return cards.filter((c) => set.has(c.hashId));
  },
  search(query, lang, page_ = 0) {
    const q = (query || '').trim().toLowerCase();
    const hits = byLang(lang).filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.categories.some((k) => k.includes(q)),
    );
    const topics = SEED_TOPICS.filter((t) => t.toLowerCase().includes(q));
    return { cards: hits, topics };
  },
  autoSuggest(q) {
    const s = (q || '').toLowerCase();
    return SEED_TOPICS.filter((t) => t.toLowerCase().startsWith(s)).slice(0, 6);
  },
  topics() {
    return SEED_TOPICS;
  },

  // ---- polls ----
  answerPoll(pollId, optionId) {
    const tally = pollVotes.get(pollId);
    if (!tally || !(optionId in tally)) return null;
    tally[optionId] += 1;
    return this.pollResult(pollId);
  },
  pollResult(pollId) {
    const tally = pollVotes.get(pollId);
    if (!tally) return null;
    const options = Object.entries(tally).map(([id, votes]) => ({ id, votes }));
    const totalVotes = options.reduce((n, o) => n + o.votes, 0);
    return { pollId, totalVotes, options };
  },

  // ---- bookmarks ----
  toggleBookmark(userId, hashId) {
    if (!bookmarks.has(userId)) bookmarks.set(userId, new Set());
    const set = bookmarks.get(userId);
    set.has(hashId) ? set.delete(hashId) : set.add(hashId);
    return [...set];
  },
  listBookmarks(userId) {
    const set = bookmarks.get(userId) || new Set();
    return cards.filter((c) => set.has(c.hashId));
  },

  // ---- devices ----
  registerDevice(installationId, record) {
    devices.set(installationId, { ...record, installationId });
    return devices.get(installationId);
  },

  // ---- editorial: publish a breaking card into the feed ----
  publishCard(card) {
    cards.unshift(card);
    if (card.poll) {
      const tally = {};
      for (const o of card.poll.options) tally[o.id] = o.votes || 0;
      pollVotes.set(card.poll.pollId, tally);
    }
    return card;
  },
};
