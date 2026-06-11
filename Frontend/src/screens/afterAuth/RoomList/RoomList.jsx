import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useState,
  version,
  useMemo,
  useContext,
} from 'react';
import FilterIcon from 'react-native-vector-icons/Feather';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import LocationIcon from 'react-native-vector-icons/Ionicons';
import ParkingIcon from 'react-native-vector-icons/FontAwesome6';
import WifiIcon from 'react-native-vector-icons/Feather';
import TvIcon from 'react-native-vector-icons/Feather';
import FurnishedIcon from 'react-native-vector-icons/Ionicons';
import PlusIcon from 'react-native-vector-icons/Feather';
import API from '../../../api/api.js';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../../context.jsx';
import { log } from '@react-native-firebase/app/dist/module/internal/web/firebaseFirestorePipelines';

const RoomList = ({ navigation }) => {
  //const [roomsDetails, setRoomsDetails] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [bySearchValue, setBySearchValue] = useState('');
  const [byRoomTypeFilter, setByRoomTypeFilter] = useState('All');
  const [byRoomPriceFilter, setByRoomPriceFilter] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { roomsDetails, setRoomsDetails, isLoading, setIsLoading } =
    useContext(AuthContext);

  const showToast = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const checkRoomCount = async () => {
    try {
      const userInfo = await EncryptedStorage.getItem('roomCount');
      const roomCount = userInfo ? JSON.parse(userInfo) : null;
      console.log('Room Count from storage:', roomCount);
      if (roomCount >= 3) {
        showToast("You've reached the 3-rooms limit.");
      } else {
        navigation.navigate('NewRoomDetails');
      }
    } catch (err) {
      console.log('Error checking room count:', err);
      showToast(
        'An error occurred while checking room count. Please try again.',
      );
    }
  };

  const getRooms = async (pageNumber = 1) => {
    try {
      //if (isLoading || !hasMore) return;

      //setIsLoading(true);
      const userAccessToken = await EncryptedStorage.getItem('userAccessToken');

      const payload = {
        search: debouncedSearch,
        searchByType: byRoomTypeFilter,
        searchByPrice: byRoomPriceFilter,
        page: pageNumber,
        limit: 10,
      };
      if (!userAccessToken) {
        console.log('missing token in encrypted storage');
        return;
      }
      const res = await API.post('/room/getAllRooms', payload, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const newData = res.data.rooms || [];

      if (pageNumber === 1) {
        setRooms(newData);
      } else {
        setRooms(prev => [...prev, ...newData]);
      }
      if (newData.length < 10) setHasMore(false);
      console.log(res.data);
      setRoomsDetails(res?.data?.rooms);
    } catch (err) {
      console.log('error :', err.response?.data || err.message);
      //setIsLoading(true);
    }
  };

  console.log(rooms);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    //getRooms(1);
    setRooms([]);
  }, [debouncedSearch, byRoomTypeFilter, byRoomPriceFilter]);

  useEffect(() => {
    getRooms(page);
  }, [page, debouncedSearch, byRoomTypeFilter, byRoomPriceFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(bySearchValue);
    }, 400); // delay (ms)

    return () => clearTimeout(timer); // cleanup
  }, [bySearchValue]);

  const handleFilter = () => {
    setOpenFilter(prev => !prev);
  };

  const handleViewDeatails = roomId => {
    if (roomId) {
      navigation.navigate('SingleRoomDetails', { roomId: roomId });
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.headingPart}>
        <View
          style={{
            flexDirection: 'row',
            //justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: 30,
              marginLeft: 8,
              marginRight: 8,
              fontWeight: 500,
            }}
          >
            Find Your Room
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: '10',
              marginLeft: 'auto',
            }}
          >
            <PlusIcon
              name="plus"
              size={26}
              color="#7a2c01"
              style={styles.filterIconStyle}
              onPress={() => checkRoomCount()}
            />
            <FilterIcon
              name="sliders"
              size={26}
              color="#7a2c01"
              style={styles.filterIconStyle}
              onPress={handleFilter}
            />
          </View>
        </View>
        <View style={styles.searchArea}>
          <SearchIcon
            name="search"
            size={22}
            style={{ marginTop: 10 }}
            color="#9E9E9E"
          />
          <TextInput
            placeholder="Search by area or location"
            placeholderTextColor="#9E9E9E"
            style={{ fontSize: 17 }}
            value={bySearchValue}
            onChangeText={text => setBySearchValue(text)}
          />
        </View>
        {openFilter && (
          <View
            style={{
              backgroundColor: '#fafad2',
              marginBottom: 10,
              borderRadius: 15,
              marginHorizontal: 10,
            }}
          >
            <View style={{ margin: 10, rowGap: 10 }}>
              <Text>Room type</Text>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 35,
                  rowGap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomTypeFilter.includes('All') && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomTypeFilter(prev => (prev === 'All' ? '' : 'All'))
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomTypeFilter.includes('All') && { color: '#FFF' },
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomTypeFilter === '1 BHK' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomTypeFilter(prev =>
                      prev === '1 BHK' ? '' : '1 BHK',
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomTypeFilter === '1 BHK' && { color: '#FFF' },
                    ]}
                  >
                    1BHK
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomTypeFilter === '2 BHK' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomTypeFilter(prev =>
                      prev === '2 BHK' ? '' : '2 BHK',
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomTypeFilter === '2 BHK' && { color: '#fff' },
                    ]}
                  >
                    2BHK
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomTypeFilter === '3 BHK' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomTypeFilter(prev =>
                      prev === '3 BHK' ? '' : '3 BHK',
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomTypeFilter === '3 BHK' && { color: '#fff' },
                    ]}
                  >
                    3BHK
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomTypeFilter === '1 RK' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomTypeFilter(prev => (prev === '1 RK' ? '' : '1 RK'))
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomTypeFilter === '1 RK' && { color: '#fff' },
                    ]}
                  >
                    1RK
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomTypeFilter === 'PG' && { backgroundColor: 'orange' },
                  ]}
                  onPress={() =>
                    setByRoomTypeFilter(prev => (prev === 'PG' ? '' : 'PG'))
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomTypeFilter === 'PG' && { color: '#fff' },
                    ]}
                  >
                    PG
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomTypeFilter === 'Hostel' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomTypeFilter(prev =>
                      prev === 'Hostel' ? '' : 'Hostel',
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomTypeFilter === 'Hostel' && { color: '#fff' },
                    ]}
                  >
                    Hostel
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.divider}></View>
            <View style={{ margin: 10, rowGap: 10 }}>
              <Text>Rent Ranges</Text>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 35,
                  rowGap: 5,
                  flexWrap: 'wrap',
                }}
              >
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomPriceFilter.includes('All') && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomPriceFilter(prev => (prev === 'All' ? '' : 'All'))
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomPriceFilter.includes('All') && { color: '#fff' },
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomPriceFilter === '10000' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomPriceFilter(prev =>
                      prev === '10000' ? '' : '10000',
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomPriceFilter === '10000' && { color: '#fff' },
                    ]}
                  >
                    {'<'}10000
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomPriceFilter === '10000-15000' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomPriceFilter(prev =>
                      prev === '10000-15000' ? '' : '10000-15000',
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomPriceFilter === '10000-15000' && { color: '#fff' },
                    ]}
                  >
                    10000 - 15000
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.eachFilterValue,
                    byRoomPriceFilter === '15000' && {
                      backgroundColor: 'orange',
                    },
                  ]}
                  onPress={() =>
                    setByRoomPriceFilter(prev =>
                      prev === '15000' ? '' : '15000',
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterValueText,
                      byRoomPriceFilter === '15000' && { color: '#fff' },
                    ]}
                  >
                    {'>'}15000
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
      <View style={styles.listArea}>
        <FlatList
          data={rooms}
          contentContainerStyle={{ paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.roomId.toString()}
          //style={styles.mainCard}
          renderItem={({ item }) => {
            const facilitesArray = item.roomFacilities
              ? item.roomFacilities.split(',').map(f => f.trim())
              : [];
            return (
              <>
                <View style={styles.mainCard}></View>
                <View style={styles.roomDetailsCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      height: 200,
                      width: '100%',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                    resizeMode="cover"
                  />
                  <View
                    style={{ flexDirection: 'column', gap: 6, marginLeft: 11 }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={styles.middleUpper}>
                        <LocationIcon
                          name="location-outline"
                          size={24}
                          color="#f7a10c"
                        />
                        <Text
                          style={{
                            fontSize: 19,
                            fontWeight: '500',
                            alignSelf: 'center',
                          }}
                        >
                          {item.Locality}
                        </Text>
                      </View>
                      <Text style={styles.middleLower}>{item.roomType}</Text>
                    </View>
                    <View style={styles.middleMiddle}>
                      <Text style={{ fontSize: 24 }}>₹ </Text>
                      <Text style={{ fontSize: 22, fontWeight: 600 }}>
                        {item.MonthlyRent}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 7,
                          color: '#9E9E9E',
                          fontWeight: 600,
                        }}
                      >
                        /month
                      </Text>
                    </View>
                  </View>
                  <View style={styles.facilities}>
                    <View style={styles.facilityItem}>
                      <WifiIcon
                        name="wifi"
                        size={18}
                        color={
                          facilitesArray.includes('Wifi') ? 'green' : '#9E9E9E'
                        }
                      />
                      <Text
                        style={[
                          styles.facilityText,
                          facilitesArray.includes('Wifi')
                            ? { color: 'green' }
                            : { color: '#9E9E9E' },
                        ]}
                      >
                        Wifi
                      </Text>
                    </View>

                    <View style={styles.facilityItem}>
                      <TvIcon
                        name="tv"
                        size={17}
                        color={
                          facilitesArray.includes('TV') ? 'green' : '#9E9E9E'
                        }
                      />
                      <Text
                        style={[
                          styles.facilityText,
                          facilitesArray.includes('TV')
                            ? { color: 'green' }
                            : { color: '#9E9E9E' },
                        ]}
                      >
                        TV
                      </Text>
                    </View>

                    <View style={styles.facilityItem}>
                      <ParkingIcon
                        name="car-side"
                        size={17}
                        color={
                          facilitesArray.includes('Parking')
                            ? 'green'
                            : '#9E9E9E'
                        }
                      />
                      <Text
                        style={[
                          styles.facilityText,
                          facilitesArray.includes('Parking')
                            ? { color: 'green' }
                            : { color: '#9E9E9E' },
                        ]}
                      >
                        Parking
                      </Text>
                    </View>

                    <View style={styles.facilityItem}>
                      <FurnishedIcon
                        name="bed-outline"
                        size={22}
                        color={
                          facilitesArray.includes('Furnished')
                            ? 'green'
                            : '#9E9E9E'
                        }
                      />
                      <Text
                        style={[
                          styles.facilityText,
                          facilitesArray.includes('Furnished')
                            ? { color: 'green' }
                            : { color: '#9E9E9E' },
                        ]}
                      >
                        Furnished
                      </Text>
                    </View>
                  </View>
                  <View style={styles.divider}></View>
                  <Pressable
                    style={styles.viewDetails}
                    onPress={() => handleViewDeatails(item.roomId)}
                  >
                    <Text style={{ fontSize: 15, fontWeight: 500 }}>
                      View More Details
                    </Text>
                  </Pressable>
                </View>
              </>
            );
          }}
          onEndReached={() => {
            if (hasMore && !isLoading) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <Text style={{ textAlign: 'center' }}>Loading...</Text>
            ) : null
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
};

export default RoomList;

const styles = StyleSheet.create({
  searchArea: {
    borderWidth: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  main: {
    flex: 1,
    backgroundColor: '#fafad2',
  },
  filterIconStyle: {
    transform: [{ rotate: '270deg' }],
    backgroundColor: '#fafad2',
    borderRadius: 30,
    padding: 9,
  },
  headingPart: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 15,
    flexDirection: 'column',
    gap: 15,
  },
  roomDetailsCard: {
    //height: '73%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: '85%',
    borderRadius: 20,
    flexDirection: 'column',
    gap: 15,
    marginBottom: 25,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
  middleUpper: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  middleMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  middleLower: {
    color: '#7a2c01',
    backgroundColor: '#fafad2',
    borderRadius: 40,
    fontWeight: 500,
    padding: 2,
    paddingVertical: 3,
    width: '20%',
    textAlign: 'center',
    fontSize: 15,
    marginRight: 8,
  },
  facilities: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  facilityText: {
    fontSize: 14,
  },
  viewDetails: {
    // marginTop: 20,
    marginBottom: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#facc15',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    //boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '90%',
    marginHorizontal: 1,
    alignSelf: 'center',
  },
  mainCard: {
    // flexDirection: 'column',
    // gap: 15,
    marginTop: 20,
  },
  eachFilterValue: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  filterValueText: {
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});
