import React, { createContext, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import API from './src/api/api';
import { setLogoutHandler } from './src/utils/logoutHelper';

export const AuthContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [backendResponse, setBackendResponse] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(0);
  const [tokenError, setTokenError] = useState({});
  const [roomCount, setRoomCount] = useState();
  const [roomsDetails, setRoomsDetails] = useState([]);
  const [fcmToken, setFcmToken] = useState(null);

  //const { notificationHandler } = useNotification();

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const payload = {
        email: email,
        password: password,
      };

      const res = await API.post('/auth/login', payload);
      console.log(res);
      setBackendResponse(res);
      console.log(res?.data?.Accesstoken);
      setUserToken(res?.data?.token);
      setRoomCount(res?.data?.roomCount);
      //console.log(userToken);

      const profileStatus = res?.data?.profileCompleted;
      const roomCountNo = res?.data?.roomCount;
      console.log(profileStatus);

      await EncryptedStorage.setItem('userAccessToken', res?.data?.Accesstoken);
      await EncryptedStorage.setItem(
        'userRefreshToken',
        res?.data?.RefreshToken,
      );
      await EncryptedStorage.setItem(
        'profileCompletedStatus',
        JSON.stringify(Number(profileStatus)),
      );
      await EncryptedStorage.setItem(
        'userInfo',
        JSON.stringify({
          name: res?.data?.name,
          email: res?.data?.email,
        }),
      );
      await EncryptedStorage.setItem('roomCount', JSON.stringify(roomCountNo));
      setProfileCompleted(Number(profileStatus));
      setIsLoggedIn(true);
      return res;
    } catch (e) {
      console.log('Login error:', e);
      return e;
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setIsLoading(true);
      setUserToken(null);
      setIsLoggedIn(false);
      setProfileCompleted(0);
      await EncryptedStorage.clear();
    } catch (e) {
      console.log('Logout error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLogin = async () => {
    try {
      let userInfo = await EncryptedStorage.getItem('userInfo');
      let storedAccessToken = await EncryptedStorage.getItem('userAccessToken');
      let storedRefreshToken = await EncryptedStorage.getItem(
        'userRefreshToken',
      );
      let profileCompletedOrnot = await EncryptedStorage.getItem(
        'profileCompletedStatus',
      );
      let storedRoomCount = await EncryptedStorage.getItem('roomCount');
      userInfo = JSON.parse(userInfo);
      console.log(profileCompletedOrnot);

      console.log(userInfo);
      console.log(storedAccessToken);
      console.log(storedRefreshToken);

      if (storedRefreshToken && storedAccessToken) {
        setIsLoggedIn(true);
        setUserToken(storedAccessToken);
        setProfileCompleted(
          profileCompletedOrnot ? JSON.parse(profileCompletedOrnot) : 0,
        );
        setRoomCount(storedRoomCount ? JSON.parse(storedRoomCount) : 0);
      } else {
        setIsLoggedIn(false);
        setUserToken(null);
        setProfileCompleted(0);
      }
    } catch (e) {
      console.log('isLoggedIn error:', e);
      setTokenError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    setLogoutHandler(logOut);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logOut,
        isLoading,
        setIsLoading,
        userToken,
        backendResponse,
        isLoggedIn,
        profileCompleted,
        setProfileCompleted,
        setTokenError,
        tokenError,
        roomCount,
        roomsDetails,
        setRoomsDetails,
        fcmToken,
        setFcmToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
