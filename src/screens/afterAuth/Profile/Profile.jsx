import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context';
import ProfileBackground from '../../../assets/Images/profileBack.png';
import EncryptedStorage from 'react-native-encrypted-storage';
import API from '../../../api/api';
import EditIcon from 'react-native-vector-icons/Feather';
import LogOutIcon from 'react-native-vector-icons/FontAwesome6';
import AddRoomIcon from 'react-native-vector-icons/Ionicons';
import DetailsIcon from 'react-native-vector-icons/Octicons';
import HomeIcone from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';

const screenWeight = Dimensions.get('window').width;
const LOCK_DURATION_HOURS = 6; // 6 hours lock

const Profile = ({ navigation }) => {
  const [userDetailsFromBackend, setUserDetailsFromBackend] = useState({});
  const [isRoomRequired, setIsRoomRequired] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const [remainingTimeToUnlock, setRemainingTimeToUnlock] = useState('');
  const {
    logOut,
    setTokenError,
    tokenError,
    setRoomCount,
    roomCount,
    setIsLoggedIn,
  } = useContext(AuthContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userToken = await EncryptedStorage.getItem('userAccessToken');
        const userInfo = await EncryptedStorage.getItem('userInfo');
        //console.log(userInfo);
        if (!userToken || !userInfo) {
          console.log('missing user Data');
          return;
        }

        const user = JSON.parse(userInfo);
        //console.log(userToken);
        //console.log(user);
        const payload = {
          name: user?.name,
          email: user?.email,
        };
        //console.log(payload);

        const res = await API.post('/user/getUser', payload, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        setUserDetailsFromBackend(res?.data?.user);
      } catch (err) {
        console.log('ERROR:', err.response?.data || err.message);
        setTokenError(err.response?.data);
        setIsLoggedIn(false);
        navigation.navigate('login');
      }
    };
    getUser();
  }, []);
  //console.log(userDetailsFromBackend);
  //console.log(tokenError);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lockUntil) return;

      const now = Date.now();
      const remaining = lockUntil - now;

      if (remaining <= 0) {
        setRemainingTimeToUnlock('');
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      setRemainingTimeToUnlock(`Locked for ${hours}h ${minutes}m`);
    }, 1000); // every second

    return () => clearInterval(interval);
  }, [lockUntil]);

  const handleToggle = async () => {
    const now = Date.now();

    // Check if currently locked
    if (lockUntil && now < lockUntil) {
      // Still locked, do nothing
      return;
    }

    if (!isRoomRequired) {
      // Turn ON and lock for 6 hours
      const lockTime = now + LOCK_DURATION_HOURS * 60 * 60 * 1000;
      setIsRoomRequired(true);
      setLockUntil(lockTime);
      await EncryptedStorage.setItem(
        'roomRequireLockUntil',
        lockTime.toString(),
      );
      await EncryptedStorage.setItem(
        'roomRequiredStatus',
        JSON.stringify(true),
      );
      const userInfo = await EncryptedStorage.getItem('userInfo');
      const userToken = await EncryptedStorage.getItem('userAccessToken');
      //console.log(userInfo);
      if (!userToken || !userInfo) {
        console.log('missing user Data');
        return;
      }
      const user = JSON.parse(userInfo);
      const payload = {
        name: user?.name,
        email: user?.email,
        roomRequiredStatus: !isRoomRequired,
      };
      const res = await API.post('/profile/RRStatus', payload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      //console.log(res);
    } else {
      // Can turn OFF (lock expired)
      setIsRoomRequired(false);
      setLockUntil(null);
      await EncryptedStorage.removeItem('roomRequireLockUntil');
      await EncryptedStorage.setItem(
        'roomRequiredStatus',
        JSON.stringify(false),
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      try {
        const specialforRoomCount = async () => {
          const roomCountNo = await EncryptedStorage.getItem('roomCount');
          setRoomCount(roomCountNo ? parseInt(roomCountNo) : 0);
        };
        specialforRoomCount();

        // Check if there's a saved lock timestamp
        const checkTike = async () => {
          try {
            const savedLockUntil = await EncryptedStorage.getItem(
              'roomRequireLockUntil',
            );
            const savedStatus = await EncryptedStorage.getItem(
              'roomRequiredStatus',
            );

            const now = Date.now();

            // ✅ Restore status first
            if (savedStatus) {
              setIsRoomRequired(JSON.parse(savedStatus));
            }

            if (savedLockUntil) {
              const lockTime = parseInt(savedLockUntil);

              if (now < lockTime) {
                // ✅ Still locked
                setIsRoomRequired(true); // 🔥 ensure sync
                setLockUntil(lockTime);
              } else {
                // ❌ Lock expired
                setLockUntil(null);
                setIsRoomRequired(false);

                // ✅ Clear storage
                await EncryptedStorage.removeItem('roomRequireLockUntil');
                await EncryptedStorage.setItem(
                  'roomRequiredStatus',
                  JSON.stringify(false),
                );

                // ✅ Sync with backend (correct value = false)
                const userInfo = await EncryptedStorage.getItem('userInfo');
                const userToken = await EncryptedStorage.getItem(
                  'userAccessToken',
                );

                if (!userToken || !userInfo) {
                  console.log('missing user Data');
                  return;
                }

                const user = JSON.parse(userInfo);

                const payload = {
                  name: user?.name,
                  email: user?.email,
                  roomRequiredStatus: false, // 🔥 FIXED (was wrong before)
                };

                const res = await API.post('/profile/RRStatus', payload, {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                  },
                });

                console.log('Updated RRStatus after expiry:', res.data);
              }
            }
          } catch (err) {
            console.log('Error in checkTike:', err);
          }
        };
        checkTike();
      } catch (err) {
        console.log('while getting room Count', err);
      }
    }, []),
  );

  const isLocked = lockUntil && Date.now() < lockUntil;

  const handleLogOut = async () => {
    await logOut();
  };
  return (
    <ScrollView
      style={styles.main}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={ProfileBackground}
        style={styles.profileBackground}
        imageStyle={styles.overlay}
      ></ImageBackground>
      <View style={styles.upperPart}>
        <View style={styles.profileImage}>
          {userDetailsFromBackend?.profile_image_uri ? (
            <Image
              source={{ uri: userDetailsFromBackend.profile_image_uri }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <Text>Loading Image...</Text>
          )}
        </View>
        <Text style={{ fontSize: 20, color: '#451901', fontWeight: 500 }}>
          {userDetailsFromBackend?.userName}
        </Text>
        <Text style={{ fontSize: 14, color: '#451901', fontWeight: 400 }}>
          {userDetailsFromBackend?.email}
        </Text>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.infoBoxLower}>
          <View style={styles.specificInfoArea}>
            <Text style={[styles.infoText, { fontWeight: 600 }]}>
              Registered Id :
            </Text>
            <Text style={styles.infoText}>
              ROOMY26
              {userDetailsFromBackend?.user_id}
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.specificInfoArea}>
            <Text style={[styles.infoText, { fontWeight: 600 }]}>Age :</Text>
            <Text style={styles.infoText}>{userDetailsFromBackend?.age}</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.specificInfoArea}>
            <Text style={[styles.infoText, { fontWeight: 600 }]}>Gender :</Text>
            <Text style={styles.infoText}>
              {userDetailsFromBackend?.gender}
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.specificInfoArea}>
            <Text style={[styles.infoText, { fontWeight: 600 }]}>
              Contact :
            </Text>
            <Text style={styles.infoText}>
              +91 {userDetailsFromBackend?.contactNo}
            </Text>
          </View>
          <View style={styles.divider}></View>

          <View style={styles.specificInfoArea}>
            <Text style={[styles.infoText, { fontWeight: 600 }]}>
              Profession :
            </Text>
            <Text style={styles.infoText}>
              {userDetailsFromBackend?.profession}
            </Text>
          </View>

          <View style={styles.divider}></View>
          <View style={styles.specificInfoAreaBigText}>
            <Text style={[styles.infoText, { fontWeight: 600 }]}>
              Address :
            </Text>
            <Text style={[styles.infoText, { lineHeight: 22 }]}>
              {userDetailsFromBackend?.address}
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.specificInfoAreaBigText}>
            <Text style={[styles.infoText, { fontWeight: 600 }]}>
              Description :
            </Text>
            <Text style={[styles.infoText, { lineHeight: 22 }]}>
              {userDetailsFromBackend?.profession_Description}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.infoEnding}>
        <Pressable
          style={[
            styles.profileBtn,
            { backgroundColor: '#fff', borderColor: '#e67b08', borderWidth: 2 },
          ]}
        >
          <EditIcon name="edit" size={20} color="#000" />
          <Text style={{ color: '#000', fontWeight: 600, fontSize: 15 }}>
            Edit Your Profile
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.profileBtn,
            { backgroundColor: '#fff', borderColor: 'red', borderWidth: 1 },
          ]}
          onPress={() => handleLogOut()}
        >
          <LogOutIcon name="arrow-right-from-bracket" size={20} color="red" />
          <Text style={{ color: 'red', fontWeight: 600, fontSize: 15 }}>
            Log Out
          </Text>
        </Pressable>
        {roomCount >= 1 ? (
          <Pressable
            style={[
              styles.profileBtn,
              {
                backgroundColor: '#fff',
                borderColor: '#66ff34',
                borderWidth: 2,
              },
            ]}
            onPress={() => navigation.navigate('UploadedRoom')}
          >
            <HomeIcone name="home" size={22} color="black" />
            <View style={{ flexDirection: 'column', gap: 5 }}>
              <Text style={{ color: 'black', fontWeight: 600, fontSize: 15 }}>
                View Uploaded Rooms
              </Text>
              <Text style={{ fontSize: 12, paddingLeft: 2 }}>
                Room Count :- {EncryptedStorage.getItem('roomCount')}
              </Text>
            </View>
          </Pressable>
        ) : null}
        <Pressable
          style={[
            styles.profileBtn,
            {
              backgroundColor: '#fafad2',
              borderWidth: 2,
              borderColor: '#FFDF00',
              justifyContent: 'space-between',
            },
          ]}
        >
          <View
            style={{ flexDirection: 'column', alignItems: 'center', gap: 10 }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <DetailsIcon name="note" size={22} color="#3e0e0efa" />

              <Text
                style={{ color: '#3e0e0efa', fontWeight: 600, fontSize: 15 }}
              >
                Room Require Status
              </Text>
            </View>
            {isRoomRequired === true ? (
              <Text
                style={{ fontSize: 13, color: 'grey', alignSelf: 'center' }}
              >
                {remainingTimeToUnlock}
              </Text>
            ) : null}
          </View>
          {/* Remaining Time */}

          <CheckBox
            value={isRoomRequired}
            onValueChange={handleToggle}
            disabled={isLocked} // 🔥 disables when locked
          />
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  // main: {
  //   flex: 1,
  //   alignItems: 'center',
  // },
  profileBackground: {
    position: 'absolute',
    flex: 1,
    resizeMode: 'cover',
    // height: screenHeight,
    //width: screenWeight,
    height: '60%',
    width: screenWeight,
    overflow: 'hidden',
  },
  overlay: {
    paddingHorizontal: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 6,
  },
  infoBox: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    height: 'auto',
    width: '89%',
    marginTop: 28,
    paddingTop: 5,
    paddingBottom: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 6,
  },
  upperPart: {
    marginTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    //backgroundColor: '#000',
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 15,
  },
  infoBoxUpper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 26,
  },
  profileBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
  },
  infoBoxLower: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 13,
    marginHorizontal: 20,
  },
  infoText: {
    fontSize: 17,
  },
  specificInfoArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specificInfoAreaBigText: {
    flexDirection: 'column',
    //justifyContent: 'space-between',
  },
  infoEnding: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 22,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
});
