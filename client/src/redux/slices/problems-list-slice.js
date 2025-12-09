// src/redux/problems/problems-list-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

// ----------------------------
//  SEARCH PROBLEMS (filter + paging)
// ----------------------------
export const searchProblems = createAsyncThunk(
  "problemsList/searchProblems",
  async ({ search = "", page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const body = {
        maxResultCount: size,
        skipCount: (page - 1) * size,
        sorting: "created_at desc",
        filter: search,
      };

      const res = await axios.post(`${BASE_URL}/problems/search`, body);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Search failed");
    }
  }
);


// ----------------------------
//  SEARCH PROBLEMS BY KEYWORD
// ----------------------------
export const searchProblemsByText = createAsyncThunk(
  "problemsList/searchText",
  async ({ page = 1, size = 10, keyword = "" }, { rejectWithValue }) => {
    try {
      const body = {
        page,
        size,
        filter: keyword
      };

      const res = await axios.post(`${BASE_URL}/problems/search-text`, body);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Search text failed");
    }
  }
);


// ----------------------------
//  CREATE NEW PROBLEM
// ----------------------------
export const createProblem = createAsyncThunk(
  "problemsList/createProblem",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/problems`, body);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create failed");
    }
  }
);

const problemsListSlice = createSlice({
  name: "problemsList",
  initialState: {
    problems: [],
    totalItems: 0,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // -------- SEARCH PROBLEMS --------
      .addCase(searchProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload.data.data || [];
        state.totalItems = action.payload.data.totalCount;
        state.error = null;
      })
      .addCase(searchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- SEARCH TEXT --------
      .addCase(searchProblemsByText.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProblemsByText.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload.data.data || [];
        state.totalItems = action.payload.data.totalCount;
        state.error = null;
      })
      .addCase(searchProblemsByText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- CREATE PROBLEM --------
      .addCase(createProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default problemsListSlice.reducer;
