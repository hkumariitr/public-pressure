// ============================================================================
// Realtime hub — the "live news" mechanism.
//
// This is the Public Pressure equivalent of the Inshorts MQTT pipeline. The
// Inshorts client held a persistent MQTT connection (Eclipse Paho, port 1883)
// and subscribed to per-language + per-device topics pushed from remote config.
// We reproduce the same SHAPE over WebSockets so the demo runs with no broker:
//
//   • clients connect to  ws://host/live?topics=pp/breaking/en,pp/breaking/hi
//   • the editorial endpoint publishes a card to a topic
//   • the hub fans it out to every subscriber of that topic
//
// To move to real MQTT in production: keep this interface, replace the Set of
// sockets with broker publishes, and point config.realtime.host at the broker.
// ============================================================================
import { WebSocketServer } from 'ws';

export function createRealtime(server) {
  const wss = new WebSocketServer({ server, path: '/live' });
  // topic -> Set<ws>
  const topics = new Map();

  function subscribe(ws, topic) {
    if (!topics.has(topic)) topics.set(topic, new Set());
    topics.get(topic).add(ws);
  }

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const requested = (url.searchParams.get('topics') || 'pp/breaking/en')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    requested.forEach((t) => subscribe(ws, t));

    ws.send(JSON.stringify({ type: 'ping', topic: requested[0], at: new Date().toISOString() }));

    const keepAlive = setInterval(() => {
      if (ws.readyState === ws.OPEN) ws.ping();
    }, 30_000);

    ws.on('close', () => {
      clearInterval(keepAlive);
      for (const set of topics.values()) set.delete(ws);
    });
  });

  /** Publish a LiveEvent to every subscriber of a topic. */
  function publish(topic, event) {
    const payload = JSON.stringify(event);
    const subs = topics.get(topic);
    if (!subs) return 0;
    let sent = 0;
    for (const ws of subs) {
      if (ws.readyState === ws.OPEN) {
        ws.send(payload);
        sent += 1;
      }
    }
    return sent;
  }

  function stats() {
    return {
      topics: [...topics.entries()].map(([t, s]) => ({ topic: t, subscribers: s.size })),
    };
  }

  return { wss, publish, stats };
}
