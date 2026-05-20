import { useEffect, useContext, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import app from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import API from '../api/api';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from '../../context';
import { navigate } from '../api/navigateRef.js';

export default function useNotification() {
  const { setFcmToken } = useContext(AuthContext);

  const notificationHandler = useCallback(async () => {
    try {
      // Android 13+ notification permission
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (!alreadyGranted) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          console.log('Notification Permission:', granted);
        }
      }

      // Get FCM token
      const token = await messaging().getToken();

      console.log('FCM Token:', token);

      if (token) {
        setFcmToken(token);
        await sendTokenToBackend(token);
      }
    } catch (err) {
      console.log('Notification init error:', err);
    }
  }, []);

  const sendTokenToBackend = async token => {
    try {
      const accessToken = await EncryptedStorage.getItem('userAccessToken');
      console.log('Access Token:', accessToken);

      const user = await EncryptedStorage.getItem('userInfo');
      const userInfo = user ? JSON.parse(user) : null;
      console.log('User Info:', userInfo);

      if (accessToken && token) {
        const res = await API.post(
          '/auth/fcmTokenHandler',
          { fcmToken: token, userEmail: userInfo?.email },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('FCM Token sent to backend:', res.data);
      }
    } catch (err) {
      console.log('FCM token send error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    // APP OPENED FROM BACKGROUND
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open');

      const screen = remoteMessage?.data?.screen;
      const roomId = remoteMessage?.data?.roomId;
      if (screen && roomId) {
        navigate(screen, { roomId: roomId });
      }
    });

    // APP OPENED FROM QUIT STATE
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from quit state:', remoteMessage);
        }
        const screen = remoteMessage?.data?.screen;
        const roomId = remoteMessage?.data?.roomId;
        if (screen && roomId) {
          navigate(screen, { roomId: roomId });
        }
      })
      .catch(err => {
        console.log('Initial notification error:', err);
      });
  }, []);

  // Handle foreground messages only (not token initialization)
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      // App is in foreground; do not show a toast here if you want
      // background notifications only.
      // Optionally, add local notification display here if needed.
    });

    return () => unsubscribe();
  }, []);

  return { notificationHandler };
}
