import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";


export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async ({ contest_id, mode = "page", page = 0, size = 20, group_id }) => {
    const body = {
      offset: page * size,
      limit: size,
      ...(mode === "group" && group_id ? { group_id } : {})
    };

    let endpoint = `${SERVER_URL}/contest/${contest_id}/dashboard/page`;
    if (mode === "friends") {
      endpoint = `${SERVER_URL}/contest/${contest_id}/dashboard/friends`;
    }
    if (mode === "group") {
      endpoint = `${SERVER_URL}/contest/${contest_id}/dashboard/group`;
    }

    const res = await axios.post(`${SERVER_URL}${endpoint}`, body);
    return res.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    items: [],
    totalItems: 0,
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.total || 0;
      })

      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load dashboard";
      });
  }
});

export default dashboardSlice.reducer;
