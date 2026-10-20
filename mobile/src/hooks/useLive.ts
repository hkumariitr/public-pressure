import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../api/client';

/**
 * Live breaking-news subscription for mobile. React Native ships a global
 * WebSocket, so the client side of the realtime mechanism is identical to web.
 * Reads transport + topics from remote config — swap to MQTT in production by
 * replacing the socket with mqtt.js and subscribing to the same topic.
 */
export function useLive(config: any | null, lang: Lang, onBreaking: (card: any) => void) {
  const [connected, setConnected] = useState(false);
  const cb = useRef(onBreaking);
  cb.current = onBreaking;

  useEffect(() => {
    if (!config || config.realtime?.disabled || config.realtime?.transport !== 'websocket') return;
    const topic = lang === 'hi' ? config.realtime.topicHi : config.realtime.topicEn;
    const url = `${config.realtime.host}?topics=${topic}`;

    let ws: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      ws = new WebSocket(url);
      ws.onopen = () => setConnected(true);
      ws.onclose = () => { setConnected(false); retry = setTimeout(connect, 2000); };
      ws.onmessage = (ev) => {
        try {
          const e = JSON.parse(ev.data as string);
          if ((e.type === 'breaking' || e.type === 'live_update') && e.card) cb.current(e.card);
        } catch { /* ignore */ }
      };
    };
    connect();
    return () => { if (retry) clearTimeout(retry); ws?.close(); };
  }, [config, lang]);

  return { connected };
}
