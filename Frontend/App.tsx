/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppProvider, AuthContext } from './context.jsx';
import { enableScreens } from 'react-native-screens';
import { useContext, useEffect } from 'react';
import useNotification from './src/hooks/useNotification';
import AuthNavigation from './src/Navigation/AuthNavigation.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/api/navigateRef.js';

enableScreens();

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer ref={navigationRef}>
          <AppContent />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { isLoggedIn } = useContext(AuthContext);
  console.log(isLoggedIn);

  const { notificationHandler } = useNotification();

  useEffect(() => {
    if (isLoggedIn) {
      notificationHandler();
    }
  }, [isLoggedIn, notificationHandler]);

  return (
    <View style={styles.container}>
      <AuthNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
