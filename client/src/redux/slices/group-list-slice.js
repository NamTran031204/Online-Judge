import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";
import { mockGroups } from "../../pages/groups/mock-group.js";

/* ============================================================
   MOCK HELPERS
============================================================ */

function mockSearchGroups(body) {
  const { search, page = 1, size = 10 } = body || {};

  let data = [...mockGroups];

  if (search) {
    const keyword = search.toLowerCase();
    data = data.filter((g) =>
      g.group_name.toLowerCase().includes(keyword)
    );
  }

  const totalCount = data.length;
  const start = (page - 1) * size;

  return {
    items: data.slice(start, start + size),
    totalCount,
  };
}

function mockCreateGroup(body) {
  const newGroup = {
    group_id: Date.now(),       // fake id
    owner_id: 1,               // fake owner
    group_name: body.group_name,
    group_image: body.group_image,
  };

  mockGroups.unshift(newGroup);
  return newGroup;
}

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

      try {
        return mockCreateGroup(body);
      } catch {
        return rejectWithValue("Create failed");
      }
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

      try {
        return mockSearchGroups(body);
      } catch {
        return rejectWithValue("Search failed");
      }
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
    totalCount: 0,

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
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== SEARCH ===== */
      .addCase(searchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.searchError = null;

        // Tương thích API cũ / API mới / mock
        if (Array.isArray(action.payload)) {
          state.groups = action.payload;
          state.totalCount = action.payload.length;
        } else {
          state.groups = action.payload.items;
          state.totalCount = action.payload.totalCount;
        }
      })
      .addCase(searchGroups.rejected, (state, action) => {
        state.loading = false;
        state.searchError = action.payload;
      })

      /* ===== CREATE ===== */
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
      });
  },
});

export const { createGroupState } = groupsListSlice.actions;
export default groupsListSlice.reducer;
