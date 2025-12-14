import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

// ================================
// CREATE SUBMISSION
// ================================
export const createSubmission = createAsyncThunk(
  'submissions/createSubmission',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/submissions`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// ================================
// SEARCH SUBMISSIONS
// ================================
export const searchSubmissions = createAsyncThunk(
  'submissions/searchSubmissions',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/submissions/search`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

/* ================================
   SLICE
 ================================ */
const submissionsListSlice = createSlice({
  name: 'submissions',
  initialState: {
    items: [],
    page: null,
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // CREATE
    builder.addCase(createSubmission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSubmission.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createSubmission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // SEARCH
    builder.addCase(searchSubmissions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(searchSubmissions.fulfilled, (state, action) => {
      state.loading = false;
      state.page = action.payload;
      state.items = action.payload.items || [];
    });
    builder.addCase(searchSubmissions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    },
});

export default submissionsListSlice.reducer;