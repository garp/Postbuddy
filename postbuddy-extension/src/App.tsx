import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import './App.css';
import { useSelector } from "react-redux";
import Success from './pages/Auth/Success';

function App() {

  const user = useSelector((state: any) => state.auth);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user.user !== null ? <Home /> : <Login />} />
        <Route path="/login" element={user.user !== null ? <Home /> : <Login />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
}

export default App;
