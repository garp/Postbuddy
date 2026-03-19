import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token') || null;

const initialState = {
  token: token,
  user: token ? jwtDecode(token) : null, // ✅ Decode JWT if available
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
    },
    login: (state, action) => {
      const newToken = action.payload;
      console.log('New token: ', newToken)
      localStorage.setItem('token', newToken); // ✅ Store token in LocalStorage
      state.token = newToken;
      state.user = jwtDecode(newToken); // ✅ Decode user details
    },
    details: (state) => {
      if (state.token) {
        state.user = jwtDecode(state.token);
      } else {
        console.error('No token found');
      }
    },
  },
});

export const { logout, login, details } = authSlice.actions;
export default authSlice.reducer;
