/* ============================================================================
   PUBLIC PRESSURE — shared data contracts.
   One source of truth for the shapes that cross the API boundary.
   Mirrors (and simplifies) the Inshorts model families observed during the
   decompilation: news, poll, config, search, user_service.
   ============================================================================ */

export type Lang = 'en' | 'hi';
export type Tenant = 'public-pressure';

/** A single news card — the 60-word unit. */
export interface NewsCard {
  hashId: string;
  tenant: Tenant;
  lang: Lang;
  title: string;
  content: string;          // the ~60-word body
  imageUrl: string | null;
  sourceName: string;       // e.g. "RTI reply, 12 Mar"
  sourceUrl: string | null;
  categories: string[];     // ["investigation","civic"]
  authorName: string;
  createdAt: string;        // ISO
  readMoreUrl: string | null;
  live: boolean;            // true while a story is actively updating
  breaking: boolean;
  poll?: Poll | null;
}

/** Pagination envelope returned by every feed endpoint. */
export interface FeedResponse {
  cards: NewsCard[];
  newsOffset: string | null; // opaque cursor for load_more
  hasMore: boolean;
  servedAt: string;
}

export interface Poll {
  pollId: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}
export interface PollOption { id: string; label: string; votes: number; }
export interface PollAnswerRequest { pollId: string; optionId: string; }

export interface SearchResponse {
  query: string;
  cards: NewsCard[];
  topics: string[];
  page: number;
}

/** Remote config. The realtime block is shaped exactly like the Inshorts
 *  `mqtt_notification_*` config so a production build can swap the WebSocket
 *  demo transport for an MQTT broker with no client contract change. */
export interface AppConfig {
  tenant: Tenant;
  minSupportedVersion: string;
  feedPageSize: number;
  ratioGuide: { neutral: number; secondary: number; red: number };
  realtime: RealtimeConfig;
  flags: Record<string, boolean>;
}

export interface RealtimeConfig {
  disabled: boolean;              // mqtt_notification_disabled
  transport: 'websocket' | 'mqtt';
  host: string;                   // ws URL (demo) or mqtt_notification_host (prod)
  topicEn: string;                // mqtt_notification_topic_en
  topicHi: string;                // mqtt_notification_topic_hi
  topicDeviceHashEn: string;      // mqtt_notification_topic_device_hash_en
  topicDeviceHashHi: string;      // mqtt_notification_topic_device_hash_hi
  keepAliveSeconds: number;
}

/** Realtime envelope pushed to subscribers on the live channel. */
export interface LiveEvent {
  type: 'breaking' | 'live_update' | 'ping';
  topic: string;
  card?: NewsCard;
  at: string;
}

/* ---- user_service ---- */
export interface LoginRequest {
  provider: 'google' | 'facebook' | 'phone' | 'guest';
  providerUserId: string;
  displayName?: string;
  emailId?: string;
  phoneNumber?: string;
  photoUrl?: string;
}
export interface LoginResponse { userId: string; token: string; displayName: string; }

export interface DeviceRegRequest {
  deviceRegId: string;      // push token (FCM/HMS in prod)
  lang: Lang;
  displayName?: string;
}
export interface DeviceRegResponse { installationId: string; }
