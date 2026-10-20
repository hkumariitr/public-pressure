import { FlatList, Text, View } from 'react-native';
import { NewsCard } from '../components/NewsCard';
import { color, font, space, type as T } from '../brand/tokens';

export function SavedScreen({ cards, bookmarks, onBookmark, onVote }: any) {
  if (!cards.length) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <Text style={{ fontFamily: font.latin, fontWeight: '600', color: color.ink, marginBottom: 6 }}>
          Nothing saved
        </Text>
        <Text style={{ color: color.grey }}>Tap Save on any card to keep it here.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={cards}
      keyExtractor={(c) => c.hashId}
      contentContainerStyle={{ padding: 14, gap: space.gap }}
      renderItem={({ item }) => (
        <NewsCard card={item} bookmarked={bookmarks.has(item.hashId)} onBookmark={onBookmark} onVote={onVote} />
      )}
    />
  );
}
