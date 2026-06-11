import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ProfileBackground from '../../../assets/Images/NewRoomBack.jpg';
import CameraIcon from 'react-native-vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';
import WifiIcon from 'react-native-vector-icons/Feather';
import TvIcon from 'react-native-vector-icons/Feather';
import ParkingIcon from 'react-native-vector-icons/FontAwesome6';
import FurnishedIcon from 'react-native-vector-icons/Feather';
import ArrowRight from 'react-native-vector-icons/Feather';
import CrossIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import API from '../../../api/api';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from '../../../../context';

const screenWidth = Dimensions.get('window').width;
const roomType = [
  { label: '1 BHK', value: '1 BHK' },
  { label: '2 BHK', value: '2 BHK' },
  { label: '3 BHK', value: '3 BHK' },
  { label: '1 RK', value: '1 RK' },
  { label: 'Single Sharing', value: 'Single Sharing' },
  { label: 'Double Sharing', value: 'Double Sharing' },
  { label: 'Triple Sharing', value: 'Triple Sharing' },
];

const tenantPreferences = [
  { label: 'Any', value: 'Any' },
  { label: 'Male Only', value: 'Male Only' },
  { label: 'Female Only', value: 'Female Only' },
  { label: 'Family Only', value: 'Family Only' },
  { label: 'Working Professionals Only', value: 'Working Professionals Only' },
  { label: 'Boys Students Only', value: 'Boys Students Only' },
  { label: 'Girls Students Only', value: 'Girls Students Only' },
];

