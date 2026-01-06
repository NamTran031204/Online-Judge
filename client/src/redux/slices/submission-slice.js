import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";
import { mockSubmissions } from "../../pages/submissions/mock-submissions";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  console.log(token);
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
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

function normalizeSubmissionDetail(s) {
  return {
    submission_id: s.submissionId,
    user_id: s.userId,
    problem_id: s.problemId,
    created_at: s.submittedAt,
    language: s.language,
    source_code: s.sourceCode,

    // verdict & status
    result: deriveVerdictFromTestcases(s.result) ?? "—",
    status: deriveJudgingStatus(s.result),

    // giữ raw testcase cho bảng chi tiết
    // ✅ GIỮ testcase array để render table
    testcases: Array.isArray(s.result) ? s.result : [],
    allAccepted: !!s.allAccepted,
  };
}

/* ============================================================
   GET SUBMISSION DETAIL
============================================================ */
export const getSubmissionDetail = createAsyncThunk(
  "submission/detail",
  async (submission_id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/submission/${submission_id}`,
        {
          headers: getAuthHeader(),
        }
      );
      return res.data.data;
    } catch (err) {
      console.warn(
        "[SubmissionDetail] API failed, fallback to mock"
      );

      const mock = mockSubmissions.find(
        (s) => String(s.submission_id) === String(submission_id)
      );

      if (mock) return mock;

      return rejectWithValue(
        "Submission not found (API & mock)"
      );
    }
  }
);

/* ============================================================
   DELETE ONE SUBMISSION (ADMIN)
============================================================ */
export const deleteSubmission = createAsyncThunk(
  "submission/deleteOne",
  async (submission_id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${SERVER_URL}/submission/${submission_id}`
      );
      return submission_id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Delete submission failed"
      );
    }
  }
);

/* ============================================================
   DELETE SUBMISSIONS BY PROBLEM (ADMIN)
============================================================ */
export const deleteSubmissionsByProblem = createAsyncThunk(
  "submission/deleteByProblem",
  async (problem_id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${SERVER_URL}/submission/by-problem/${problem_id}`
      );
      return problem_id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Delete submissions by problem failed"
      );
    }
  }
);

/* ============================================================
   DELETE SUBMISSIONS BY USER (ADMIN)
============================================================ */
export const deleteSubmissionsByUser = createAsyncThunk(
  "submission/deleteByUser",
  async (user_id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${SERVER_URL}/submission/by-user/${user_id}`
      );
      return user_id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Delete submissions by user failed"
      );
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const submissionSlice = createSlice({
  name: "submission",
  initialState: {
    detail: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSubmissionDetail: (state) => {
      state.detail = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= DETAIL ================= */
      .addCase(getSubmissionDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubmissionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = normalizeSubmissionDetail(action.payload);
        state.error = null;
      })
      .addCase(getSubmissionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ONE ================= */
      .addCase(deleteSubmission.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubmission.fulfilled, (state) => {
        state.loading = false;
        state.detail = null;
        state.error = null;
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE BY PROBLEM ================= */
      .addCase(deleteSubmissionsByProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubmissionsByProblem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSubmissionsByProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE BY USER ================= */
      .addCase(deleteSubmissionsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubmissionsByUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSubmissionsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubmissionDetail } = submissionSlice.actions;
export default submissionSlice.reducer;
