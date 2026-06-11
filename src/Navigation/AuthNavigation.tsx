import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegistrationScreen from '../features/auth/screens/RegistrationScreen';
import CompleteProfile from '../screens/afterAuth/Profile/CompleteProfile';
import TabNavigator from './AfterAuthNavigation';
import { Loader } from '../components/ui/Loader';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const profileCompleted = useAuthStore(state => state.profileCompleted);
  const isLoading = useAuthStore(state => state.isLoading);
  const checkLogin = useAuthStore(state => state.checkLogin);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  if (isLoading) {
    return <Loader fullscreen message="Checking session..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoggedIn ? (
        Number(profileCompleted) === 1 ? (
          <Stack.Screen name="Maintabs" component={TabNavigator} />
        ) : (
          <Stack.Screen name="gettingUserDetails" component={CompleteProfile} />
        )
      ) : (
        <>
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="register" component={RegistrationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const AuthNavigation = () => {
  return <StackNavigator />;
};

export default AuthNavigation;
