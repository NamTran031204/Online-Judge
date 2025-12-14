import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

// ================================
// GET SUBMISSION DETAIL
// ================================
export const getSubmissionDetail = createAsyncThunk(
  'submissions/getSubmissionDetail',
  async (submissionId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/submission/${submissionId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// ================================
// DELETE A SUBMISSION (ADMIN)
// ================================
export const deleteSubmission = createAsyncThunk(
  'submissions/deleteSubmission',
  async (submissionId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/submission/${submissionId}`);
      return { submission_id: submissionId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// ================================
// DELETE SUBMISSIONS BY PROBLEM (ADMIN)
// ================================
export const deleteSubmissionsByProblem = createAsyncThunk(
  'submissions/deleteByProblem',
  async (problemId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/submission/by-problem/${problemId}`);
      return { problem_id: problemId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// ================================
// DELETE SUBMISSIONS BY USER (ADMIN)
// ================================
export const deleteSubmissionsByUser = createAsyncThunk(
  'submissions/deleteByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/submission/by-user/${userId}`);
      return { user_id: userId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error');
    }
  }
);

/* ================================
   SLICE
 ================================ */
const submissionSlice = createSlice({
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
    // DETAIL
    builder.addCase(getSubmissionDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSubmissionDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.detail = action.payload;
    });
    builder.addCase(getSubmissionDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // DELETE ONE
    builder.addCase(deleteSubmission.fulfilled, (state, action) => {
      state.items = state.items.filter(s => s.submission_id !== action.payload.submission_id);
    });

    // DELETE BY PROBLEM
    builder.addCase(deleteSubmissionsByProblem.fulfilled, (state) => {
      // reload list nếu cần
    });

    // DELETE BY USER
    builder.addCase(deleteSubmissionsByUser.fulfilled, (state) => {
      // reload list nếu cần
    });
  },
});

export default submissionSlice.reducer;