const NewRoomDetails = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    //images: [],
    roomId: '',
    OwnerName: '',
    OwnerContact: '',
    OwnerEmail: '',
    MonthlyRent: '',
    SecurityDeposit: '',
    RoomType: '',
    city: '',
    Locality: '',
    fullAddress: '',
    Preferred_tenants: '',
    requirement: '',
    roomDescription: '',
  });
  const [userToken, setUserToken] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      const userInfo = await EncryptedStorage.getItem('userInfo');
      const userToken = await EncryptedStorage.getItem('userAccessToken');
      const user = JSON.parse(userInfo);
      console.log(userToken);
      setUserToken(userToken);
      setUserName(user?.name);
      setUserEmail(user?.email);
    };
    fetchToken();
  }, []);

  const { isLoading, setIsLoading } = useContext(AuthContext);

  const backToProfile = () => {
    navigation.navigate('Home', {
      screen: 'RoomList',
    });
  };

  const showToast = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const selectFiles = async () => {
    const option = { mediaType: 'photo', selectionLimit: 6 };
    await launchImageLibrary(option, async res => {
      if (res.didCancel) {
        showToast('No image selected');
      } else {
        console.log(res);
        if (res.assets) {
          const selectedImages = res.assets.map((img, index) => ({
            uri: img.uri,
            type: img.type,
            name: img.fileName || `image_${index}.jpg`,
          }));
          console.log(selectedImages);

          // setFormData(prev => ({
          //   ...prev,
          //   images: [...prev.images, ...selectedImages],
          // }));

          // setFormData(prev => ({
          //   ...prev,
          //   userName: userName,
          //   images: [...prev.images, ...selectedImages],
          // }));
          // selectedImages.forEach((img, index) => {
          //   formData.append('images', {
          //     uri: img.uri,
          //     type: img.type,
          //     name: img.name || `image_${index}.jpg`,
          //   });
          // });
          setImages(prev => [...prev, ...selectedImages]);
        }
      }
    });
  };

  //console.log(formData);

  const handle = async () => {
    setIsLoading(true);
    // const data = new FormData();
    // formData.images.forEach(img => {
    //   data.append('image', img);
    //   data.append('userWhoAddRoom', formData?.userName);
    // });

    const data = new FormData();

    // append text fields
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    data.append('userName', userName);
    data.append('userEmail', userEmail);

    data.append('Facilities', facilities.join(','));

    // append images correctly
    images.forEach((img, index) => {
      data.append('images', {
        uri: img.uri,
        type: img.type,
        name: img.name,
      });
    });
    // const payload = formData;
    console.log(data);

    try {
      const res = await API.post('/room/uploadRoomDetails', data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      if (res?.data?.success === true) {
        navigation.navigate('Profile');
        const userInfo = await EncryptedStorage.getItem('userInfo');
        const user = userInfo ? JSON.parse(userInfo) : {};
        user.roomCount = user.roomCount + 1;
        await EncryptedStorage.setItem('userInfo', JSON.stringify(user));
        showToast('Room posted successfully');
      }
      setIsLoading(false);
    } catch (err) {
      console.log('error occured while posting room', err);
      showToast('Error occurred while posting room');
    }
  };

  const removeImage = index => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const toggleFacility = item => {
    setFacilities(
      prev =>
        prev.includes(item)
          ? prev.filter(f => f !== item) // remove (unselect)
          : [...prev, item], // add (select)
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <ImageBackground
        source={ProfileBackground}
        style={styles.NewRoomDetailsBackground}
        imageStyle={styles.yellowImage}
      ></ImageBackground>
      <ArrowRight
        name="arrow-left"
        size={25}
        color="black"
        style={styles.backArrow}
        onPress={backToProfile}
      />
      <Text style={styles.title}>Add New Room Details</Text>

      <View style={styles.allFieldsContainer}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          {/* roomId and image upload area */}
          <View style={{ marginLeft: 20, marginRight: 20 }}>
            <View style={styles.ImageUpper}>
              <Text style={{ fontSize: 18 }}>Room Images *</Text>
              <FlatList
                data={[...images, { isAddButton: true }]}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  if (item.isAddButton) {
                    return (
                      images.length < 6 && (
                        <Pressable
                          style={styles.imageUploadSection}
                          onPress={selectFiles}
                        >
                          <CameraIcon name="camera" size={22} color="black" />
                          <Text style={{ fontSize: 12, marginTop: 8 }}>
                            Add Photos
                          </Text>
                        </Pressable>
                      )
                    );
                  }

                  return (
                    <View style={styles.imageBox}>
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.image}
                        resizeMode="cover"
                      />

                      <Pressable
                        style={styles.removeBtn}
                        onPress={() => removeImage(index)}
                      >
                        <CrossIcon name="cancel" size={20} color="red" />
                      </Pressable>
                    </View>
                  );
                }}
              />

              <Text
                style={{
                  fontSize: 11,
                  color: 'grey',
                  fontWeight: 400,
                  marginLeft: 4,
                }}
              >
                upload up to 6 images
              </Text>
            </View>
            <View style={styles.inputArea}>
              <Text style={styles.inputTitle}>Room Id *</Text>
              <TextInput
                placeholder="enter 5 Digits only eg. 25421"
                maxLength={5}
                style={styles.inputFields}
                value={formData.roomId}
                onChangeText={text =>
                  setFormData({ ...formData, roomId: text })
                }
              />
            </View>
          </View>
          <View style={styles.divider}></View>
          {/* Owner Details */}
          <View style={styles.OwnerDetails}>
            <Text style={{ fontSize: 20, marginBottom: 8 }}>Owner Details</Text>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Owner Name *</Text>
              <TextInput
                placeholder="Enter Owner name"
                style={styles.inputFields}
                value={formData.OwnerName}
                onChangeText={text =>
                  setFormData({ ...formData, OwnerName: text })
                }
              />
            </View>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Owner Contact No *</Text>
              <TextInput
                placeholder="Enter contact number"
                style={styles.inputFields}
                maxLength={10}
                keyboardType="numeric"
                value={formData.OwnerContact}
                onChangeText={text =>
                  setFormData({ ...formData, OwnerContact: text })
                }
              />
            </View>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Owner Email ID *</Text>
              <TextInput
                placeholder="Enter Owner Email Id"
                style={styles.inputFields}
                value={formData.OwnerEmail}
                onChangeText={text =>
                  setFormData({ ...formData, OwnerEmail: text })
                }
              />
            </View>
          </View>
          <View style={styles.divider}></View>
          {/* room rent & type details */}
          <View style={styles.OwnerDetails}>
            <Text style={{ fontSize: 20, marginBottom: 8 }}>Room Details</Text>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Monthly Rent (₹) *</Text>
              <TextInput
                placeholder="eg. 8000"
                style={styles.inputFields}
                value={formData.MonthlyRent}
                onChangeText={text =>
                  setFormData({ ...formData, MonthlyRent: text })
                }
              />
            </View>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Security Deposit (₹) *</Text>
              <TextInput
                placeholder="eg. 20000"
                style={styles.inputFields}
                value={formData.SecurityDeposit}
                onChangeText={text =>
                  setFormData({ ...formData, SecurityDeposit: text })
                }
              />
            </View>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Room Type</Text>
              <Dropdown
                data={roomType}
                style={styles.dropDown}
                labelField="label"
                valueField="value"
                value={formData.RoomType}
                onChange={text =>
                  setFormData({ ...formData, RoomType: text.value })
                }
              />
            </View>
          </View>
          <View style={styles.divider}></View>
          {/* room Address Details */}
          <View style={styles.OwnerDetails}>
            <Text style={{ fontSize: 20, marginBottom: 8 }}>
              Location Details
            </Text>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>City</Text>
              <TextInput
                placeholder="eg. Nashik"
                style={styles.inputFields}
                value={formData.city}
                onChangeText={text => setFormData({ ...formData, city: text })}
              />
            </View>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Locality</Text>
              <TextInput
                placeholder="eg. Gangapur Road"
                style={styles.inputFields}
                value={formData.Locality}
                onChangeText={text =>
                  setFormData({ ...formData, Locality: text })
                }
              />
            </View>
            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Full Address</Text>
              <TextInput
                multiline={true}
                placeholder="Enter Owner name"
                style={[
                  styles.inputFields,
                  { height: 100, textAlignVertical: 'top' },
                ]}
                value={formData.fullAddress}
                onChangeText={text =>
                  setFormData({ ...formData, fullAddress: text })
                }
              />
            </View>
          </View>
          <View style={styles.divider}></View>
          {/* Tenant Preferences */}
          <View style={styles.OwnerDetails}>
            <Text style={{ fontSize: 20, marginBottom: 8 }}>
              Resident Details
            </Text>

            <View style={styles.OwnerFields}>
              <Text style={styles.inputTitle}>Prefered Resident</Text>
              <Dropdown
                data={tenantPreferences}
                style={styles.dropDown}
                labelField="label"
                valueField="value"
                value={formData.Preferred_tenants}
                onChange={text =>
                  setFormData({ ...formData, Preferred_tenants: text.value })
                }
              />
              <View style={styles.OwnerFields}>
                <Text style={styles.inputTitle}>Requirements / Rules</Text>
                <TextInput
                  multiline={true}
                  placeholder="e.g., No pets, No smoking, Cooking allowed, etc."
                  style={[
                    styles.inputFields,
                    { height: 100, textAlignVertical: 'top' },
                  ]}
                  value={formData.requirement}
                  onChangeText={text =>
                    setFormData({ ...formData, requirement: text })
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.divider}></View>
          {/* room facilities */}
          <View style={styles.OwnerDetails}>
            <Text style={styles.inputTitle}>Room Facilities</Text>
            <View style={styles.twoFacilites}>
              <Pressable
                style={[
                  styles.eachFacility,
                  facilities.includes('Wifi') && styles.pressedBox,
                ]}
                onPress={() => toggleFacility('Wifi')}
              >
                <WifiIcon name="wifi" size={20} color="black" />
                <Text>WiFi</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.eachFacility,
                  facilities.includes('TV') && styles.pressedBox,
                ]}
                onPress={() => toggleFacility('TV')}
              >
                <TvIcon name="tv" size={20} color="black" />
                <Text>TV</Text>
              </Pressable>
            </View>
            <View style={styles.twoFacilites}>
              <Pressable
                style={[
                  styles.eachFacility,
                  facilities.includes('Parking') && styles.pressedBox,
                ]}
                onPress={() => toggleFacility('Parking')}
              >
                <ParkingIcon name="car-side" size={20} color="black" />
                <Text>Parking</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.eachFacility,
                  facilities.includes('Furnished') && styles.pressedBox,
                ]}
                onPress={() => toggleFacility('Furnished')}
              >
                <FurnishedIcon name="home" size={20} color="black" />
                <Text>Furnished</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.divider}></View>
          {/* room Description */}
          <View style={styles.OwnerDetails}>
            <Text style={styles.inputTitle}>Room Description</Text>
            <TextInput
              multiline={true}
              placeholder="e.g., Describe your room, nearby amenities, transportation, etc."
              style={[
                styles.inputFields,
                { height: 100, textAlignVertical: 'top', marginBottom: 25 },
              ]}
              value={formData.roomDescription}
              onChangeText={text =>
                setFormData({ ...formData, roomDescription: text })
              }
            />
          </View>
          <Pressable style={styles.PostButton} onPress={() => handle()}>
            <Text style={{ fontSize: 17, fontWeight: 500, color: '#3e0e0efa' }}>
              Post Room
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

