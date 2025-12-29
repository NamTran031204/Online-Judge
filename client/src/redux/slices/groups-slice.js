import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";
import {
  mockGroupDetails,
  mockGroupMembers,
  mockGroupInvitations,
} from "../../pages/groups/mock-group.js";

/* ============================================================
   GET GROUP DETAIL
============================================================ */
export const fetchGroupDetail = createAsyncThunk(
  "groups/detail",
  async (group_id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${SERVER_URL}/group/${group_id}`);
      return res.data.data;
    } catch (err) {
      const group = mockGroupDetails.find(
        (g) => g.group_id === Number(group_id)
      );
      if (group) return group;
      return rejectWithValue("Detail failed");
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
      return res.data.data;
    } catch (err) {
      const items = mockGroupMembers.filter(
        (m) => m.group_id === Number(group_id)
      );
      return {
        items,
        totalCount: items.length,
      };
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
      return res.data.data;
    } catch (err) {

      const invitation = {
        invite_id: Date.now(),
        group_id: Number(group_id),
        inviter_id: 1,
        invitee_id: body.invitee_user_id,
        status: "PENDING",
        created_at: new Date().toISOString(),
        responded_at: null,
      };

      mockGroupInvitations.push(invitation);
      return invitation;
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
      return res.data.data;
    } catch (err) {
      const items = mockGroupInvitations.filter(
        (i) => i.group_id === Number(group_id)
      );

      return {
        items,
        totalCount: items.length,
      };
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    detail: null,

    members: [],
    membersTotal: 0,

    invitations: [],
    invitationsTotal: 0,

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
      state.membersTotal = 0;
      state.invitations = [];
      state.invitationsTotal = 0;
    },

    resetInviteState: (state) => {
      state.inviteLoading = false;
      state.inviteError = null;
      state.inviteSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== DETAIL ===== */
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

      /* ===== MEMBERS ===== */
      .addCase(searchGroupMembers.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.members = action.payload;
          state.membersTotal = action.payload.length;
        } else {
          state.members = action.payload.items;
          state.membersTotal = action.payload.totalCount;
        }
      })

      /* ===== INVITE ===== */
      .addCase(inviteGroupUser.pending, (state) => {
        state.inviteLoading = true;
        state.inviteError = null;
        state.inviteSuccess = false;
      })
      .addCase(inviteGroupUser.fulfilled, (state, action) => {
        state.inviteLoading = false;
        state.inviteSuccess = true;
        state.invitations.unshift(action.payload);
      })
      .addCase(inviteGroupUser.rejected, (state, action) => {
        state.inviteLoading = false;
        state.inviteError = action.payload;
      })

      /* ===== INVITATIONS ===== */
      .addCase(searchGroupInvitations.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.invitations = action.payload;
          state.invitationsTotal = action.payload.length;
        } else {
          state.invitations = action.payload.items;
          state.invitationsTotal = action.payload.totalCount;
        }
      });
  },
});

export const { clearGroupDetail, resetInviteState } = groupsSlice.actions;
export default groupsSlice.reducer;
