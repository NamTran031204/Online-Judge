// groupsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";

/* ============================================================
   GET GROUP DETAIL
============================================================ */
export const fetchGroupDetail = createAsyncThunk(
  "groups/detail",
  async (group_id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${SERVER_URL}/group/${group_id}`);
      return res.data.data;        // GroupDetailDto
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Detail failed");
    }
  }
);

/* ============================================================
   SEARCH MEMBERS
============================================================ */
export const searchGroupMembers = createAsyncThunk(
  "groups/members",
  async ({ group_id, body }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/group/${group_id}/members/search`,
        body
      );
      return res.data.data;        // PageResult<GroupMemberDto>
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Load members failed");
    }
  }
);

/* ============================================================
   INVITE USER
============================================================ */
export const inviteGroupUser = createAsyncThunk(
  "groups/invite",
  async ({ group_id, body }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/group/${group_id}/invite`,
        body
      );
      return res.data.data;        // GroupInvitationDto
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invite failed");
    }
  }
);

/* ============================================================
   SEARCH GROUP INVITATIONS
============================================================ */
export const searchGroupInvitations = createAsyncThunk(
  "groups/invitations",
  async ({ group_id, body }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/group/${group_id}/invitations/search`,
        body
      );
      return res.data.data;        // PageResult<GroupInvitationDto>
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Load invitations failed"
      );
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    detail: null,
    members: [],
    invitations: [],

    inviteLoading: false,
    inviteError: null,
    inviteSuccess: false,

    loading: false,
    error: null,
  },

  reducers: {
    clearGroupDetail: (state) => {
      state.detail = null;
      state.members = [];
      state.invitations = [];
    },

    resetInviteState: (state) => {
      state.inviteLoading = false;
      state.inviteError = null;
      state.inviteSuccess = false;
    }
  },

  extraReducers: (builder) => {
    builder
      /* DETAIL */
      .addCase(fetchGroupDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroupDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchGroupDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* MEMBERS SEARCH */
      .addCase(searchGroupMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })

      /* INVITE USER */
      .addCase(inviteGroupUser.pending, (state) => {
        state.inviteLoading = true;
        state.inviteError = null;
        state.inviteSuccess = false;
      })
      .addCase(inviteGroupUser.fulfilled, (state, action) => {
        state.inviteLoading = false;
        state.inviteSuccess = true;
        state.invitations.push(action.payload);
      })
      .addCase(inviteGroupUser.rejected, (state, action) => {
        state.inviteLoading = false;
        state.inviteError = action.payload;
      })

      /* SEARCH INVITATIONS */
      .addCase(searchGroupInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload;
      });
  },
});

export const { clearGroupDetail, resetInviteState } = groupsSlice.actions;
export default groupsSlice.reducer;
