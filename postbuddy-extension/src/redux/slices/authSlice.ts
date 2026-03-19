import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    email?: string;
    fullName?: string;
  } | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { token, email, fullName } = action.payload;
      state.token = token;
      state.isAuthenticated = !!token;
      state.user = { email, fullName };
      
      // Store token in localStorage
      if (token) {
        localStorage.setItem('token', token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      chrome.storage.sync.remove('token');
      chrome.storage.sync.remove('websiteToken');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer; 