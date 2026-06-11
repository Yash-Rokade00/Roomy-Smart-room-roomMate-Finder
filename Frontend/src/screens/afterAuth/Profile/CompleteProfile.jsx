import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import UploadIcon from 'react-native-vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';
import EmailIcone from 'react-native-vector-icons/Fontisto';
import ArrowRight from 'react-native-vector-icons/Feather';
import PhoneIcon from 'react-native-vector-icons/Feather';
import UserIcon from 'react-native-vector-icons/Feather';
import AgeIcon from 'react-native-vector-icons/Entypo';
import DescriptionIcon from 'react-native-vector-icons/MaterialIcons';
import AddressIcon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../../../context';

import EncryptedStorage from 'react-native-encrypted-storage';
import API from '../../../api/api';

const gender = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];
const profession = [
  { label: 'Student', value: 'Student' },
  { label: 'Farmer', value: 'Farmer' },
  { label: 'Business', value: 'Business' },
  { label: 'Government', value: 'Government' },
  { label: 'Private', value: 'Private' },
  { label: 'Other', value: 'Other' },
];

const CompleteProfile = ({ navigation }) => {
  //console.log(backendResponse);

  const [imageDetails, setImageDetails] = useState({});
  const [showImage, setShowImage] = useState('');
  const [formData, setFormData] = useState({
    ProfileImage: {},
    name: '',
    age: '',
    gender: '',
    email: '',
    contactNo: '',
    address: '',
    profession: '',
    description: '',
  });

  const { setProfileCompleted, isLoading, setIsLoading } =
    useContext(AuthContext);

  const selectFile = async () => {
    try {
      const option = { mediaType: 'photo' };

      await launchImageLibrary(option, res => {
        if (res.didCancel) {
          console.log('User cancelled');
        } else if (res.errorCode) {
          console.log('Error: ', res.errorMessage);
        } else {
          setImageDetails(res.assets[0]);
          setShowImage(imageDetails.uri);

          setFormData(prev => ({
            ...prev,
            ProfileImage: {
              uri: imageDetails.uri,
              type: imageDetails.type,
              name: imageDetails.fileName,
            },
          }));
        }
      });
    } catch (err) {
      console.log('error at selecting image' + err);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userAccesstoken = await EncryptedStorage.getItem('userAccessToken');
      //console.log(token);
      console.log(formData);

      const data = new FormData();

      // image
      data.append('ProfileImage', {
        uri: formData.ProfileImage.uri,
        type: formData.ProfileImage.type,
        name: formData.ProfileImage.name,
      });

      // text fields
      data.append('name', formData.name);
      data.append('age', formData.age);
      data.append('gender', formData.gender);
      data.append('email', formData.email);
      data.append('contactNo', formData.contactNo);
      data.append('address', formData.address);
      data.append('profession', formData.profession);
      data.append('description', formData.description);

      const res = await API.post('/profile/updation', data, {
        headers: {
          Authorization: `Bearer ${userAccesstoken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);

      if (res?.data?.success === true) {
        setProfileCompleted(1);
      } else {
        console.log(res.message);
      }
      setIsLoading(false);
    } catch (err) {
      console.log('saving Error' + err);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[
        '#fef3c7',
        '#fde047',
        '#facc15',
        '#eab308',
        '#ca8a04',
        '#a16207',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView>
        <View>
          {/* title */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Tell us about your self to get Started
            </Text>
          </View>
          {/* middle */}
          <View>
            {/* profile image */}
            <View style={styles.imageSection}>
              <Text style={styles.inputTitle}>Profile Image</Text>
              <View>
                {showImage ? (
                  <View
                    style={{
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Image
                      source={{ uri: showImage }}
                      style={{
                        height: 90,
                        width: 90,
                        borderRadius: 50,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
                      }}
                    />
                  </View>
                ) : (
                  <Pressable style={styles.imageCircle} onPress={selectFile}>
                    <UploadIcon name="upload" size={20} color="#ad844f" />
                    <Text style={{ color: '#ad844f' }}>Upload</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* fullName */}
            <View style={styles.nameContainer}>
              <Text style={[styles.inputTitle, { paddingLeft: 4 }]}>
                Full Name
              </Text>
              <View style={styles.nameField}>
                <UserIcon
                  name="user"
                  color="#ad844f"
                  size={20}
                  style={{ marginTop: 10 }}
                />
                <TextInput
                  placeholder="Yash sunil Rokade"
                  placeholderTextColor={'#ad844f'}
                  value={formData.name}
                  onChangeText={text =>
                    setFormData({ ...formData, name: text })
                  }
                  style={{ fontSize: 15 }}
                />
              </View>
            </View>
            {/* age */}
            <View style={styles.ageContainer}>
              <Text style={[styles.inputTitle, { paddingLeft: 4 }]}>Age</Text>
              <View style={styles.nameField}>
                <AgeIcon
                  name="calendar"
                  color="#ad844f"
                  size={20}
                  style={{ marginTop: 10 }}
                />
                <TextInput
                  placeholder="25"
                  placeholderTextColor={'#ad844f'}
                  value={formData.age}
                  onChangeText={text => setFormData({ ...formData, age: text })}
                  style={{ fontSize: 15 }}
                />
              </View>
            </View>
            {/* gender */}
            <View style={styles.ageContainer}>
              <Text style={[styles.inputTitle, { paddingLeft: 4 }]}>
                Gender
              </Text>
              <Dropdown
                data={gender}
                style={styles.dropDown}
                labelField="label"
                valueField="value"
                value={formData.gender}
                placeholderStyle={{ fontSize: 13, color: '#ad844f' }}
                placeholder="Select Gender"
                onChange={text =>
                  setFormData({ ...formData, gender: text.value })
                }
              />
            </View>
            {/* email */}
            <View>
              <View style={styles.nameContainer}>
                <Text
                  style={[styles.inputTitle, { paddingLeft: 4, marginTop: 8 }]}
                >
                  Email
                </Text>
                <View style={styles.nameField}>
                  <EmailIcone
                    name="email"
                    color="#ad844f"
                    size={20}
                    style={{ marginTop: 10 }}
                  />
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor={'#ad844f'}
                    value={formData.email}
                    onChangeText={text =>
                      setFormData({ ...formData, email: text })
                    }
                    style={{ fontSize: 15 }}
                  />
                </View>
              </View>
            </View>
            {/* contact */}
            <View>
              <View style={styles.nameContainer}>
                <Text
                  style={[styles.inputTitle, { paddingLeft: 4, marginTop: 8 }]}
                >
                  Contact No.
                </Text>
                <View style={styles.nameField}>
                  <PhoneIcon
                    name="phone"
                    color="#ad844f"
                    size={20}
                    style={{ marginTop: 10 }}
                  />
                  <TextInput
                    placeholder="+91 00000 00000"
                    placeholderTextColor={'#ad844f'}
                    value={formData.contactNo}
                    onChangeText={text =>
                      setFormData({ ...formData, contactNo: text })
                    }
                    style={{ fontSize: 15 }}
                  />
                </View>
              </View>
            </View>
            {/* Address */}
            <View style={styles.nameContainer}>
              <Text
                style={[styles.inputTitle, { paddingLeft: 4, marginTop: 8 }]}
              >
                Address
              </Text>
              <View style={styles.DescriptionField}>
                <AddressIcon
                  name="location-outline"
                  color="#ad844f"
                  size={20}
                  style={{ marginTop: 10, fontWeight: 600 }}
                />
                <TextInput
                  multiline={true}
                  placeholder="Enter your Your current residential address in the city where you work."
                  placeholderTextColor={'#ad844f'}
                  value={formData.address}
                  onChangeText={text =>
                    setFormData({ ...formData, address: text })
                  }
                  style={{
                    fontSize: 15,
                    textAlignVertical: 'top',
                    width: '95%',
                  }}
                />
              </View>
            </View>
            {/* profession */}
            <View style={styles.ageContainer}>
              <Text style={[styles.inputTitle, { paddingLeft: 4 }]}>
                Profession
              </Text>
              <Dropdown
                data={profession}
                style={styles.dropDown}
                labelField="label"
                valueField="value"
                value={formData.profession}
                placeholderStyle={{ fontSize: 15, color: '#ad844f' }}
                placeholder="Select your profession"
                onChange={text =>
                  setFormData({ ...formData, profession: text.value })
                }
              />
            </View>
            {/* profession Description */}
            <View style={styles.nameContainer}>
              <Text
                style={[styles.inputTitle, { paddingLeft: 4, marginTop: 8 }]}
              >
                Description
              </Text>
              <View style={styles.DescriptionField}>
                <DescriptionIcon
                  name="description"
                  color="#ad844f"
                  size={20}
                  style={{ marginTop: 10 }}
                />
                <TextInput
                  multiline={true}
                  placeholder="work place name and ....."
                  placeholderTextColor={'#ad844f'}
                  value={formData.description}
                  onChangeText={text =>
                    setFormData({ ...formData, description: text })
                  }
                  style={{
                    fontSize: 15,
                    textAlignVertical: 'top',
                  }}
                />
              </View>
            </View>
          </View>
          {/* lower */}
          <View>
            <Pressable style={styles.SaveButton} onPress={handleSubmit}>
              <Text
                style={{ fontSize: 17, fontWeight: 500, color: '#3e0e0efa' }}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#451901',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginTop: 75,
    marginBottom: 5,
  },
  subtitle: {
    alignSelf: 'center',
    fontSize: 15,
    color: '#ad6415',
  },
  imageSection: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  imageCircle: {
    paddingVertical: 25,
    paddingHorizontal: 22,
    borderRadius: '50%',
    backgroundColor: '#FFFFFF80',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    gap: 12,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  nameField: {
    borderColor: '#fce260',
    borderWidth: 1,
    backgroundColor: '#FFFFFF80',
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 5,
  },
  ageContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  dropDown: {
    color: '#ad844f',
    alignItems: 'center',
    paddingHorizontal: 1,
    height: 45,
    borderColor: '#fce260',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: '10',
    backgroundColor: '#FFFFFF80',
  },
  DescriptionField: {
    borderColor: '#fce260',
    borderWidth: 1,
    backgroundColor: '#FFFFFF80',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 100,

    flexDirection: 'row',
    gap: 5,
  },
  inputTitle: {
    fontWeight: 600,
    fontSize: 17,
  },
  SaveButton: {
    marginVertical: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#facc15',
    width: '40%',
    alignSelf: 'center',
    borderRadius: 40,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
});
