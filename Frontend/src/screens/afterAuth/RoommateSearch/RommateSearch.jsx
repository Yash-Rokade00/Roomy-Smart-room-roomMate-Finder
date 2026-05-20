import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  Linking,
  FlatList,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useFocusEffect } from '@react-navigation/native';
import API from '../../../api/api';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import AgeIcon from 'react-native-vector-icons/Feather';
import GenderIcon from 'react-native-vector-icons/Feather';
import ProfessionIcon from 'react-native-vector-icons/Feather';
import LocalityIcon from 'react-native-vector-icons/Ionicons';
import CallIcon from 'react-native-vector-icons/Ionicons';
import EmailIcon from 'react-native-vector-icons/Fontisto';
import SampleImage from '../../../assets/Images/sample_room.jpg';
import TextTicker from 'react-native-text-ticker';

const RommateSearch = () => {
  const [roomRequiredStatus, setRoomRequiredStatus] = useState();
  const [deboundcedSearch, setDebouncedSearch] = useState('');
  const [bySearchValue, setBySearchValue] = useState('');
  const [roomMateListFromBackend, setRoomMateListFromBackend] = useState([]);
  const [roomMateList, setRoomMateList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(bySearchValue);
    }, 400); // delay (ms)

    return () => clearTimeout(timer); // cleanup
  }, [bySearchValue]);

  // const check = async () => {
  //   try {
  //     const value = await EncryptedStorage.getItem('roomRequiredStatus');

  //     const parsedValue = value ? JSON.parse(value) : false;
  //     setRoomRequiredStatus(parsedValue);

  //     console.log(parsedValue);
  //   } catch (err) {
  //     console.log('Error reading storage:', err);
  //   }
  // };
  // check();
  const getRoomMateList = async (pageNumber = 1, searchText = '') => {
    try {
      if (loading || !hasMore) return;

      setLoading(true);

      let userInfo = await EncryptedStorage.getItem('userInfo');
      let storedAccessToken = await EncryptedStorage.getItem('userAccessToken');

      const user = JSON.parse(userInfo);

      const payload = {
        name: user.name,
        email: user.email,
        roomRequiredStatus: 1,
        search: searchText,
        page: pageNumber, // ✅ pagination
        limit: 10, // ✅ 10 users per page
      };

      const res = await API.post('/roomMate/searchList', payload, {
        headers: {
          Authorization: `Bearer ${storedAccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const newData = res?.data?.List || [];

      if (pageNumber === 1) {
        setRoomMateList(newData); // fresh data
      } else {
        setRoomMateList(prev => [...prev, ...newData]); // append
      }

      // 🚨 if less than limit → no more data
      if (newData.length < 10) {
        setHasMore(false);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    getRoomMateList(1, deboundcedSearch);
  }, [deboundcedSearch]);

  useEffect(() => {
    if (page > 1) {
      getRoomMateList(page, deboundcedSearch);
    }
  }, [page]);

  // const filteredUsers = useMemo(() => {
  //   const searchText = deboundcedSearch.toLowerCase().trim();
  //   //console.log(searchText);

  //   return roomMateListFromBackend.filter(user => {
  //     if (searchText === '') return true;
  //     const oldLocality = user.address
  //       ? user.address.split(' ').map(f => f.trim('' && ','))
  //       : [];
  //     const FilteredCity = oldLocality[oldLocality.length - 1];
  //     const FilteredLocality =
  //       oldLocality[oldLocality.length - 2] === ','
  //         ? oldLocality[oldLocality.length - 3]
  //         : oldLocality[oldLocality.length - 2];
  //     const finalLocality = FilteredLocality + ' ' + FilteredCity;

  //     const locality = finalLocality?.toLowerCase() || '';
  //     const profession = user.profession?.toLowerCase() || '';

  //     return locality.includes(searchText) || profession.includes(searchText);
  //   });
  // }, [roomMateListFromBackend, deboundcedSearch]);

  const handleCall = number => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = emailId => {
    Linking.openURL(`mailto:${emailId}`);
  };

  return (
    <View style={styles.main}>
      <View style={styles.headingPart}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 30, marginLeft: 8, fontWeight: 500 }}>
            Find Your Room Mates
          </Text>
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
            onChangeText={text => setBySearchValue(text)}
          />
        </View>
      </View>
      <View style={{ backgroundColor: '#000', width: '100%' }}>
        <TextTicker
          duration={9000}
          loop
          bounceDelay={0}
          bounce={false}
          repeatSpacer={450}
          style={styles.slider}
          //marqueeDelay={1000}
        >
          <Text style={styles.slider}>
            Search Students / Working Professionals as Your Room Mate Here
          </Text>
        </TextTicker>
      </View>
      <View style={{}}>
        <FlatList
          data={roomMateList}
          keyExtractor={item => item.user_id.toString()}
          contentContainerStyle={{ paddingBottom: 220 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const locality = item.address
              ? item.address.split(' ').map(f => f.trim('' && ','))
              : [];
            //console.log(locality);
            const FilteredCity = locality[locality.length - 1];
            const FilteredLocality =
              locality[locality.length - 2] === ','
                ? locality[locality.length - 3]
                : locality[locality.length - 2];
            //console.log(FilteredLocality, FilteredCity);

            return (
              <>
                <View style={styles.mainCard}>
                  {/* section-1 */}
                  <View style={{ flexDirection: 'row', gap: 15 }}>
                    <Image
                      source={{ uri: item.profile_image_uri }}
                      style={styles.profileImage}
                    />
                    <View
                      style={{
                        alignContent: 'center',
                        marginTop: 4,
                        rowGap: 3,
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: 500 }}>
                        {item.userName}
                      </Text>
                      <Text style={{ marginLeft: 4 }}>
                        User ID - {item.user_id}
                      </Text>
                    </View>
                  </View>
                  {/* section -2 */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 15,
                    }}
                  >
                    <View
                      style={[
                        styles.eachDetail,
                        {
                          backgroundColor: '#B2EBF2',
                        },
                      ]}
                    >
                      <AgeIcon
                        name="calendar"
                        size={20}
                        color="#1E88E5"
                        style={{ alignSelf: 'center', marginLeft: 8 }}
                      />
                      <View
                        style={{
                          alignContent: 'center',
                          marginTop: 5,
                          rowGap: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#71717A  ',
                            fontWeight: '300',
                          }}
                        >
                          Age
                        </Text>
                        <Text
                          style={{
                            marginLeft: 1,
                            fontWeight: 500,
                            fontSize: 17,
                          }}
                        >
                          {item.age}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.eachDetail,
                        {
                          backgroundColor: '#F8BBD0',
                        },
                      ]}
                    >
                      <GenderIcon
                        name="users"
                        size={20}
                        color="#C2185B"
                        style={{ alignSelf: 'center', marginLeft: 8 }}
                      />
                      <View
                        style={{
                          alignContent: 'center',
                          marginTop: 5,
                          rowGap: 1,
                        }}
                      >
                        <Text style={{ fontSize: 14, color: '#71717A ' }}>
                          Gender
                        </Text>
                        <Text
                          style={{
                            marginLeft: 1,
                            fontWeight: 500,
                            fontSize: 17,
                          }}
                        >
                          {item.gender}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* section-3 */}
                  <View style={{ flexDirection: 'row', marginTop: 22 }}>
                    <View
                      style={[
                        styles.eachDetail,
                        {
                          backgroundColor: '#FFECB3',
                          width: '100%',
                        },
                      ]}
                    >
                      <ProfessionIcon
                        name="briefcase"
                        size={20}
                        color="#B45309"
                        style={{ alignSelf: 'center', marginLeft: 8 }}
                      />
                      <View
                        style={{
                          alignContent: 'center',
                          marginTop: 5,
                          rowGap: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#71717A  ',
                            fontWeight: '300',
                          }}
                        >
                          Profession
                        </Text>
                        <Text
                          style={{
                            marginLeft: 1,
                            fontWeight: 500,
                            fontSize: 17,
                          }}
                        >
                          {item.profession}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* section-4 */}
                  <View style={{ flexDirection: 'row', marginTop: 22 }}>
                    <View
                      style={[
                        styles.eachDetail,
                        {
                          backgroundColor: '#D1FAE5',
                          width: '100%',
                        },
                      ]}
                    >
                      <LocalityIcon
                        name="location-outline"
                        size={20}
                        color="#047857"
                        solid
                        style={{ alignSelf: 'center', marginLeft: 8 }}
                      />
                      <View
                        style={{
                          alignContent: 'center',
                          marginTop: 5,
                          rowGap: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#71717A  ',
                            fontWeight: '300',
                          }}
                        >
                          Locality
                        </Text>
                        <Text
                          style={{
                            marginLeft: 1,
                            fontWeight: 500,
                            fontSize: 17,
                          }}
                        >
                          {FilteredLocality}, {FilteredCity}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* section-5 */}
                  <View>
                    <Text style={styles.professionText}>
                      I am Engineering student at {item.profession_Description}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Pressable
                        style={styles.Buttons}
                        onPress={() => handleCall(item.contactNo)}
                      >
                        <CallIcon name="call-outline" size={24} color="#fff" />
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: 500,
                            color: '#fff',
                          }}
                        >
                          Call
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.Buttons}
                        onPress={() => handleEmail(item.email)}
                      >
                        <EmailIcon name="email" size={24} color="#fff" />
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: 500,
                            color: '#fff',
                          }}
                        >
                          Email
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </>
            );
          }}
          onEndReached={() => {
            if (hasMore && !loading) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <Text style={{ textAlign: 'center' }}>Loading...</Text>
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default RommateSearch;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  searchArea: {
    borderWidth: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  headingPart: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 15,
    flexDirection: 'column',
    gap: 15,
  },
  mainCard: {
    width: '85%',
    //height: '91%',
    backgroundColor: '#FFf',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 20,
    flexDirection: 'column',
    //gap: 15,
    marginBottom: 25,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  eachDetail: {
    //height: '110%',
    paddingVertical: 5,
    width: '44%',
    flexDirection: 'row',
    gap: 13,
    borderRadius: 15,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
  Buttons: {
    backgroundColor: '#400000',
    padding: 15,
    height: '95%',
    width: '44%',
    borderRadius: 15,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  professionText: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 19,
  },
  slider: {
    fontSize: 16,
    paddingVertical: 8,
    //backgroundColor: '#000',
    color: '#FFF',
  },
});
