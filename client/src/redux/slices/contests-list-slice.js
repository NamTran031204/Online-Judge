import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:3001/api/v1";

/* =======================================================
   SEARCH CONTESTS
======================================================= */
export const fetchContests = createAsyncThunk(
  "contests/fetchContests",
  async ({ search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const body = {
        maxResultCount: limit,
        skipCount: (page - 1) * limit,
        sorting: "start_time desc",
        filter: search ? { title: search } : {}
      };

      const res = await axios.post(`${API}/contests/search`, body);
      return res.data.data; // PageResult<ContestSummaryDto>

    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch contest list failed");
    }
  }
);

/* =======================================================
   CREATE CONTEST
======================================================= */
export const createContest = createAsyncThunk(
  "contests/createContest",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/contests`, data);
      return res.data.data; // { contest_id }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create contest failed");
    }
  }
);

/* =======================================================
   SLICE
======================================================= */
const contestsListSlice = createSlice({
  name: "contestsList",
  initialState: {
    list: [],
    totalCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ---------- FETCH LIST ---------- */
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- CREATE ---------- */
      .addCase(createContest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default contestsListSlice.reducer;
