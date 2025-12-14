// commentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/config.js";

/* ============================================================
   DELETE COMMENT
============================================================ */
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (comment_id, { rejectWithValue }) => {
    try {
      await axios.delete(`${SERVER_URL}/comment/${comment_id}`);
      return comment_id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

/* ============================================================
   SLICE
============================================================ */
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comment: null,
    loading: false,
    error: null,
    deleteSuccess: false,
  },

  reducers: {
    clearComment(state) {
      state.comment = null;
      state.error = null;
      state.deleteSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* DELETE */
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.error = null;
        state.comment = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComment } = commentSlice.actions;
export default commentSlice.reducer;
