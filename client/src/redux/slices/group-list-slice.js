import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";

/* ============================================================
    CREATE GROUP
============================================================ */
export const createGroup = createAsyncThunk(
  "groups/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/groups`, body);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

/* ============================================================
    SEARCH GROUPS
============================================================ */
export const searchGroups = createAsyncThunk(
  "groups/search",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/groups/search`, body);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const groupsListSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    detail: null,
    members: [],
    invitations: [],
    loading: false,
    searchError: null,
    createError: null,
    
    createdGroupId: null,
  },

  reducers: {
    createGroupState: (state) => {
      state.createdGroupId = null;
      state.createError = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.searchError = null;
        state.groups = action.payload;
      })
      .addCase(searchGroups.rejected, (state, action) => {
        state.loading = false;
        state.searchError = action.payload;
      })

      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.createError = null;
        state.createdGroupId = action.payload.group_id;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.createError = action.payload;
      })
    },
});

export const { createGroupState } = groupsListSlice.actions;
export default groupsListSlice.reducer;