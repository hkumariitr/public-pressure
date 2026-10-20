import Constants from 'expo-constants';

// On a simulator, localhost reaches the host. On a physical device, set
// `extra.apiBase` in app.json to your machine's LAN IP.
const BASE: string =
  (Constants.expoConfig?.extra as any)?.apiBase || 'http://localhost:4000';
const TENANT = 'public-pressure';

export type Lang = 'en' | 'hi';

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
  base: BASE,
  config: () => get<any>('/v1/config/app_config'),
  topRefresh: (lang: Lang, limit = 10) =>
    get<any>(`/${TENANT}/v4/news/top_refresh?lang=${lang}&max_limit=${limit}`),
  loadMore: (lang: Lang, offset: string, limit = 10) =>
    get<any>(`/${TENANT}/v4/news/load_more?lang=${lang}&max_limit=${limit}&news_offset=${offset}`),
  search: (q: string, lang: Lang) =>
    get<any>(`/${TENANT}/v3/news_search?lang=${lang}&query_str=${encodeURIComponent(q)}`),
  trendingTopics: () => get<any>(`/${TENANT}/v3/trending_topics`),
  answerPoll: (pollId: string, optionId: string) =>
    send<any>(`/${TENANT}/v2/poll/answer`, 'PUT', { pollId, optionId }),
  toggleBookmark: (userId: string, hashId: string) =>
    send<any>(`/${TENANT}/v3/bookmark/toggle`, 'POST', { userId, hashId }),
  myBookmarks: (userId: string) =>
    get<any>(`/${TENANT}/v3/bookmark/my_bookmarks?userId=${userId}`),
};
