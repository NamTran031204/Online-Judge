import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

/* ============================================================
   SEARCH COMMENTS
============================================================ */
export const searchComments = createAsyncThunk(
  "comments/search",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/comments/search`, body);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
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
      const res = await axios.post(`${BASE_URL}/comments`, body);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const commentsListSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    totalItems: 0,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* SEARCH */
      .addCase(searchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data || [];
        state.totalItems = action.payload.totalCount || 0;
        state.error = null;
      })
      .addCase(searchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    },
});

export default commentsListSlice.reducer;