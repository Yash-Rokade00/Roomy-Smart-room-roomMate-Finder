import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import Login from '../screens/auth/Login';
import Registration from '../screens/auth/Registration';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../../context';
import TabNavigator from './AfterAuthNavigation';
import CompleteProfile from '../screens/afterAuth/Profile/CompleteProfile';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const { isLoggedIn, profileCompleted, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
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
          <Stack.Screen name="login" component={Login} />

          <Stack.Screen name="register" component={Registration} />
        </>
      )}
    </Stack.Navigator>
  );
};

const AuthNavigation = () => {
  return <StackNavigator />;
};

export default AuthNavigation;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
