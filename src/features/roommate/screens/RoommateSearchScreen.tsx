import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import TextTicker from 'react-native-text-ticker';

import { useRoommates } from '../hooks/useRoommates';
import { RoommateCard, RoommateType } from '../components/RoommateCard';
import { COLORS, TYPOGRAPHY, RADIUS } from '../../../theme/theme';
import { moderateScale, spacing, shadows } from '../../../utils/responsive';

const RoommateSearchScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Handle Search Debounce (400ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);

  // Integrate custom React Query hook
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useRoommates(debouncedSearch);

  // Flatten infinite query results
  const roommates = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.list);
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: RoommateType }) => (
    <RoommateCard item={item} />
  );

  return (
    <View style={styles.main}>
      {/* Header Panel */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Find Your Room Mates</Text>

        <View style={styles.searchArea}>
          <SearchIcon
            name="search"
            size={moderateScale(22)}
            color={COLORS.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search by area, location or profession"
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            value={searchValue}
            onChangeText={setSearchValue}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Marquee Banner */}
      <View style={styles.tickerContainer}>
        <TextTicker
          duration={10000}
          loop
          bounce={false}
          repeatSpacer={moderateScale(200)}
          marqueeDelay={1000}
        >
          <Text style={styles.tickerText}>
            Search Students / Working Professionals as Your Room Mate Here
          </Text>
        </TextTicker>
      </View>

      {/* List Feed Area */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching room mates...</Text>
        </View>
      ) : (
        <FlatList
          data={roommates}
          keyExtractor={item => item.user_id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshing={isRefetching}
          onRefresh={refetch}
          removeClippedSubviews={true}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No potential roommates found.</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default RoommateSearchScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingTop: moderateScale(45),
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    ...shadows.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.secondary,
    marginBottom: spacing.md,
  },
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.greyLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: spacing.sm,
    height: moderateScale(46),
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    padding: 0,
    color: COLORS.text,
  },
  tickerContainer: {
    backgroundColor: COLORS.black,
    paddingVertical: moderateScale(8),
    justifyContent: 'center',
  },
  tickerText: {
    ...TYPOGRAPHY.body,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.white,
  },
  listContent: {
    paddingBottom: moderateScale(100),
    paddingTop: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(50),
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  footerLoader: {
    marginVertical: spacing.md,
    alignSelf: 'center',
  },
});
