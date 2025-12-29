// src/services/contestDashboardApi.js
import { baseApi } from './baseApi';

export const contestDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContestDashboard: builder.query({
      query: ({ contest_id, offset = 0, limit = 50 }) => ({
        url: `/contest/${contest_id}/dashboard/page`,
        method: 'POST',
        body: { offset, limit },
      }),
      providesTags: (r, e, { contest_id }) => [
        { type: 'ContestDashboard', id: contest_id },
      ],
      // realtime polling
      keepUnusedDataFor: 0,
      pollingInterval: 5000,
    }),
  }),
});

export const { useGetContestDashboardQuery } = contestDashboardApi;
