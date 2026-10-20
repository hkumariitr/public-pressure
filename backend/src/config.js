// ============================================================================
// Remote config. The client fetches this on launch and reads the realtime
// block to know how to connect to the live channel — exactly the pattern the
// Inshorts client uses with its `mqtt_notification_*` config fields.
//
// Here `transport` is 'websocket' so the demo needs no broker. Flip it to
// 'mqtt' and set `host` to your broker to go to production without changing
// any client code (see realtime.js and the web/mobile useLive hooks).
// ============================================================================

export const REALTIME = {
  topicEn: 'pp/breaking/en',
  topicHi: 'pp/breaking/hi',
  topicDeviceHashEn: 'pp/device/{hash}/en',
  topicDeviceHashHi: 'pp/device/{hash}/hi',
  keepAliveSeconds: 30,
};

export function buildConfig(req) {
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:4000';
  const wsProto = proto === 'https' ? 'wss' : 'ws';

  return {
    tenant: 'public-pressure',
    minSupportedVersion: '1.0.0',
    feedPageSize: 10,
    ratioGuide: { neutral: 0.6, secondary: 0.3, red: 0.1 },
    realtime: {
      disabled: false,                       // -> mqtt_notification_disabled
      transport: process.env.PP_REALTIME || 'websocket',
      host: `${wsProto}://${host}/live`,     // -> mqtt_notification_host in prod
      topicEn: REALTIME.topicEn,             // -> mqtt_notification_topic_en
      topicHi: REALTIME.topicHi,             // -> mqtt_notification_topic_hi
      topicDeviceHashEn: REALTIME.topicDeviceHashEn,
      topicDeviceHashHi: REALTIME.topicDeviceHashHi,
      keepAliveSeconds: REALTIME.keepAliveSeconds,
    },
    flags: {
      pollsEnabled: true,
      bookmarksEnabled: true,
      readerRtiUploads: true,
      liveTicker: true,
    },
  };
}
