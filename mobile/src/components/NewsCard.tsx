import { useState } from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, font, space, type as T } from '../brand/tokens';

function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return 'now';
  if (d < 3600) return `${Math.floor(d / 60)}m`;
  if (d < 86400) return `${Math.floor(d / 3600)}h`;
  return `${Math.floor(d / 86400)}d`;
}

export function NewsCard({
  card, bookmarked, onBookmark, onVote,
}: {
  card: any;
  bookmarked: boolean;
  onBookmark: (id: string) => void;
  onVote: (pollId: string, optionId: string) => void;
}) {
  const [voted, setVoted] = useState<string | null>(null);
  const hi = card.lang === 'hi';
  const deva = hi ? { fontFamily: font.deva } : null;

  const poll = card.poll;
  const total = poll ? poll.options.reduce((n: number, o: any) => n + o.votes, 0) || 1 : 1;
  const leadId = poll ? [...poll.options].sort((a: any, b: any) => b.votes - a.votes)[0]?.id : null;

  const share = () =>
    Share.share({ message: `${card.title} — Public Pressure` }).catch(() => {});

  return (
    <View style={s.card}>
      {card.imageUrl && <View style={s.media} />}
      <View style={s.body}>
        <View style={s.eyebrow}>
          {card.live && <View style={s.dot} />}
          {card.breaking && (
            <Text style={[s.meta, { color: color.red, fontWeight: '600' }]}>
              {hi ? 'ताज़ा' : 'Breaking'}
            </Text>
          )}
          <Text style={[s.meta, { color: color.slate }]}>{card.categories.join('  ·  ')}</Text>
        </View>

        <Text style={[s.title, deva, hi && { fontWeight: '700' }]}>{card.title}</Text>
        <Text style={[s.text, deva]}>{card.content}</Text>

        {poll && (
          <View style={{ gap: 8, marginTop: 4 }}>
            <Text style={[s.pollQ, deva]}>{poll.question}</Text>
            {poll.options.map((o: any) => {
              const pct = Math.round((o.votes / total) * 100);
              const done = voted !== null;
              const lead = done && o.id === leadId;
              return (
                <TouchableOpacity
                  key={o.id}
                  disabled={done}
                  onPress={() => { setVoted(o.id); onVote(poll.pollId, o.id); }}
                  style={s.pollOpt}
                >
                  {done && (
                    <View
                      style={[
                        s.pollFill,
                        { width: `${pct}%`, backgroundColor: lead ? color.red : color.inkRule },
                        lead && { opacity: 0.14 },
                      ]}
                    />
                  )}
                  <Text style={[s.pollLabel, deva]}>{o.label}</Text>
                  {done && <Text style={s.pollPct}>{pct}%</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={s.source}>
          {card.sourceName}  ·  {timeAgo(card.createdAt)}  ·  {card.authorName}
        </Text>
      </View>

      <View style={s.actions}>
        <TouchableOpacity style={s.act} onPress={() => onBookmark(card.hashId)}>
          <Text style={[s.actTxt, bookmarked && { color: color.red }]}>
            {bookmarked ? '★' : '☆'}  {hi ? 'सहेजें' : 'Save'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.act} onPress={share}>
          <Text style={s.actTxt}>↗  {hi ? 'साझा' : 'Share'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: color.white, borderRadius: space.radiusLg,
    borderWidth: 1, borderColor: color.paperRule, overflow: 'hidden',
  },
  media: { aspectRatio: 16 / 9, backgroundColor: '#EDEBE7' },
  body: { padding: space.pad, gap: 10 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.red },
  meta: { fontFamily: font.mono, fontSize: T.meta, letterSpacing: 0.5 },
  title: { fontFamily: font.latin, fontWeight: '800', fontSize: T.h3, lineHeight: T.h3 * 1.18, color: color.ink },
  text: { fontFamily: font.latin, fontSize: T.body, lineHeight: T.body * 1.5, color: color.ink },
  source: { fontFamily: font.mono, fontSize: T.meta, color: color.grey },
  pollQ: { fontWeight: '600', color: color.ink, fontSize: T.sm },
  pollOpt: {
    borderWidth: 1, borderColor: color.paperRule, borderRadius: space.radius,
    paddingVertical: 10, paddingHorizontal: 12, backgroundColor: color.paper,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden',
  },
  pollFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  pollLabel: { fontSize: T.sm, color: color.ink },
  pollPct: { fontFamily: font.mono, fontSize: T.meta, color: color.grey },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: color.paperRule },
  act: { paddingVertical: 12, paddingHorizontal: space.pad },
  actTxt: { color: color.grey, fontSize: T.sm },
});
