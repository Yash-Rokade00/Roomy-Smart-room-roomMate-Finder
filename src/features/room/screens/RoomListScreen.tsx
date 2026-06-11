import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import FilterIcon from 'react-native-vector-icons/Feather';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import PlusIcon from 'react-native-vector-icons/Feather';
import EncryptedStorage from 'react-native-encrypted-storage';

import { useRooms } from '../hooks/useRooms';
import { RoomCard, RoomType } from '../components/RoomCard';
import { COLORS, TYPOGRAPHY, RADIUS } from '../../../theme/theme';
import { moderateScale, spacing, shadows } from '../../../utils/responsive';

interface RoomListScreenProps {
  navigation: any;
}

const RoomListScreen: React.FC<RoomListScreenProps> = ({ navigation }) => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('All');
  const [roomPriceFilter, setRoomPriceFilter] = useState<string>('All');

  // Debounce search values (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Hook into our custom React Query hook
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useRooms(debouncedSearch, roomTypeFilter, roomPriceFilter);

  // Flatten page arrays
  const rooms = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.rooms);
  }, [data]);

  const showToast = (message: string) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  // Safe checks before navigations to upload room
  const handleAddNewRoom = async () => {
    try {
      const storedRoomCount = await EncryptedStorage.getItem('roomCount');
      const roomCount = storedRoomCount ? JSON.parse(storedRoomCount) : 0;
      console.log('Current room count:', roomCount);

      if (Number(roomCount) >= 3) {
        showToast("You've reached the limit of 3 uploaded rooms.");
      } else {
        navigation.navigate('NewRoomDetails');
      }
    } catch (err) {
      console.log('Error checking room count:', err);
      showToast('Error checking uploaded room counts.');
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const handleViewDetails = (roomId: number) => {
    navigation.navigate('SingleRoomDetails', { roomId });
  };

  const renderItem = ({ item }: { item: RoomType }) => (
    <RoomCard item={item} onViewDetails={handleViewDetails} />
  );

  return (
    <View style={styles.main}>
      {/* Search Header Panel */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Find Your Room</Text>
          <View style={styles.iconActions}>
            <Pressable
              style={styles.actionBtn}
              onPress={handleAddNewRoom}
              accessibilityRole="button"
              accessibilityLabel="Add new room"
            >
              <PlusIcon name="plus" size={moderateScale(24)} color={COLORS.secondaryLight} />
            </Pressable>
            <Pressable
              style={[styles.actionBtn, openFilter && styles.actionBtnActive]}
              onPress={() => setOpenFilter(prev => !prev)}
              accessibilityRole="button"
              accessibilityLabel="Filter listings"
            >
              <FilterIcon name="sliders" size={moderateScale(22)} color={openFilter ? COLORS.white : COLORS.secondaryLight} />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchBar}>
          <SearchIcon
            name="search"
            size={moderateScale(20)}
            color={COLORS.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search by area or location"
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            value={searchValue}
            onChangeText={setSearchValue}
            autoCapitalize="none"
          />
        </View>

        {/* Collapsible Filter Panel */}
        {openFilter && (
          <View style={styles.filterCard}>
            {/* Filter Section: Room Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Room Type</Text>
              <View style={styles.filterOptionsGrid}>
                {['All', '1 BHK', '2 BHK', '3 BHK', '1 RK', 'PG', 'Hostel'].map(type => (
                  <Pressable
                    key={type}
                    style={[
                      styles.filterOptionBtn,
                      roomTypeFilter === type && styles.filterOptionBtnActive,
                    ]}
                    onPress={() => setRoomTypeFilter(type)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        roomTypeFilter === type && styles.filterOptionTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inlineDivider} />

            {/* Filter Section: Rent Ranges */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Rent Ranges</Text>
              <View style={styles.filterOptionsGrid}>
                {[
                  { label: 'All', value: 'All' },
                  { label: '< 10000', value: '10000' },
                  { label: '10000 - 15000', value: '10000-15000' },
                  { label: '> 15000', value: '15000' },
                ].map(price => (
                  <Pressable
                    key={price.value}
                    style={[
                      styles.filterOptionBtn,
                      roomPriceFilter === price.value && styles.filterOptionBtnActive,
                    ]}
                    onPress={() => setRoomPriceFilter(price.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        roomPriceFilter === price.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {price.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Room Feed List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching properties...</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={item => item.roomId.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshing={isRefetching}
          onRefresh={refetch}
          removeClippedSubviews={true}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings matched your criteria.</Text>
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

export default RoomListScreen;

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
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.secondary,
  },
  iconActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    padding: moderateScale(8),
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.greyLight,
  },
  actionBtnActive: {
    backgroundColor: COLORS.primary,
  },
  searchBar: {
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
  filterCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  filterSection: {
    gap: spacing.sm,
  },
  filterLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.secondaryLight,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOptionBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(12),
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterOptionBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterOptionText: {
    ...TYPOGRAPHY.caption,
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: COLORS.text,
  },
  filterOptionTextActive: {
    color: COLORS.white,
  },
  inlineDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  listContent: {
    paddingBottom: moderateScale(100),
    paddingTop: spacing.md,
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
