// src/services/baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_URL } from '../config/config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user?.accessToken;
        console.log("accessToken =", token, "| type =", typeof token);

      if (token) headers.set("Authorization", `Bearer ${token}`);
      else headers.delete("Authorization");
      return headers;
    }

  }),
  tagTypes: ['Auth', 'User', 'Contest', 'Problem'],
  endpoints: () => ({}),
});
