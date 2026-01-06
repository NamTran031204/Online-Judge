// src/services/problemApi.js
import { baseApi } from './baseApi';

export const problemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // crud problem
    createProblem: builder.mutation({
      query: (data) => ({
        url: '/problem',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: "Problem", id: "LIST" }],
    }),

    updateProblem: builder.mutation({
      query: ({ problem_id, data }) => ({
        url: `/problem/${problem_id}/edit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (r, e, { problem_id }) => [
        { type: "Problem", id: problem_id },
        { type: "Problem", id: "LIST" },
      ],
    }),

    deleteProblem: builder.mutation({
      query: (problem_id) => ({
        url: `/problem/${problem_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, problem_id) => [
        { type: "Problem", id: problem_id },
        { type: "Problem", id: "LIST" },
      ],
    }),

    // search
    searchProblems: builder.query({
      query: (pageRequest) => ({
        url: '/problem/search',
        method: 'POST',
        body: pageRequest,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
            ...result.data.data.map((p) => ({
              type: "Problem",
              id: p.problem_id,
            })),
            { type: "Problem", id: "LIST" },
          ]
          : [{ type: "Problem", id: "LIST" }],
    }),

    searchProblemsByText: builder.query({
      query: (pageRequest) => ({
        url: '/problem/search-text',
        method: 'POST',
        body: pageRequest,
      }),
    }),

    // detail
    getProblemDetail: builder.query({
      query: (problem_id) => `/problem/get-by-id/${problem_id}`,
      providesTags: (r, e, problem_id) => [
        { type: "Problem", id: problem_id },
      ],
    }),

    // problems by contest
    getProblemsByContest: builder.query({
      query: (pageRequest) => ({
        url: '/problem/by-contest',
        method: 'POST',
        body: pageRequest,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,

  useSearchProblemsQuery,
  useGetProblemDetailQuery,
  useSearchProblemsByTextQuery,
  useGetProblemsByContestQuery,
} = problemApi;
