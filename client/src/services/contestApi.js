// src/services/contestApi.js
import { baseApi } from './baseApi';

export const contestApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // search
    searchContests: builder.query({
      query: (pageRequest) => ({
        url: '/contest/search',
        method: 'POST',
        body: pageRequest,
      }),
      providesTags: [{ type: 'Contest', id: 'LIST' }],
    }),

    // detail
    getContestDetail: builder.query({
      query: (contest_id) => {
      console.log('[RTKQ] getContestDetail.query contest_id =', contest_id);

      return `/contest/${contest_id}`;
      },
      providesTags: (r, e, contest_id) => [{ type: "Contest", id: contest_id }],
    }),

    // crud contest
    createContest: builder.mutation({
      query: (data) => ({
        url: '/contest',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Contest', id: 'LIST' }],
    }),

    updateContest: builder.mutation({
      query: ({ contestId, data }) => ({
        url: `/contest/${contestId}/edit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
        { type: 'Contest', id: 'LIST' },
      ],
    }),

    deleteContest: builder.mutation({
      query: (contest_id) => ({
        url: `/contest/${contest_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, contest_id) => [
        { type: 'Contest', id: contest_id },
        { type: 'Contest', id: 'LIST' },
      ],
    }),

    // registration and participants
    registerContest: builder.mutation({
      query: (contest_id) => ({
        url: `/contest/${contest_id}/register`,
        method: 'POST',
      }),
      invalidatesTags: (r, e, contest_id) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

    searchRegistrations: builder.query({
      query: ({ contest_id, pageRequest }) => ({
        url: `/contest/${contest_id}/registrations/search`,
        method: 'POST',
        body: pageRequest,
      }),
      providesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

    searchParticipants: builder.query({
      query: ({ contest_id, pageRequest }) => ({
        url: `/contest/${contest_id}/participants/search`,
        method: 'POST',
        body: pageRequest,
      }),
      providesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

    // problems in contest
    addProblemToContest: builder.mutation({
      query: ({ contest_id, data }) => ({
        url: `/contest/${contest_id}/problems`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

    removeProblemFromContest: builder.mutation({
      query: ({ contest_id, problem_id }) => ({
        url: `/contest/${contest_id}/problem/${problem_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

    // promote to gym
    promoteContestToGym: builder.mutation({
      query: ({ contest_id, data }) => ({
        url: `/contest/${contest_id}/promote-to-gym`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
        { type: 'Contest', id: 'LIST' },
      ],
    }),

    // rankings
    searchRankings: builder.query({
      query: ({ contest_id, pageRequest }) => ({
        url: `/contest/${contest_id}/rankings/search`,
        method: 'POST',
        body: pageRequest,
      }),
      providesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

    // post contest actions
    calculateRating: builder.mutation({
      query: ({ contest_id, data }) => ({
        url: `/contest/${contest_id}/calculate-rating`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

    openSolutions: builder.mutation({
      query: ({ contest_id, data }) => ({
        url: `/contest/${contest_id}/open-solutions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (r, e, { contest_id }) => [
        { type: 'Contest', id: contest_id },
      ],
    }),

  }),
});

export const {
  useSearchContestsQuery,
  useGetContestDetailQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
  useRegisterContestMutation,
  useSearchRegistrationsQuery,
  useSearchParticipantsQuery,
  useAddProblemToContestMutation,
  useRemoveProblemFromContestMutation,
  usePromoteContestToGymMutation,
  useSearchRankingsQuery,
  useCalculateRatingMutation,
  useOpenSolutionsMutation,
} = contestApi;
