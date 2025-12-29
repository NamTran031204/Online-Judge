// src/services/userApi.js
import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.mutation({
      query: (pageRequest) => ({
        url: '/users/search',
        method: 'POST',
        body: pageRequest,
      }),
      providesTags: ['User'],
    }),

    getUserDetail: builder.query({
      query: (userName) => `/user/${userName}`,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useSearchUsersMutation,
  useGetUserDetailQuery,
} = userApi;
