import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  Dimensions,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context';
import sampleImage from '../../../assets/Images/sample_room.jpg';
import ArrowRight from 'react-native-vector-icons/Feather';
import RupeeIcon from 'react-native-vector-icons/FontAwesome';
import ShieldIcon from 'react-native-vector-icons/Octicons';
import LocationIcon from 'react-native-vector-icons/Ionicons';
import ParkingIcon from 'react-native-vector-icons/FontAwesome6';
import WifiIcon from 'react-native-vector-icons/Feather';
import TvIcon from 'react-native-vector-icons/Feather';
import FurnishedIcon from 'react-native-vector-icons/Ionicons';
import GenderIcon from 'react-native-vector-icons/Feather';
import RulesIcon from 'react-native-vector-icons/MaterialIcons';
import DescriptionIcon from 'react-native-vector-icons/Feather';
import OwnerIcon from 'react-native-vector-icons/FontAwesome5';
import UserIcon from 'react-native-vector-icons/Feather';
import CallIcon from 'react-native-vector-icons/Ionicons';
import EmailIcon from 'react-native-vector-icons/Fontisto';
import API from '../../../api/api';
import EncryptedStorage from 'react-native-encrypted-storage';

const width = Dimensions.get('window').width;

const SingleRoomDetails = ({ navigation, route }) => {
  const [detailsFromBackend, setDetailsFromBackend] = useState({});
  const [imagesDataFromBackend, setImagesDataFromBackend] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { roomsDetails } = useContext(AuthContext);
  const { roomId } = route.params;
  console.log(roomId);
  console.log(roomsDetails);

  useEffect(() => {
    const singleRoomData = async () => {
      try {
        const userToken = await EncryptedStorage.getItem('userAccessToken');
        if (!userToken) {
          console.log('missing user Data');
          return;
        }
        const payload = {
          roomId: roomId,
        };

        const response = await API.post('/room/getSingleRoomData', payload, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response?.data);
        setDetailsFromBackend(response?.data?.roomDetails);
        setImagesDataFromBackend(response?.data?.roomImages);
      } catch (err) {
        console.log(err);
      }
    };
    singleRoomData();
  }, [roomId]);

  const handleBack = () => {
    navigation.navigate('Home', { screen: 'RoomList' });
  };

  const handleCall = number => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = emailId => {
    Linking.openURL(`mailto:${emailId}`);
  };

  const filteredFacilites = detailsFromBackend.roomFacilities
    ? detailsFromBackend.roomFacilities.split(',')
    : [];
  console.log(filteredFacilites);

  const handleScroll = event => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {' '}
      <View style={{ backgroundColor: '#fefeda', flex: 1, paddingBottom: 20 }}>
        <View style={{ position: 'relative' }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {imagesDataFromBackend.map((item, index) => (
              <Image
                key={item.imageId || index}
                source={{ uri: item.imagePath }}
                style={{ height: 300, width: width }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.dotsContainer}>
            {imagesDataFromBackend.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeIndex === index && styles.activeDot]}
              />
            ))}
          </View>
          <ArrowRight
            name="arrow-left"
            size={25}
            color="black"
            style={{
              position: 'absolute',
              top: 40,
              left: 15,
              backgroundColor: 'rgba(209, 209, 209, 0.86)',
              padding: 10,
              borderRadius: 15,
            }}
            onPress={() => handleBack()}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 18,
              width: '100%',
              padding: 12,
              backgroundColor: 'rgba(0,0,0,0.6)',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              {detailsFromBackend.Locality}, {detailsFromBackend.city}
            </Text>

            <Text
              style={{
                color: '#000',
                backgroundColor: '#FFB300',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                fontWeight: '600',
                fontSize: 15,
              }}
            >
              {detailsFromBackend.roomType}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 20 }}>
          <View
            style={{
              backgroundColor: '#FFB300',
              borderRadius: 20,
              marginHorizontal: 20,
              marginTop: 20,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#fffdf1',
                marginLeft: 8,
                borderRadius: 20,
                alignItems: 'center',
              }}
            >
              <View style={{ padding: 20, rowGap: 6 }}>
                <Text style={{ color: 'grey', fontSize: 16 }}>
                  Monthly Rent
                </Text>
                <Text style={{ fontWeight: 600, fontSize: 23 }}>
                  ₹ {detailsFromBackend.MonthlyRent} /-
                </Text>
              </View>
              <View>
                <RupeeIcon
                  name="rupee"
                  size={25}
                  color="#FFF"
                  style={{
                    backgroundColor: '#FFB300',
                    paddingHorizontal: 21,
                    paddingVertical: 15,
                    borderRadius: 15,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#FFB300',
              borderRadius: 20,
              marginHorizontal: 20,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#fffdf1',
                marginLeft: 8,
                borderRadius: 20,
                alignItems: 'center',
              }}
            >
              <View style={{ padding: 20, rowGap: 6 }}>
                <Text style={{ color: 'grey', fontSize: 16 }}>
                  Security Deposit
                </Text>
                <Text style={{ fontWeight: 600, fontSize: 23 }}>
                  ₹ {detailsFromBackend.SecurityDeposit} /-
                </Text>
              </View>
              <View>
                <ShieldIcon
                  name="shield-check"
                  size={25}
                  color="#FFF"
                  style={{
                    backgroundColor: '#FFB300',
                    paddingHorizontal: 16,
                    paddingVertical: 15,
                    borderRadius: 15,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FFB300',
            marginHorizontal: 20,
            marginBottom: 20,
            marginTop: 20,
            borderRadius: 20,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: '#fff',
              marginLeft: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
            }}
          >
            <Text style={{ fontWeight: 500, fontSize: 20, paddingTop: 8 }}>
              Facilities Available
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingBottom: 20,
                paddingTop: 10,
              }}
            >
              <View style={styles.eachFacility}>
                <WifiIcon
                  name="wifi"
                  size={25}
                  color={filteredFacilites.includes('Wifi') ? '#000' : 'grey'}
                  style={[
                    styles.eachFacilityIcon,
                    filteredFacilites.includes('Wifi')
                      ? { backgroundColor: '#FFB300' }
                      : { backgroundColor: '#fff' },
                  ]}
                />
                <Text
                  style={[
                    styles.facilityText,
                    filteredFacilites.includes('Wifi')
                      ? { color: '#000' }
                      : { color: 'grey' },
                  ]}
                >
                  Wifi
                </Text>
              </View>
              <View style={styles.eachFacility}>
                <ParkingIcon
                  name="car-side"
                  size={25}
                  color={
                    filteredFacilites.includes('Parking') ? '#000' : 'grey'
                  }
                  style={[
                    styles.eachFacilityIcon,
                    filteredFacilites.includes('Parking')
                      ? { backgroundColor: '#FFB300' }
                      : { backgroundColor: '#fff' },
                  ]}
                />
                <Text
                  style={[
                    styles.facilityText,
                    filteredFacilites.includes('Parking')
                      ? { color: 'black' }
                      : { color: 'grey' },
                  ]}
                >
                  Parking
                </Text>
              </View>
              <View style={styles.eachFacility}>
                <TvIcon
                  name="tv"
                  size={25}
                  color={filteredFacilites.includes('TV') ? '#000' : 'grey'}
                  style={[
                    styles.eachFacilityIcon,
                    filteredFacilites.includes('TV')
                      ? { backgroundColor: '#FFB300' }
                      : { backgroundColor: '#fff' },
                  ]}
                />
                <Text
                  style={[
                    styles.facilityText,
                    filteredFacilites.includes('TV')
                      ? { color: '#000' }
                      : { color: 'grey' },
                  ]}
                >
                  TV
                </Text>
              </View>
              <View style={styles.eachFacility}>
                <FurnishedIcon
                  name="bed-outline"
                  size={25}
                  color={
                    filteredFacilites.includes('Furnished') ? '#000' : 'grey'
                  }
                  style={[
                    styles.eachFacilityIcon,
                    filteredFacilites.includes('Furnished')
                      ? { backgroundColor: '#FFB300' }
                      : { backgroundColor: '#fff' },
                  ]}
                />
                <Text
                  style={[
                    styles.facilityText,
                    filteredFacilites.includes('Furnished')
                      ? { color: '#000' }
                      : { color: 'grey' },
                  ]}
                >
                  Furnished
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FFB300',
            borderRadius: 20,
            marginBottom: 20,
            marginHorizontal: 20,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              backgroundColor: '#fffdf1',
              marginLeft: 8,
              borderRadius: 20,
              alignItems: 'center',
            }}
          >
            <View>
              <GenderIcon
                name="users"
                size={25}
                color="#FFF"
                style={{
                  backgroundColor: '#FFB300',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  borderRadius: 15,
                  marginLeft: 20,
                }}
              />
            </View>
            <View style={{ padding: 20, rowGap: 6 }}>
              <Text style={{ color: 'grey', fontSize: 16 }}>
                Preferred Tenant
              </Text>
              <Text style={{ fontWeight: 600, fontSize: 20 }}>
                {detailsFromBackend.Preferred_tenants}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FFB300',
            borderRadius: 20,
            marginHorizontal: 20,
            marginBottom: 20,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              backgroundColor: '#fffdf1',
              marginLeft: 8,
              borderRadius: 20,
              alignItems: 'center',
            }}
          >
            <View>
              <LocationIcon
                name="location-outline"
                size={25}
                color="#FFF"
                style={{
                  backgroundColor: '#FFB300',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  borderRadius: 15,
                  marginLeft: 20,
                }}
              />
            </View>
            <View style={{ padding: 20, rowGap: 6 }}>
              <Text style={{ color: 'grey', fontSize: 16 }}>Room Location</Text>
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  width: 245,
                  textAlign: 'justify',
                  lineHeight: 20,
                }}
              >
                {detailsFromBackend.FullAddress}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FFB300',
            borderRadius: 20,
            marginHorizontal: 20,
            marginBottom: 20,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              backgroundColor: '#fffdf1',
              marginLeft: 8,
              borderRadius: 20,
              alignItems: 'center',
            }}
          >
            <View>
              <RulesIcon
                name="rule"
                size={29}
                color="#FFF"
                style={{
                  backgroundColor: '#FFB300',
                  paddingHorizontal: 13,
                  paddingVertical: 13,
                  borderRadius: 15,
                  marginLeft: 20,
                }}
              />
            </View>
            <View style={{ padding: 20, rowGap: 6 }}>
              <Text style={{ color: 'grey', fontSize: 16 }}>
                Rules / Requirement
              </Text>
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  width: 245,
                  textAlign: 'justify',
                  lineHeight: 20,
                }}
              >
                {detailsFromBackend.requirementsOrRules}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FFB300',
            borderRadius: 20,
            marginHorizontal: 20,
            marginBottom: 20,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              backgroundColor: '#fffdf1',
              marginLeft: 8,
              borderRadius: 20,
              alignItems: 'center',
            }}
          >
            <View>
              <DescriptionIcon
                name="file-text"
                size={25}
                color="#FFF"
                style={{
                  backgroundColor: '#FFB300',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  borderRadius: 15,
                  marginLeft: 20,
                }}
              />
            </View>
            <View style={{ padding: 20, rowGap: 6 }}>
              <Text style={{ color: 'grey', fontSize: 16 }}>
                Property Discription
              </Text>
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  width: 245,
                  textAlign: 'justify',
                  lineHeight: 20,
                }}
              >
                {detailsFromBackend.roomDescription}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FFB300',
            borderRadius: 20,
            marginHorizontal: 20,
            marginBottom: 20,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              gap: 5,
              backgroundColor: '#fffdf1',
              marginLeft: 8,
              paddingVertical: 15,
              borderRadius: 20,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <View>
                <OwnerIcon
                  name="house-user"
                  size={25}
                  color="#FFF"
                  style={{
                    backgroundColor: '#FFB300',
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderRadius: 15,
                    marginLeft: 20,
                  }}
                />
              </View>
              <View style={{ padding: 20, rowGap: 6 }}>
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  Owner Details
                </Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 16 }}>
              {/* name */}
              <View
                style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}
              >
                <UserIcon
                  name="user"
                  size={25}
                  color="#FFB300"
                  style={{
                    marginLeft: 20,
                  }}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ color: 'grey', fontSize: 16 }}>
                    Owner Name
                  </Text>
                  <Text style={{ fontWeight: 600, fontSize: 18 }}>
                    {detailsFromBackend.ownerName}
                  </Text>
                </View>
              </View>
              <View style={styles.divider}></View>
              {/* phone */}
              <View
                style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}
              >
                <CallIcon
                  name="call-outline"
                  size={25}
                  color="#FFB300"
                  style={{
                    marginLeft: 20,
                  }}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ color: 'grey', fontSize: 16 }}>
                    Owner Contact No
                  </Text>
                  <Text style={{ fontWeight: 600, fontSize: 18 }}>
                    {detailsFromBackend.ownerContact}
                  </Text>
                </View>
              </View>
              <View style={styles.divider}></View>
              {/* email */}
              <View
                style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}
              >
                <EmailIcon
                  name="email"
                  size={25}
                  color="#FFB300"
                  style={{
                    marginLeft: 20,
                  }}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ color: 'grey', fontSize: 16 }}>
                    Owner Email Id
                  </Text>
                  <Text style={{ fontWeight: 600, fontSize: 18 }}>
                    {detailsFromBackend.ownerEmail}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Pressable
            style={styles.Buttons}
            onPress={() => handleCall(detailsFromBackend.ownerContact)}
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
            onPress={() => handleEmail(detailsFromBackend.ownerEmail)}
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
    </ScrollView>
  );
};

export default SingleRoomDetails;

const styles = StyleSheet.create({
  eachFacility: {
    backgroundColor: '#fcf3c3',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 80,
    rowGap: 8,
  },
  eachFacilityIcon: {
    backgroundColor: '#FFf',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 15,
    //marginRight: 20,
  },
  facilityText: {
    color: 'grey',
  },
  divider: {
    height: 2,
    backgroundColor: '#ccc',
    width: '90%',
    marginVertical: 10,
  },
  Buttons: {
    backgroundColor: '#400000',
    padding: 15,
    width: '33%',
    borderRadius: 15,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 4,
    width: '100%',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#FFB300',
    width: 10,
    height: 10,
  },
});
