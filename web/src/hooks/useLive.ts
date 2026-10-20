import { useEffect, useRef, useState } from 'react';
import type { AppConfig, Lang, LiveEvent, NewsCard } from '../types';

/**
 * Subscribe to the live breaking-news channel.
 *
 * This is the client side of the realtime mechanism. It reads the transport
 * and topics from remote config — the same contract the Inshorts client used
 * for its MQTT settings. When transport is 'mqtt', swap the WebSocket below for
 * an MQTT client (e.g. mqtt.js) subscribing to the same topic; nothing else in
 * the component tree changes.
 */
export function useLive(config: AppConfig | null, lang: Lang, onBreaking: (c: NewsCard) => void) {
  const [connected, setConnected] = useState(false);
  const cbRef = useRef(onBreaking);
  cbRef.current = onBreaking;

  useEffect(() => {
    if (!config || config.realtime.disabled || config.realtime.transport !== 'websocket') return;

    const topic = lang === 'hi' ? config.realtime.topicHi : config.realtime.topicEn;
    // In dev, Vite proxies /live to the backend; in prod use the config host.
    const wsBase = import.meta.env.VITE_WS_BASE;
    const url = wsBase
      ? `${location.origin.replace(/^http/, 'ws')}${wsBase}?topics=${topic}`
      : `${config.realtime.host}?topics=${topic}`;

    let ws: WebSocket | null = null;
    let retry: number | undefined;

    const connect = () => {
      ws = new WebSocket(url);
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        retry = window.setTimeout(connect, 2000); // auto-reconnect
      };
      ws.onmessage = (ev) => {
        try {
          const event: LiveEvent = JSON.parse(ev.data);
          if ((event.type === 'breaking' || event.type === 'live_update') && event.card) {
            cbRef.current(event.card);
          }
        } catch { /* ignore malformed frames */ }
      };
    };
    connect();

    return () => {
      if (retry) clearTimeout(retry);
      ws?.close();
    };
  }, [config, lang]);

  return { connected };
}
