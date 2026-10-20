import { FlatList, RefreshControl, Text, View } from 'react-native';
import { NewsCard } from '../components/NewsCard';
import { color, font, space, type as T } from '../brand/tokens';

export function FeedScreen({
  cards, bookmarks, onBookmark, onVote, onEnd, refreshing, onRefresh,
}: any) {
  return (
    <FlatList
      data={cards}
      keyExtractor={(c) => c.hashId}
      contentContainerStyle={{ padding: 14, gap: space.gap }}
      onEndReached={onEnd}
      onEndReachedThreshold={0.4}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color.red} />}
      renderItem={({ item }) => (
        <NewsCard
          card={item}
          bookmarked={bookmarks.has(item.hashId)}
          onBookmark={onBookmark}
          onVote={onVote}
        />
      )}
      ListFooterComponent={
        cards.length ? (
          <Text style={{ fontFamily: font.mono, fontSize: T.meta, color: color.grey, textAlign: 'center', padding: 14 }}>
            documents, not noise
          </Text>
        ) : null
      }
    />
  );
}
