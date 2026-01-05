import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Search users (admin)
    searchUsers: builder.query({
      query: (pageRequest) => ({
        url: "/users/search",
        method: "POST",
        body: pageRequest,
      }),
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    // Get user detail by username
    getUserDetail: builder.query({
      query: (user_name) => `/user/${user_name}`,
      providesTags: (r, e, user_name) => [
        { type: "User", id: user_name },
      ],
    }),

    // Delete user 
    deleteUser: builder.mutation({
      query: (user_id) => ({
        url: `/admin/users/${user_id}/delete`,
        method: "POST",
      }),
      invalidatesTags: (r, e, user_id) => [
        { type: "User", id: user_id },
        { type: "User", id: "LIST" },
      ],
    }),

    // Adjust user rating (delta)
    adjustUserRating: builder.mutation({
      query: ({ user_id, delta, reason }) => ({
        url: `/admin/users/${user_id}/adjust-rating`,
        method: "POST",
        body: {
          delta,
          reason,
        },
      }),
      invalidatesTags: (r, e, { user_id }) => [
        { type: "User", id: user_id },
      ],
    }),

    // Set absolute user rating
    setUserRating: builder.mutation({
      query: ({ user_id, rating, reason }) => ({
        url: `/admin/users/${user_id}/set-rating`,
        method: "POST",
        body: {
          rating,
          reason,
        },
      }),
      invalidatesTags: (r, e, { user_id }) => [
        { type: "User", id: user_id },
      ],
    }),

    // Grant role to user
    grantUserRole: builder.mutation({
      query: ({ user_id, role_name }) => ({
        url: `/admin/users/${user_id}/grant-role`,
        method: "POST",
        body: {
          role_name,
        },
      }),
      invalidatesTags: (r, e, { user_id }) => [
        { type: "User", id: user_id },
      ],
    }),

    // Revoke role from user
    revokeUserRole: builder.mutation({
      query: ({ user_id, role_name }) => ({
        url: `/admin/users/${user_id}/revoke-role`,
        method: "POST",
        body: {
          role_name,
        },
      }),
      invalidatesTags: (r, e, { user_id }) => [
        { type: "User", id: user_id },
      ],
    }),

    // Search all roles in system
    searchRoles: builder.query({
      query: (pageRequest) => ({
        url: "/admin/roles/search",
        method: "POST",
        body: pageRequest,
      }),
      providesTags: [{ type: "Role", id: "LIST" }],
    }),

    // Search all permissions in system
    searchPermissions: builder.query({
      query: (pageRequest) => ({
        url: "/admin/permissions/search",
        method: "POST",
        body: pageRequest,
      }),
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useSearchUsersQuery,
  useGetUserDetailQuery,
  useDeleteUserMutation,
  useAdjustUserRatingMutation,
  useSetUserRatingMutation,
  useGrantUserRoleMutation,
  useRevokeUserRoleMutation,
  useSearchRolesQuery,
  useSearchPermissionsQuery,
} = adminApi;
