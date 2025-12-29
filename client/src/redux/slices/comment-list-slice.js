import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";

/* ============================================================
   SEARCH COMMENTS
============================================================ */
export const searchComments = createAsyncThunk(
  "comments/search",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/comments/search`,
        payload
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Search comments failed"
      );
    }
  }
);

/* ============================================================
   CREATE COMMENT
============================================================ */
export const createComment = createAsyncThunk(
  "comments/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/comments`,
        body
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Create comment failed"
      );
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const commentsListSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    totalCount: 0,
    maxResultCount: 10,
    loading: false,
    error: null,
  },

  reducers: {
    clearComments: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= SEARCH ================= */
      .addCase(searchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchComments.fulfilled, (state, action) => {
        const { data = [], totalCount = 0 } = action.payload || {};

        state.loading = false;
        state.totalCount = totalCount;
        state.error = null;

        // append (Load more)
        state.items.push(...data);
      })
      .addCase(searchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentsListSlice.actions;
export default commentsListSlice.reducer;
