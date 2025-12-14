import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";

export const fetchRatings = createAsyncThunk(
  "ratings/fetch",
  async ({ contest_id, page = 0, size = 50, filter = {} }) => {
    const body = {
      skipCount: page * size,
      maxResultCount: size,
      filter: filter
    };

    const res = await axios.post(
      `${SERVER_URL}/contest/${contest_id}/ratings/search`,
      body
    );

    return res.data;
  }
);

const ratingsSlice = createSlice({
  name: "ratings",
  initialState: {
    items: [],
    totalItems: 0,
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.total || 0;
      })

      .addCase(fetchRatings.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load ratings";
      });
  }
});

export default ratingsSlice.reducer;
