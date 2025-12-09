import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
  user: null,
  isLogin: false,
  loading: false,
  error: null,
};

/* ============================================
   LOGIN
============================================ */
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ user_name, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/auth/login",
        { user_name, password }
      );

      // API trả về: { isSuccessful, data: { access_token, refresh_token } }
      return res.data.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed!"
      );
    }
  }
);

/* ============================================
   REGISTER
============================================ */
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ user_name, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/auth/register",
        { user_name, email, password }
      );

      // API trả về: { data: { user_id, user_name, email } }
      return res.data.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Register failed!"
      );
    }
  }
);


/* ============================================
   SLICE
============================================ */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLogin = false;
      state.error = null;
      state.loading = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;

        // action.payload = data returned from API
        localStorage.setItem("accessToken", action.payload.access_token);
        localStorage.setItem("refreshToken", action.payload.refresh_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== REGISTER ===== */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;

        // action.payload = { user_id, user_name, email }
        state.user = action.payload;

        // 🔥 API register không trả token 
        // Tạm để token trống hoặc tạo token giả
        localStorage.setItem("accessToken", "mock-register-token");
        localStorage.setItem("refreshToken", "mock-register-refresh");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});


export const { clearError, clearUser } = userSlice.actions;
export default userSlice.reducer;
