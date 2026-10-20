import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api/client';
import { useLive } from './hooks/useLive';
import { Header } from './components/Header';
import { NewsCard } from './components/NewsCard';
import type { AppConfig, Lang, NewsCard as Card } from './types';

const USER_ID = 'guest'; // demo single-user; replace with auth'd id

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [view, setView] = useState<'feed' | 'search' | 'saved'>('feed');

  const [cards, setCards] = useState<Card[]>([]);
  const [offset, setOffset] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [ticker, setTicker] = useState<Card | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Card[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [savedCards, setSavedCards] = useState<Card[]>([]);

  // --- config + initial feed ---
  useEffect(() => { api.config().then(setConfig).catch(console.error); }, []);

  const loadFeed = useCallback(async (l: Lang) => {
    const res = await api.topRefresh(l, config?.feedPageSize || 10);
    setCards(res.cards);
    setOffset(res.newsOffset);
    setHasMore(res.hasMore);
  }, [config]);

  useEffect(() => { if (config) loadFeed(lang); }, [config, lang, loadFeed]);

  // --- live: prepend breaking cards + show ticker ---
  const onBreaking = useCallback((card: Card) => {
    if (card.lang !== lang) return;
    setCards((prev) => (prev.some((c) => c.hashId === card.hashId) ? prev : [card, ...prev]));
    setTicker(card);
    window.setTimeout(() => setTicker((t) => (t?.hashId === card.hashId ? null : t)), 8000);
  }, [lang]);
  const { connected } = useLive(config, lang, onBreaking);

  // --- bookmarks ---
  const toggleBookmark = async (hashId: string) => {
    const { bookmarks: ids } = await api.toggleBookmark(USER_ID, hashId);
    setBookmarks(new Set(ids));
  };
  const vote = (pollId: string, optionId: string) => { api.answerPoll(pollId, optionId).catch(() => {}); };

  const loadMore = async () => {
    if (!offset) return;
    const res = await api.loadMore(lang, offset, config?.feedPageSize || 10);
    setCards((prev) => [...prev, ...res.cards]);
    setOffset(res.newsOffset);
    setHasMore(res.hasMore);
  };

  // --- search ---
  useEffect(() => {
    if (view !== 'search') return;
    api.trendingTopics().then((r) => setTopics(r.topics)).catch(() => {});
  }, [view]);
  useEffect(() => {
    if (view !== 'search') return;
    const q = query.trim();
    if (!q) { setResults([]); return; }
    const id = setTimeout(() => { api.search(q, lang).then((r) => setResults(r.cards)).catch(() => {}); }, 220);
    return () => clearTimeout(id);
  }, [query, lang, view]);

  // --- saved view ---
  useEffect(() => {
    if (view !== 'saved') return;
    api.myBookmarks(USER_ID).then((r) => setSavedCards(r.cards)).catch(() => {});
  }, [view, bookmarks]);

  const cardProps = (c: Card) => ({
    card: c, bookmarked: bookmarks.has(c.hashId), onBookmark: toggleBookmark, onVote: vote,
  });

  return (
    <div className="pp-app">
      <Header lang={lang} onLang={setLang} view={view} onView={setView} liveConnected={connected} />

      {ticker && (
        <div className="pp-ticker" role="status">
          <span className="pp-livetag">{ticker.breaking ? 'BREAKING' : 'LIVE'}</span>
          <a onClick={() => setView('feed')} href="#top">{ticker.title}</a>
        </div>
      )}

      {view === 'feed' && (
        <main className="pp-feed" id="top">
          {cards.map((c) => <NewsCard key={c.hashId} {...cardProps(c)} />)}
          {hasMore && <button className="pp-loadmore" onClick={loadMore}>Load more</button>}
          {!hasMore && cards.length > 0 && (
            <div className="pp-status">You're all caught up · documents, not noise</div>
          )}
        </main>
      )}

      {view === 'search' && (
        <>
          <div className="pp-search">
            <input
              autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'खोजें: पानी, ऑडिट, आरटीआई…' : 'Search: water, audit, RTI…'}
              lang={lang}
            />
            <div className="pp-chips">
              {topics.map((t) => (
                <button key={t} className="pp-chip" onClick={() => setQuery(t)}>{t}</button>
              ))}
            </div>
          </div>
          <main className="pp-feed">
            {results.map((c) => <NewsCard key={c.hashId} {...cardProps(c)} />)}
            {query && results.length === 0 && (
              <div className="pp-empty"><strong>No cards yet</strong>Try a topic chip above.</div>
            )}
          </main>
        </>
      )}

      {view === 'saved' && (
        <main className="pp-feed">
          {savedCards.length === 0 ? (
            <div className="pp-empty">
              <strong>Nothing saved</strong>
              Tap Save on any card to keep it here.
            </div>
          ) : savedCards.map((c) => <NewsCard key={c.hashId} {...cardProps(c)} />)}
        </main>
      )}
    </div>
  );
}
