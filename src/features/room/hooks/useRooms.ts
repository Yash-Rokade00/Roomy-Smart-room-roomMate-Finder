import { useInfiniteQuery } from '@tanstack/react-query';
import API from '../../../services/api/api';
import EncryptedStorage from 'react-native-encrypted-storage';

interface FetchRoomsParams {
  search: string;
  roomType: string;
  roomPrice: string;
  pageParam: number;
}

const fetchRooms = async ({ search, roomType, roomPrice, pageParam = 1 }: FetchRoomsParams) => {
  const userAccessToken = await EncryptedStorage.getItem('userAccessToken');
  if (!userAccessToken) {
    throw new Error('Access token missing');
  }

  const payload = {
    search: search,
    searchByType: roomType,
    searchByPrice: roomPrice,
    page: pageParam,
    limit: 10,
  };

  const response = await API.post('/room/getAllRooms', payload, {
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    rooms: response.data?.rooms || [],
    nextPage: pageParam + 1,
    hasMore: (response.data?.rooms || []).length === 10,
  };
};

export const useRooms = (search: string, roomType: string, roomPrice: string) => {
  return useInfiniteQuery({
    queryKey: ['rooms', search, roomType, roomPrice],
    queryFn: ({ pageParam = 1 }) => fetchRooms({ search, roomType, roomPrice, pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });
};
