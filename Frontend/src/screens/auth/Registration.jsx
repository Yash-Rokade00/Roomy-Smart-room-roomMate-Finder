import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useState } from 'react';

import AuthBackground from '../../assets/Images/AuthBackground.jpg';
import EmailIcone from 'react-native-vector-icons/Fontisto';
import PassIcone from 'react-native-vector-icons/Feather';
import ArrowRight from 'react-native-vector-icons/Feather';
import PhoneIcon from 'react-native-vector-icons/Feather';
import UserIcon from 'react-native-vector-icons/Feather';
import ArrowLeft from 'react-native-vector-icons/Feather';
import axios from 'axios';
import API from '../../api/api';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Registration = ({ navigation }) => {
  const [backendResponse, setBackendResponse] = useState();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNo: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      const payload = { ...formData };
      console.log(payload);
      const res = await API.post('/auth/signUp', payload);
      console.log(res.data);
      setBackendResponse(res?.data);
      if (res?.data?.success == true) {
        navigation.navigate('login');
      }
    } catch (err) {
      console.log('REGISTRATION ERROR:', err);
    }
  };
  return (
    <View style={styles.main}>
      <ImageBackground style={styles.LoginImage} source={AuthBackground}>
        <View>
          <View style={styles.heading}>
            <View>
              <Pressable
                style={styles.backToLogin}
                onPress={() => navigation.navigate('login')}
              >
                <ArrowRight
                  name="arrow-left"
                  color="#f7a10c"
                  size={20}
                  style={{ marginTop: 2 }}
                />
                <Text
                  style={{ color: '#f7a10c', fontSize: 16, fontWeight: 500 }}
                >
                  Back to Login
                </Text>
              </Pressable>
            </View>
            <Text style={styles.title}>Sign Up / Register</Text>
          </View>
          <View style={styles.inputField}>
            <View style={styles.inputBox}>
              <UserIcon name="user" size={30} style={{ marginTop: 6 }} />
              <TextInput
                placeholder="Full Name"
                style={styles.InputText}
                value={formData.name}
                onChangeText={text => handleChange('name', text)}
              />
            </View>
            <View style={styles.inputBox}>
              <EmailIcone name="email" size={28} style={{ marginTop: 6 }} />
              <TextInput
                placeholder="Email"
                style={styles.InputText}
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
              />
            </View>
            <View style={styles.inputBox}>
              <PassIcone name="lock" size={28} style={{ marginTop: 6 }} />
              <TextInput
                placeholder="Password"
                style={styles.InputText}
                secureTextEntry
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
              />
            </View>
            <View style={styles.inputBox}>
              <PassIcone name="lock" size={28} style={{ marginTop: 6 }} />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                style={styles.InputText}
              />
            </View>
            <View style={styles.inputBox}>
              <PhoneIcon name="phone" size={28} style={{ marginTop: 9 }} />
              <TextInput
                placeholder="Mobile No"
                style={styles.InputText}
                maxLength={10}
                value={formData.contactNo}
                onChangeText={text => handleChange('contactNo', text)}
              />
            </View>
          </View>
          <View>
            <Pressable
              style={styles.LogInbtn}
              // onPress={() => navigation.navigate('login')}
              onPress={() => handleRegister()}
            >
              <Text style={{ fontSize: 22, color: 'white', fontWeight: 800 }}>
                Sign Up / Register
              </Text>
              <ArrowRight
                name="arrow-right"
                color="white"
                size={28}
                style={{ marginTop: 3 }}
              />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  LoginImage: {
    flex: 1,
    justifyContent: 'flex-start',
    resizeMode: 'cover',
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
  },
  heading: {
    marginTop: '28%',
  },
  inputField: {
    padding: '8%',
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: 'column',
    gap: 30,
  },
  inputBox: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 30,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.18)',
  },
  InputText: { fontWeight: 600, fontSize: 18 },
  LogInbtn: {
    backgroundColor: '#f7a10c',
    paddingHorizontal: '17%',
    paddingVertical: 10,
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  backToLogin: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    alignSelf: 'center',
  },
});
