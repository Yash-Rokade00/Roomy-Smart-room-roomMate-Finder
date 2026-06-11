import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import AuthBackground from '../../assets/Images/AuthBackground.jpg';
import EmailIcone from 'react-native-vector-icons/Fontisto';
import PassIcone from 'react-native-vector-icons/Feather';
import ArrowRight from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../../context';
import useNotification from '../../hooks/useNotification.js';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Login = ({ navigation, route }) => {
  const { notificationHandler } = useNotification();

  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (route?.params?.afterRegistration) {
      setIsRegistered(route?.params?.afterRegistration);
    }
  }, [route?.params?.afterRegistration]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      return { ...prev, [field]: value };
    });
  };
  const showToast = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await login(formData.email, formData.password);

      if (response?.data?.success === true) {
        setError('');
        await notificationHandler();
        if (response?.data?.profileCompleted !== 1) {
          showToast('Login successful! Please complete your profile.');
          navigation.navigate('gettingUserDetails');
        }
      } else {
        setError('Invalid Credentials');
      }
    } catch (err) {
      console.log(err);
      console.log('LOGIN ERROR:', err);
      console.log('ERROR RESPONSE:', err?.response?.data);
      setError('Something went wrong');
    }
  };

  //console.log(formData?.email);
  return (
    <View style={styles.main}>
      <ImageBackground style={styles.LoginImage} source={AuthBackground}>
        <View style={{ marginTop: 95 }}>
          <View>
            <Text style={styles.heading}>Log In</Text>
          </View>
          <View style={styles.inputField}>
            <View style={styles.inputBox}>
              <EmailIcone name="email" size={30} style={{ marginTop: 6 }} />
              <TextInput
                placeholder="Email"
                style={styles.InputText}
                value={formData?.email}
                onChangeText={text => handleChange('email', text)}
              />
            </View>
            <View style={styles.inputBox}>
              <PassIcone name="lock" size={28} style={{ marginTop: 6 }} />
              <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.InputText}
                value={formData?.password}
                onChangeText={text => handleChange('password', text)}
              />
            </View>
          </View>

          <View>
            {error ? (
              <Text
                style={{
                  color: 'red',
                  alignSelf: 'center',
                  marginBottom: 6,
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                Invalid Credentials
              </Text>
            ) : null}

            <Pressable style={styles.LogInbtn} onPress={handleLogin}>
              <Text style={{ fontSize: 22, color: 'white', fontWeight: 800 }}>
                Log In
              </Text>
              <ArrowRight
                name="arrow-right"
                color="white"
                size={28}
                style={{ marginTop: 3 }}
              />
            </Pressable>
          </View>
          <View style={styles.LoginBottom}>
            {isRegistered ? (
              <Text style={styles.BottomText}>
                Successfully registedred,{'\n'} Access you account by logging
                in.{' '}
              </Text>
            ) : (
              <View style={styles.LoginBottom}>
                <Text style={[styles.BottomText, { color: 'black' }]}>
                  Not registered yet ?
                </Text>
                <Pressable
                  style={styles.goToRegister}
                  onPress={() => navigation.navigate('register')}
                >
                  <Text style={[styles.BottomText, { color: '#f7a10c' }]}>
                    {' '}
                    Resgister
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
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
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    alignSelf: 'center',
    marginTop: '35%',
  },
  inputField: {
    padding: '8%',
    marginTop: 10,
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
    paddingHorizontal: '30%',
    paddingVertical: 10,
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  goToRegister: {},
  LoginBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  BottomText: {
    marginHorizontal: 2,
    marginVertical: 5,
    fontSize: 17,
    fontWeight: 600,
    color: 'green',
    textAlign: 'center',
  },
});
