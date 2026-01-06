import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_URL } from '../config/config';

export const notContainHeaderBaseApi = createApi({
    reducerPath: 'publicApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().user?.accessToken;
            console.log("accessToken =", token, "| type =", typeof token);

            return headers;
        }

    }),
    tagTypes: ['Auth', 'User', 'Contest', 'Problem'],
    endpoints: () => ({}),
});
