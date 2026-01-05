import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';
// import localStorage from 'localStorage';

//  user lưu trong store
const emptyUser = {
  user_id: null,
  user_name: null,
};

//  Load token từ localStorage khi reload trang
const rawAccessToken = localStorage.getItem("accessToken");
const rawRefreshToken = localStorage.getItem("refreshToken");

const accessToken =
  rawAccessToken && rawAccessToken !== "undefined" && rawAccessToken !== "null"
    ? rawAccessToken
    : null;

const refreshToken =
  rawRefreshToken && rawRefreshToken !== "undefined" && rawRefreshToken !== "null"
    ? rawRefreshToken
    : null;

const initialState = {
  user: emptyUser,
  accessToken: accessToken || null,
  refreshToken: refreshToken || null,
  isAuthenticated: !!accessToken,
  is_admin: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    // Logout thủ công 
    logout: (state) => {
      state.user = emptyUser;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    setUserInfo: (state, action) => {
      state.user = action.payload;
    },

    clearError: (state) => {
      state.error = null; 
    }
  },

  extraReducers: (builder) => {

    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        const { accessToken, refreshToken, isAdmin } = payload.data;

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.is_admin = isAdmin;


        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    );

    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled, (state) => {
        // user cần login lại
      }
    );

    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled, (state, { payload }) => {
        const { access_token } = payload.data;

        state.accessToken = access_token;
        state.isAuthenticated = true;

        localStorage.setItem('accessToken', access_token);
      }
    );

    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = emptyUser;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    );
  },
});

export const {
  logout,
  setUserInfo,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
