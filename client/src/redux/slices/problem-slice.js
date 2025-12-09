// src/redux/problems/problem-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

// ----------------------------
//  GET PROBLEM DETAIL
// ----------------------------
export const getProblemDetail = createAsyncThunk(
  "problem/getDetail",
  async (problem_id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/problem/${problem_id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Cannot load detail");
    }
  }
);

// ----------------------------
//  UPDATE PROBLEM
// ----------------------------
export const updateProblem = createAsyncThunk(
  "problem/update",
  async ({ problem_id, body }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/problem/${problem_id}/edit`,
        body
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// ----------------------------
//  DELETE PROBLEM
// ----------------------------
export const deleteProblem = createAsyncThunk(
  "problem/delete",
  async (problem_id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/problem/${problem_id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    problem: null,
    loading: false,
    error: null,
    deleteSuccess: false,
  },

  reducers: {
    clearProblem(state) {
      state.problem = null;
      state.error = null;
      state.deleteSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ---------------- DETAIL ----------------
      .addCase(getProblemDetail.pending, (state) => {
        state.loading = true;
        state.problem = null;
      })
      .addCase(getProblemDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.problem = action.payload.data;
        state.error = null;
      })
      .addCase(getProblemDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- UPDATE ----------------
      .addCase(updateProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problem = action.payload.data;
        state.error = null;
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- DELETE ----------------
      .addCase(deleteProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProblem.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.error = null;
        state.problem = null;
      })
      .addCase(deleteProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProblem } = problemSlice.actions;
export default problemSlice.reducer;
