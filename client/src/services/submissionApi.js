import { baseApi } from "./baseApi";

export const submissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitSolution: builder.mutation({
      query: (body) => ({
        url: "/api/v1/submissions",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSubmitSolutionMutation,
} = submissionApi;
