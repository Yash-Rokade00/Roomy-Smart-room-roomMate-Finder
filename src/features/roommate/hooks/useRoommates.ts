import { useInfiniteQuery } from '@tanstack/react-query';
import API from '../../../services/api/api';
import EncryptedStorage from 'react-native-encrypted-storage';

interface FetchRoommatesParams {
  search: string;
  pageParam: number;
}

const fetchRoommates = async ({ search, pageParam = 1 }: FetchRoommatesParams) => {
  const userInfoStr = await EncryptedStorage.getItem('userInfo');
  const user = userInfoStr ? JSON.parse(userInfoStr) : null;
  const token = await EncryptedStorage.getItem('userAccessToken');

  if (!user || !token) {
    throw new Error('User details or token missing');
  }

  const payload = {
    name: user.name,
    email: user.email,
    roomRequiredStatus: 1,
    search: search,
    page: pageParam,
    limit: 10,
  };

  const response = await API.post('/roomMate/searchList', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    list: response.data?.List || [],
    nextPage: pageParam + 1,
    hasMore: (response.data?.List || []).length === 10,
  };
};

export const useRoommates = (search: string) => {
  return useInfiniteQuery({
    queryKey: ['roommates', search],
    queryFn: ({ pageParam = 1 }) => fetchRoommates({ search, pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });
};
