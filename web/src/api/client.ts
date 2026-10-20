import type {
  AppConfig, FeedResponse, NewsCard, SearchResponse, Lang,
} from '../types';

const BASE = import.meta.env.VITE_API_BASE || '/api';
const TENANT = 'public-pressure';

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) throw new Error(`${r.status} ${path}`);
  return r.json();
}
async function send<T>(path: string, method: string, body?: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`${r.status} ${path}`);
  return r.json();
}

export const api = {
  config: () => get<AppConfig>('/v1/config/app_config'),

  topRefresh: (lang: Lang, limit = 10) =>
    get<FeedResponse>(`/${TENANT}/v4/news/top_refresh?lang=${lang}&max_limit=${limit}`),

  loadMore: (lang: Lang, offset: string, limit = 10) =>
    get<FeedResponse>(
      `/${TENANT}/v4/news/load_more?lang=${lang}&max_limit=${limit}&news_offset=${offset}`,
    ),

  trending: (lang: Lang, limit = 10) =>
    get<FeedResponse>(`/${TENANT}/v4/news/trending?lang=${lang}&max_limit=${limit}`),

  search: (query: string, lang: Lang) =>
    get<SearchResponse>(
      `/${TENANT}/v3/news_search?lang=${lang}&query_str=${encodeURIComponent(query)}`,
    ),

  trendingTopics: () => get<{ topics: string[] }>(`/${TENANT}/v3/trending_topics`),

  answerPoll: (pollId: string, optionId: string) =>
    send<{ pollId: string; totalVotes: number; options: { id: string; votes: number }[] }>(
      `/${TENANT}/v2/poll/answer`, 'PUT', { pollId, optionId },
    ),

  toggleBookmark: (userId: string, hashId: string) =>
    send<{ bookmarks: string[] }>(`/${TENANT}/v3/bookmark/toggle`, 'POST', { userId, hashId }),

  myBookmarks: (userId: string) =>
    get<{ cards: NewsCard[] }>(`/${TENANT}/v3/bookmark/my_bookmarks?userId=${userId}`),
};
