import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@react-stack/query' // Wait, package is @tanstack/react-query! Let's use @tanstack/react-query!
import { enableScreens } from 'react-native-screens';

import AuthNavigation from './src/Navigation/AuthNavigation';
import { navigationRef } from './src/api/navigateRef';
import { useAuthStore } from './src/store/authStore';
import useNotification from './src/hooks/useNotification';
import { Loader } from './src/components/ui/Loader';
import { QueryClient as TanStackQueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';

enableScreens();

// Initialize TanStack Query Client
const queryClient = new TanStackQueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes cache stale duration
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <SafeAreaProvider>
      <TanStackQueryClientProvider client={queryClient}>
        <NavigationContainer ref={navigationRef}>
          <AppContent />
        </NavigationContainer>
      </TanStackQueryClientProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const isLoading = useAuthStore(state => state.isLoading);
  const checkLogin = useAuthStore(state => state.checkLogin);
  const { notificationHandler } = useNotification();

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    if (isLoggedIn) {
      notificationHandler();
    }
  }, [isLoggedIn, notificationHandler]);

  if (isLoading) {
    return <Loader fullscreen message="Loading Roomy..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AuthNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
