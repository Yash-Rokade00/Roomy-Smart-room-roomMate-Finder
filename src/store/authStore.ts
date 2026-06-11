import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import API from '../services/api/api';

interface UserInfo {
  name: string;
  email: string;
}

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  userToken: string | null;
  profileCompleted: number;
  roomCount: number;
  fcmToken: string | null;
  tokenError: any;
  backendResponse: any;
  userInfo: UserInfo | null;

  // Actions
  setIsLoading: (loading: boolean) => void;
  setFcmToken: (token: string | null) => void;
  setProfileCompleted: (status: number) => void;
  setRoomCount: (count: number) => void;
  incrementRoomCount: () => void;
  
  checkLogin: () => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: true,
  isLoggedIn: false,
  userToken: null,
  profileCompleted: 0,
  roomCount: 0,
  fcmToken: null,
  tokenError: null,
  backendResponse: null,
  userInfo: null,

  setIsLoading: (loading) => set({ isLoading: loading }),
  setFcmToken: (token) => set({ fcmToken: token }),
  setProfileCompleted: (status) => set({ profileCompleted: status }),
  setRoomCount: (count) => set({ roomCount: count }),
  incrementRoomCount: () => set((state) => ({ roomCount: state.roomCount + 1 })),

  checkLogin: async () => {
    try {
      set({ isLoading: true });
      let userInfoStr = await EncryptedStorage.getItem('userInfo');
      let storedAccessToken = await EncryptedStorage.getItem('userAccessToken');
      let storedRefreshToken = await EncryptedStorage.getItem('userRefreshToken');
      let profileCompletedStatus = await EncryptedStorage.getItem('profileCompletedStatus');
      let storedRoomCount = await EncryptedStorage.getItem('roomCount');

      if (storedRefreshToken && storedAccessToken) {
        set({
          isLoggedIn: true,
          userToken: storedAccessToken,
          userInfo: userInfoStr ? JSON.parse(userInfoStr) : null,
          profileCompleted: profileCompletedStatus ? JSON.parse(profileCompletedStatus) : 0,
          roomCount: storedRoomCount ? JSON.parse(storedRoomCount) : 0,
          tokenError: null,
        });
      } else {
        set({
          isLoggedIn: false,
          userToken: null,
          userInfo: null,
          profileCompleted: 0,
          roomCount: 0,
        });
      }
    } catch (e) {
      console.log('checkLogin error:', e);
      set({ tokenError: e });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const payload = { email, password };

      const res = await API.post('/auth/login', payload);
      console.log('Login Response:', res.data);
      
      const { Accesstoken, RefreshToken, profileCompleted, roomCount: roomCountNo, name, email: userEmail } = res?.data || {};

      // Save token and values synchronously into secure storage
      await EncryptedStorage.setItem('userAccessToken', Accesstoken);
      await EncryptedStorage.setItem('userRefreshToken', RefreshToken);
      await EncryptedStorage.setItem('profileCompletedStatus', JSON.stringify(Number(profileCompleted)));
      await EncryptedStorage.setItem('userInfo', JSON.stringify({ name, email: userEmail }));
      await EncryptedStorage.setItem('roomCount', JSON.stringify(roomCountNo || 0));

      set({
        isLoggedIn: true,
        userToken: Accesstoken,
        profileCompleted: Number(profileCompleted),
        roomCount: Number(roomCountNo || 0),
        userInfo: { name, email: userEmail },
        backendResponse: res,
        tokenError: null,
      });

      return res;
    } catch (e: any) {
      console.log('Login error:', e);
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  logOut: async () => {
    try {
      set({ isLoading: true });
      await EncryptedStorage.clear();
      set({
        isLoggedIn: false,
        userToken: null,
        userInfo: null,
        profileCompleted: 0,
        roomCount: 0,
        backendResponse: null,
      });
    } catch (e) {
      console.log('Logout error:', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