export default NewRoomDetails;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  NewRoomDetailsBackground: {
    flex: 1,
    width: screenWidth,
    position: 'absolute',
    resizeMode: 'cover',
    height: '50%',
    overflow: 'hidden',
  },
  backArrow: {
    marginTop: 65,
    marginLeft: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 20,
  },
  allFieldsContainer: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: '85%',
    width: '93%',
    borderRadius: 30,
    marginTop: 40,
    boxShadow: '0px 4px 6px rgba(0,0,0,0.9)',
    overflow: 'hidden',
  },
  yellowImage: {
    paddingHorizontal: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
  imageUploadSection: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFDF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFDF00',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ImageUpper: {
    //marginLeft: 20,
    paddingTop: 30,
    flexDirection: 'column',
    gap: 10,
  },
  inputFields: {
    borderWidth: 2,
    borderColor: '#FFDF00',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '90%',
    marginHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  inputArea: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 25,
  },
  OwnerDetails: {
    marginHorizontal: 20,
    flexDirection: 'column',
    gap: 10,
  },
  OwnerFields: { flexDirection: 'column', gap: 10 },
  inputTitle: {
    fontSize: 18,
    paddingHorizontal: 5,
  },
  dropDown: {
    color: '#ad844f',
    alignItems: 'center',
    paddingHorizontal: 1,
    height: 45,
    borderColor: '#FFDF00',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: '10',
    backgroundColor: '#FFFFFF80',
  },
  twoFacilites: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    marginVertical: 5,
  },
  eachFacility: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    height: 40,
    width: 140,
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
  },
  PostButton: {
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#facc15',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 10,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  pressedBox: {
    borderWidth: 3,
    borderColor: '#facc15',
    backgroundColor: '#fefeda',
  },
});
