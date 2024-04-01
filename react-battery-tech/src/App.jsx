import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import History from './pages/History';
import Optimizer from './pages/Optimizer';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import NoPage from './pages/NoPage';


export default function App() {
  return (   
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}> {/* parent route */}
        <Route index element={<Home />} /> {/* default for the parent route */}
        <Route path="history" element={<History />} />
        <Route path="optimizer" element={<Optimizer />} />
        <Route path="profile" element={<Profile/>} />
        <Route path="savings" element={<Savings/>} />
        <Route path="*" element={<NoPage/>} /> {/* catches all unidentified routes*/}
      </Route>
    </Routes>
  </BrowserRouter>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);