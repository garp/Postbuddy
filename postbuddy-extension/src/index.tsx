import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
// Import regular CSS
import './App.css';
import App from './App';
import { store } from './redux/store';
import { setUser } from './redux/slices/authSlice';

// Check for existing token in Chrome storage and set user state
const initializeAuth = () => {
  chrome.storage.sync.get(['token', 'email'], (result) => {
    if (result.token) {
      store.dispatch(setUser({ 
        token: result.token,
        email: result.email || ''
      }));
    }
  });
};

// Create a root element if it doesn't exist
let rootElement = document.getElementById('root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

// Initialize auth before rendering
initializeAuth();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
        <Toaster position="top-center" />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
