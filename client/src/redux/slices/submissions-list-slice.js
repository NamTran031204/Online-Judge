import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { SERVER_URL } from "../../config/config.js";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  console.log(token);
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

/* ============================================================
   CREATE SUBMISSION
============================================================ */
export const createSubmission = createAsyncThunk(
  "submissions/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/submissions`,
        body,
        {
          headers: getAuthHeader(),
        }
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
  "submission/search",
  async (pageRequest, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/submission/search`,
        pageRequest,
        {
          headers: getAuthHeader(),
        }
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


function normalizeSubmission(s) {
  const verdict = deriveVerdictFromTestcases(s.result);
  const judgingStatus = deriveJudgingStatus(s.result);

  return {
    submission_id: s.submissionId,
    user_id: s.userId,
    problem_id: s.problemId,
    created_at: s.submittedAt,   // backend field
    result: verdict ?? "—",
    status: judgingStatus,
  };
}


function deriveVerdictFromTestcases(testcases = []) {
  if (!Array.isArray(testcases) || testcases.length === 0) {
    return null; // chưa có verdict
  }

  const firstNotAC = testcases.find(tc => tc.status !== "AC");
  return firstNotAC ? firstNotAC.status : "AC";
}


function deriveJudgingStatus(testcases = []) {
  return Array.isArray(testcases) && testcases.length > 0
    ? "DONE"
    : "PENDING";
}


const submissionsListSlice = createSlice({
  name: "submissions",
  initialState: {
    items: ([]),
    totalItems: 0,
    detail: null,
    loading: false,
    error: null,
    createError: null,
  },

  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearSubmissions: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.detail = null;
      state.error = null;
      state.createError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= CREATE ================= */
      .addCase(createSubmission.pending, (state) => {
        state.loading = true;
        state.createError = null;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.createError = null;

        if (action.payload) {
          // action.payload là 1 submission raw từ backend
          state.items.unshift(normalizeSubmission(action.payload));
          state.totalItems += 1;
        }
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.loading = false;
        state.createError = action.payload;
      })

      /* ================= SEARCH ================= */
      .addCase(searchSubmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchSubmissions.fulfilled, (state, action) => {
        state.loading = false;

        const rawItems = action.payload?.data || [];
        state.items = rawItems.map(normalizeSubmission);
        state.totalItems = action.payload?.totalCount || 0;

        state.error = null;
      })
      .addCase(searchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export action mới
export const { clearSubmissions, clearCreateError } = submissionsListSlice.actions;
export default submissionsListSlice.reducer;