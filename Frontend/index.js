/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App.tsx';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

// Background Message Handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
