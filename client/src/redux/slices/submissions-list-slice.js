import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

/* ============================================================
   CREATE SUBMISSION
============================================================ */
export const createSubmission = createAsyncThunk(
  "submissions/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/submissions`,
        body
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Create submission failed"
      );
    }
  }
);

/* ============================================================
   SEARCH SUBMISSIONS
============================================================ */
export const searchSubmissions = createAsyncThunk(
  "submissions/search",
  async (filter, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/submissions/search`,
        filter
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Search submissions failed"
      );
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const submissionsListSlice = createSlice({
  name: "submissions",
  initialState: {
    items: ([]),
    totalItems: 0,
    detail: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSubmissions: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.detail = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= CREATE ================= */
      .addCase(createSubmission.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload) {
          state.items.unshift(action.payload);
          state.totalItems += 1;
        }
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= SEARCH ================= */
      .addCase(searchSubmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.totalItems = action.payload?.totalCount || 0;
        state.error = null;
      })
      .addCase(searchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubmissions } = submissionsListSlice.actions;
export default submissionsListSlice.reducer;
