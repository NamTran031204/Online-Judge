import { baseApi } from "./baseApi";
function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  console.log(token);
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
export const submissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitSolution: builder.mutation({
      query: (body) => ({
        url: "submission/submit",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSubmitSolutionMutation,
} = submissionApi;
