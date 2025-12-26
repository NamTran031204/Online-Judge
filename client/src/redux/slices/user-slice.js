import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import { User } from "../../types/user";
import { SERVER_URL } from "../../config/config.js";


const initialState = {
  user: null,
  isLogin: false,
  loading: false,
  error: null,
};

/* LOGIN */
export const login = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/auth/login`,
        { username, password }
      );

      // API trả về: { isSuccessful, data: { access_token, refresh_token, expires_in } }
      return res.data.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed!"
      );
    }
  }
);

/* REGISTER */
export const signup = createAsyncThunk(
  "user/signup",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/auth/register`,
        { username, email, password }
      );

      // API trả về: { isSuccessful, data: { user_id, username, email } }
      return res.data.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Register failed!"
      );
    }
  }
);

/*  REFRESH-TOKEN */
export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async ({ refresh_token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/auth/refresh`,
        { refresh_token }
      );

      // API trả về: { isSuccessful, data: { access-token, expires_in } }
      return res.data.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Register failed!"
      );
    }
  }
);

/* LOGOUT */
export const logoutUser = createAsyncThunk(
  "user/logout",
  async () => {
    await axios.post(`${SERVER_URL}/auth/logout`);
  }
);

/* SLICE */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // clearUser: (state) => {
    //   state.user = null;
    //   state.isLogin = false;
    //   state.error = null;
    //   state.loading = false;

    //   localStorage.removeItem("accessToken");
    //   localStorage.removeItem("refreshToken");
    // },
  },

  extraReducers: (builder) => {
    builder

      /*  LOGIN  */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;

        // action.payload = data returned from API
        // localStorage.setItem("accessToken", action.payload.access_token);
        // localStorage.setItem("refreshToken", action.payload.refresh_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*  REGISTER  */
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;

        // action.payload = { user_id, username, email }
        state.user = action.payload;

        // API register không trả token 
        // localStorage.setItem("accessToken", "mock-register-token");
        // localStorage.setItem("refreshToken", "mock-register-refresh");
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLogin = false;
      });
  }
});


export const { clearError, clearUser } = userSlice.actions;
export default userSlice.reducer;
