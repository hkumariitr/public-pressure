import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  useFonts,
  Archivo_400Regular, Archivo_600SemiBold, Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import { Hind_400Regular, Hind_600SemiBold, Hind_700Bold } from '@expo-google-fonts/hind';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';

import { api, type Lang } from './src/api/client';
import { useLive } from './src/hooks/useLive';
import { Header } from './src/components/Header';
import { FeedScreen } from './src/screens/FeedScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { color, font, type as T } from './src/brand/tokens';

const USER_ID = 'guest';
type Tab = 'feed' | 'search' | 'saved';

export default function App() {
  const [fontsLoaded] = useFonts({
    // mapped to the family names used in tokens.ts
    Archivo: Archivo_400Regular,
    Archivo_600SemiBold, Archivo_800ExtraBold,
    Hind: Hind_400Regular, Hind_600SemiBold, Hind_700Bold,
    JetBrainsMono: JetBrainsMono_400Regular, JetBrainsMono_500Medium,
  });

  const [config, setConfig] = useState<any | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [tab, setTab] = useState<Tab>('feed');

  const [cards, setCards] = useState<any[]>([]);
  const [offset, setOffset] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => { api.config().then(setConfig).catch(() => {}); }, []);

  const loadFeed = useCallback(async () => {
    const res = await api.topRefresh(lang, config?.feedPageSize || 10);
    setCards(res.cards); setOffset(res.newsOffset);
  }, [lang, config]);

  useEffect(() => { if (config) loadFeed(); }, [config, lang, loadFeed]);

  const onBreaking = useCallback((card: any) => {
    if (card.lang !== lang) return;
    setCards((prev) => (prev.some((c) => c.hashId === card.hashId) ? prev : [card, ...prev]));
  }, [lang]);
  const { connected } = useLive(config, lang, onBreaking);

  const onEnd = async () => {
    if (!offset) return;
    const res = await api.loadMore(lang, offset, config?.feedPageSize || 10);
    setCards((prev) => [...prev, ...res.cards]); setOffset(res.newsOffset);
  };
  const onRefresh = async () => { setRefreshing(true); await loadFeed(); setRefreshing(false); };

  const onBookmark = async (hashId: string) => {
    const { bookmarks: ids } = await api.toggleBookmark(USER_ID, hashId);
    setBookmarks(new Set(ids));
  };
  const onVote = (pollId: string, optionId: string) => { api.answerPoll(pollId, optionId).catch(() => {}); };

  useEffect(() => {
    if (tab !== 'saved') return;
    api.myBookmarks(USER_ID).then((r) => setSaved(r.cards)).catch(() => {});
  }, [tab, bookmarks]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: color.ink }} />;
  }

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={color.ink} />
      <Header lang={lang} onLang={setLang} liveConnected={connected} />

      <View style={{ flex: 1 }}>
        {tab === 'feed' && (
          <FeedScreen
            cards={cards} bookmarks={bookmarks} onBookmark={onBookmark} onVote={onVote}
            onEnd={onEnd} refreshing={refreshing} onRefresh={onRefresh}
          />
        )}
        {tab === 'search' && (
          <SearchScreen lang={lang} bookmarks={bookmarks} onBookmark={onBookmark} onVote={onVote} />
        )}
        {tab === 'saved' && (
          <SavedScreen cards={saved} bookmarks={bookmarks} onBookmark={onBookmark} onVote={onVote} />
        )}
      </View>

      <View style={s.tabbar}>
        {([['feed', 'Feed'], ['search', 'Search'], ['saved', 'Saved']] as [Tab, string][]).map(
          ([key, label]) => (
            <TouchableOpacity key={key} style={s.tab} onPress={() => setTab(key)}>
              <Text style={[s.tabTxt, tab === key && s.tabOn]}>{label}</Text>
            </TouchableOpacity>
          ),
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.paper },
  tabbar: {
    flexDirection: 'row', backgroundColor: color.white,
    borderTopWidth: 1, borderTopColor: color.paperRule,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabTxt: { fontFamily: font.mono, fontSize: T.sm, color: color.grey, letterSpacing: 0.5 },
  tabOn: { color: color.red, fontWeight: '500' },
});
