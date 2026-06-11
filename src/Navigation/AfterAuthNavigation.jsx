import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import RoomList from '../screens/afterAuth/RoomList/RoomList';
import NewRoomDetails from '../screens/afterAuth/RoomList/NewRoomDetails';
import SingleRoomDetails from '../screens/afterAuth/RoomList/SingleRoomDetails';
import Profile from '../screens/afterAuth/Profile/Profile';
import UploadedRoom from '../screens/afterAuth/Profile/UploadedRoom';
import RommateSearch from '../screens/afterAuth/RoommateSearch/RommateSearch';
import HomeIcone from 'react-native-vector-icons/AntDesign';
import SearchIcone from 'react-native-vector-icons/Ionicons';
import ProfileIcone from 'react-native-vector-icons/FontAwesome6';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RoomList" component={RoomList} />

      <Stack.Screen name="NewRoomDetails" component={NewRoomDetails} />

      <Stack.Screen name="SingleRoomDetails" component={SingleRoomDetails} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="UploadedRoom" component={UploadedRoom} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 65,
          backgroundColor: '#400000',
        },

        tabBarActiveTintColor: '#ff8c00',

        tabBarInactiveTintColor: '#fff',

        tabBarLabel: () => null,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeIcone name="home" color={color} size={25} />
          ),

          tabBarIconStyle: {
            alignSelf: 'center',
            height: 35,
            borderRadius: 10,
          },
        }}
      />

      <Tab.Screen
        name="RoommateSearch"
        component={RommateSearch}
        options={{
          tabBarIcon: ({ color }) => (
            <SearchIcone name="search" color={color} size={25} />
          ),

          tabBarIconStyle: {
            alignSelf: 'center',
            marginTop: 2,
            height: 35,
            borderRadius: 10,
          },
        }}
      />

      <Tab.Screen
        name="ProfileArea"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileIcone name="circle-user" color={color} size={25} />
          ),

          tabBarIconStyle: {
            alignSelf: 'center',
            marginTop: 2,
            height: 35,
            borderRadius: 10,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({});
