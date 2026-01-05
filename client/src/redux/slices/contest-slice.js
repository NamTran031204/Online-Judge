import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";

// đm thg 

/* FETCH DETAIL */
export const fetchContestDetail = createAsyncThunk(
  "contest/fetchDetail",
  async (contest_id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${SERVER_URL}/contest/${contest_id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch detail failed");
    }
  }
);

/* UPDATE */
export const updateContest = createAsyncThunk(
  "contest/updateContest",
  async ({ contest_id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/contest/${contest_id}/edit`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

/* ADD PROBLEM */
export const addContestProblem = createAsyncThunk(
  "contest/addProblem",
  async ({ contest_id, problem_id }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/contest/${contest_id}/problems`, {
        problem_id,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add problem failed");
    }
  }
);

/* REMOVE PROBLEM */
export const removeContestProblem = createAsyncThunk(
  "contest/removeProblem",
  async ({ contest_id, problem_id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${SERVER_URL}/contest/${contest_id}/problem/${problem_id}`);
      return { contest_id, problem_id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Remove problem failed"
      );
    }
  }
);

/* =======================================================
   DELETE CONTEST  ← (MỚI THÊM)
======================================================= */
export const deleteContest = createAsyncThunk(
  "contest/deleteContest",
  async (contest_id, { rejectWithValue }) => {
    try {
      await axios.delete(`${SERVER_URL}/contest/${contest_id}`);
      return contest_id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete contest failed"
      );
    }
  }
);

/* SLICE */
const contestSlice = createSlice({
  name: "contest",
  initialState: {
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearContestDetail: (state) => {
      state.detail = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* FETCH DETAIL */
      .addCase(fetchContestDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchContestDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateContest.fulfilled, (state) => {
        state.loading = false;
      })

      /* ADD PROBLEM */
      .addCase(addContestProblem.fulfilled, (state, action) => {
        if (state.detail) {
          state.detail.problems.push({
            problem_id: action.payload.problem_id,
          });
        }
      })

      /* REMOVE PROBLEM */
      .addCase(removeContestProblem.fulfilled, (state, action) => {
        if (state.detail) {
          state.detail.problems = state.detail.problems.filter(
            (p) => p.problem_id !== action.payload.problem_id
          );
        }
      })

      /* DELETE CONTEST - (MỚI THÊM) */
      .addCase(deleteContest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContest.fulfilled, (state) => {
        state.loading = false;
        state.detail = null;
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContestDetail } = contestSlice.actions;
export default contestSlice.reducer;
