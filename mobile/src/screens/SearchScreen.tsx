import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NewsCard } from '../components/NewsCard';
import { api } from '../api/client';
import { color, font, space, type as T } from '../brand/tokens';

export function SearchScreen({ lang, bookmarks, onBookmark, onVote }: any) {
  const [q, setQ] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => { api.trendingTopics().then((r) => setTopics(r.topics)).catch(() => {}); }, []);
  useEffect(() => {
    const t = q.trim();
    if (!t) { setResults([]); return; }
    const id = setTimeout(() => { api.search(t, lang).then((r) => setResults(r.cards)).catch(() => {}); }, 220);
    return () => clearTimeout(id);
  }, [q, lang]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 14, gap: 12 }}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={lang === 'hi' ? 'खोजें: पानी, ऑडिट…' : 'Search: water, audit, RTI…'}
          placeholderTextColor={color.grey}
          style={s.input}
        />
        <View style={s.chips}>
          {topics.map((t) => (
            <TouchableOpacity key={t} style={s.chip} onPress={() => setQ(t)}>
              <Text style={s.chipTxt}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={results}
        keyExtractor={(c) => c.hashId}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 14, gap: space.gap }}
        renderItem={({ item }) => (
          <NewsCard card={item} bookmarked={bookmarks.has(item.hashId)} onBookmark={onBookmark} onVote={onVote} />
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  input: {
    borderWidth: 1, borderColor: color.paperRule, borderRadius: space.radius,
    backgroundColor: color.white, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, color: color.ink,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: color.paperRule, borderRadius: 999, backgroundColor: color.white, paddingHorizontal: 10, paddingVertical: 6 },
  chipTxt: { fontFamily: font.mono, fontSize: T.meta, color: color.slate },
});
